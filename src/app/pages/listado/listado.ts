import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FiltrosBusqueda } from '../../core/models';
import { AlojamientoService } from '../../core/services/alojamiento.service';
import { AlojamientoCard } from '../../shared/components/alojamiento-card/alojamiento-card';
import { EstadoVacio } from '../../shared/components/estado-vacio/estado-vacio';
import { Filtros } from '../../shared/components/filtros/filtros';

/** Filtros vacíos: con todo en null no se filtra nada. */
const SIN_FILTROS: FiltrosBusqueda = { ciudad: null, huespedes: null, tipo: null, precioMaximo: null };

/** Listado de alojamientos con filtros. */
@Component({
  imports: [AlojamientoCard, EstadoVacio, Filtros],
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

  /** Filtros actuales. Cambian cada vez que el formulario emite filtrosCambiados. */
  protected readonly filtros = signal<FiltrosBusqueda>(SIN_FILTROS);

  /**
   * Alojamientos que cumplen los filtros.
   * computed se recalcula solo cuando cambia alojamientos() o filtros().
   */
  protected readonly resultados = computed(() =>
    this.alojamientoService.filtrar(this.alojamientos(), this.filtros())
  );

  /** Referencia al componente de filtros, para poder llamar su método limpiar(). */
  private readonly formularioFiltros = viewChild.required(Filtros);

  /** Botón del estado vacío: limpia el formulario, y este a su vez emite filtros vacíos. */
  protected limpiarFiltros(): void {
    this.formularioFiltros().limpiar();
  }
}
