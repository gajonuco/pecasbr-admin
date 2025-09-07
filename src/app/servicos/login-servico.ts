import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../model/Usuario';
import { Observable } from 'rxjs';
import { Token } from '../model/JWTToken';

@Injectable({
  providedIn: 'root'
})
export class LoginServico {
  constructor(private http: HttpClient){}
  
  public logarUsuarios(user: Usuario): Observable<Token> {
    return this.http.post<Token>("http://localhost:8080/login", user);
  }
}
