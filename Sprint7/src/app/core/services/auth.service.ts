import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly TOKEN_KEY = 'token';

  constructor() {}

  // =========================
  // VERIFICA SE ESTÁ LOGADO
  // =========================
  isLoggedIn(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  // =========================
  // LOGIN (SALVA TOKEN)
  // =========================
  login(token: string): void {
    if (typeof window === 'undefined') {
      return;
    }

    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // =========================
  // LOGOUT (REMOVE TOKEN)
  // =========================
  logout(): void {
    if (typeof window === 'undefined') {
      return;
    }

    localStorage.removeItem(this.TOKEN_KEY);
  }

  // =========================
  // OBTÉM TOKEN
  // =========================
  getToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    return localStorage.getItem(this.TOKEN_KEY);
  }

}