import { Component } from '@angular/core';
import { Pedido } from '../../model/Pedido';
import { PedidosServico } from '../../servicos/pedidos-servico';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Cliente } from '../../model/Cliente';
declare var bootstrap: any;
@Component({
  selector: 'app-pedidos',
  imports: [DatePipe, CurrencyPipe, CommonModule],
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.css'
})
export class Pedidos {

  public mensagemToast!:string;
   public toastType!: string;
  public detalhe: Pedido = new Pedido();

  public lista : Pedido[]=[]
  constructor(private service: PedidosServico){
    this.detalhe.cliente = new Cliente()
    this.service.getAllPedidos()
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


}
