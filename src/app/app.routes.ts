import { Routes } from '@angular/router';

/**
 * Rutas de la aplicación.
 * loadComponent carga cada página solo cuando se visita (carga perezosa).
 * title cambia el texto de la pestaña del navegador.
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/inicio/inicio').then(m => m.Inicio),
    title: 'Lodge In · Inicio',
  },
  {
    path: 'alojamientos',
    loadComponent: () => import('./pages/listado/listado').then(m => m.Listado),
    title: 'Lodge In · Alojamientos',
  },
  {
    path: 'alojamientos/:id',
    loadComponent: () => import('./pages/detalle/detalle').then(m => m.Detalle),
    title: 'Lodge In · Detalle',
  },
  {
    path: 'mis-reservas',
    loadComponent: () => import('./pages/mis-reservas/mis-reservas').then(m => m.MisReservas),
    title: 'Lodge In · Mis reservas',
  },
  {
    // '**' atrapa cualquier ruta que no coincida con las de arriba.
    // Debe ir SIEMPRE de última: Angular revisa las rutas en orden.
    path: '**',
    loadComponent: () => import('./pages/no-encontrado/no-encontrado').then(m => m.NoEncontrado),
    title: 'Lodge In · Página no encontrada',
  },
];
