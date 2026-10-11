import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ReservaService } from '../../../core/services/reserva.service';

/** Barra de navegación superior, visible en todas las páginas. */
@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar {
  /** Misma señal que usa Mis reservas: el contador cambia apenas se crea una reserva. */
  protected readonly reservas = inject(ReservaService).reservas;
}
