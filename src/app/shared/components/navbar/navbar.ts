import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

/** Barra de navegación superior, visible en todas las páginas. */
@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar {}
