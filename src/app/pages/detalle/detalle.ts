import { Component, effect, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { AlojamientoService } from '../../core/services/alojamiento.service';

/** Detalle de un alojamiento, con cotización y reseñas. */
@Component({
  imports: [CurrencyPipe, RouterLink],
  selector: 'app-detalle',
  styleUrl: './detalle.css',
  templateUrl: './detalle.html',
})
export class Detalle {
  private readonly alojamientoService = inject(AlojamientoService);
  private readonly router = inject(Router);

  /**
   * Viene del parámetro :id de la URL (/alojamientos/3 → "3").
   * Llega solo gracias a withComponentInputBinding() en app.config.ts.
   */
  readonly id = input.required<string>();

  /**
   * El alojamiento de la URL. Tiene tres estados posibles:
   * - null: todavía está cargando el JSON.
   * - undefined: no existe o está inactivo (getById solo busca entre los disponibles).
   * - objeto Alojamiento: se muestra.
   *
   * toObservable(this.id) convierte el signal del id en un Observable.
   * switchMap cambia ese id por la búsqueda en el servicio; si el id cambia,
   * cancela la búsqueda anterior y hace la nueva.
   */
  protected readonly alojamiento = toSignal(
    toObservable(this.id).pipe(switchMap(id => this.alojamientoService.getById(Number(id)))),
    { initialValue: null }
  );

  constructor() {
    // effect() se ejecuta cada vez que cambia un signal que lee (aquí, alojamiento()).
    // Si la búsqueda terminó y no encontró nada, va a la página 404.
    effect(() => {
      if (this.alojamiento() === undefined) {
        // '/no-encontrado' no es una ruta definida, así que cae en la ruta '**'.
        // replaceUrl: el botón "Atrás" no vuelve a la URL inválida.
        this.router.navigate(['/no-encontrado'], { replaceUrl: true });
      }
    });
  }
}
