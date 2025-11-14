import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { FormaPagamento } from '../model/FormaPagamento';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormapagamentoService {
  
  constructor(private http: HttpClient){}

  public recuperarTodasFormasPgto(): Observable<FormaPagamento[]>{
    return this.http.get<FormaPagamento[]>(environment.apiURL + "/formaspagamento?visivel=0")
  }

  public recuperarPeloId(id: number): Observable<FormaPagamento>{
    return this.http.get<FormaPagamento>(environment.apiURL + "/formaspagamento/" + id);
  }

  public inserirNovo(forma: FormaPagamento){
    return this.http.post<FormaPagamento>(environment.apiURL + "/formaspagamento", forma)
  }

  public atualizar(forma: FormaPagamento){
    return this.http.put<FormaPagamento>(environment.apiURL + "/formaspagamento", forma)
  }
}
