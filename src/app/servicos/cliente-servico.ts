import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cliente } from '../model/Cliente';
import { Observable } from 'rxjs';
import { CompradorDTO } from '../dto/CompradorDTO';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClienteServico {
  constructor(private http: HttpClient) { }

  public buscarTodos(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(environment.apiURL + "/cliente");
  }

  public buscarPorPalavraChave(keyword: String): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(environment.apiURL + "/cliente/busca/" + keyword);
  }

  public buscarPorLetra(letra: String): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(environment.apiURL + "/cliente/nome/" + letra);
  }

  public buscarCompradores(idPeca: number): Observable<CompradorDTO[]> {
    return this.http.get<CompradorDTO[]>(environment.apiURL + "/cliente/compras/" + idPeca);
  }

  public buscarAniversariantes(mes: number) {
    return this.http.get<Cliente[]>(environment.apiURL + "/cliente/aniversario/" + mes);
  }

  public adicionarNovo(cliente: Cliente) {
    return this.http.post<Cliente>(environment.apiURL + "/cliente", cliente);
  }

  public atualizarDados(cliente: Cliente) {
    return this.http.put<Cliente>(environment.apiURL + "/cliente", cliente);
  }

}
