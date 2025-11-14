import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pedido } from '../model/Pedido';
import { VendasPorDataDTO } from '../model/VendasPorDataDTO';
import { FiltroPedidoDTO } from '../model/FiltroPedidoDTO';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PedidosServico {

    constructor(private http: HttpClient){}
  
      public getAllPedidos(filtro: FiltroPedidoDTO): Observable<Pedido[]>{
        return this.http.post<Pedido[]>(environment.apiURL+"/pedido/filtrar", filtro );
      }

      public alterarStatus(pedido: Pedido, status:number){
        return this.http.patch<Pedido>(environment.apiURL + "/pedido/" + pedido.id + "?status=" + status, {});

      }

      public recuperarTotaisDaSemana(inicio: string, fim: string): Observable<VendasPorDataDTO[]>{

        return this.http.get<VendasPorDataDTO[]>(environment.apiURL+"/pedido/recentes?inicio="+inicio+"&fim="+fim);
      }

      public atualizarPedido(pedido: Pedido): Observable<Pedido>{
        return this.http.put<Pedido>(environment.apiURL + "/pedido", pedido )
      }
}
