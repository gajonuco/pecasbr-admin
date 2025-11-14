import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { RegistroFinanceiroService } from '../../servicos/registro-financeiro-service';
import { ItemFinanceiroDTO } from '../../model/ItemFinanceiroDTO';
import { Subject } from 'rxjs';
import { DataTablesModule } from 'angular-datatables';
import type { Config } from 'datatables.net';
declare var bootstrap: any;

@Component({
  selector: 'app-financeiro',
  imports: [DatePipe, CurrencyPipe, DataTablesModule, CommonModule],
  templateUrl: './financeiro.html',
  styleUrl: './financeiro.css'
})
export class Financeiro implements OnInit, OnDestroy {

  public dtOptions: Config = {};
  public dtTrigger: Subject<any> = new Subject<any>();
  public lista!: ItemFinanceiroDTO[];
    public toastType!: string;
  public mensagemToast!:string;
  
  constructor(private service: RegistroFinanceiroService, private router: Router) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      language: {
      url: 'https://cdn.datatables.net/plug-ins/1.13.7/i18n/pt-BR.json'  // HTTPS explícito
      }
    };
    
    this.carregarDados();
  }

  carregarDados(): void {
    this.service.recuperarRegistrosFinanceiros().subscribe({
      next: (dados: ItemFinanceiroDTO[]) => {
        this.lista = dados;
        this.dtTrigger.next(null);
      },
      error: (err) => {
        if (err.status == 403) {
          localStorage.removeItem("Token");
          this.router.navigate(["/"], { queryParams: { src: "expired" } })
      }
    }
   });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  public alterarStatus(item: ItemFinanceiroDTO, novoStatus: number) {
    if (novoStatus == -1) {
      if (!confirm("Deseja mesmo excluir este registro? A operação não pode ser desfeita")) {
        return;
      }
    }
    if (item.status == novoStatus) {
      this.mensagemToast =  "Status do item " + item.numSeq + " do pedido " + item.idPedido + " já está definido";
        this.toastType = 'warning'
        this.mostrarToast();
      return;
    }
    item.status = novoStatus;
    this.service.alterarStatusItem(item).subscribe({
      next: (res: ItemFinanceiroDTO) => { 
        this.mensagemToast = "Status alterado com sucesso!" 
        this.toastType = 'success'
        this.mostrarToast();
      },
      error: (err: any) => {
        if (err.status == 403) {

          this.mensagemToast = "Sessão expirada! Tente fazer login novamente."
          this.toastType = 'error'
          localStorage.removeItem("Token");
          setTimeout(() =>{ this.router.navigate(['/'])}, 1500)
        }else{
          this.mensagemToast = "ERRO ao alterar status!"
          this.toastType = 'error'
  
        }
         this.mostrarToast();

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