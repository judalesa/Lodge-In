import { Component, effect, inject, input, output, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Alojamiento, Cotizacion } from '../../../core/models';
import { CotizacionService } from '../../../core/services/cotizacion.service';
import { fechaNoPasada, hoyISO, rangoFechas } from '../../../core/validators/fechas.validators';

/** Formulario de cotización del detalle: fechas de llegada y salida, y número de huéspedes. */
@Component({
  imports: [CurrencyPipe, ReactiveFormsModule],
  selector: 'app-cotizacion-form',
  styleUrl: './cotizacion-form.css',
  templateUrl: './cotizacion-form.html',
})
export class CotizacionForm {
  private readonly cotizacionService = inject(CotizacionService);

  /** El alojamiento que se cotiza (de aquí salen la capacidad y los precios). */
  readonly alojamiento = input.required<Alojamiento>();

  /** Avisa al padre (el detalle) si hay una cotización válida o no (null). */
  readonly cotizacionCambiada = output<Cotizacion | null>();

  /** Resultado de la última cotización. null = todavía no se ha cotizado (o hay que volver a cotizar). */
  protected readonly cotizacion = signal<Cotizacion | null>(null);

  /** true si se pulsó Cotizar pero el servicio no pudo calcular (no debería pasar si el formulario es válido). */
  protected readonly sinResultado = signal(false);

  /** Hoy en 'yyyy-MM-dd', para el atributo min de los campos de fecha. */
  protected readonly hoy = hoyISO();

  protected readonly form = new FormGroup(
    {
      llegada: new FormControl('', { nonNullable: true, validators: [Validators.required, fechaNoPasada()] }),
      salida: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      huespedes: new FormControl<number | null>(1, [Validators.required, Validators.min(1)]),
    },
    // Validador del grupo: compara las dos fechas (RN-01).
    { validators: rangoFechas() }
  );

  constructor() {
    // La capacidad depende del alojamiento, que llega como input. Cuando llega (o cambia),
    // se ponen los validadores de huéspedes con el máximo correcto (RN-04).
    effect(() => {
      const capacidad = this.alojamiento().capacidad;
      const huespedes = this.form.controls.huespedes;
      huespedes.setValidators([Validators.required, Validators.min(1), Validators.max(capacidad)]);
      huespedes.updateValueAndValidity(); // vuelve a validar con las reglas nuevas
    });

    // Si el usuario cambia cualquier dato después de cotizar, la cotización anterior ya no sirve:
    // se borra y se avisa al detalle, para obligar a cotizar de nuevo (y no reservar con datos viejos).
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.sinResultado.set(false);
      if (this.cotizacion() !== null) {
        this.cotizacion.set(null);
        this.cotizacionCambiada.emit(null);
      }
    });
  }

  /** ¿Mostrar el error de este campo? Solo si es inválido y el usuario ya pasó por él. */
  protected tieneError(campo: 'llegada' | 'salida' | 'huespedes'): boolean {
    const control = this.form.controls[campo];
    return control.invalid && control.touched;
  }

  /** ¿Mostrar el error de rango? Cuando el grupo lo marca y la salida ya fue tocada. */
  protected rangoInvalido(): boolean {
    return this.form.hasError('rangoInvalido') && this.form.controls.salida.touched;
  }

  /** Botón "Cotizar": calcula con el servicio, guarda el resultado y avisa al detalle. */
  protected cotizar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { llegada, salida, huespedes } = this.form.getRawValue();
    const resultado = this.cotizacionService.calcular(this.alojamiento(), llegada, salida, huespedes ?? 0);
    this.cotizacion.set(resultado);
    this.sinResultado.set(resultado === null);
    this.cotizacionCambiada.emit(resultado);
  }
}
