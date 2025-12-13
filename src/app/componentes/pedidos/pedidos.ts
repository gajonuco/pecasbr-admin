import { Component } from '@angular/core';
import { Pedido } from '../../model/Pedido';
import { PedidosServico } from '../../servicos/pedidos-servico';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Cliente } from '../../model/Cliente';
import { FiltroPedidoDTO } from '../../dto/FiltroPedidoDTO';
import { FormsModule } from '@angular/forms';
import { StatusPedido } from '../../model/StatusPedido';
import { FormapagamentoService } from '../../servicos/formapagamento-service';
import { RegistroFinanceiro } from '../../model/RegistroFinanceiro';
import { Router } from '@angular/router';
import { FormaPagamento } from '../../model/FormaPagamento';
import { RegistroFinanceiroService } from '../../servicos/registro-financeiro-service';


// PrimeNG
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { AccordionModule } from 'primeng/accordion';

import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { Select } from 'primeng/select';

import { DialogModule } from 'primeng/dialog';        // ✅ ADICIONAR
import { InputNumberModule } from 'primeng/inputnumber'; // ✅ ADICIONAR
import { DividerModule } from 'primeng/divider';      // ✅ ADICIONAR
declare var bootstrap: any;
@Component({
  selector: 'app-pedidos',
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    CurrencyPipe,
    TableModule,
    TagModule,
    AccordionModule,
    InputTextModule,
    ToggleButtonModule,
    ButtonModule,
    TooltipModule,
    DialogModule,        // ✅ ADICIONAR
    InputNumberModule,   // ✅ ADICIONAR
    DividerModule, Select        // ✅ ADICIONAR
  ],
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.css'
})
export class Pedidos {

  public mensagemToast!: string;
  public toastType!: string;
  public detalhe: Pedido = new Pedido();
  public filtroPedidoDTO: FiltroPedidoDTO = new FiltroPedidoDTO();
  public registroFinanceiro!: RegistroFinanceiro
  public total!: number;
  public formasPgto!: FormaPagamento[]
  public lista!: Pedido[]

    // ✅ ADICIONAR: Variáveis para controlar os modais
  displayDetalhePedido: boolean = false;
  displayFinanceiro: boolean = false;
  
  // ✅ ADICIONAR: Opções para o dropdown de retirar
  retirarOptions = [
    { label: 'Não', value: 0 },
    { label: 'Sim', value: 1 }
  ];
  constructor(
    private service: PedidosServico,
    private fpservice: FormapagamentoService,
    private rfservice: RegistroFinanceiroService,
    private router: Router
  ) {
    this.detalhe.cliente = new Cliente()
    this.registroFinanceiro = new RegistroFinanceiro();



    this.service.getAllPedidos(this.filtroPedidoDTO)
      .subscribe({
        next: (res: Pedido[]) => {
          this.lista = res,
            console.log(this.lista)
          this.lista.forEach(item => { this.total += item.valorTotal })
        },
        error: (err) => {
          if (err.status == 403) {
            localStorage.removeItem("Token");
            this.router.navigate(["/"], { queryParams: { src: "expired" } })
          }
        }
      })

  }

  public alterarStatus(pedido: Pedido, status: number) {
    this.service.alterarStatus(pedido, status).
      subscribe({
        next: (res: Pedido) => {
          this.mensagemToast = "Status do pedido alterado!"
          this.toastType = 'success'
          this.mostrarToast();
        },
        error: (err) => {
          this.mensagemToast = "ERRO ao alterar o status do pedido"
          this.toastType = 'error';
          this.mostrarToast();
        }
      })


  }

  public mostrarToast() {
    const toastEl = document.querySelector('#liveToast');
    if (toastEl) {
      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    }
  }

  public enviarDetalhes(item: any){
    this.detalhe = item;  // Apenas isso
    this.displayDetalhePedido = true; // Abre o modal PrimeNG

  }

  public filtrarPedidos() {
    this.filtroPedidoDTO.novo = (this.filtroPedidoDTO.novo) ? StatusPedido.NOVO_PEDIDO : 0;
    this.filtroPedidoDTO.pago = (this.filtroPedidoDTO.pago) ? StatusPedido.PAGO : 0;
    this.filtroPedidoDTO.transporte = (this.filtroPedidoDTO.transporte) ? StatusPedido.EM_TRANSPORTE : 0
    this.filtroPedidoDTO.entregue = (this.filtroPedidoDTO.entregue) ? StatusPedido.ENTREGUE : 0;
    this.filtroPedidoDTO.posVenda = (this.filtroPedidoDTO.posVenda) ? StatusPedido.POS_VENDA : 0;
    this.filtroPedidoDTO.finalizado = (this.filtroPedidoDTO.finalizado) ? StatusPedido.FINALIZDO : 0
    this.filtroPedidoDTO.cancelado = (this.filtroPedidoDTO.cancelado) ? StatusPedido.CANCELADO : 0


    this.service.getAllPedidos(this.filtroPedidoDTO)
      .subscribe({
        next: (res: Pedido[]) => {
          this.lista = res,
            this.lista.forEach(item => { this.total += item.valorTotal })
        }
      })
  }

  public limparFiltros(): void {
    this.filtroPedidoDTO = new FiltroPedidoDTO();
  }

  public gerarFinanceiro(item: any, status: number) {
    /* abrir o modal para criarmos o fluxo financeiro do nosso sistema*/
    this.alterarStatus(item, 2);
    this.fpservice.recuperarTodasFormasPgto().subscribe(
      (res: FormaPagamento[]) => {
        this.formasPgto = res;
        this.detalhe = item;
        this.registroFinanceiro.diaVencimento = 1;
        this.registroFinanceiro.totalParcelas = 1;
        this.registroFinanceiro.pedido = item;
         this.displayFinanceiro = true; 
      }
    )
  }
  public gerarFluxo() { /* método criado para economizar o acesso ao banco*/
    let forma: FormaPagamento;
    for (let i = 0; i < this.formasPgto.length; i++) {
      if (this.registroFinanceiro.formaPagamento.numSeq == this.formasPgto[i].numSeq) {
        this.registroFinanceiro.formaPagamento = this.formasPgto[i];
        break;
      }
    }
    this.rfservice.gerarRegistroFinanceiro(this.registroFinanceiro).subscribe({
      next: (res: RegistroFinanceiro) => console.log(this.registroFinanceiro)

    })

  }

  public atualizarPedido() {
    console.log(this.detalhe);
    this.service.atualizarPedido(this.detalhe).subscribe({
      next: (res: Pedido) => {
        this.displayDetalhePedido = false;
        this.mensagemToast = "Pedido alterado com sucesso!"
        this.toastType = 'success'
        this.mostrarToast()
        
      },
      error: (err: any) => {
        this.mensagemToast = "Infelizmente não consegui alterar os dados do pedido"
        this.toastType = 'error'
        this.mostrarToast()
      }
    });

  }
}
