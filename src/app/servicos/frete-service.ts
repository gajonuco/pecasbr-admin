import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Frete } from '../model/Frete';

@Injectable({
  providedIn: 'root'
})
export class FreteService {
  

  constructor(private http: HttpClient) { }

  public recuperarTodos(){
    return this.http.get<Frete[]>(environment.apiURL+"/fretes");
  }

  public atualizarFrete(frete: Frete){
    return this.http.put<Frete>(environment.apiURL+"/fretes", frete);
  }

  public inserirFrete(frete: Frete){
    return this.http.post<Frete>(environment.apiURL+"/fretes", frete);
  }

  public recuperarPeloId(id: number){
    return this.http.get<Frete>(environment.apiURL+"/fretes/"+id);
  }
}
