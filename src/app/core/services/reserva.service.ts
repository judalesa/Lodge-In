import { Injectable, signal } from '@angular/core';
import { Alojamiento, Cotizacion, Reserva } from '../models';

/** Clave con la que se guardan las reservas en el localStorage del navegador. */
const STORAGE_KEY = 'lodgein.reservas';

/**
 * Reservas que hace el usuario desde el detalle de un alojamiento.
 * Como no hay backend, se guardan en localStorage para que sigan ahí
 * aunque se recargue la página (RF-14).
 */
@Injectable({ providedIn: 'root' })
export class ReservaService {
  /** Lista interna, editable solo desde este servicio. */
  private readonly _reservas = signal<Reserva[]>(this.cargar());

  /** Lista pública de solo lectura: Mis reservas y la barra de navegación la leen. */
  readonly reservas = this._reservas.asReadonly();

  /**
   * Crea una reserva confirmada a partir de una cotización válida y la guarda.
   * RN-07: no se puede reservar sin cotizar primero, por eso se exige la cotización.
   */
  crear(alojamiento: Alojamiento, cotizacion: Cotizacion | null, nombre: string, correo: string): Reserva {
    if (!cotizacion) {
      throw new Error('No se puede reservar sin una cotización válida (RN-07).');
    }

    const nueva: Reserva = {
      // Ej.: 'R-MG3K9Z2A'. toString(36) usa dígitos y letras, así el id queda corto y legible.
      id: 'R-' + Date.now().toString(36).toUpperCase(),
      alojamientoId: alojamiento.id,
      alojamientoNombre: alojamiento.nombre,
      ciudad: alojamiento.ciudad,
      imagen: alojamiento.imagenPrincipal,
      fechaLlegada: cotizacion.fechaLlegada,
      fechaSalida: cotizacion.fechaSalida,
      huespedes: cotizacion.huespedes,
      noches: cotizacion.noches,
      total: cotizacion.total,
      nombreHuesped: nombre.trim(),
      correo: correo.trim(),
      estado: 'CONFIRMADA',
      fechaCreacion: new Date().toISOString(),
    };

    this._reservas.update(lista => [nueva, ...lista]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._reservas()));
    return nueva;
  }

  /** Lee las reservas guardadas. Si no hay nada o el contenido está dañado, devuelve una lista vacía. */
  private cargar(): Reserva[] {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY);
      const datos: unknown = guardado ? JSON.parse(guardado) : [];
      return Array.isArray(datos) ? datos : [];
    } catch {
      // JSON.parse lanza un error si el texto no es JSON válido.
      return [];
    }
  }
}
