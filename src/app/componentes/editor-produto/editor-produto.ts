import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProdutoServico } from '../../servicos/produto-servico';
import { Peca } from '../../model/Peca';
import { CategoriaServico } from '../../servicos/categoria-servico';
import { CategoriaPeca } from '../../model/CategoriaPeca';
import { PathDTO } from '../../dto/PathDTO';
import { CommonModule } from '@angular/common';
import { lastValueFrom, of, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Select } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { PecaImagem } from '../../model/PecaImagem';
import { UploadImagemDragDrop } from '../upload-imagem-drag-drop/upload-imagem-drag-drop';
import { EditorVariacoes } from '../editor-variacoes/editor-variacoes';
import { SalvarVariacoesDTO } from '../../model/PecaVariacao';
import { PecaVariacaoServico } from '../../servicos/peca-variacao-servico';
import { SomaEstoquePipe } from './soma-estoque.pipe';

declare var bootstrap: any;

@Component({
  selector: 'app-editor-produto',
  imports: [
    CommonModule,
    Select,
    FormsModule,
    RouterLink,
    CKEditorModule,
    InputTextModule,
    InputNumberModule,
    CheckboxModule,
    ButtonModule,
    UploadImagemDragDrop,
    EditorVariacoes,
    SomaEstoquePipe
  ],
  templateUrl: './editor-produto.html',
  styleUrl: './editor-produto.css'
})
export class EditorProduto {
  public mode: number = 0;
  public peca: Peca;
  public listaCategorias: CategoriaPeca[] = [];
  public arquivo!: File;
  public result!: number;
  public mensagemToast!: string;
  public toastType!: string;
  public uploadandoImagem: boolean = false;
  public erroUpload: string = '';
  public MAX_IMAGENS = 10;
  public payloadVariacoes: SalvarVariacoesDTO | null = null;

  public erroEstoqueMinimo: string = '';
  public erroQuantidadeEstoque: string = '';
  public formularioValido: boolean = true;

  public Editor: any = ClassicEditor;

  public editorConfig = {
    toolbar: [
      'heading', '|',
      'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|',
      'outdent', 'indent', '|',
      'blockQuote', 'insertTable', 'undo', 'redo'
    ]
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private servicoProduto: ProdutoServico,
    private router: Router,
    private servicoCategoria: CategoriaServico,
    private servicoVariacao: PecaVariacaoServico
  ) {
    this.peca = new Peca();
    this.peca.detalhe = '';
    const id = this.activatedRoute.snapshot.params['id'];

    this.servicoCategoria.getAllCategoriasPecas().subscribe({
      next: (res: CategoriaPeca[]) => { this.listaCategorias = res; }
    });

    if (id === 'new') {
      this.mode = 0;
      this.servicoCategoria.getAllCategoriasPecas().subscribe({
        next: (res: CategoriaPeca[]) => {
          this.listaCategorias = res;
          this.peca.categoriaPeca = this.listaCategorias[0];
        }
      });
    } else {
      this.mode = 1;

      this.servicoProduto.getById(id).subscribe({
        next: (res: Peca) => {
          this.peca = Object.assign(new Peca(), res);
          console.log('Produto carregado:', this.peca);
          this.servicoCategoria.getAllCategoriasPecas().subscribe({
            next: (resCat: CategoriaPeca[]) => {
              this.listaCategorias = resCat;
              this.peca.categoriaPeca =
                this.listaCategorias.find(c => c.id === res.categoriaPeca.id) ?? res.categoriaPeca;
            }
          });

          // Dentro do next — garante objeto correto; flags lidas do res original
          this.servicoVariacao.listar(id).subscribe({
            next: (variacoes) => {
              this.peca.corUnica = res.corUnica ?? false;
              this.peca.tamanhoUnico = res.tamanhoUnico ?? false;
              this.peca.variacoes = [...variacoes];
            }
          });
        },
        error: (err: any) => {
          if (err.status !== 404) {
            localStorage.removeItem('Token');
            this.router.navigate(['']);
          }
        }
      });

      this.servicoProduto.listarImagensPeca(id).subscribe({
        next: (imagens: PecaImagem[]) => { this.peca.imagens = imagens; }
      });
    }
  }

  // ── Variações ──────────────────────────────────────────────────────────────

  public aoVariacoesChange(payload: SalvarVariacoesDTO): void {
    this.payloadVariacoes = payload;
    this.peca.corUnica = payload.corUnica;
    this.peca.tamanhoUnico = payload.tamanhoUnico;

    if (payload.variacoes?.length > 0) {
      this.formularioValido = true;
      this.erroEstoqueMinimo = '';
      this.erroQuantidadeEstoque = '';
    }
  }

  // ── Estoque ────────────────────────────────────────────────────────────────

  public onEstoqueCriticoChange(): void {
    if (this.peca.estoqueCritico !== null && this.peca.estoqueCritico !== undefined) {
      this.peca.estoqueMinimo = this.peca.estoqueCritico + 2;
      this.peca.quantidadeEstoque = this.peca.estoqueMinimo + 2;
      this.validarEstoque();
    }
  }

