import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';
import { Alojamiento, MarketplaceData } from '../models';

/** Ruta del archivo de datos dentro de public/ (Angular la sirve desde la raíz). */
const DATA_URL = 'assets/data/marketplace-data.json';

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
}
