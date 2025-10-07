import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Usuario } from '../../model/Usuario';
import { FormsModule } from '@angular/forms';
import { LoginServico } from '../../servicos/login-servico';
import { Token } from '../../model/JWTToken';
import { CommonModule } from '@angular/common';
declare var bootstrap: any;

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  public usuario : Usuario;
  public toastType!: string;
  public mensagemToast!:string;


  constructor(private router: Router,
              private service: LoginServico
  ){this.usuario = new Usuario()}

  public autenticar(): void{
    this.usuario = Object.assign(new Usuario(), this.usuario);
    this.service.logarUsuarios(this.usuario).
    subscribe({
      next: (res: Token) => {
        localStorage.setItem("Token",res.token)

        this.mensagemToast = "Login efetuado com sucesso!"
        this.toastType = 'success'
        this.mostrarToast();

        setTimeout(() =>{
          this.router.navigate(['main/dashboard'])
        }, 2000)


      },
      error: (err) => {
        this.mensagemToast = "Seu usuário/senha estão inválidos ou bloqueado"
        this.toastType = 'error'
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
