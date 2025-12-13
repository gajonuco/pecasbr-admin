import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Frete } from '../../model/Frete';
import { FreteService } from '../../servicos/frete-service';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
declare var bootstrap: any;

@Component({
  selector: 'app-fretes',
  imports: [RouterLink, DecimalPipe, FormsModule, TableModule, ButtonModule, TagModule, CurrencyPipe ],
  templateUrl: './fretes.html',
  styleUrl: './fretes.css'
})
export class Fretes {

  public lista: Frete[] = []
  public mensagemToast!:string;
  public toastType!: string;
  constructor(private service: FreteService, private router: Router) { }


  ngOnInit(): void {
    this.service.recuperarTodos().subscribe({
      next:  (res: Frete[]) => { this.lista = res },
      error: (err: any) => {
        if (err.status == 403) {
            this.mensagemToast = "Sessão expirada! Tente fazer login novamente."
            this.toastType = 'error'
            this.mostrarToast();
            localStorage.removeItem("Token");
            setTimeout(() =>{ this.router.navigate(['/'])}, 1500)

        }
      }
    });
  }

  public disponibiliza(frete: Frete) {
    frete.disponivel = (frete.disponivel) ? 1 : 0;
    this.service.atualizarFrete(frete).subscribe({
      next: (res: Frete) => {
        console.log(res);
      },
      error: (err: any) => {
        if (err.status == 403) {
            this.mensagemToast = "Sessão expirada! Tente fazer login novamente."
            this.toastType = 'error'
            this.mostrarToast();
            localStorage.removeItem("Token");
            setTimeout(() =>{ this.router.navigate(['/'])}, 1500)

        }
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
}
