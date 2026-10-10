import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { FiltrosBusqueda, TipoAlojamiento } from '../../core/models';
import { AlojamientoService } from '../../core/services/alojamiento.service';
import { AlojamientoCard } from '../../shared/components/alojamiento-card/alojamiento-card';
import { EstadoVacio } from '../../shared/components/estado-vacio/estado-vacio';
import { Filtros } from '../../shared/components/filtros/filtros';

/** Tipos válidos, para no aceptar cualquier texto que alguien escriba en la URL. */
const TIPOS_VALIDOS: TipoAlojamiento[] = ['Apartamento', 'Casa', 'Cabaña', 'Villa'];

/** Listado de alojamientos con filtros. */
@Component({
  imports: [AlojamientoCard, EstadoVacio, Filtros],
  selector: 'app-listado',
  styleUrl: './listado.css',
  templateUrl: './listado.html',
})
export class Listado {
  private readonly alojamientoService = inject(AlojamientoService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  /**
   * Filtros que vienen en la URL al entrar (ej.: /alojamientos?ciudad=Cartagena).
   * snapshot = "foto" de la ruta en el momento de entrar.
   */
  protected readonly filtrosIniciales = this.leerFiltrosDeUrl(this.route.snapshot.queryParamMap);

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

  /** Filtros actuales. Arrancan con los de la URL y cambian cada vez que el formulario emite. */
  protected readonly filtros = signal<FiltrosBusqueda>(this.filtrosIniciales);

  /**
   * Alojamientos que cumplen los filtros.
   * computed se recalcula solo cuando cambia alojamientos() o filtros().
   */
  protected readonly resultados = computed(() =>
    this.alojamientoService.filtrar(this.alojamientos(), this.filtros())
  );

  /** Referencia al componente de filtros, para poder llamar su método limpiar(). */
  private readonly formularioFiltros = viewChild.required(Filtros);

  /** El formulario cambió: filtra y deja los filtros escritos en la URL. */
  protected cambiarFiltros(filtros: FiltrosBusqueda): void {
    this.filtros.set(filtros);
    this.router.navigate([], {
      relativeTo: this.route, // [] + relativeTo = "quédate en esta misma página"
      queryParams: this.aQueryParams(filtros),
      queryParamsHandling: 'replace', // reemplaza todos los parámetros anteriores
      replaceUrl: true, // no llena el historial: "Atrás" sale del listado, no deshace filtros
    });
  }

  /** Botón del estado vacío: limpia el formulario, y este a su vez emite filtros vacíos. */
  protected limpiarFiltros(): void {
    this.formularioFiltros().limpiar();
  }

  /** Convierte los parámetros de la URL (siempre texto) en FiltrosBusqueda. Lo inválido queda en null. */
  private leerFiltrosDeUrl(params: ParamMap): FiltrosBusqueda {
    const tipo = params.get('tipo') as TipoAlojamiento | null;
    return {
      ciudad: params.get('ciudad'),
      huespedes: this.aNumero(params.get('huespedes')),
      tipo: tipo && TIPOS_VALIDOS.includes(tipo) ? tipo : null,
      precioMaximo: this.aNumero(params.get('precioMaximo')),
    };
  }

  /** "4" → 4. Texto vacío, letras, 0 o negativos → null. */
  private aNumero(texto: string | null): number | null {
    const numero = Number(texto);
    return texto && Number.isFinite(numero) && numero > 0 ? numero : null;
  }

  /** Arma los parámetros de la URL omitiendo los filtros en null, para que la URL quede limpia. */
  private aQueryParams(filtros: FiltrosBusqueda): Params {
    const params: Params = {};
    for (const [clave, valor] of Object.entries(filtros)) {
      if (valor !== null) {
        params[clave] = valor;
      }
    }
    return params;
  }
}
