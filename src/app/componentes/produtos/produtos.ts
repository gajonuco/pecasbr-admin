import { Component, OnInit } from '@angular/core';
import { ProdutoServico } from '../../servicos/produto-servico';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Peca } from '../../model/Peca';
import { ClienteServico } from '../../servicos/cliente-servico';
import { CompradorDTO } from '../../dto/CompradorDTO';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-produtos',
  imports: [
    CommonModule,
    FormsModule, 
    DialogModule,
    RouterLink, 
    TableModule, 
    ButtonModule, 
    TagModule, 
    CurrencyPipe,  
    InputTextModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './produtos.html',
  styleUrl: './produtos.css'
})
export class Produtos implements OnInit {

  public lista: Peca[] = [];
  public compradores: CompradorDTO[] = [];
  public displayCompradores: boolean = false;

  constructor(
    private service: ProdutoServico, 
    private router: Router,
    private cliService: ClienteServico,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    if (!localStorage.getItem("Token")) {
      this.router.navigate(['/']);
    }
    this.service.getAllPecas()
      .subscribe({
        next: (res: Peca[]) => {
          this.lista = res;
          console.log('📦 Produtos carregados:', this.lista.length);
        },
        error: (err) => {
          console.error('❌ Erro ao carregar produtos:', err);
          this.router.navigate(['/']);
        }
      });
  }

  /**
   * Verifica se o produto pode ser destacado (tem estoque)
   */
  private podeDestacar(peca: Peca): boolean {
    return peca.quantidadeEstoque !== null && 
           peca.quantidadeEstoque !== undefined && 
           peca.quantidadeEstoque > 0;
  }

  /**
   * Verifica se o produto pode ser disponibilizado (tem estoque)
   */
  private podeDisponibilizar(peca: Peca): boolean {
    return peca.quantidadeEstoque !== null && 
           peca.quantidadeEstoque !== undefined && 
           peca.quantidadeEstoque > 0;
  }

