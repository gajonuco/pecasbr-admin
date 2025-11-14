import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../model/Usuario';
import { Observable } from 'rxjs';
import { Token } from '../model/JWTToken';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginServico {
  constructor(private http: HttpClient){}
  
  public logarUsuarios(user: Usuario): Observable<Token> {

    let token: string = localStorage.getItem("Token") ?? '';

    let header = {
      'Authorization':token
    }
    return this.http.post<Token>(environment.apiURL+"/login", user);
  }
}
