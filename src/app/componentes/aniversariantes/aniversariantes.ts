import { Component } from '@angular/core';
import { ClienteServico } from '../../servicos/cliente-servico';
import { Cliente } from '../../model/Cliente';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-aniversariantes',
  imports: [DatePipe],
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
