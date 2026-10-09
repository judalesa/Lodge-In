import { Component, input } from '@angular/core';

/** Detalle de un alojamiento, con cotización y reseñas. */
@Component({
  imports: [],
  selector: 'app-detalle',
  styleUrl: './detalle.css',
  templateUrl: './detalle.html',
})
export class Detalle {
  /**
   * Viene del parámetro :id de la URL (/alojamientos/3 → "3").
   * Llega solo gracias a withComponentInputBinding() en app.config.ts.
   */
  readonly id = input.required<string>();
}
