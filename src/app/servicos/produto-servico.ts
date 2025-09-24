import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Peca } from '../model/Peca';
import { PathDTO } from '../model/PathDTO';

@Injectable({
  providedIn: 'root'
})
export class ProdutoServico {
  

    constructor(private http: HttpClient){}

    public getAllPecas(): Observable<Peca[]>{

      return this.http.get<Peca[]>("http://localhost:8080/peca/todos");
    }

    public getById(id: number): Observable<Peca>{
      
      let token: string = localStorage.getItem("Token") ?? '';
      let header = {'Authorization':token}

  
      return this.http.get<Peca>("http://localhost:8080/peca/"+ id, {headers: header});
    }

    public incluirNovaPeca(peca:Peca){

      let token: string = localStorage.getItem("Token") ?? '';
      let header = {'Authorization':token}

      return this.http.post<Peca>("http://localhost:8080/peca", peca, {headers: header});

    }

    public uploadFoto(formData: FormData){

      let token: string = localStorage.getItem("Token") ?? '';
      let header = {'Authorization':token}

      return this.http.post<PathDTO>("http://localhost:8080/peca/upload", formData, {headers: header});
    }

    public atualizarProduto(peca:Peca){

      let token: string = localStorage.getItem("Token") ?? '';
      let header = {'Authorization':token} 

      return this.http.put<Peca>("http://localhost:8080/peca/"+ peca.id, peca, {headers: header});

    }
}
