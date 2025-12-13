
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClienteServico } from '../../servicos/cliente-servico';
import { Cliente } from '../../model/Cliente';
import { EntidadeCEP } from '../../model/EntidadeCEP';
import { BuscarCepService } from '../../servicos/buscar-cep-service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';

declare var bootstrap: any;


@Component({
  selector: 'app-clientes',
    imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
   TagModule,  
  ],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css'
})
export class Clientes implements OnInit {

    public listaClientes: Cliente[] = [];
    public listaLetras: string[] = [];
    public detalhe: Cliente = new Cliente();

  public letra!: string
  public keyword!: string
  public modo!: number;
   public cliente!: Cliente;
    public mensagemToast!: string;
  public toastType!: string;
  public modoCliente!: number

  constructor(private route: ActivatedRoute,
    private servico: ClienteServico,
    private router: Router,
    private cepSerivce: BuscarCepService
  ) {  this.cliente = new Cliente(); }
  ngOnInit(): void {
    this.listaLetras = []
    for (let i = 0; i < 26; i++) {
      this.letra = String.fromCharCode(65 + i)
      this.listaLetras.push(this.letra)

    }

    this.route.queryParams.subscribe(
      (parameters) => {
        if (parameters['letra']) {
          this.servico.buscarPorLetra(parameters['letra'])
            .subscribe({
              next: (res: Cliente[]) => {
                this.listaClientes = res
              }
            })

        }
        else if (parameters['keyword']) {
          this.servico.buscarPorPalavraChave(parameters['keyword'])
            .subscribe({
              next: (res: Cliente[]) => {
                this.listaClientes = res;
              }
            })
        }
        else {
          this.servico.buscarTodos()
            .subscribe({
              next: (res: Cliente[]) => {
                console.log(res)
                this.listaClientes = res
              }
            })
        }
      }
    )
  }


  public adicionarNovoCliente() {
    this.detalhe = new Cliente();
    this.modoCliente = 0; // novo cliente
    document.getElementById("btnModalCliente")?.click();
  }

  public atualizarDadosCliente() {
    if (this.modoCliente == 0) {  // novo cliente
      this.servico.adicionarNovo(this.detalhe).subscribe({
        next: (res: Cliente) => {
          alert("Cliente adicionado com sucesso!");
        },
        error: (err: any) => {
          alert("Desculpe, não consegui incluir novo cliente");
        }
      });

    }
    else {
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



  public exibirCliente(cliente: Cliente) {
    this.detalhe = cliente;
    this.modoCliente = 1; // cliente existente
    document.getElementById("btnModalCliente")?.click();

  }

  public buscarPorPalavraChave() {
    this.router.navigate(['/main/clientes'], { queryParams: { keyword: this.keyword } })
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

   public mostrarToast() {
    const toastEl = document.querySelector('#liveToast');
    if (toastEl) {
      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    }
  } 

public buscarCEP() {
  // Remove espaços, pontos, traços e qualquer caractere não numérico
  const cepLimpo = this.detalhe.cep.trim().replace(/\D/g, '');
  
  // Atualiza o valor no modelo com o CEP limpo
  this.cliente.cep = cepLimpo;

  this.cepSerivce.buscarCEP(cepLimpo)
    .subscribe({
      next: (res: EntidadeCEP) => {
        this.detalhe.estado = res.uf;
        this.detalhe.logradouro = res.logradouro;
        this.detalhe.complemento = res.complemento
        this.detalhe.bairro = res.bairro;
        this.detalhe.cidade = res.localidade;

        console.log(res)
      }, error: (err) => {
        if (cepLimpo.length !== 8) {
          this.mensagemToast = "Informe um CEP válido com 8 dígitos.";
          this.toastType = 'warning'
        }
        else if (err.status == 404) {
          this.mensagemToast = "Não foi localizado o CEP informado.";
          this.toastType = 'error'
        }
        else{
          console.log("Error" + err.status)
        }
        this.mostrarToast();
      }
    })


  }




}
