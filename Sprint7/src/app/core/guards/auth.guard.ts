import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  // =========================
  // VERIFICA AUTENTICAÇÃO
  // =========================
  const isAuthenticated = authService.isLoggedIn();

  if (isAuthenticated) {
    return true;
  }

  // =========================
  // NÃO AUTENTICADO → REDIRECIONA
  // =========================
  router.navigate(['/login'], {
    replaceUrl: true
  });

  return false;
};