import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FiltrosBusqueda } from '../../core/models';
import { AlojamientoService } from '../../core/services/alojamiento.service';
import { AlojamientoCard } from '../../shared/components/alojamiento-card/alojamiento-card';
import { Filtros } from '../../shared/components/filtros/filtros';

/** Listado de alojamientos con filtros. */
@Component({
  imports: [AlojamientoCard, Filtros],
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

  /** Opciones para los <select> del formulario de filtros. */
  protected readonly ciudades = toSignal(this.alojamientoService.getCiudades(), { initialValue: [] });
  protected readonly tipos = toSignal(this.alojamientoService.getTipos(), { initialValue: [] });

  // TEMPORAL (C17): solo muestra en la consola lo que emite el formulario. En C18 se filtra de verdad.
  protected verFiltros(filtros: FiltrosBusqueda): void {
    console.log('Filtros:', filtros);
  }
}
