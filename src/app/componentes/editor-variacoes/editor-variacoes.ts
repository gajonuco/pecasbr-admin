import {
  Component, Input, Output, EventEmitter,
  OnChanges, SimpleChanges, OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { PecaVariacao, SalvarVariacoesDTO } from '../../model/PecaVariacao';

// Tamanhos pré-definidos para roupas femininas
const TAMANHOS_PADRAO = ['PP', 'P', 'M', 'G', 'GG', 'XGG', '34', '36', '38', '40'];

@Component({
  selector: 'app-editor-variacoes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputNumberModule,
    InputTextModule,
    CheckboxModule,
    TooltipModule,
  ],
  templateUrl: './editor-variacoes.html',
  styleUrl: './editor-variacoes.css'
})
export class EditorVariacoes implements OnChanges, OnDestroy {

  // Variações já salvas no banco (ao editar produto existente)
  @Input() variacoesSalvas: PecaVariacao[] = [];
  @Input() corUnicaInicial: boolean = false;
  @Input() tamanhoUnicoInicial: boolean = false;
  @Input() modoEdicao: boolean = false; // false = novo produto

  // Emite sempre que o estado muda — o pai envia para a API
  @Output() variacoesChange = new EventEmitter<SalvarVariacoesDTO>();

  // ── Estado interno ────────────────────────────────────────────────────────

  readonly MAX_CORES = 5;
  readonly MAX_TAMANHOS = 10;
  readonly TAMANHOS_SUGERIDOS = TAMANHOS_PADRAO;

  corUnica: boolean = false;
  tamanhoUnico: boolean = false;
  isMobile = false;

  // Controle de cartões colapsáveis na view mobile
  cardsAbertos: Record<string, boolean> = {};

  // Valor do quick-fill mobile
  valorPreenchimento: number = 0;

  // Paleta de cores configurada pelo admin
  cores: { nome: string; hex: string }[] = [];
  novaCor = '';
  novoHex = '#000000';
  erroNovaCor = '';

  // Tamanhos configurados pelo admin
  tamanhos: string[] = [];
  novoTamanho = '';
  erroTamanho = '';

  // Matriz de variações: variacaoMap[cor][tamanho] = PecaVariacao
  variacaoMap: Record<string, Record<string, PecaVariacao>> = {};

  private bpSub: Subscription;

  constructor(private bp: BreakpointObserver) {
    this.bpSub = this.bp.observe([Breakpoints.Handset]).subscribe(result => {
      this.isMobile = result.matches;
    });
  }

  ngOnDestroy(): void {
    this.bpSub.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['variacoesSalvas']) {
      const anterior = changes['variacoesSalvas'].previousValue;
      const atual = changes['variacoesSalvas'].currentValue;

      const chegouDadosDoBanco = atual?.length > 0 &&
        JSON.stringify(anterior) !== JSON.stringify(atual);

      if (chegouDadosDoBanco || (!anterior?.length && atual?.length > 0)) {
        this.inicializarDeVariacoesSalvas();
      }
    }

