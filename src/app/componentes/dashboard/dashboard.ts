import { Component } from '@angular/core';
import { GraficoVendas } from "../grafico-vendas/grafico-vendas";
import { Aniversariantes } from "../aniversariantes/aniversariantes";
import { UltimosPedidos } from "../ultimos-pedidos/ultimos-pedidos";
import { RankingProduto } from "../ranking-produto/ranking-produto";

@Component({
  selector: 'app-dashboard',
  imports: [GraficoVendas, Aniversariantes, UltimosPedidos, RankingProduto],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

}
