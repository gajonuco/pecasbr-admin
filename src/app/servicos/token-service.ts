import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp: number;
  sub?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  
  constructor(private router: Router) {}

  public getToken(): string | null {
    return localStorage.getItem("Token");
  }

  public clearToken(): void {
    localStorage.removeItem("Token");
  }

  public saveToken(token: string): void {
    this.clearToken();
    localStorage.setItem("Token", token);
  }

  public isTokenValid(token: string): boolean {
    try {
      const decoded: JwtPayload = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      
      // Verifica se o token tem campo exp e se ainda não expirou
      if (decoded.exp && decoded.exp > currentTime) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return false;
    }
  }

  public hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) return false;
    return this.isTokenValid(token);
  }
}