import { Component, OnInit } from '@angular/core';
import { VendasPorDataDTO } from '../../model/VendasPorDataDTO';
import { PedidosServico } from '../../servicos/pedidos-servico';
import moment from 'moment';
import { Chart } from 'chart.js';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-grafico-vendas',
  imports: [CurrencyPipe],
  templateUrl: './grafico-vendas.html',
  styleUrl: './grafico-vendas.css'
})
export class GraficoVendas implements OnInit {

    public totais: VendasPorDataDTO[] = []
    public canvas!: any;

    public total: number = 0;
    public chart!: Chart;
    public labels: string[] = []
    public data: number[] = []

    constructor(private service: PedidosServico, private router: Router){

    }

    ngOnInit(): void {
        setInterval(() => this.recuperarGrafico(), 60000);
        this.gerarGrafico();
        this.recuperarGrafico();
    }

    public recuperarGrafico() {
      let dataFim: string = moment().format("yyyy-MM-DD")
      let dataIni: string = moment().subtract(7, 'days').format("yyyy-MM-DD")

      this.service.recuperarTotaisDaSemana(dataIni, dataFim)
        .subscribe({
          next: (res: VendasPorDataDTO[]) =>{

          this.total = 0;

          while(this.totais.length) {
            this.totais.pop();
          }

          while(this.labels.length) {
            this.labels.pop();
            this.data.pop();
          }

          this.totais = res;

          this.totais.forEach(elem => {
            this.total += elem.total;
            this.data.push(elem.total);
            this.labels.push(moment(elem.data).format('DD/MM/yyyy'));
          })

          this.chart.update();
          },
          error: (err:any) =>{
            if(err.status == 403) {
              localStorage.removeItem("Token");
              this.router.navigate([''])
            }
          }
        })
    }

    public gerarGrafico(){
      this.canvas = document.getElementById("meuGrafico");
      this.chart = new Chart(this.canvas,
        {
          type: 'bar',
          data: {
            labels: this.labels,
            datasets: [{
              label: 'Volume de Vendas',
              data: this.data,
              borderColor: 'rgba(255, 99, 132, 0.2)',
              backgroundColor: 'rgba(255, 0, 0, 0.5)'
            }]
          },
          options: {
            responsive: true,
            scales: {
              yAxis: {
                beginAtZero: true
              }
            }
          }
        }
      )
    }
}
