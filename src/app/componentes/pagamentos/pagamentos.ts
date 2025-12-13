import { Component } from '@angular/core';
import { FormaPagamento } from '../../model/FormaPagamento';
import { FormapagamentoService } from '../../servicos/formapagamento-service';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-pagamentos',
  imports: [ TableModule, ButtonModule, TagModule, RouterLink ],
  templateUrl: './pagamentos.html',
  styleUrl: './pagamentos.css'
})
export class Pagamentos {


  public lista:FormaPagamento[] = [];
  constructor(private service: FormapagamentoService, private router: Router) { }

  ngOnInit(): void {
    this.service.recuperarTodasFormasPgto().subscribe({
      next: (res: FormaPagamento[])=>{this.lista = res},
      error: (err:any)=>{
        if (err.status == 403){
          localStorage.removeItem("Token");
          this.router.navigate(["/"], { queryParams: { src: "expired" } } )
        }
      }
  });
  }
}
