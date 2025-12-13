import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TokenService } from '../servicos/token-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private tokenService: TokenService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = this.tokenService.getToken();
    
    if (token && this.tokenService.isTokenValid(token)) {
      return true;
    }
    
    // Token inválido ou expirado
    if (token) {
      this.tokenService.clearToken();
      this.router.navigate(['/'], { queryParams: { src: 'expired' }});
    } else {
      this.router.navigate(['/'], { queryParams: { src: 'unauthorized' }});
    }
    
    return false;
  }
}