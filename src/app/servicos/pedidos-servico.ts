import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pedido } from '../model/Pedido';

@Injectable({
  providedIn: 'root'
})
export class PedidosServico {

    constructor(private http: HttpClient){}
  
      public getAllPedidos(): Observable<Pedido[]>{
        let token: string = localStorage.getItem("Token") ?? '';
  
        let header = {
          'Authorization':token
        }
        return this.http.get<Pedido[]>("http://localhost:8080/pedido", {headers: header});
      }

        public alterarStatus(idPedido: number, status:number): Observable<Pedido>{
        let token: string = localStorage.getItem("Token") ?? '';
  
        let header = {
          'Authorization':token
        }
        return this.http.put<Pedido>(`http://localhost:8080/pedido/${idPedido}?status=${status}`,{}, { headers: header });

}}
