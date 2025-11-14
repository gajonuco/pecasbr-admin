import { Component } from '@angular/core';
import { Pedido } from '../../model/Pedido';
import { PedidosServico } from '../../servicos/pedidos-servico';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Cliente } from '../../model/Cliente';
import { FiltroPedidoDTO } from '../../model/FiltroPedidoDTO';
import { FormsModule } from '@angular/forms';
import { StatusPedido } from '../../model/StatusPedido';
import { FormapagamentoService } from '../../servicos/formapagamento-service';
import { RegistroFinanceiro } from '../../model/RegistroFinanceiro';
import { Router } from '@angular/router';
import { FormaPagamento } from '../../model/FormaPagamento';
import { RegistroFinanceiroService } from '../../servicos/registro-financeiro-service';
declare var bootstrap: any;
@Component({
  selector: 'app-pedidos',
  imports: [DatePipe, CurrencyPipe, CommonModule, FormsModule],
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.css'
})
export class Pedidos {

  public mensagemToast!:string;
  public toastType!: string;
  public detalhe: Pedido = new Pedido();
  public filtroPedidoDTO: FiltroPedidoDTO = new FiltroPedidoDTO();
  public registroFinanceiro!: RegistroFinanceiro
  public total!: number;
  public formasPgto!: FormaPagamento[]
  public lista : Pedido[]=[]
  constructor(
    private service: PedidosServico,
    private fpservice: FormapagamentoService,
    private rfservice: RegistroFinanceiroService,
    private router: Router
  ){
    this.detalhe.cliente = new Cliente()
    this.registroFinanceiro = new RegistroFinanceiro();
 

    
    this.service.getAllPedidos(this.filtroPedidoDTO)
    .subscribe({
      next : (res: Pedido[]) => {
        this.lista = res,
        this.lista.forEach(item => { this.total += item.valorTotal})
      },
      error: (err) => {
        if(err.status == 403){
          localStorage.removeItem("Token");
          this.router.navigate(["/"], { queryParams: { src: "expired"}})
        }
      }
    })

  }

  public alterarStatus(pedido: Pedido, status:number){
    this.service.alterarStatus(pedido, status).
      subscribe({
        next: (res:Pedido) => {
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

  public mostrarToast(){
    const toastEl = document.querySelector('#liveToast');
    if(toastEl){
      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    }
  } 

  public enviarDetalhes(pedido: Pedido){
      this.detalhe = pedido
      document.getElementById("btnModal")?.click()
  }

  public filtrarPedidos(){
    this.filtroPedidoDTO.novo = (this.filtroPedidoDTO.novo) ? StatusPedido.NOVO_PEDIDO :0;
    this.filtroPedidoDTO.pago = (this.filtroPedidoDTO.pago) ? StatusPedido.PAGO:0;
    this.filtroPedidoDTO.transporte = (this.filtroPedidoDTO.transporte) ? StatusPedido.EM_TRANSPORTE:0
    this.filtroPedidoDTO.entregue = (this.filtroPedidoDTO.entregue) ? StatusPedido.ENTREGUE:0;
    this.filtroPedidoDTO.posVenda = (this.filtroPedidoDTO.posVenda) ? StatusPedido.POS_VENDA:0;
    this.filtroPedidoDTO.finalizado = (this.filtroPedidoDTO.finalizado) ? StatusPedido.FINALIZDO:0
    this.filtroPedidoDTO.cancelado = (this.filtroPedidoDTO.cancelado) ? StatusPedido.CANCELADO:0


    this.service.getAllPedidos(this.filtroPedidoDTO)
      .subscribe({
      next : (res: Pedido[]) => {
        this.lista = res,
        this.lista.forEach(item => { this.total += item.valorTotal})
        }
      })
  }

  public limparFiltros(): void {
    this.filtroPedidoDTO = new FiltroPedidoDTO();
  }

 public gerarFinanceiro(pedido: Pedido, status: number) {
    /* abrir o modal para criarmos o fluxo financeiro do nosso sistema*/
    this.alterarStatus(pedido, 2);
    this.fpservice.recuperarTodasFormasPgto().subscribe(
      (res: FormaPagamento[]) => {
        this.formasPgto = res;
        this.detalhe = pedido;
        this.registroFinanceiro.diaVencimento = 1;
        this.registroFinanceiro.totalParcelas = 1;
        this.registroFinanceiro.pedido = pedido;
        document.getElementById("btnModalFinanceiro")?.click();
      }
    )
  }

    public gerarFluxo() { /* método criado para economizar o acesso ao banco*/
    let forma: FormaPagamento;
    for (let i =0; i<this.formasPgto.length; i++){
      if (this.registroFinanceiro.formaPagamento.numSeq == this.formasPgto[i].numSeq){
        this.registroFinanceiro.formaPagamento = this.formasPgto[i];
        break;
      }
    }
    this.rfservice.gerarRegistroFinanceiro(this.registroFinanceiro).subscribe({
      next: (res: RegistroFinanceiro) =>  console.log(this.registroFinanceiro)

    })

  }

  public atualizarPedido(){
     this.service.atualizarPedido(this.detalhe).subscribe({

     })
  }

}