    if (changes['corUnicaInicial'] && changes['corUnicaInicial'].isFirstChange()) {
      this.corUnica = this.corUnicaInicial;
    }
    if (changes['tamanhoUnicoInicial'] && changes['tamanhoUnicoInicial'].isFirstChange()) {
      this.tamanhoUnico = this.tamanhoUnicoInicial;
    }
  }

  private inicializarDeVariacoesSalvas(): void {
    this.corUnica = this.corUnicaInicial;
    this.tamanhoUnico = this.tamanhoUnicoInicial;

    if (!this.variacoesSalvas?.length) return;

    const coresMap = new Map<string, string>();
    const tamSet = new Set<string>();

    this.variacoesSalvas.forEach(v => {
      coresMap.set(v.cor, v.hexCode ?? '#000000');
      tamSet.add(v.tamanho);
    });

    this.cores = Array.from(coresMap.entries()).map(([nome, hex]) => ({ nome, hex }));
    this.tamanhos = Array.from(tamSet);
    this.reconstruirMapa();

    this.variacoesSalvas.forEach(v => {
      if (this.variacaoMap[v.cor]?.[v.tamanho]) {
        this.variacaoMap[v.cor][v.tamanho] = { ...v };
      }
    });

    // Abre o primeiro cartão por padrão na view mobile
    if (this.cores.length > 0) {
      this.cardsAbertos[this.cores[0].nome] = true;
    }
  }

  // ── Gerenciamento de cores ────────────────────────────────────────────────

  adicionarCor(): void {
    const nome = this.novaCor.trim();
    if (!nome) { this.erroNovaCor = 'Informe o nome da cor.'; return; }
    if (this.cores.length >= this.MAX_CORES) {
      this.erroNovaCor = `Máximo de ${this.MAX_CORES} cores por produto.`; return;
    }
    if (this.cores.some(c => c.nome.toLowerCase() === nome.toLowerCase())) {
      this.erroNovaCor = 'Essa cor já foi adicionada.'; return;
    }
    this.erroNovaCor = '';
    this.cores.push({ nome, hex: this.novoHex });
    this.novaCor = '';
    this.novoHex = '#000000';
    this.reconstruirMapa();
    this.emitir();
  }

  removerCor(idx: number): void {
    this.cores.splice(idx, 1);
    this.reconstruirMapa();
    this.emitir();
  }

  // ── Gerenciamento de tamanhos ─────────────────────────────────────────────

  adicionarTamanho(valor?: string): void {
    const tam = (valor ?? this.novoTamanho).trim().toUpperCase();
    if (!tam) { this.erroTamanho = 'Informe o tamanho.'; return; }
    if (this.tamanhos.length >= this.MAX_TAMANHOS) {
      this.erroTamanho = `Máximo de ${this.MAX_TAMANHOS} tamanhos por produto.`; return;
    }
    if (this.tamanhos.includes(tam)) {
      this.erroTamanho = 'Esse tamanho já foi adicionado.'; return;
    }
    this.erroTamanho = '';
    this.tamanhos.push(tam);
    this.novoTamanho = '';
    this.reconstruirMapa();
    this.emitir();
  }

  removerTamanho(idx: number): void {
    this.tamanhos.splice(idx, 1);
    this.reconstruirMapa();
    this.emitir();
  }

  sugestaoJaAdicionada(tam: string): boolean {
    return this.tamanhos.includes(tam.toUpperCase());
  }

  // ── Mapa de variações ─────────────────────────────────────────────────────

  private reconstruirMapa(): void {
    const novoMapa: Record<string, Record<string, PecaVariacao>> = {};
    this.cores.forEach(c => {
      novoMapa[c.nome] = {};
      this.tamanhos.forEach(t => {
        novoMapa[c.nome][t] = this.variacaoMap[c.nome]?.[t] ?? {
          cor: c.nome,
          hexCode: c.hex,
          tamanho: t,
          quantidadeEstoque: 0
        };
      });
    });
    this.variacaoMap = novoMapa;

    // Abre o primeiro cartão por padrão se nenhum estiver aberto ainda
    if (this.cores.length > 0 && Object.keys(this.cardsAbertos).length === 0) {
      this.cardsAbertos[this.cores[0].nome] = true;
    }
  }

  atualizarEstoque(cor: string, tamanho: string, valor: number | null): void {
    if (this.variacaoMap[cor]?.[tamanho]) {
      this.variacaoMap[cor][tamanho].quantidadeEstoque = valor ?? 0;
      this.emitir();
    }
  }

  // ── Mobile: cartões colapsáveis ───────────────────────────────────────────

  toggleCard(nomeCor: string): void {
    this.cardsAbertos[nomeCor] = !this.cardsAbertos[nomeCor];
  }

  isCardAberto(nomeCor: string): boolean {
    return !!this.cardsAbertos[nomeCor];
  }

  estoquePorCor(nomeCor: string): number {
    return this.tamanhos.reduce((acc, t) =>
      acc + (this.variacaoMap[nomeCor]?.[t]?.quantidadeEstoque ?? 0), 0);
  }

  // Preenche todas as variações com o mesmo valor — atalho para cadastro inicial
  preencherTodos(): void {
    const valor = Math.max(0, this.valorPreenchimento ?? 0);
    this.cores.forEach(c => {
      this.tamanhos.forEach(t => {
        if (this.variacaoMap[c.nome]?.[t]) {
          this.variacaoMap[c.nome][t].quantidadeEstoque = valor;
        }
      });
    });
    this.emitir();
  }

  // ── Helpers de UI ─────────────────────────────────────────────────────────

  get totalVariacoes(): number {
    return this.cores.length * this.tamanhos.length;
  }

  get estoqueTotal(): number {
    let total = 0;
    this.cores.forEach(c =>
      this.tamanhos.forEach(t =>
        total += this.variacaoMap[c.nome]?.[t]?.quantidadeEstoque ?? 0));
    return total;
  }

  onCorUnicaChange(): void {
    if (this.corUnica) {
      if (this.cores.length > 1) this.cores = [this.cores[0]];
      this.reconstruirMapa();
    }
    this.emitir();
  }

  onTamanhoUnicoChange(): void {
    if (this.tamanhoUnico) {
      if (this.tamanhos.length > 1) this.tamanhos = [this.tamanhos[0]];
      this.reconstruirMapa();
    }
    this.emitir();
  }

  // ── Emissão para o pai ────────────────────────────────────────────────────

  private emitir(): void {
    const variacoes: PecaVariacao[] = [];
    this.cores.forEach(c => {
      this.tamanhos.forEach(t => {
        const v = this.variacaoMap[c.nome]?.[t];
        if (v) variacoes.push({ ...v, cor: c.nome, hexCode: c.hex, tamanho: t });
      });
    });
    this.variacoesChange.emit({
      corUnica: this.corUnica,
      tamanhoUnico: this.tamanhoUnico,
      variacoes
    });
  }
}
