import { Component, computed, effect, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { AlojamientoService } from '../../core/services/alojamiento.service';
import { ResenaService } from '../../core/services/resena.service';

/** Ícono de Bootstrap Icons para cada servicio. Si un servicio no está aquí, se usa ICONO_SERVICIO_DEFECTO. */
const ICONOS_SERVICIO: Record<string, string> = {
  'Wi-Fi': 'bi-wifi',
  'Cocina': 'bi-egg-fried',
  'Televisión': 'bi-tv',
  'Lavadora': 'bi-droplet-half',
  'Aire acondicionado': 'bi-snow',
  'Parqueadero': 'bi-p-square',
  'Piscina': 'bi-water',
  'BBQ': 'bi-fire',
  'Chimenea': 'bi-fire',
  'Gimnasio': 'bi-bicycle',
};
const ICONO_SERVICIO_DEFECTO = 'bi-check-circle';

/** Detalle de un alojamiento, con cotización y reseñas. */
@Component({
  imports: [CurrencyPipe, RouterLink],
  selector: 'app-detalle',
  styleUrl: './detalle.css',
  templateUrl: './detalle.html',
})
export class Detalle {
  private readonly alojamientoService = inject(AlojamientoService);
  private readonly resenaService = inject(ResenaService);
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

  /** Reseñas del JSON para este alojamiento. Se vuelven a pedir si cambia el id. */
  private readonly resenasJson = toSignal(
    toObservable(this.id).pipe(switchMap(id => this.alojamientoService.getResenas(Number(id)))),
    { initialValue: [] }
  );

  /**
   * Todas las reseñas: primero las nuevas de este alojamiento (localStorage) y después las del JSON.
   * Al publicar una reseña, nuevas() cambia y esta lista se recalcula sola.
   */
  protected readonly resenas = computed(() => {
    const id = Number(this.id());
    const nuevas = this.resenaService.nuevas().filter(r => r.alojamientoId === id);
    return [...nuevas, ...this.resenasJson()];
  });

  /**
   * Promedio de las reseñas, redondeado a 1 decimal (null si no hay reseñas).
   * Solo se muestra en la sección de reseñas; la calificación del alojamiento sigue siendo la del JSON.
   */
  protected readonly promedio = computed(() => {
    const lista = this.resenas();
    if (lista.length === 0) {
      return null;
    }
    const suma = lista.reduce((total, r) => total + r.calificacion, 0);
    return Math.round((suma / lista.length) * 10) / 10;
  });

  /** Para dibujar las 5 estrellas de cada reseña con @for. */
  protected readonly estrellas = [1, 2, 3, 4, 5];

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

  /** Devuelve la clase del ícono de un servicio. */
  protected iconoServicio(servicio: string): string {
    return ICONOS_SERVICIO[servicio] ?? ICONO_SERVICIO_DEFECTO;
  }
}
