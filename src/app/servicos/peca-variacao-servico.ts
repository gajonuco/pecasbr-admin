import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PecaVariacao, SalvarVariacoesDTO } from '../model/PecaVariacao';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PecaVariacaoServico {

  private base = `${environment.apiURL}/pecas`;

  constructor(private http: HttpClient) {}

  listar(idPeca: number): Observable<PecaVariacao[]> {
    return this.http.get<PecaVariacao[]>(`${this.base}/${idPeca}/variacoes`);
  }

  salvarLote(idPeca: number, payload: SalvarVariacoesDTO): Observable<void> {
    return this.http.put<void>(`${this.base}/${idPeca}/variacoes`, payload);
  }

  atualizarEstoque(idPeca: number, idVariacao: number, qtd: number): Observable<PecaVariacao> {
    return this.http.patch<PecaVariacao>(
      `${this.base}/${idPeca}/variacoes/${idVariacao}/estoque`,
      { quantidadeEstoque: qtd }
    );
  }

  remover(idPeca: number, idVariacao: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${idPeca}/variacoes/${idVariacao}`);
  }
}
