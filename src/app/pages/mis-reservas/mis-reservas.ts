import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EstadoVacio } from '../../shared/components/estado-vacio/estado-vacio';

/** Reservas que el usuario ha hecho (guardadas en el navegador). */
@Component({
  imports: [RouterLink, EstadoVacio],
  selector: 'app-mis-reservas',
  styleUrl: './mis-reservas.css',
  templateUrl: './mis-reservas.html',
})
export class MisReservas {}
