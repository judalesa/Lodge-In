export interface Cotizacion {
  alojamientoId: number;
  fechaLlegada: string;   // formato 'yyyy-MM-dd', ej. '2026-10-15'
  fechaSalida: string;
  huespedes: number;
  noches: number;
  subtotal: number;
  tarifaLimpieza: number;
  tarifaServicio: number;
  total: number;
}
