import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Peca } from '../model/Peca';
import { PathDTO } from '../dto/PathDTO';
import { environment } from '../../environments/environment';
import { FiltroPedidoDTO } from '../dto/FiltroPedidoDTO';
import { FiltroRankingProdutosDTO } from '../dto/FiltroRankingProdutosDTO';
import { ProdutoMaisPedidoDTO } from '../dto/ProdutoMaisPedidoDTO';

@Injectable({
  providedIn: 'root'
})
export class ProdutoServico {


  constructor(private http: HttpClient) { }

  public getAllPecas(): Observable<Peca[]> {
    return this.http.get<Peca[]>(environment.apiURL + "/peca/todos");
  }

  public getById(id: number): Observable<Peca> {
    return this.http.get<Peca>(environment.apiURL + "/peca/" + id);
  }

  public incluirNovaPeca(peca: Peca) {
    return this.http.post<Peca>(environment.apiURL + "/peca", peca);

  }

  public uploadFoto(formData: FormData)   {
    return this.http.post<PathDTO>(environment.apiURL + "/peca/upload", formData);
  }

  public atualizarProduto(peca: Peca) {
    return this.http.put<Peca>(environment.apiURL + "/peca/" + peca.id, peca);

  }

  public listarProdutosMaisPedidos(filtro: FiltroRankingProdutosDTO){
    return this.http.post<ProdutoMaisPedidoDTO[]>(environment.apiURL + "/produtos_mais_pedidos", filtro);
  }
}
