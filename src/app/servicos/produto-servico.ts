import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Peca } from '../model/Peca';
import { PathDTO } from '../dto/PathDTO';
import { environment } from '../../environments/environment';
import { FiltroPedidoDTO } from '../dto/FiltroPedidoDTO';
import { FiltroRankingProdutosDTO } from '../dto/FiltroRankingProdutosDTO';
import { ProdutoMaisPedidoDTO } from '../dto/ProdutoMaisPedidoDTO';
import { PecaImagem } from '../model/PecaImagem';

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

  public uploadFoto(formData: FormData) {
    return this.http.post<PathDTO>(environment.apiURL + "/peca/upload", formData);
  }

  public atualizarProduto(peca: Peca) {
    return this.http.put<Peca>(environment.apiURL + "/peca/" + peca.id, peca);

  }

  public listarProdutosMaisPedidos(filtro: FiltroRankingProdutosDTO) {
    return this.http.post<ProdutoMaisPedidoDTO[]>(environment.apiURL + "/produtos_mais_pedidos", filtro);
  }

  // Adicione estes métodos ao ProdutoServico existente:

  public listarImagensPeca(pecaId: number): Observable<PecaImagem[]> {
    return this.http.get<PecaImagem[]>(
      `${environment.apiURL}/peca/${pecaId}/imagens`
    );
  }

  public uploadFotoViaUrl(pecaId: number, url: string, principal: number = 0): Observable<PecaImagem> {
    return this.http.post<PecaImagem>(
      `${environment.apiURL}/peca/${pecaId}/imagem/url`,
      { url, principal }
    );
  }

  public adicionarImagemPeca(
    pecaId: number,
    formData: FormData,
    principal: number = 0
  ): Observable<PecaImagem> {
    formData.append('principal', principal.toString());
    return this.http.post<PecaImagem>(
      `${environment.apiURL}/peca/${pecaId}/imagem`,
      formData
    );
  }

  public removerImagemPeca(imagemId: number): Observable<void> {
    return this.http.delete<void>(
      `${environment.apiURL}/peca/imagem/${imagemId}`
    );
  }

  public definirImagemPrincipal(
    pecaId: number,
    imagemId: number
  ): Observable<void> {
    return this.http.patch<void>(
      `${environment.apiURL}/peca/${pecaId}/imagem/${imagemId}/principal`,
      {}
    );
  }

  public reordenarImagens(pecaId: number, ordens: { id: number; ordem: number }[]): Observable<void> {
  return this.http.patch<void>(
    `${environment.apiURL}/peca/${pecaId}/imagens/reordenar`,
    ordens
  );
}

}
