
import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClienteServico } from '../../servicos/cliente-servico';
import { Cliente } from '../../model/Cliente';
;

@Component({
  selector: 'app-clientes',
  imports: [ FormsModule, DatePipe, RouterLink],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css'
})
export class Clientes {

  public listaLetras:string[]
  public listaClientes!:Cliente[]
  public letra!:string
  public keyword!:string
  public modo!:number;

  constructor(private route: ActivatedRoute,
              private servico: ClienteServico,
              private router: Router
  ){
      this.listaLetras = []
      for (let i = 0; i < 26; i++) {
        this.letra = String.fromCharCode(65+i)
        this.listaLetras.push(this.letra)
        
      }

    this.route.queryParams.subscribe(
      (parameters) => {
        if(parameters['letra']) {
          this.servico.buscarPorLetra(parameters['letra'])
            .subscribe({
              next: (res: Cliente[]) => {
                this.listaClientes = res
              }
          })

        }
        else if(parameters['keyword']){
          this.servico.buscarPorPalavraChave(parameters['keyword'])
            .subscribe({
              next: (res: Cliente[]) => {
                this.listaClientes = res
              }
          })
        } else{
          this.servico.buscarTodos()
            .subscribe({
              next: (res: Cliente[]) => {
                this.listaClientes = res
              }
          })
        }
      }
    )
  }

    public buscarPorPalavraChave(){
      this.router.navigate(['clientes'], {queryParams:{keyword : this.keyword}})
  }

    public isBirthDay(dataNasc: string): boolean {
      if (!dataNasc) return false; 
      const hoje = new Date();
      const mesHoje = hoje.getMonth() + 1;
      const diaHoje = hoje.getDate();

      // Se dataNasc vier no formato "yyyy-mm-dd"
      const mesNasc = parseInt(dataNasc.slice(5, 7));
      const diaNasc = parseInt(dataNasc.slice(8, 10));

      return mesHoje === mesNasc && diaHoje === diaNasc;
    }

}
