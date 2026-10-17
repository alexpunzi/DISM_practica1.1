import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'gestionusuarios',
    loadComponent: () => import('./gestionusuarios/gestionusuarios.page').then( m => m.GestionusuariosPage)
  },
  {
    path: 'gestiontrabajos',
    loadComponent: () => import('./gestiontrabajos/gestiontrabajos.page').then( m => m.GestiontrabajosPage)
  },
  {
    path: 'gestionfichajes',
    loadComponent: () => import('./gestionfichajes/gestionfichajes.page').then( m => m.GestionfichajesPage)
  },
];
