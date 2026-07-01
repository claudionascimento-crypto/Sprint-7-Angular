import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // 1. Rota raiz (Vazia) -> Carrega a tela de Login
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/login/login.component')
        .then(c => c.LoginComponent)
  },

  // 2. Rota de Login explícita (/login) -> Boa prática caso precise navegar para /login diretamente
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component')
        .then(c => c.LoginComponent)
  },

  // 3. Rota Home (Protegida)
  {
    path: 'home',
    pathMatch: 'full',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/home/home.component')
        .then(c => c.HomeComponent)
  },

  // 4. Rota Dashboard (Protegida)
  {
    path: 'dashboard',
    pathMatch: 'full',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component')
        .then(c => c.DashboardComponent)
  },

  // 5. Rota Curinga -> Qualquer URL inválida ou não encontrada manda para o login
  {
    path: '**',
    redirectTo: '' // Redireciona para a rota raiz (que é o login)
  }
];