  public onEstoqueMinimoChange(): void { this.validarEstoque(); }
  public onQuantidadeEstoqueChange(): void { this.validarEstoque(); }

  private validarEstoque(): void {
    this.erroEstoqueMinimo = '';
    this.erroQuantidadeEstoque = '';
    this.formularioValido = true;

    if (this.peca.estoqueMinimo !== null &&
      this.peca.estoqueCritico !== null &&
      this.peca.estoqueMinimo <= this.peca.estoqueCritico) {
      this.erroEstoqueMinimo = 'O estoque mínimo não pode ser menor ou igual que o estoque crítico.';
      this.formularioValido = false;
    }

    if (this.peca.quantidadeEstoque !== null &&
      this.peca.estoqueMinimo !== null &&
      this.peca.quantidadeEstoque <= this.peca.estoqueMinimo) {
      this.erroQuantidadeEstoque = 'A quantidade de estoque não pode ser menor ou igual que o estoque mínimo registrado.';
      this.formularioValido = false;
    }
  }

  // ── Salvar produto ─────────────────────────────────────────────────────────

  public atualizarProduto(): void {
    const temVariacoes = (this.payloadVariacoes?.variacoes?.length ?? this.peca.variacoes?.length ?? 0) > 0;

    if (!temVariacoes) {
      this.validarEstoque();
      if (!this.formularioValido) {
        this.mensagemToast = 'Corrija os erros de validação antes de continuar.';
        this.toastType = 'error';
        this.mostrarToast();
        return;
      }
    }

    if (this.mode === 0) {
      // ── Novo produto ──────────────────────────────────────────────────────
      this.servicoProduto.incluirNovaPeca(this.peca).pipe(
        switchMap((res: Peca) => {
          if (this.payloadVariacoes && res.id) {
            return this.servicoVariacao.salvarLote(res.id, this.payloadVariacoes);
          }
          return of(undefined);
        })
      ).subscribe({
        next: () => {
          this.mensagemToast = 'Produto inserido com sucesso!';
          this.toastType = 'success';
          this.mostrarToast();
          setTimeout(() => this.router.navigate(['main/produtos']), 2000);
        },
        error: (err: any) => {
          if (err.status === 400) {
            this.mensagemToast = 'ERRO ao inserir o produto.';
            this.toastType = 'error';
            this.mostrarToast();
          } else {
            localStorage.removeItem('Token');
            this.router.navigate(['']);
          }
        }
      });

    } else {
      const idPeca = this.peca.id;
      // ✅ Captura snapshot do payload AGORA, antes de qualquer async
      const corUnica = this.payloadVariacoes?.corUnica ?? this.peca.corUnica;
      const tamanhoUnico = this.payloadVariacoes?.tamanhoUnico ?? this.peca.tamanhoUnico;
      const payloadParaSalvar = this.payloadVariacoes;

      this.servicoProduto.atualizarProduto(this.peca).pipe(
        switchMap(() => {
          if (payloadParaSalvar && idPeca) {
            return this.servicoVariacao.salvarLote(idPeca, payloadParaSalvar);
          }
          return of(undefined);
        })
      ).subscribe({
        next: () => {
          this.mensagemToast = 'Produto atualizado com sucesso!';
          this.toastType = 'success';
          this.mostrarToast();

          // Usa os valores capturados — não depende de estado que pode ter mudado
          this.servicoVariacao.listar(idPeca).subscribe({
            next: (variacoes) => {
              this.peca.corUnica = corUnica;
              this.peca.tamanhoUnico = tamanhoUnico;
              this.peca.variacoes = [...variacoes];
              this.payloadVariacoes = null;
            }
          });

          setTimeout(() => this.router.navigate(['main/produtos']), 2000);
        },
        error: (err: any) => {
          if (err.status === 403 || err.status === 400) {
            this.mensagemToast = 'ERRO ao atualizar o produto.';
            this.toastType = 'error';
            this.mostrarToast();
            setTimeout(() => this.router.navigate(['main/produtos']), 2000);
          } else if (err.status === 422) {
            this.mensagemToast = 'Produto salvo, mas houve erro ao salvar variações: limite excedido.';
            this.toastType = 'warning';
            this.mostrarToast();
          } else {
            localStorage.removeItem('Token');
            this.router.navigate(['']);
          }
        }
      });
    }
  }

  // ── Upload de foto principal ───────────────────────────────────────────────

