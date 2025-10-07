import { Component } from '@angular/core';
import { UsuarioServico } from '../../servicos/usuario-servico';
import { Usuario } from '../../model/Usuario';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
declare var bootstrap: any;

@Component({
  selector: 'app-usuarios',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css'
})
export class Usuarios {

  public lista! : Usuario[]
  public mensagemToast!:string;
  public toastType!: string;

  constructor(private service: UsuarioServico) {
    this.service.recuperarTodos()
      .subscribe({
        next:(res: Usuario[]) =>{
          this.lista = res
        }
      })
  }

  public mudaStatus(usuario: Usuario){
    usuario.ativo = usuario.ativo ? 1 : 0
        this.service.alterarDados(usuario).subscribe({
          next: (res: Usuario) => {
            this.mensagemToast = "Usuario alterado com sucesso!"
            this.toastType = 'success'
            this.mostrarToast();
          }
        })
  }

  public mostrarToast(){
    const toastEl = document.querySelector('#liveToast');
    if(toastEl){
      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    }
  }

  

  

}
