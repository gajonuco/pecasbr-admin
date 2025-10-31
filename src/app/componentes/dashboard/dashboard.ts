import { Component } from '@angular/core';
import { GraficoVendas } from "../grafico-vendas/grafico-vendas";
import { Aniversariantes } from "../aniversariantes/aniversariantes";
import { UltimosPedidos } from "../ultimos-pedidos/ultimos-pedidos";

@Component({
  selector: 'app-dashboard',
  imports: [GraficoVendas, Aniversariantes, UltimosPedidos],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

}
