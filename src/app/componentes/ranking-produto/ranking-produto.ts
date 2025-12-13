import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js/auto';
import moment from 'moment';
import { ProdutoMaisPedidoDTO } from '../../dto/ProdutoMaisPedidoDTO';
import { FiltroRankingProdutosDTO } from '../../dto/FiltroRankingProdutosDTO';
import { PedidosServico } from '../../servicos/pedidos-servico';
import { Router } from '@angular/router';
import { ProdutoServico } from '../../servicos/produto-servico';

// Imports do PrimeNG
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker'; // ✅ DatePicker ao invés de Calendar
import { Select } from 'primeng/select'; // ✅ Select ao invés de Dropdown
import { SelectButtonModule } from 'primeng/selectbutton';
import { BlockUIModule } from 'primeng/blockui';

@Component({
  selector: 'app-ranking-produto',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CurrencyPipe,
    DatePipe,
    TableModule,
    TagModule,
    ButtonModule,
    DatePicker,        // ✅ Adicionar
    Select,            // ✅ Já estava (correto)
    SelectButtonModule,
    BlockUIModule
  ],
  templateUrl: './ranking-produto.html',
  styleUrl: './ranking-produto.css',
})
export class RankingProduto implements OnInit {
  
  public produtos: ProdutoMaisPedidoDTO[] = [];
  public canvas!: any;
  public chart!: Chart;
  
  // Arrays para o gráfico
  public labels: string[] = [];
  public quantidades: number[] = [];
  public valores: number[] = [];
  
  // Totais
  public totalQuantidade: number = 0;
  public totalValor: number = 0;
  
  // Filtros - ✅ MUDANÇA: usar Date ao invés de string
  public dataInicio: Date = moment().subtract(30, 'days').toDate();
  public dataFim: Date = moment().toDate();
  public limiteProdutos: number = 6;
  public tipoGrafico: string = 'quantidade'; // ✅ Adicionar esta propriedade
  
  // Controle de visualização
  opcoesProdutos = [
    { label: '2 produtos', value: 2 },
    { label: '3 produtos', value: 3 },
    { label: '4 produtos', value: 4 },
    { label: '5 produtos', value: 5 },
    { label: '6 produtos', value: 6 }
  ];

  tiposGrafico = [
    { label: 'Por Quantidade', value: 'quantidade', icon: 'pi pi-chart-bar' },
    { label: 'Por Valor', value: 'valor', icon: 'pi pi-money-bill' }
  ];
  
  public carregando: boolean = false;

  constructor(
    private service: ProdutoServico, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.gerarGrafico();
    this.recuperarDados();
    
    // Atualiza a cada 5 minutos
    setInterval(() => this.recuperarDados(), 300000);
  }

  public recuperarDados(): void {
    this.carregando = true;
    
    const filtro = new FiltroRankingProdutosDTO();
    // ✅ MUDANÇA: Converter Date para string no formato esperado
    filtro.dataInicio = moment(this.dataInicio).format('YYYY-MM-DD');
    filtro.dataFim = moment(this.dataFim).format('YYYY-MM-DD');
    filtro.limiteProdutos = this.limiteProdutos;
    filtro.ordenarPor = this.tipoGrafico; 

    this.service.listarProdutosMaisPedidos(filtro)
      .subscribe({
        next: (res: ProdutoMaisPedidoDTO[]) => {
          this.produtos = res;
          console.log('Produtos recebidos:', this.produtos);
          this.processarDados();
          this.atualizarGrafico();
          this.carregando = false;
        },
        error: (err: any) => {
          console.error('Erro ao buscar produtos:', err);
          this.carregando = false;
          if (err.status == 403) {
            localStorage.removeItem("Token");
            this.router.navigate(['']);
          }
        }
      });
  }

  private processarDados(): void {
    // Limpar arrays
    this.labels = [];
    this.quantidades = [];
    this.valores = [];
    this.totalQuantidade = 0;
    this.totalValor = 0;

    // Processar dados
    this.produtos.forEach(produto => {
      this.labels.push(produto.nomePeca);
      this.quantidades.push(produto.quantidadeTotal);
      this.valores.push(produto.valorTotal);
      this.totalQuantidade += produto.quantidadeTotal;
      this.totalValor += produto.valorTotal;
    });
  }

  public gerarGrafico(): void {
    this.canvas = document.getElementById("graficoRankingProdutos");
    
    this.chart = new Chart(this.canvas, {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [{
          label: 'Quantidade de Itens',
          data: this.quantidades,
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 2
        }]
      },
      options: {
        indexAxis: 'y', // Gráfico horizontal
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const index = context.dataIndex;
                const quantidade = this.quantidades[index];
                const valor = this.valores[index];
                return [
                  `Quantidade: ${quantidade} itens`,
                  `Valor Total: R$ ${valor.toFixed(2)}`
                ];
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              callback: (value) => {
                if (this.tipoGrafico === 'valor') {
                  return 'R$ ' + Number(value).toLocaleString('pt-BR');
                }
                return value;
              }
            }
          }
        }
      }
    });
  }

  private atualizarGrafico(): void {
    if (!this.chart) return;

    this.chart.data.labels = this.labels;
    
    if (this.tipoGrafico === 'quantidade') {
      this.chart.data.datasets[0].label = 'Quantidade de Itens';
      this.chart.data.datasets[0].data = this.quantidades;
    } else {
      this.chart.data.datasets[0].label = 'Valor Total (R$)';
      this.chart.data.datasets[0].data = this.valores;
    }
    
    this.chart.update();
  }

  public alternarTipoGrafico(tipo: 'quantidade' | 'valor'): void {
    this.tipoGrafico = tipo;
    this.recuperarDados();
  }

  public aplicarFiltro(): void {
    // Validação de datas
    if (moment(this.dataInicio).isAfter(moment(this.dataFim))) {
      alert('Data inicial não pode ser posterior à data final!');
      return;
    }

    // Validação do limite
    if (this.limiteProdutos < 2 || this.limiteProdutos > 6) {
      alert('O limite de produtos deve ser entre 2 e 6!');
      return;
    }

    this.recuperarDados();
  }

  public limparFiltro(): void {
    this.dataInicio = moment().subtract(30, 'days').toDate();
    this.dataFim = moment().toDate();
    this.limiteProdutos = 6;
    this.tipoGrafico = 'quantidade';
    this.recuperarDados();
  }
}