  public selectFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) { this.arquivo = input.files[0]; }
  }

  public uploadFoto(): void {
    if (!this.arquivo) { console.error('Nenhum arquivo selecionado'); return; }

    const formData = new FormData();
    formData.append('arquivo', this.arquivo, this.arquivo.name);

    this.servicoProduto.uploadFoto(formData).subscribe({
      next: (res: PathDTO) => {
        this.peca.linkFoto =
          `${environment.imageURL}/${res.pathToFile}`;
      },
      error: (err: any) => {
        if (err.status === 413) {
          this.mensagemToast = 'Arquivo muito grande.';
          this.toastType = 'error';
          this.mostrarToast();
        }
      }
    });
  }

  // ── Imagens da galeria ─────────────────────────────────────────────────────

  public aoReceberImagemViaUrl(url: string): void {
    if (this.mode !== 1) {
      this.erroUpload = 'Salve o produto antes de adicionar imagens via URL.';
      return;
    }
    this.uploadandoImagem = true;
    this.erroUpload = '';

    const ehPrincipal = this.peca.imagens.length === 0 ? 1 : 0;

    this.servicoProduto.uploadFotoViaUrl(this.peca.id, url, ehPrincipal).subscribe({
      next: (img: PecaImagem) => {
        this.peca.imagens.push(img);
        if (img.principal === 1) this.peca.linkFoto = img.linkImagem;
      },
      error: (err: any) => {
        if (err.status === 413) this.erroUpload = 'Imagem muito grande.';
        else if (err.status === 422) this.erroUpload = `Limite de ${this.MAX_IMAGENS} imagens atingido.`;
        else this.erroUpload = 'Não foi possível baixar a imagem da URL.';
      },
      complete: () => { this.uploadandoImagem = false; }
    });
  }

  public aoSelecionarArquivos(arquivos: File[]): void {
    if (!arquivos.length) return;

    this.uploadandoImagem = true;
    this.erroUpload = '';

    const uploads = arquivos.map((arquivo, idx) => {
      const formData = new FormData();
      const ehPrincipal = this.peca.imagens.length === 0 && idx === 0 ? 1 : 0;
      formData.append('arquivo', arquivo, arquivo.name);

      if (this.mode === 1) {
        return lastValueFrom(
          this.servicoProduto.adicionarImagemPeca(this.peca.id, formData, ehPrincipal)
        ).then((img: PecaImagem) => {
          this.peca.imagens.push(img);
          if (img.principal === 1) this.peca.linkFoto = img.linkImagem;
        });
      } else {
        return lastValueFrom(
          this.servicoProduto.uploadFoto(formData)
        ).then((res: PathDTO) => {
          const novaImagem = new PecaImagem();
          novaImagem.linkImagem = `${environment.imageURL}/${res.pathToFile}`;
          novaImagem.ordem = this.peca.imagens.length + 1;
          novaImagem.principal = ehPrincipal;
          this.peca.imagens.push(novaImagem);
          if (ehPrincipal) this.peca.linkFoto = novaImagem.linkImagem;
        });
      }
    });

    Promise.all(uploads)
      .catch((err: any) => {
        if (err?.status === 413) this.erroUpload = 'Arquivo muito grande. Tamanho máximo: 1 MB.';
        else if (err?.status === 422) this.erroUpload = `Limite de ${this.MAX_IMAGENS} imagens por produto atingido.`;
        else if (err?.status === 401 || err?.status === 403) { localStorage.removeItem('Token'); this.router.navigate(['']); }
        else this.erroUpload = 'Erro ao enviar imagem. Tente novamente.';
      })
      .finally(() => { this.uploadandoImagem = false; });
  }

  public aoReordenarImagens(novaLista: PecaImagem[]): void {
    this.peca.imagens = novaLista;

    if (this.mode === 1) {
      const ordens = novaLista.map(img => ({ id: img.id, ordem: img.ordem }));
      this.servicoProduto.reordenarImagens(this.peca.id, ordens).subscribe({
        error: (err: any) => console.warn('Erro ao persistir reordenação:', err?.status)
      });
    }
  }

  public aoRemoverImagem(evento: { imagem: PecaImagem; index: number }): void {
    if (this.mode === 1 && evento.imagem.id) {
      this.servicoProduto.removerImagemPeca(evento.imagem.id).subscribe({
        next: () => this.peca.imagens.splice(evento.index, 1)
      });
    } else {
      this.peca.imagens.splice(evento.index, 1);
    }
  }

  public aoDefinirPrincipal(evento: { imagem: PecaImagem; index: number }): void {
    if (this.mode === 1 && evento.imagem.id) {
      this.servicoProduto.definirImagemPrincipal(this.peca.id, evento.imagem.id).subscribe({
        next: () => {
          this.peca.imagens.forEach(i => i.principal = 0);
          this.peca.imagens[evento.index].principal = 1;
          this.peca.linkFoto = evento.imagem.linkImagem;
        }
      });
    } else {
      this.peca.imagens.forEach(i => i.principal = 0);
      this.peca.imagens[evento.index].principal = 1;
      this.peca.linkFoto = evento.imagem.linkImagem;
    }
  }

  // ── Toast ──────────────────────────────────────────────────────────────────

  public mostrarToast(): void {
    const toastEl = document.querySelector('#liveToast');
    if (toastEl) { new bootstrap.Toast(toastEl).show(); }
  }
}
