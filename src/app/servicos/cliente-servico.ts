import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cliente } from '../model/Cliente';
import { Observable } from 'rxjs';
import { CompradorDTO } from '../model/CompradorDTO';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClienteServico {
    constructor(private http: HttpClient){}

    public buscarTodos(): Observable<Cliente[]>{


      return this.http.get<Cliente[]>(environment.apiURL+"/cliente");
    }

   
    public buscarPorPalavraChave(keyword: String): Observable<Cliente[]>{
        let token: string = localStorage.getItem("Token") ?? '';
        let header = {
          'Authorization':token
        }

      return this.http.get<Cliente[]>(environment.apiURL+"/cliente/" + keyword, {headers : header});
    }
    
      public buscarPorLetra(letra: String): Observable<Cliente[]>{
        let token: string = localStorage.getItem("Token") ?? '';
        let header = {
          'Authorization':token
        }

      return this.http.get<Cliente[]>(environment.apiURL+"/cliente/nome/" + letra, {headers : header});
    }

    public buscarCompradores(idPeca: number): Observable<CompradorDTO[]>{
        let token: string = localStorage.getItem("Token") ?? '';
        let header = {
          'Authorization':token
        }

      return this.http.get<CompradorDTO[]>(environment.apiURL+"/cliente/compras/" + idPeca, {headers : header});
    }

    public buscarAniversariantes(mes: number){

        let token: string = localStorage.getItem("Token") ?? '';
        let header = {
          'Authorization':token
        }

        return this.http.get<Cliente[]>(environment.apiURL+"/cliente/aniversario/" + mes, {headers : header});

    }
  }
