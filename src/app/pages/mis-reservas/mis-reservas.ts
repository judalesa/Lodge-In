import { Component, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReservaService } from '../../core/services/reserva.service';
import { EstadoVacio } from '../../shared/components/estado-vacio/estado-vacio';

/** Reservas que el usuario ha hecho (guardadas en el navegador). */
@Component({
  imports: [CurrencyPipe, DatePipe, RouterLink, EstadoVacio],
  selector: 'app-mis-reservas',
  styleUrl: './mis-reservas.css',
  templateUrl: './mis-reservas.html',
})
export class MisReservas {
  /** Señal de solo lectura del servicio: si se crea una reserva, la tabla se actualiza sola. */
  protected readonly reservas = inject(ReservaService).reservas;
}
