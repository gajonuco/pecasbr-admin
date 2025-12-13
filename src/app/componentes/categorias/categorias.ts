import { Component, OnInit } from '@angular/core';
import { CategoriaServico } from '../../servicos/categoria-servico';
import { Router, RouterLink } from '@angular/router';
import { CategoriaPeca } from '../../model/CategoriaPeca';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { TableModule } from "primeng/table";

@Component({
  selector: 'app-categorias',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    InputTextModule,
    InputNumberModule,
    CheckboxModule,
    ButtonModule,
    TableModule
],
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
