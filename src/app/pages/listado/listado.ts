import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AlojamientoService } from '../../core/services/alojamiento.service';
import { AlojamientoCard } from '../../shared/components/alojamiento-card/alojamiento-card';

/** Listado de alojamientos con filtros. */
@Component({
  imports: [AlojamientoCard],
  selector: 'app-listado',
  styleUrl: './listado.css',
  templateUrl: './listado.html',
})
export class Listado {
  private readonly alojamientoService = inject(AlojamientoService);

  /**
   * Alojamientos disponibles (activos y con precio válido).
   * toSignal convierte el Observable del servicio en un signal que el HTML lee con alojamientos().
   * initialValue: [] evita que valga undefined mientras llega el JSON.
   */
  protected readonly alojamientos = toSignal(this.alojamientoService.getAlojamientos(), {
    initialValue: [],
  });
}
