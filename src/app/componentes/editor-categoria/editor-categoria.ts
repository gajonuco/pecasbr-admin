import { Component } from '@angular/core';
import { CategoriaPeca } from '../../model/CategoriaPeca';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CategoriaServico } from '../../servicos/categoria-servico';

@Component({
  selector: 'app-editor-categoria',
  imports: [FormsModule, RouterLink],
  templateUrl: './editor-categoria.html',
  styleUrl: './editor-categoria.css'
})
export class EditorCategoria {

  public mode: number = 0;
  public categoria: CategoriaPeca

  constructor(private activatedRoute: ActivatedRoute,
              private service: CategoriaServico,
              private router: Router){
    this.categoria = new CategoriaPeca()
    let id = this.activatedRoute.snapshot.params['id']

    if(id == "new"){
      this.mode = 0;
    }else{
      this.mode = 1;
      this.service.getById(id)
      .subscribe({
        next: (res: CategoriaPeca) => {
        (this.categoria = res)
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
}
