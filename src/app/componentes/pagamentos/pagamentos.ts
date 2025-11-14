import { Component } from '@angular/core';
import { FormaPagamento } from '../../model/FormaPagamento';
import { FormapagamentoService } from '../../servicos/formapagamento-service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagamentos',
  imports: [RouterLink],
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
