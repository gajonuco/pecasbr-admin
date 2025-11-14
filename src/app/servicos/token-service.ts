import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  
  constructor(private router: Router){}

  public getToken(): string | null {
    const token = localStorage.getItem("Token");
    if (!token) {
      this.router.navigate(['/'], { queryParams: { src: 'unauthorized'}});
      return null;
    }
    return token;
  }

  public clearToken() {
    localStorage.removeItem("Token");
  }
}
