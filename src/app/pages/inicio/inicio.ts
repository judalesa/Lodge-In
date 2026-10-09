import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AlojamientoService } from '../../core/services/alojamiento.service';
import { AlojamientoCard } from '../../shared/components/alojamiento-card/alojamiento-card';

/** Página inicial: buscador y alojamientos destacados. */
@Component({
  imports: [AlojamientoCard],
  selector: 'app-inicio',
  styleUrl: './inicio.css',
  templateUrl: './inicio.html',
})
export class Inicio {
  private readonly alojamientoService = inject(AlojamientoService);

  // TEMPORAL (C14): solo para ver la tarjeta. En la Fase 5 se cambia por los destacados.
  protected readonly alojamientos = toSignal(this.alojamientoService.getAlojamientos(), {
    initialValue: [],
  });
}
