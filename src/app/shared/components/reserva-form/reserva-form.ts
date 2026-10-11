import { Component, inject, input, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Alojamiento, Cotizacion, Reserva } from '../../../core/models';
import { ReservaService } from '../../../core/services/reserva.service';

/**
 * Formulario para confirmar la reserva con el nombre y el correo del huésped.
 * Solo aparece cuando ya hay una cotización válida (RN-07).
 */
@Component({
  imports: [CurrencyPipe, DatePipe, ReactiveFormsModule, RouterLink],
  selector: 'app-reserva-form',
  styleUrl: './reserva-form.css',
  templateUrl: './reserva-form.html',
})
export class ReservaForm {
  private readonly reservaService = inject(ReservaService);

  /** Alojamiento que se va a reservar (lo pasa el detalle). */
  readonly alojamiento = input.required<Alojamiento>();

  /** Cotización ya calculada: de aquí salen fechas, huéspedes, noches y total. */
  readonly cotizacion = input.required<Cotizacion>();

  protected readonly form = new FormGroup({
    nombre: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    correo: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  /** Reserva recién creada. Mientras sea null se ve el formulario; después, el mensaje de éxito. */
  protected readonly reserva = signal<Reserva | null>(null);

  /** ¿Mostrar el error de este campo? Solo si es inválido y el usuario ya pasó por él. */
  protected tieneError(campo: 'nombre' | 'correo'): boolean {
    const control = this.form.controls[campo];
    return control.invalid && control.touched;
  }

  /** Crea la reserva con el ReservaService y cambia el formulario por la confirmación. */
  protected confirmar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { nombre, correo } = this.form.getRawValue();
    const nueva = this.reservaService.crear(this.alojamiento(), this.cotizacion(), nombre, correo);
    this.reserva.set(nueva);
  }
}
