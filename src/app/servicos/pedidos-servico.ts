import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pedido } from '../model/Pedido';
import { VendasPorDataDTO } from '../model/VendasPorDataDTO';
import { FiltroPedidoDTO } from '../model/FiltroPedidoDTO';


@Injectable({
  providedIn: 'root'
})
export class PedidosServico {

    constructor(private http: HttpClient){}
  
      public getAllPedidos(filtro: FiltroPedidoDTO): Observable<Pedido[]>{
        let token: string = localStorage.getItem("Token") ?? '';
  
        let header = {
          'Authorization':token
        }
        return this.http.post<Pedido[]>("http://localhost:8080/pedido/filtrar", filtro , {headers: header});
      }

        public alterarStatus(idPedido: number, status:number): Observable<Pedido>{
        let token: string = localStorage.getItem("Token") ?? '';
  
        let header = {
          'Authorization':token
        }
        return this.http.put<Pedido>(`http://localhost:8080/pedido/${idPedido}?status=${status}`,{}, { headers: header });

      }

      public recuperarTotaisDaSemana(inicio: string, fim: string): Observable<VendasPorDataDTO[]>{
        let token: string = localStorage.getItem("Token") ?? '';
  
        let header = {
          'Authorization':token
        }
        return this.http.get<VendasPorDataDTO[]>("http://localhost:8080/pedido/recentes?inicio="+inicio+"&fim="+fim, { headers: header });

      }
}
