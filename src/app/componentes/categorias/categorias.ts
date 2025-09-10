import { Component, OnInit } from '@angular/core';
import { CategoriaServico } from '../../servicos/categoria-servico';
import { Router, RouterLink } from '@angular/router';
import { CategoriaPeca } from '../../model/CategoriaPeca';

@Component({
  selector: 'app-categorias',
  imports: [RouterLink],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css'
})
export class Categorias implements OnInit {

  public lista: CategoriaPeca[] = []

  constructor(private service: CategoriaServico,
              private router: Router
  ){}
  ngOnInit(): void {
    if(!localStorage.getItem("Token")){
      this.router.navigate(['/']);
    }

    this.service.getAllCategoriasPecas()
      .subscribe({
        next: (res: CategoriaPeca[]) => {
          this.lista = res
        },
        error: (err) => {

          this.router.navigate(['/'])
        }
      })
  }




}
