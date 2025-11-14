import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../model/Usuario';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioServico {

      constructor(private http: HttpClient){}
  
      public recuperarTodos(): Observable<Usuario[]>{
        
        let token: string = localStorage.getItem("Token") ?? '';
        let header = {'Authorization':token}
  
        return this.http.get<Usuario[]>(environment.apiURL+"/usuario", {headers: header});
      }

      public alterarDados(usuario:Usuario): Observable<Usuario>{
        
        let token: string = localStorage.getItem("Token") ?? '';
        let header = {'Authorization':token}
  
          return this.http.put<Usuario>(environment.apiURL+"/usuario/"+ usuario.id, usuario, {headers: header});
      }

      public adicionarUsuario(usuario:Usuario): Observable<Usuario>{
      
        let token: string = localStorage.getItem("Token") ?? '';
        let header = {'Authorization':token}

          return this.http.post<Usuario>(environment.apiURL+"/usuario", usuario, {headers: header});
    } 

    public recuperarPeloId(id: number): Observable<Usuario>{
      
        let token: string = localStorage.getItem("Token") ?? '';
        let header = {'Authorization':token}

          return this.http.get<Usuario>(environment.apiURL+"/usuario/"+ id, {headers: header});
    } 
}
