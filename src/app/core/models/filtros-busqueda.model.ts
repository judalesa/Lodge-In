import { TipoAlojamiento } from './alojamiento.model';

export interface FiltrosBusqueda {
  ciudad: string | null;
  huespedes: number | null;
  tipo: TipoAlojamiento | null;
  precioMaximo: number | null;
}
