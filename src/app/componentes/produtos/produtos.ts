import { Component, OnInit } from '@angular/core';
import { ProdutoServico } from '../../servicos/produto-servico';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Peca } from '../../model/Peca';
import { ClienteServico } from '../../servicos/cliente-servico';
import { CompradorDTO } from '../../model/CompradorDTO';

@Component({
  selector: 'app-produtos',
    imports: [FormsModule, RouterLink],
  templateUrl: './produtos.html',
  styleUrl: './produtos.css'
})
export class Produtos implements OnInit{

  public lista: Peca[] = []
  public compradores: CompradorDTO[] = []
  constructor(private service: ProdutoServico, private router: Router,
                private cliService: ClienteServico){

  }
  ngOnInit(): void {
        if(!localStorage.getItem("Token")){
        this.router.navigate(['/']);
    }
    this.service.getAllPecas()
      .subscribe({
        next: (res: Peca[]) => {
          this.lista = res
        },
        error: (err) => {
          console.log(err)
          this.router.navigate(['/'])
        }
      })
  }
  public destaca(peca:Peca){
    peca.destaque = peca.destaque ? 1 : 0
    this.service.atualizarProduto(peca).subscribe({
      next: (res: Peca) => {
        console.log("Peca" + res)
      }
    })
  }
  public disponibiliza(peca:Peca){
    peca.disponivel = peca.disponivel ? 1 : 0;
    this.service.atualizarProduto(peca).subscribe({
      next: (res: Peca) => {
        console.log("Peca" + res)
      }
    })
  }

    public buscarCompradores(idPeca: number) {
    this.cliService.buscarCompradores(idPeca)
      .subscribe({
        next: (res: CompradorDTO[]) => {
          this.compradores = res;
          document.getElementById("btnModal")?.click();
        }
      })
  }

}
