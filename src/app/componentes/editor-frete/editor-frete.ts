import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Frete } from '../../model/Frete';
import { FreteService } from '../../servicos/frete-service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
declare var bootstrap: any;

@Component({
  selector: 'app-editor-frete',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    InputTextModule,
    InputNumberModule,
    CheckboxModule,
    ButtonModule
  ],
  templateUrl: './editor-frete.html',
  styleUrl: './editor-frete.css'
})
export class EditorFrete implements OnInit {

  public disponivel!:boolean;
  public frete:Frete = new Frete();
  public mode: number = 0;
    public mensagemToast!:string;
  public toastType!: string;
  constructor(private service: FreteService, 
              private activeRouter: ActivatedRoute, 
              private router: Router) { 

     let id = this.activeRouter.snapshot.params["id"]
     if (id == "new"){
       this.mode = 0;
       this.frete = new Frete();
     }
     else{
       this.mode = 1;
       this.service.recuperarPeloId(id).subscribe({
         next: (res: Frete) => {
           this.frete = res;
           this.disponivel = (this.frete.disponivel == 1)? true: false;
         },
         error: (err: any) => {
           if (err.status == 403){
            this.mensagemToast = "Sessão expirada! Tente fazer login novamente."
            this.toastType = 'error'
            this.mostrarToast();
            localStorage.removeItem("Token");
            setTimeout(() =>{ this.router.navigate(['/'])}, 1500)
           }
         }
     })
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

  public atualizarFrete(){
    this.frete.disponivel = (this.disponivel)? 1: 0;
    if (this.mode == 0){  // novo frete
      this.service.inserirFrete(this.frete).subscribe({
        next: (res: Frete) => {
          this.mensagemToast = "Frete inserido com sucesso!"
          this.toastType = 'success'
          this.mostrarToast();
          setTimeout(() =>{ this.router.navigate(['main/fretes'])}, 2000)

        },
        error: (err: any) => {
          if (err.status == 403){
            this.mensagemToast = "Sessão expirada! Tente fazer login novamente."
            this.toastType = 'error'
            localStorage.removeItem("Token");
            setTimeout(() =>{ this.router.navigate(['/'])}, 2000)
          }
          else if (err.status == 400){
            this.mensagemToast = "Erro! Verifique se prefixo está em uso"
            this.toastType = 'warning'
          }
            this.mostrarToast();
        }
    });

    }
    else { // frete existente
      this.service.atualizarFrete(this.frete).subscribe({
       next: (res: Frete) => {
          this.mensagemToast = "Frete atualizado com sucesso!"
          this.toastType = 'info'
          this.mostrarToast()
          setTimeout(() =>{ this.router.navigate(['main/fretes'])}, 2000)
        },
        error: (err: any) => {
          localStorage.removeItem("Token");
          setTimeout(() =>{ this.router.navigate(['/'])}, 2000)
        }
    });

    }

  }

}