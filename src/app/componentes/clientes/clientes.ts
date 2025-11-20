
import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClienteServico } from '../../servicos/cliente-servico';
import { Cliente } from '../../model/Cliente';
import { EntidadeCEP } from '../../model/EntidadeCEP';
import { BuscarCepService } from '../../servicos/buscar-cep-service';
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
   public detalhe!: Cliente;
  public modoCliente!: number

  constructor(private route: ActivatedRoute,
              private servico: ClienteServico,
              private router: Router,
              private cepSerivce: BuscarCepService
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

    public adicionarNovoCliente(){
    this.detalhe = new Cliente();
    this.modoCliente = 0; // novo cliente
    document.getElementById("btnModalCliente")?.click();
  }

    public atualizarDadosCliente(){
    if (this.modoCliente == 0){  // novo cliente
      this.servico.adicionarNovo(this.detalhe).subscribe({
        next: (res: Cliente) => { 
          alert("Cliente adicionado com sucesso!");
        },
        error: (err: any) => {
          alert("Desculpe, não consegui incluir novo cliente");
        }
       });

    } 
    else{
      this.servico.atualizarDados(this.detalhe).subscribe(
        (res: Cliente) => {
          alert("Dados do cliente atualizados com sucesso!");
        },
        (res: any) => {
          alert("Desculpe, não consegui atualizar dados do cliente");
        }
      )

    }
  }

  public exibirCliente(cliente: Cliente){
    this.detalhe = cliente;
    this.modoCliente = 1; // cliente existente
    document.getElementById("btnModalCliente")?.click();

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

     public buscarCEP(){
    this.cepSerivce.buscarCEP(this.detalhe.cep).subscribe({
      next: (res:EntidadeCEP)=>{
        this.detalhe.logradouro = res.logradouro;
        this.detalhe.bairro = res.bairro;
        this.detalhe.cidade = res.localidade;
        this.detalhe.estado = res.uf;
      },
      error: (err: any) => {
        alert("CEP nao encontrado - preencha manualmente");
      }
    }); 

}




}
