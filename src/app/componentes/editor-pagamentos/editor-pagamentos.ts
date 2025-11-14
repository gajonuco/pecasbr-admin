import { Component } from '@angular/core';
import { FormapagamentoService } from '../../servicos/formapagamento-service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormaPagamento } from '../../model/FormaPagamento';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
declare var bootstrap: any;

@Component({
  selector: 'app-editor-pagamentos',
  imports:  [FormsModule, RouterLink, CommonModule],
  templateUrl: './editor-pagamentos.html',
  styleUrl: './editor-pagamentos.css'
})
export class EditorPagamentos {

  public mode: number = 0;   // 0 novo   != 0 existente
  public visivel: boolean = false;
  public formaPgto: FormaPagamento;
  public mensagemToast!:string;
  public toastType!: string;

  constructor(private pgtoService: FormapagamentoService, private activatedRoute: ActivatedRoute, private router: Router) {
    this.formaPgto = new FormaPagamento();
    let id = this.activatedRoute.snapshot.params["id"];
    if (id == "new") {
      this.mode = 0;
    }
    else {
      this.mode = 1;
      this.pgtoService.recuperarPeloId(id).subscribe({
        next: (res: FormaPagamento) => { 
          this.formaPgto = res; 
          this.visivel = (this.formaPgto.visivel==1)? true: false;
        },
        error: (err: any) => {
          if (err.status == 403) {
            this.mensagemToast = "Sessão expirada! Tente fazer login novamente."
            this.toastType = 'error'
            localStorage.removeItem("Token");
            setTimeout(() =>{ this.router.navigate(['/'])}, 1500)
          }
          else if (err.status == 404){
            this.mensagemToast = "Erro ao recuperar forma de pagamento"
            this.toastType = 'error'
          }
          this.mostrarToast();
        }
    });
    }
  }
  ngOnInit(): void {
  }

  public mostrarToast(){
    const toastEl = document.querySelector('#liveToast');
    if(toastEl){
      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    }
  }


  atualizarFormaPgto(): void {
    this.formaPgto.visivel = (this.visivel)?1:0;
    if (this.mode == 0){
       this.pgtoService.inserirNovo(this.formaPgto).subscribe({
         next: (res: FormaPagamento) => {
           this.formaPgto = res;
           this.mensagemToast = "Novo meio de pagamento Inserido!"
           this.toastType = 'success'
           this.mostrarToast();
            setTimeout(() =>{ this.router.navigate(['main/pagamentos'])}, 1500)
        },
         error: (err: any) => {
           if (err.status == 403){
            this.mensagemToast = "Sessão expirada! Tente fazer login novamente."
            this.toastType = 'error'
            localStorage.removeItem("Token");
            setTimeout(() =>{ this.router.navigate(['/'])}, 1500)
           }
           else{
              this.mensagemToast = "Erro ao inserir Meio de Pagamento"
              this.toastType = 'error'
           }
           this.mostrarToast();
         }
    });
    }
    else {   // para atualizar
      this.pgtoService.atualizar(this.formaPgto).subscribe({
        next: (res: FormaPagamento) => {
          this.formaPgto = res;
          this.mensagemToast = "Informações Atualizadas com Sucesso"
          this.toastType = 'info'
          this.mostrarToast();
          setTimeout(() =>{ this.router.navigate(['main/pagamentos'])}, 1500)
       },
        error: (err: any) => {
          if (err.status == 403){
            this.mensagemToast = "Sessão expirada! Tente fazer login novamente."
            this.toastType = 'error'
            localStorage.removeItem("Token");
            setTimeout(() =>{ this.router.navigate(['/'])}, 1500)
          }
          else{
            this.mensagemToast = "Erro ao atualizar informações do Meio de Pagamento"
             this.toastType = 'error'
          }
          this.mostrarToast();
        },
    });

    }

  }
}
