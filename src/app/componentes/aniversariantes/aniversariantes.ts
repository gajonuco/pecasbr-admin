import { Component } from '@angular/core';
import { ClienteServico } from '../../servicos/cliente-servico';
import { Cliente } from '../../model/Cliente';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-aniversariantes',
  imports: [DatePipe, FormsModule, TableModule, ButtonModule, TagModule ],
  templateUrl: './aniversariantes.html',
  styleUrl: './aniversariantes.css'
})
export class Aniversariantes {


  private dataHoje: Date;
  public lista: Cliente[]= []
  constructor(private cliService: ClienteServico){
    this.dataHoje = new Date();
    let mes = this.dataHoje.getMonth() + 1;
    this.aniv(mes);


  }
  
  public aniv(mes: number): void{
    this.cliService.buscarAniversariantes(mes)
      .subscribe({
        next: (res: Cliente[]) =>
          this.lista = res
      })
  }
}
