import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EntidadeCEP } from '../model/EntidadeCEP';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BuscarCepService {
    
  constructor(private http: HttpClient){}

  public buscarCEP(cep : string): Observable<EntidadeCEP>{
    return this.http.get<EntidadeCEP>("https://opencep.com/v1/" + cep);
  }
}
