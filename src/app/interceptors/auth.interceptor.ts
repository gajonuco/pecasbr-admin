import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TokenService } from '../servicos/token-service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private tokenService: TokenService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = this.tokenService.getToken();
    let authReq = req;

    // Adiciona token no header se existir e for válido
    if (token && this.tokenService.isTokenValid(token)) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {

        // 401 → token expirado ou inválido
        if (error.status === 401) {
          this.tokenService.clearToken();
          this.router.navigate(['/'], { queryParams: { src: 'expired' } });
        }

        // 403 → não autorizado (usuário inativo ou sem permissão)
        if (error.status === 403) {
          this.tokenService.clearToken();
          this.router.navigate(['/'], { queryParams: { src: 'unauthorized' } });
        }
        if (error.status == 413) {
          alert("Tente enviar uma imagem mais pequena.")
        }

        return throwError(() => error);
      })
    );
  }
}