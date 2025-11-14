import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoriaPeca } from '../model/CategoriaPeca';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriaServico {
  
  constructor(private http: HttpClient){}

    public getAllCategoriasPecas(): Observable<CategoriaPeca[]>{

      return this.http.get<CategoriaPeca[]>(environment.apiURL+"/categoria_by_id");
    }

   
    public getById(id: number): Observable<CategoriaPeca>{
      let token: string = localStorage.getItem("Token") ?? '';

      let header = {
        'Authorization':token
      }
      return this.http.get<CategoriaPeca>(environment.apiURL+"/categoria_peca/"+ id, {headers: header});
    }
    
    public incluirNovaCategoria(categoria:CategoriaPeca){

      let token: string = localStorage.getItem("Token") ?? '';
      let header = {
        'Authorization':token
      }
      return this.http.post<CategoriaPeca>(environment.apiURL+"/categoria_peca", categoria, {headers: header});

    }

    public atualizarCategoria(categoria:CategoriaPeca){

      let token: string = localStorage.getItem("Token") ?? '';
      let header = {
        'Authorization':token
      }
      return this.http.put<CategoriaPeca>(environment.apiURL+"/categoria_peca", categoria, {headers: header});

    }
}
