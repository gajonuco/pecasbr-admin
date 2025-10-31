import { Component } from '@angular/core';
import moment from 'moment';
import { FiltroPedidoDTO } from '../../model/FiltroPedidoDTO';
import { Pedido } from '../../model/Pedido';
import { PedidosServico } from '../../servicos/pedidos-servico';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-ultimos-pedidos',
  imports: [DatePipe,CurrencyPipe],
  templateUrl: './ultimos-pedidos.html',
  styleUrl: './ultimos-pedidos.css'
})
export class UltimosPedidos {

  private filtroDTO!: FiltroPedidoDTO;
  public lista: Pedido[] = []
  public total!: number
  public totalPago!: number
  public totalCancelado!: number
  public totalPendentes!: number

  constructor(private service: PedidosServico, private router: Router){

  }

  ngOnInit(): void {
    this.recuperarPedidos();
    setInterval(()=>this.recuperarPedidos(), 60000);
  }

  public recuperarPedidos() {
    this.total = 0;
    this.totalCancelado = 0;
    this.totalPago = 0;
    this.totalPendentes = 0;
    this.filtroDTO = new FiltroPedidoDTO();
    this.filtroDTO.dataInicio = moment().subtract(7, 'days').format("yyyy-MM-DD");
    this.filtroDTO.dataFim = moment().format("yyyy-MM-DD");
    console.log(this.filtroDTO)

    this.service.getAllPedidos(this.filtroDTO)
      .subscribe({
        next: (res: Pedido[]) => {
          this.lista = res,
          this.lista.forEach(item => {
            this.total += item.valorTotal;
            if (item.status == 0) this.totalPendentes += item.valorTotal;
            else if (item.status == 1 || item.status == 2) this.totalPago += item.valorTotal;
            else if (item.status == 3) this.totalCancelado += item.valorTotal;;
          })
        },  
          error: (err:any) =>{
            if(err.status == 403) {
              localStorage.removeItem("Token");
              this.router.navigate([''])
            }
          }
        })
  }
}