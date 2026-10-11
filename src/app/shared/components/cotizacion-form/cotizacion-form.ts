import { Component, effect, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Alojamiento } from '../../../core/models';
import { fechaNoPasada, hoyISO, rangoFechas } from '../../../core/validators/fechas.validators';

/** Formulario de cotización del detalle: fechas de llegada y salida, y número de huéspedes. */
@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-cotizacion-form',
  styleUrl: './cotizacion-form.css',
  templateUrl: './cotizacion-form.html',
})
export class CotizacionForm {
  /** El alojamiento que se cotiza (de aquí salen la capacidad y los precios). */
  readonly alojamiento = input.required<Alojamiento>();

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

  /** Botón "Cotizar". En C28 aquí se calcula y se muestra el desglose. */
  protected cotizar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
  }
}
