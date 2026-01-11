import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProdutoServico } from '../../servicos/produto-servico';
import { Peca } from '../../model/Peca';
import { CategoriaServico } from '../../servicos/categoria-servico';
import { CategoriaPeca } from '../../model/CategoriaPeca';
import { PathDTO } from '../../dto/PathDTO';
import { CommonModule } from '@angular/common';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Select } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

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
    ButtonModule
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

  // Controle de validações de estoque
  public erroEstoqueMinimo: string = '';
  public erroQuantidadeEstoque: string = '';
  public formularioValido: boolean = true;

  public Editor: any = ClassicEditor;

  public editorConfig = {
    toolbar: [
      'heading',
      '|',
      'bold',
      'italic',
      'link',
      'bulletedList',
      'numberedList',
      '|',
      'outdent',
      'indent',
      '|',
      'blockQuote',
      'insertTable',
      'undo',
      'redo'
    ]
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private servicoProduto: ProdutoServico,
    private router: Router,
    private servicoCategoria: CategoriaServico
  ) {
    this.peca = new Peca();
    this.peca.detalhe = '';
    let id = this.activatedRoute.snapshot.params['id'];

    this.servicoCategoria.getAllCategoriasPecas()
      .subscribe({
        next: (res: CategoriaPeca[]) => {
          this.listaCategorias = res;
        }
      });

    if (id == "new") {
      this.mode = 0;
      this.servicoCategoria.getAllCategoriasPecas()
        .subscribe({
          next: (res: CategoriaPeca[]) => {
            this.listaCategorias = res;
            this.peca.categoriaPeca = this.listaCategorias[0];
          }
        });
    } else {
      this.mode = 1;
      this.servicoProduto.getById(id)
        .subscribe({
          next: (res: Peca) => {
            this.peca = Object.assign(new Peca(), res);
            this.servicoCategoria.getAllCategoriasPecas().subscribe({
              next: (resCat: CategoriaPeca[]) => {
                this.listaCategorias = resCat;
                this.peca.categoriaPeca =
                  this.listaCategorias.find(c => c.id === res.categoriaPeca.id) ?? res.categoriaPeca;
              }
            });
          },
          error: (err: any) => {
            if (err.status == 404) {
              // Tratar erro 404
            } else {
              localStorage.removeItem("Token");
              this.router.navigate(['']);
            }
          }
        });
    }
  }

  /**
   * Atualização automática quando estoque crítico muda
   */
  public onEstoqueCriticoChange(): void {
    if (this.peca.estoqueCritico !== null && this.peca.estoqueCritico !== undefined) {
      // Atualiza estoque mínimo (crítico + 2)
      this.peca.estoqueMinimo = this.peca.estoqueCritico + 2;

      // Atualiza quantidade estoque (mínimo + 2)
      this.peca.quantidadeEstoque = this.peca.estoqueMinimo + 2;

      // Valida após atualização automática
      this.validarEstoque();
    }
  }

  /**
   * Validação quando estoque mínimo muda manualmente
   */
  public onEstoqueMinimoChange(): void {
    this.validarEstoque();
  }

  /**
   * Validação quando quantidade estoque muda manualmente
   */
  public onQuantidadeEstoqueChange(): void {
    this.validarEstoque();
  }

  /**
   * Validação completa dos campos de estoque
   */
  private validarEstoque(): void {
    this.erroEstoqueMinimo = '';
    this.erroQuantidadeEstoque = '';
    this.formularioValido = true;

    // Validação 1: Estoque Mínimo não pode ser menor que Estoque Crítico
    if (this.peca.estoqueMinimo !== null &&
      this.peca.estoqueCritico !== null &&
      this.peca.estoqueMinimo <= this.peca.estoqueCritico) {
      this.erroEstoqueMinimo = 'O estoque mínimo não pode ser menor ou igual que o estoque crítico.';
      this.formularioValido = false;
    }

    // Validação 2: Quantidade Estoque não pode ser menor que Estoque Mínimo
    if (this.peca.quantidadeEstoque !== null &&
      this.peca.estoqueMinimo !== null &&
      this.peca.quantidadeEstoque <= this.peca.estoqueMinimo) {
      this.erroQuantidadeEstoque = 'A quantidade de estoque não pode ser menor ou igual que o estoque mínimo registrado.';
      this.formularioValido = false;
    }
  }

  public selectFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.arquivo = input.files[0];
    }
  }

  public uploadFoto(): void {
    if (!this.arquivo) {
      console.error("Nenhum arquivo selecionado");
      return;
    }

    const formData = new FormData();
    formData.append("arquivo", this.arquivo, this.arquivo.name);

    this.servicoProduto.uploadFoto(formData).subscribe({
      next: (res: PathDTO) => {
        this.peca.linkFoto = "https://projetoreal.dev.br/assets/img/" + res.pathToFile;

        // this.peca.linkFoto = `assets/img/${res.pathToFile}`;

        console.log("Upload concluído:", res);
        console.log(this.peca.linkFoto);
      },
      error: (err: any) => {
        if (err.status = 413) {
          this.mensagemToast = "T";
          this.toastType = 'error';
          this.mostrarToast();
          return;
        }
      }
    });
  }

  public mostrarToast() {
    const toastEl = document.querySelector('#liveToast');
    if (toastEl) {
      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    }
  }

  public atualizarProduto() {
    // Valida antes de enviar
    this.validarEstoque();

    if (!this.formularioValido) {
      this.mensagemToast = "Corrija os erros de validação antes de continuar.";
      this.toastType = 'error';
      this.mostrarToast();
      return;
    }

    if (this.mode == 0) {
      console.log(this.peca)
      this.servicoProduto.incluirNovaPeca(this.peca)
        .subscribe({
          next: (res: Peca) => {
            console.log(this.peca)
            this.result = 1;
            this.mensagemToast = "Produto inserido com sucesso!";
            this.toastType = 'success';
            this.mostrarToast();

            setTimeout(() => {
              this.router.navigate(['main/produtos']);
            }, 2000);
          },
          error: (err: any) => {
            this.result = 0;
            if (err.status == 400) {
              this.mensagemToast = "ERRO ao inserir o produto";
              this.toastType = 'error';
              this.mostrarToast();
            } else {
              localStorage.removeItem("Token");
              this.router.navigate(['']);
            }
          }
        });
    } else {
      console.log("Peca enviada ", this.peca)
      this.servicoProduto.atualizarProduto(this.peca)
        .subscribe({
          next: (res: Peca) => {
            this.result = 1;
            this.mensagemToast = "Produto atualizado com sucesso!";
            this.toastType = 'success';
            this.mostrarToast();

            setTimeout(() => {
              this.router.navigate(['main/produtos']);
            }, 2000);
          },
          error: (err: any) => {
            this.result = 0;
            if (err.status == 403) {
              this.mensagemToast = "ERRO ao atualizar o produto";
              this.toastType = 'error';
              this.mostrarToast();

              setTimeout(() => {
                this.router.navigate(['main/produtos']);
              }, 2000);
            } else {
              localStorage.removeItem("Token");
              this.router.navigate(['']);
            }
          }
        });
    }
  }
}