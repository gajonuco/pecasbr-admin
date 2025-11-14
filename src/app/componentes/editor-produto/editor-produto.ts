import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProdutoServico } from '../../servicos/produto-servico';
import { Peca } from '../../model/Peca';
import { CategoriaServico } from '../../servicos/categoria-servico';
import { CategoriaPeca } from '../../model/CategoriaPeca';
import { PathDTO } from '../../model/PathDTO';
import { CommonModule } from '@angular/common';
declare var bootstrap: any;

@Component({
  selector: 'app-editor-produto',
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './editor-produto.html',
  styleUrl: './editor-produto.css'
  
})

export class EditorProduto {

  public mode: number = 0;
  public peca: Peca
  public listaCategorias: CategoriaPeca[]=[]
  public arquivo!: File;
  public result!:number;
  public prontaEntrega!: boolean
  public mensagemToast!:string;
   public toastType!: string;
  

  constructor(private activatedRoute: ActivatedRoute,
              private servicoProduto: ProdutoServico,
              private router: Router,
              private servicoCategoria: CategoriaServico,
              
               ){
    this.peca = new Peca()
    let id = this.activatedRoute.snapshot.params['id']
    
    this.servicoCategoria.getAllCategoriasPecas()
      .subscribe({
        next: (res: CategoriaPeca[]) => {
            (this.listaCategorias = res)
          }
        })


    if(id == "new"){
      this.mode = 0;
      this.servicoCategoria.getAllCategoriasPecas()
    .subscribe({
      next: (res: CategoriaPeca[]) => {
        this.listaCategorias = res;
        this.peca.categoriaPeca = this.listaCategorias[0]; // já vem preenchido
      }
    });

    }else{
      this.mode = 1;
      this.servicoProduto.getById(id)
      .subscribe({
        next: (res: Peca) => {
        this.peca = res;

      this.servicoCategoria.getAllCategoriasPecas().subscribe({
        next: (resCat: CategoriaPeca[]) => {
          this.listaCategorias = resCat;
          this.peca.categoriaPeca =
            this.listaCategorias.find(c => c.id === res.categoriaPeca.id) ?? res.categoriaPeca;
        }
      });
    },
        error: (err) => {
          if(err.status == 404){

          }
          else{
            localStorage.removeItem("Token")
            this.router.navigate([''])
          }
        }
      })
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


        console.log("Upload concluído:", res);
        console.log(this.peca.linkFoto);
      },
      error: (err) => {
        console.error("Erro no upload:", err);
      }
    });
  }

  public mostrarToast(){
    const toastEl = document.querySelector('#liveToast');
    if(toastEl){
      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    }
  }
  public atualizarProduto(){
    if(this.mode == 0){
      this.peca.destaque = this.peca.destaque ? 1 : 0;
      this.peca.disponivel =this.peca.disponivel ? 1 : 0;
      
      this.peca = Object.assign(new Peca(), this.peca);
      this.servicoProduto.incluirNovaPeca(this.peca)
        .subscribe({
          next: (res: Peca) => {
            this.result = 1
            this.mensagemToast = "Produto inserido com sucesso!"
            this.toastType = 'success'
            this.mostrarToast();

            setTimeout(() =>{
              this.router.navigate(['main/produtos'])
            }, 2000)
          },
          error: (err) => {
            this.result = 0
            if(err.status == 403){
              this.mensagemToast = "ERRO ao inserir o produto"
              this.toastType = 'error';
              this.mostrarToast();

              setTimeout(() => {
                this.router.navigate(['main/produtos']);
              }, 2000);
            }
            else{
              localStorage.removeItem("Token")
              this.router.navigate([''])
            }
          }
        })
      }else{
        this.peca.destaque = this.peca.destaque ? 1 : 0;
        this.peca.disponivel =this.peca.disponivel ? 1 : 0;
        this.peca = Object.assign(new Peca(), this.peca);
        this.servicoProduto.atualizarProduto(this.peca)
        .subscribe({
          next: (res: Peca) => {
            this.result = 1
            this.mensagemToast = "Produto atualizado com sucesso!"
            this.toastType = 'success'
            this.mostrarToast();

            setTimeout(() => {
              this.router.navigate(['main/produtos']);
            }, 2000);
          },
          error: (err) => {
            this.result = 0;
            if(err.status == 403){
              this.mensagemToast = "ERRO ao atualizar o produto"
              this.toastType = 'error';
              this.mostrarToast();

              setTimeout(() => {
                this.router.navigate(['main/produtos']);
              }, 2000);
            }
            else{
              localStorage.removeItem("Token")
              this.router.navigate([''])
            }
          }
        })

      }

  }

}
