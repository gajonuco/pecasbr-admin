import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegistroFinanceiro } from '../model/RegistroFinanceiro';
import { environment } from '../../environments/environment';
import { ItemFinanceiroDTO } from '../model/ItemFinanceiroDTO';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RegistroFinanceiroService {
   constructor(private http: HttpClient) { }

  public gerarRegistroFinanceiro(registro: RegistroFinanceiro): Observable<RegistroFinanceiro>{
    return this.http.post<RegistroFinanceiro>(environment.apiURL + "/financeiro", registro);
   }

 
  public recuperarRegistrosFinanceiros() {
    return this.http.get<ItemFinanceiroDTO[]>(environment.apiURL + "/financeiro", )
  }

  public alterarStatusItem(item: ItemFinanceiroDTO){
    return this.http.put<ItemFinanceiroDTO>(environment.apiURL+"/financeiro", item )
  }
}
