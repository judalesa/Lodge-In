import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';
import { Alojamiento, MarketplaceData, Resena, TipoAlojamiento } from '../models';

/** Ruta del archivo de datos dentro de public/ (Angular la sirve desde la raíz). */
const DATA_URL = 'assets/data/marketplace-data.json';

/** Calificación mínima para aparecer como destacado en la página inicial. */
const CALIFICACION_DESTACADO = 4.5;

/** Cuántos destacados se muestran en la página inicial. */
const MAX_DESTACADOS = 3;

/**
 * Único punto de acceso a los datos de alojamientos.
 * Los componentes nunca leen el JSON directamente: siempre pasan por este servicio.
 */
@Injectable({ providedIn: 'root' })
export class AlojamientoService {
  private readonly http = inject(HttpClient);

  /** Lee el JSON una sola vez; shareReplay(1) guarda la respuesta para las siguientes llamadas. */
  private readonly datos$: Observable<MarketplaceData> = this.http
    .get<MarketplaceData>(DATA_URL)
    .pipe(shareReplay(1));

  /** Alojamientos visibles: solo los activos (RN-09) y con precio por noche mayor que cero (RN-05). */
  getAlojamientos(): Observable<Alojamiento[]> {
    return this.datos$.pipe(
      map(datos => datos.alojamientos.filter(a => a.activo && a.precioNoche > 0))
    );
  }

  /**
   * Busca un alojamiento por su id. Devuelve undefined si no existe o está inactivo,
   * porque busca solo dentro de los alojamientos visibles.
   */
  getById(id: number): Observable<Alojamiento | undefined> {
    return this.getAlojamientos().pipe(
      map(lista => lista.find(a => a.id === id))
    );
  }

  /** Reseñas de un alojamiento, unidas por el campo alojamientoId. */
  getResenas(alojamientoId: number): Observable<Resena[]> {
    return this.datos$.pipe(
      map(datos => datos.resenas.filter(r => r.alojamientoId === alojamientoId))
    );
  }

  /** Los mejor calificados (calificación >= 4.5), de mayor a menor, máximo 3. */
  getDestacados(): Observable<Alojamiento[]> {
    return this.getAlojamientos().pipe(
      map(lista => lista
        .filter(a => a.calificacion >= CALIFICACION_DESTACADO)
        .sort((a, b) => b.calificacion - a.calificacion)
        .slice(0, MAX_DESTACADOS))
    );
  }

  /** Ciudades sin repetir, en orden alfabético, para el filtro de ciudad. */
  getCiudades(): Observable<string[]> {
    return this.getAlojamientos().pipe(
      map(lista => [...new Set(lista.map(a => a.ciudad))].sort((a, b) => a.localeCompare(b)))
    );
  }

  /** Tipos de alojamiento sin repetir, para el filtro de tipo. */
  getTipos(): Observable<TipoAlojamiento[]> {
    return this.getAlojamientos().pipe(
      map(lista => [...new Set(lista.map(a => a.tipo))].sort((a, b) => a.localeCompare(b)))
    );
  }
}
