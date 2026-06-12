import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/login/login.component')
        .then(c => c.LoginComponent)
  },

  {
    path: 'home',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/home/home.component')
        .then(c => c.HomeComponent)
  },

  {
    path: 'dashboard',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component')
        .then(c => c.DashboardComponent)
  }

];