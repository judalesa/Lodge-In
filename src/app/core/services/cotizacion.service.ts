import { Injectable } from '@angular/core';
import { Alojamiento, Cotizacion } from '../models';

/** Tarifa de servicio de la plataforma: 10 % del subtotal (RN-08). */
const TARIFA_SERVICIO = 0.1;

/** Milisegundos que tiene un día: 24 h × 60 min × 60 s × 1000 ms. */
const MS_POR_DIA = 86_400_000;

/** Calcula el costo de una estadía: noches, subtotal, limpieza, servicio y total. */
@Injectable({ providedIn: 'root' })
export class CotizacionService {
  /**
   * Devuelve la cotización, o null si los datos no son válidos:
   * - menos de 1 noche (la salida debe ser después de la llegada, RN-01),
   * - huéspedes fuera del rango 1..capacidad (RN-03, RN-04),
   * - fecha de llegada en el pasado (RN-02).
   * Así nunca se calcula un precio con datos inválidos (RN-06).
   *
   * Las fechas llegan como texto 'yyyy-MM-dd', que es lo que entrega un <input type="date">.
   */
  calcular(alojamiento: Alojamiento, llegada: string, salida: string, huespedes: number): Cotizacion | null {
    const noches = this.contarNoches(llegada, salida);
    if (noches < 1) {
      return null;
    }
    if (huespedes < 1 || huespedes > alojamiento.capacidad) {
      return null;
    }
    if (llegada < this.hoyISO()) {
      return null; // con el formato 'yyyy-MM-dd' se pueden comparar fechas como texto
    }

    const subtotal = noches * alojamiento.precioNoche;
    const tarifaServicio = Math.round(subtotal * TARIFA_SERVICIO);
    const total = subtotal + alojamiento.tarifaLimpieza + tarifaServicio;

    return {
      alojamientoId: alojamiento.id,
      fechaLlegada: llegada,
      fechaSalida: salida,
      huespedes,
      noches,
      subtotal,
      tarifaLimpieza: alojamiento.tarifaLimpieza,
      tarifaServicio,
      total,
    };
  }

  /**
   * Noches entre dos fechas 'yyyy-MM-dd'. Ej.: del 15 al 18 = 3 noches.
   * Se usa Date.UTC para que la zona horaria (y los cambios de horario) no corran la cuenta un día.
   * Si alguna fecha está vacía o mal escrita, devuelve 0.
   */
  private contarNoches(llegada: string, salida: string): number {
    const inicio = this.aMilisegundosUTC(llegada);
    const fin = this.aMilisegundosUTC(salida);
    if (inicio === null || fin === null) {
      return 0;
    }
    return Math.round((fin - inicio) / MS_POR_DIA);
  }

  /** '2026-10-15' → milisegundos de ese día a medianoche UTC. null si el texto no es una fecha. */
  private aMilisegundosUTC(fecha: string): number | null {
    const [anio, mes, dia] = fecha.split('-').map(Number);
    if (!anio || !mes || !dia) {
      return null;
    }
    return Date.UTC(anio, mes - 1, dia); // en JavaScript los meses van de 0 (enero) a 11 (diciembre)
  }

  /** Fecha de hoy (hora local del usuario) como 'yyyy-MM-dd'. */
  private hoyISO(): string {
    const hoy = new Date();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    return `${hoy.getFullYear()}-${mes}-${dia}`;
  }
}
