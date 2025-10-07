import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../model/Usuario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioServico {

      constructor(private http: HttpClient){}
  
      public recuperarTodos(): Observable<Usuario[]>{
        
        let token: string = localStorage.getItem("Token") ?? '';
        let header = {'Authorization':token}
  
        return this.http.get<Usuario[]>("http://localhost:8080/usuario", {headers: header});
      }

      public alterarDados(usuario:Usuario): Observable<Usuario>{
        
        let token: string = localStorage.getItem("Token") ?? '';
        let header = {'Authorization':token}
  
          return this.http.put<Usuario>("http://localhost:8080/usuario/"+ usuario.id, usuario, {headers: header});
      }
}
