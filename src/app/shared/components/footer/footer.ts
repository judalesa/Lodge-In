import { Component } from '@angular/core';

/** Pie de página, visible en todas las páginas. */
@Component({
  imports: [],
  selector: 'app-footer',
  styleUrl: './footer.css',
  templateUrl: './footer.html',
})
export class Footer {
  /** Año actual, para no tener que cambiarlo a mano cada año. */
  protected readonly anio = new Date().getFullYear();
}
