import { Component } from '@angular/core';
import { Usuario } from '../../model/Usuario';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsuarioServico } from '../../servicos/usuario-servico';
declare var bootstrap: any;

@Component({
  selector: 'app-editor-usuario',
  imports: [FormsModule, CommonModule],
  templateUrl: './editor-usuario.html',
  styleUrl: './editor-usuario.css'
})
export class EditorUsuario {

  public senhasIguais!:boolean
  public usuario!: Usuario;
  public senha!: string
  public mode!: number
  public mensagemToast!:string;
  public toastType!: string;

  constructor(private service: UsuarioServico,
               private router: Router,
              private activatedRoute: ActivatedRoute){
    this.usuario = new Usuario();
    let id = this.activatedRoute.snapshot.params['id']
    this.senhasIguais = false
    if(id == "new"){
      this.mode = 0;
    } else{
      this.mode = 1;
      this.service.recuperarPeloId(id)
        .subscribe({
          next : (res: Usuario) => {
            this.usuario = res;
          }
        })
    }
  }

  public sugereUsername(){
    const email = this.usuario.email
    this.usuario.username = email.split("@")[0] || email;
  }

  public confereSenha(){
    if(this.senha === this.usuario.senha) {
      this.mode = 0
      this.senhasIguais = true;
    } else{
      this.mode = 1
      this.senhasIguais = false;

    }
  }

  public atualizarUsuario(){
    if(this.mode == 0) {   
      this.usuario = Object.assign(new Usuario(), this.usuario);   
      this.service.adicionarUsuario(this.usuario)
        .subscribe({
          next: (res:Usuario) =>
          {
            this.mensagemToast = "Usuário adicionado com sucesso!"
            this.toastType = 'success'
            this.mostrarToast();

            setTimeout(() =>{
                this.router.navigate(['main/usuarios'])
            }, 1500)
          },
          error: (err) =>
          {
            this.mensagemToast = "Falha ao inserir usuário!"
            this.toastType = 'error'
            this.mostrarToast();

            setTimeout(() =>{
              this.router.navigate(['main/usuario'])
            }, 1500)
          }
        })
    } else if(this.mode == 1){
      this.usuario = Object.assign(new Usuario(), this.usuario);   
      this.service.alterarDados(this.usuario)
        .subscribe({
          next: (res:Usuario) =>
          {
            this.mensagemToast = "Usuário alterado com sucesso!"
            this.toastType = 'success'
            this.mostrarToast();

            setTimeout(() =>{
                this.router.navigate(['main/usuarios'])
            }, 1500)
          },
          error: (err) =>
          {
            this.mensagemToast = "Falha ao alterar usuário!"
            this.toastType = 'error'
            this.mostrarToast();

            setTimeout(() =>{
              this.router.navigate(['main/usuario'])
            }, 1500)
          }
        })

    }
  }

  public mostrarToast(){
    const toastEl = document.querySelector('#liveToast');
    if(toastEl){
      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    }
  }

}
