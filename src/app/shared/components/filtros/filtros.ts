import { Component, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { FiltrosBusqueda, TipoAlojamiento } from '../../../core/models';

/** Formulario de filtros del listado: ciudad, huéspedes, tipo y precio máximo. */
@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-filtros',
  styleUrl: './filtros.css',
  templateUrl: './filtros.html',
})
export class Filtros {
  /** Ciudades para llenar el <select> (las da el padre, que las saca del servicio). */
  readonly ciudades = input<string[]>([]);

  /** Tipos de alojamiento para llenar el <select>. */
  readonly tipos = input<TipoAlojamiento[]>([]);

  /** Avisa al padre cada vez que el usuario cambia algún filtro. */
  readonly filtrosCambiados = output<FiltrosBusqueda>();

  /** El formulario. Todos los campos empiezan en null, que significa "sin filtro". */
  protected readonly form = new FormGroup({
    ciudad: new FormControl<string | null>(null),
    huespedes: new FormControl<number | null>(null),
    tipo: new FormControl<TipoAlojamiento | null>(null),
    precioMaximo: new FormControl<number | null>(null),
  });

  constructor() {
    // valueChanges emite cada vez que cambia cualquier campo.
    // debounceTime(300) espera 300 ms sin cambios antes de seguir, para no filtrar en cada tecla.
    // takeUntilDestroyed() cancela la suscripción cuando el componente se destruye.
    this.form.valueChanges
      .pipe(debounceTime(300), takeUntilDestroyed())
      .subscribe(() => this.filtrosCambiados.emit(this.leerFiltros()));
  }

  /** Deja todos los campos en null (el padre también lo llamará desde el estado vacío). */
  limpiar(): void {
    this.form.reset();
  }

  /** Lee el formulario y lo convierte en FiltrosBusqueda. Números vacíos, 0 o negativos cuentan como "sin filtro". */
  private leerFiltros(): FiltrosBusqueda {
    const valores = this.form.getRawValue();
    return {
      ciudad: valores.ciudad,
      huespedes: this.numeroPositivo(valores.huespedes),
      tipo: valores.tipo,
      precioMaximo: this.numeroPositivo(valores.precioMaximo),
    };
  }

  private numeroPositivo(valor: number | null): number | null {
    return valor !== null && valor > 0 ? valor : null;
  }
}
