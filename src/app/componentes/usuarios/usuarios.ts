import { Component } from '@angular/core';

import { Usuario } from '../../model/Usuario';
import { FormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UsuarioServico } from '../../servicos/usuario-servico';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
declare var bootstrap: any;

@Component({
  selector: 'app-usuarios',
  imports: [    CommonModule,
    FormsModule,
    RouterLink,
    CKEditorModule,
    InputTextModule,
    InputNumberModule,
    CheckboxModule,
    ButtonModule, TableModule],
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