  /**
   * Marca produto como destaque
   * Valida estoque antes de permitir ativação
   */
  public destaca(peca: Peca, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const novoValor = checkbox.checked;

    console.log('🎯 Tentando alterar DESTAQUE:', {
      produto: peca.nome,
      estoqueAtual: peca.quantidadeEstoque,
      tentandoAtivar: novoValor
    });

    // Se está tentando ATIVAR destaque
    if (novoValor === true) {
      if (!this.podeDestacar(peca)) {
        console.log('❌ BLOQUEADO: Produto sem estoque');
        
        // Reverte o checkbox
        checkbox.checked = false;
        peca.destaque = 0;

        // Mostra alerta
        this.messageService.add({
          severity: 'warn',
          summary: 'Estoque Insuficiente',
          detail: `Não é possível destacar "${peca.nome}" pois o produto está sem estoque disponível.`,
          life: 5000
        });

        return;
      }
    }

    // Se passou na validação ou está DESATIVANDO, permite a alteração
    peca.destaque = novoValor ? 1 : 0;
    
    this.service.atualizarProduto(peca).subscribe({
      next: (res: Peca) => {
        console.log('✅ Destaque atualizado:', res);
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: novoValor 
            ? `"${peca.nome}" marcado como destaque` 
            : `"${peca.nome}" removido dos destaques`,
          life: 3000
        });
      },
      error: (err) => {
        console.error('❌ Erro ao atualizar destaque:', err);
        
        // Reverte o estado em caso de erro
        checkbox.checked = !novoValor;
        peca.destaque = novoValor ? 0 : 1;

        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao atualizar produto. Tente novamente.',
          life: 5000
        });
      }
    });
  }

  /**
   * Marca produto como disponível
   * Valida estoque antes de permitir ativação
   */
  public disponibiliza(peca: Peca, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const novoValor = checkbox.checked;

    console.log('📦 Tentando alterar DISPONÍVEL:', {
      produto: peca.nome,
      estoqueAtual: peca.quantidadeEstoque,
      tentandoAtivar: novoValor
    });

    // Se está tentando ATIVAR disponibilidade
    if (novoValor === true) {
      if (!this.podeDisponibilizar(peca)) {
        console.log('❌ BLOQUEADO: Produto sem estoque');
        
        // Reverte o checkbox
        checkbox.checked = false;
        peca.disponivel = 0;

        // Mostra alerta
        this.messageService.add({
          severity: 'warn',
          summary: 'Estoque Insuficiente',
          detail: `Não é possível disponibilizar "${peca.nome}" pois o produto está sem estoque. Repor estoque antes de ativar.`,
          life: 5000
        });

        return;
      }
    }

    // Se passou na validação ou está DESATIVANDO, permite a alteração
    peca.disponivel = novoValor ? 1 : 0;
    
    this.service.atualizarProduto(peca).subscribe({
      next: (res: Peca) => {
        console.log('✅ Disponibilidade atualizada:', res);
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: novoValor 
            ? `"${peca.nome}" está disponível para venda` 
            : `"${peca.nome}" marcado como indisponível`,
          life: 3000
        });
      },
      error: (err) => {
        console.error('❌ Erro ao atualizar disponibilidade:', err);
        
        // Reverte o estado em caso de erro
        checkbox.checked = !novoValor;
        peca.disponivel = novoValor ? 0 : 1;

        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao atualizar produto. Tente novamente.',
          life: 5000
        });
      }
    });
  }

  /**
   * Marca produto como pronta entrega
   * Não precisa validar estoque para este campo
   */
  public prontaEntrega(peca: Peca, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const novoValor = checkbox.checked;

    peca.prontaEntrega = novoValor ? 1 : 0;
    
    this.service.atualizarProduto(peca).subscribe({
      next: (res: Peca) => {
        console.log('✅ Pronta entrega atualizado:', res);
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: novoValor 
            ? `"${peca.nome}" marcado como pronta entrega` 
            : `"${peca.nome}" não é mais pronta entrega`,
          life: 3000
        });
      },
      error: (err) => {
        console.error('❌ Erro ao atualizar pronta entrega:', err);
        
        // Reverte o estado em caso de erro
        checkbox.checked = !novoValor;
        peca.prontaEntrega = novoValor ? 0 : 1;

        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao atualizar produto. Tente novamente.',
          life: 5000
        });
      }
    });
  }

  /**
   * Busca compradores do produto
   */
  public buscarCompradores(idPeca: number): void {
    this.cliService.buscarCompradores(idPeca)
      .subscribe({
        next: (res: CompradorDTO[]) => {
          this.compradores = res;
          this.displayCompradores = true;
          console.log('👥 Compradores encontrados:', res.length);
        },
        error: (err: any) => {
          console.error('❌ Erro ao buscar compradores:', err);
          this.compradores = [];
          this.displayCompradores = true;
        }
      });
  }

  /**
   * Limpa caracteres não numéricos do telefone
   */
  public limparTelefone(telefone: string): string {
    return telefone ? telefone.replace(/\D/g, '') : '';
  }

  /**
   * Verifica se produto está sem estoque
   */
  public isProdutoSemEstoque(peca: Peca): boolean {
    return !peca.quantidadeEstoque || peca.quantidadeEstoque === 0;
  }

  /**
   * Retorna classe CSS baseada no status do estoque
   */
  public getEstoqueStatusClass(peca: Peca): string {
    if (!peca.quantidadeEstoque || peca.quantidadeEstoque === 0) {
      return 'estoque-zerado';
    }
    if (peca.quantidadeEstoque <= (peca.estoqueCritico || 2)) {
      return 'estoque-critico';
    }
    if (peca.quantidadeEstoque <= (peca.estoqueMinimo || 5)) {
      return 'estoque-baixo';
    }
    return 'estoque-normal';
  }

  /**
   * Retorna mensagem de estoque
   */
  public getEstoqueMensagem(peca: Peca): string {
    if (!peca.quantidadeEstoque || peca.quantidadeEstoque === 0) {
      return 'SEM ESTOQUE';
    }
    if (peca.quantidadeEstoque <= (peca.estoqueCritico || 2)) {
      return `CRÍTICO (${peca.quantidadeEstoque})`;
    }
    if (peca.quantidadeEstoque <= (peca.estoqueMinimo || 5)) {
      return `BAIXO (${peca.quantidadeEstoque})`;
    }
    return `${peca.quantidadeEstoque} unid.`;
  }
}