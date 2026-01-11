import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '../../model/Usuario';
import { FormsModule } from '@angular/forms';
import { LoginServico } from '../../servicos/login-servico';
import { Token } from '../../model/JWTToken';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../servicos/token-service';

declare var bootstrap: any;

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {

  usuario: Usuario = new Usuario();
  toastType!: string;
  mensagemToast!: string;

  src: string = '';
  msgAlert: string = '';

  constructor(
    private router: Router,
    private service: LoginServico,
    private activated: ActivatedRoute,
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {
    // Verifica se já existe um token válido
    const token = this.tokenService.getToken();
    if (token && this.tokenService.isTokenValid(token)) {
      // Token válido, redireciona para o dashboard
      this.router.navigate(['main/dashboard']);
      return;
    }

    // Se chegou aqui, não há token válido
    // Remove qualquer token expirado
    if (token) {
      this.tokenService.clearToken();
    }

    // Captura a mensagem de erro da query string
    this.src = this.activated.snapshot.queryParams['src'] ?? '';

    // Define a mensagem inicial baseada no src
    if (this.src) {
      switch (this.src) {
        case 'unauthorized':
          this.msgAlert = "Você não está autorizado a navegar pelo site";
          break;
        case 'expired':
          this.msgAlert = "Sua sessão expirou. Conecte-se novamente";
          break;
      }

      // Limpa os query params da URL
      this.router.navigate([], {
        relativeTo: this.activated,
        queryParams: {},
        replaceUrl: true
      });
    }
  }

  public aoDigitar(): void {
    this.msgAlert = '';
    this.src = '';
  }

  public autenticar(event?: Event): void {
    // Sempre limpa mensagens antes de nova tentativa
    if (event) {
      event.preventDefault();
    }

    // Sempre limpa mensagens antes de nova tentativa
    this.msgAlert = '';
    this.src = '';

    console.log(this.usuario);

    this.service.logarUsuarios(this.usuario).subscribe({
      next: (res: Token) => {
        // Salva o novo token
        this.tokenService.saveToken(res.token);

        this.mensagemToast = "Login efetuado com sucesso!";
        this.toastType = 'success';
        this.mostrarToast();

        setTimeout(() => {
          this.router.navigate(['main/dashboard']);
        }, 1500);
      },

      error: (err) => {
        console.error('Erro no login:', err);

        // Verifica o status HTTP retornado
        if (err.status === 403) {
          // Usuário inativo
          this.msgAlert = "Você não está autorizado a navegar pelo site";
          this.src = 'unauthorized';
        } else if (err.status === 401) {
          // Credenciais inválidas
          this.msgAlert = "Usuário ou senha incorretos!";
          this.src = 'login-error';
        } else {
          // Erro genérico
          this.msgAlert = "Erro ao tentar fazer login. Tente novamente.";
          this.src = 'server-error';
        }
      }
    });
  }

  mostrarToast(): void {
    const toastEl = document.querySelector('#liveToast');
    if (toastEl) {
      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    }
  }
}