import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../model/Usuario';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioServico {

  constructor(private http: HttpClient) { }

  public recuperarTodos(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(environment.apiURL + "/usuario");
  }

  public alterarDados(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(environment.apiURL + "/usuario/" + usuario.id, usuario);
  }

  public adicionarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(environment.apiURL + "/usuario", usuario);
  }

  public recuperarPeloId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(environment.apiURL + "/usuario/" + id);
  }
}
