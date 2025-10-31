import { Component } from '@angular/core';
import { Pedido } from '../../model/Pedido';
import { PedidosServico } from '../../servicos/pedidos-servico';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Cliente } from '../../model/Cliente';
import { FiltroPedidoDTO } from '../../model/FiltroPedidoDTO';
import { FormsModule } from '@angular/forms';
import { ClienteServico } from '../../servicos/cliente-servico';
import { CompradorDTO } from '../../model/CompradorDTO';
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

  public lista : Pedido[]=[]
  constructor(private service: PedidosServico
  ){
    this.detalhe.cliente = new Cliente()
    this.service.getAllPedidos(this.filtroPedidoDTO)
    .subscribe({
      next : (res: Pedido[]) => {
        this.lista = res}
    })

  }

  public alterarStatus(idPedido:number, status:number){
    this.service.alterarStatus(idPedido, status).
      subscribe({
        next: (res:Pedido) => {
          this.mensagemToast = "Status alterado com sucesso!"
          this.toastType = 'success'
          this.mostrarToast();
          },
         error: (err) => {
          this.mensagemToast = "ERRO ao inserir o produto"
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
    this.filtroPedidoDTO.cancelado = (this.filtroPedidoDTO.cancelado)?3:0;
    this.filtroPedidoDTO.pago = (this.filtroPedidoDTO.pago)?1:0;
    this.filtroPedidoDTO.entregue = (this.filtroPedidoDTO.entregue)?2:0

    this.service.getAllPedidos(this.filtroPedidoDTO)
      .subscribe({
        next: (res: Pedido[]) => {
          console.log(res);
          this.lista = res;
        }
      })
  }

  public limparFiltros(): void {
    this.filtroPedidoDTO = new FiltroPedidoDTO();
  }




}
