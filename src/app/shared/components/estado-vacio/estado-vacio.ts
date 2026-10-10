import { Component, input } from '@angular/core';

/**
 * Mensaje para cuando no hay nada que mostrar (sin resultados, sin reservas...).
 * Cada página pone su propio botón dentro de la etiqueta, y se muestra en el <ng-content />.
 */
@Component({
  imports: [],
  selector: 'app-estado-vacio',
  styleUrl: './estado-vacio.css',
  templateUrl: './estado-vacio.html',
})
export class EstadoVacio {
  /** Nombre del ícono de Bootstrap Icons, sin el prefijo "bi-" (ej.: "search"). */
  readonly icono = input<string>('inbox');

  /** Título corto en negrita. */
  readonly titulo = input<string>('No hay nada por aquí');

  /** Texto de ayuda debajo del título. */
  readonly mensaje = input<string>('');
}
