import { Component, computed, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Alojamiento } from '../../../core/models';

/** Cuántos servicios se muestran como etiqueta antes de resumir el resto con "+N". */
const MAX_SERVICIOS = 3;

/** Tarjeta con el resumen de un alojamiento. Toda la tarjeta lleva al detalle. */
@Component({
  imports: [CurrencyPipe, RouterLink],
  selector: 'app-alojamiento-card',
  styleUrl: './alojamiento-card.css',
  templateUrl: './alojamiento-card.html',
})
export class AlojamientoCard {
  /** El alojamiento a mostrar. Obligatorio: el padre lo pasa con [alojamiento]="...". */
  readonly alojamiento = input.required<Alojamiento>();

  /** Los primeros servicios, los que se ven como etiqueta. */
  protected readonly serviciosVisibles = computed(() =>
    this.alojamiento().servicios.slice(0, MAX_SERVICIOS)
  );

  /** Cuántos servicios quedan por fuera (para el "+N"). */
  protected readonly serviciosRestantes = computed(() =>
    Math.max(this.alojamiento().servicios.length - MAX_SERVICIOS, 0)
  );
}
