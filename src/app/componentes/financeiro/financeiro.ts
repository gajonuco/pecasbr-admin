import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { RegistroFinanceiroService } from '../../servicos/registro-financeiro-service';
import { ItemFinanceiroDTO } from '../../dto/ItemFinanceiroDTO';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

declare var bootstrap: any;

@Component({
  selector: 'app-financeiro',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    CurrencyPipe,
    TableModule,
    ButtonModule,
    TagModule
  ],
  templateUrl: './financeiro.html',
  styleUrl: './financeiro.css'
})
export class Financeiro implements OnInit {

  public lista!: ItemFinanceiroDTO[];
  public toastType!: string;
  public mensagemToast!: string;

  constructor(private service: RegistroFinanceiroService, private router: Router) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.service.recuperarRegistrosFinanceiros().subscribe({
      next: (dados: ItemFinanceiroDTO[]) => {
        this.lista = dados;
      },
      error: (err) => {
        if (err.status == 403) {
          localStorage.removeItem("Token");
          this.router.navigate(["/"], { queryParams: { src: "expired" } })
        }
      }
    });
  }

  public alterarStatus(item: ItemFinanceiroDTO, novoStatus: number) {
    if (novoStatus == -1) {
      if (!confirm("Deseja mesmo excluir este registro? A operação não pode ser desfeita")) {
        return;
      }
    }
    if (item.status == novoStatus) {
      this.mensagemToast = `Status do item ${item.numSeq} do pedido ${item.idPedido} já está definido`;
      this.toastType = 'warning';
      this.mostrarToast();
      return;
    }

    item.status = novoStatus;
    console.log(item)
    this.service.alterarStatusItem(item).subscribe({
      next: () => {
        this.mensagemToast = "Status alterado com sucesso!";
        this.toastType = 'success';
        this.mostrarToast();
      },
      error: (err) => {
        if (err.status == 403) {
          this.mensagemToast = "Sessão expirada! Tente fazer login novamente.";
          this.toastType = 'error';
          localStorage.removeItem("Token");
          setTimeout(() => this.router.navigate(['/']), 1500);
        } else {
          this.mensagemToast = "ERRO ao alterar status!";
          this.toastType = 'error';
          this.mostrarToast();
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
}
