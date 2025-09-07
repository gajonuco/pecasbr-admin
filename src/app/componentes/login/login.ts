import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Usuario } from '../../model/Usuario';
import { FormsModule } from '@angular/forms';
import { LoginServico } from '../../servicos/login-servico';
import { Token } from '../../model/JWTToken';


@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  public usuario : Usuario;
  constructor(private router: Router, private service: LoginServico
  ){
    this.usuario = new Usuario()
  }
  autenticar(): void{
    this.usuario = Object.assign(new Usuario(), this.usuario);
    this.service.logarUsuarios(this.usuario).
    subscribe({
      next: (res: Token) => {
        localStorage.setItem("Token",res.token)
        this.router.navigate(['main/dashboard'])
      }
    })
  
  }

}
