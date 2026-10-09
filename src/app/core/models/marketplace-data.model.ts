import { Alojamiento } from './alojamiento.model';
import { Resena } from './resena.model';

export interface MarketplaceData {
  alojamientos: Alojamiento[];
  resenas: Resena[];
}
