import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoriaPeca } from '../model/CategoriaPeca';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriaServico {

  constructor(private http: HttpClient) { }

  public getAllCategoriasPecas(): Observable<CategoriaPeca[]> {
    return this.http.get<CategoriaPeca[]>(environment.apiURL + "/categoria_by_id");
  }
  public getById(id: number): Observable<CategoriaPeca> {
    return this.http.get<CategoriaPeca>(environment.apiURL + "/categoria_peca/" + id)
  }

  public incluirNovaCategoria(categoria: CategoriaPeca) {
    return this.http.post<CategoriaPeca>(environment.apiURL + "/categoria_peca", categoria);

  }
  public atualizarCategoria(categoria: CategoriaPeca) {
    return this.http.put<CategoriaPeca>(environment.apiURL + "/categoria_peca", categoria);

  }
}
