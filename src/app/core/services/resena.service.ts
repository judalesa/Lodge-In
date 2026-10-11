import { Injectable, signal } from '@angular/core';
import { Resena } from '../models';

/** Clave con la que se guardan las reseñas nuevas en el localStorage del navegador. */
const STORAGE_KEY = 'lodgein.resenas';

/**
 * Reseñas que escriben los usuarios desde el detalle.
 * El frontend no puede escribir en el JSON, así que se guardan en localStorage
 * (quedan en este navegador aunque se recargue la página).
 */
@Injectable({ providedIn: 'root' })
export class ResenaService {
  /** Lista interna, editable solo desde este servicio. */
  private readonly _nuevas = signal<Resena[]>(this.cargar());

  /** Lista pública de solo lectura: los componentes la leen, pero no la pueden modificar. */
  readonly nuevas = this._nuevas.asReadonly();

  /** Crea una reseña, la pone de primera y la guarda. Devuelve la reseña creada. */
  agregar(alojamientoId: number, usuario: string, calificacion: number, comentario: string): Resena {
    const resena: Resena = {
      id: Date.now(), // milisegundos desde 1970: sirve como id único y sencillo
      alojamientoId,
      usuario: usuario.trim(),
      calificacion,
      comentario: comentario.trim(),
    };
    this._nuevas.update(lista => [resena, ...lista]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._nuevas()));
    return resena;
  }

  /** Lee las reseñas guardadas. Si no hay nada o el contenido está dañado, devuelve una lista vacía. */
  private cargar(): Resena[] {
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
