import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Página 404: se muestra cuando la ruta no existe. */
@Component({
  imports: [RouterLink],
  selector: 'app-no-encontrado',
  styleUrl: './no-encontrado.css',
  templateUrl: './no-encontrado.html',
})
export class NoEncontrado {}
