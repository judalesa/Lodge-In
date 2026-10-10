import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Params, Router, RouterLink } from '@angular/router';
import { AlojamientoService } from '../../core/services/alojamiento.service';

/** Página inicial: portada, buscador rápido y alojamientos destacados. */
@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-inicio',
  styleUrl: './inicio.css',
  templateUrl: './inicio.html',
})
export class Inicio {
  private readonly alojamientoService = inject(AlojamientoService);
  private readonly router = inject(Router);

  /** Ciudades para el <select> del buscador. */
  protected readonly ciudades = toSignal(this.alojamientoService.getCiudades(), { initialValue: [] });

  /** Buscador rápido: solo ciudad y huéspedes (el resto de filtros está en el listado). */
  protected readonly buscador = new FormGroup({
    ciudad: new FormControl<string | null>(null),
    huespedes: new FormControl<number | null>(null),
  });

  /**
   * Lleva al listado con los filtros en la URL, ej.: /alojamientos?ciudad=Medellín&huespedes=2.
   * El listado los lee al entrar (C19), así que llega ya filtrado.
   */
  protected buscar(): void {
    const { ciudad, huespedes } = this.buscador.getRawValue();
    const queryParams: Params = {};
    if (ciudad) {
      queryParams['ciudad'] = ciudad;
    }
    if (huespedes !== null && huespedes > 0) {
      queryParams['huespedes'] = huespedes;
    }
    this.router.navigate(['/alojamientos'], { queryParams });
  }
}
