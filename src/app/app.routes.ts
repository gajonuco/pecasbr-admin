import { Routes } from '@angular/router';
import { Login } from './componentes/login/login';
import { Main } from './componentes/main/main';
import { Dashboard } from './componentes/dashboard/dashboard';
import { Categorias } from './componentes/categorias/categorias';
import { EditorCategoria } from './componentes/editor-categoria/editor-categoria';

import { EditorProduto } from './componentes/editor-produto/editor-produto';
import { Produtos } from './componentes/produtos/produtos';
import { Pedidos } from './componentes/pedidos/pedidos';
import { Clientes } from './componentes/clientes/clientes';
import { Usuarios } from './componentes/usuarios/usuarios';
import { EditorUsuario } from './componentes/editor-usuario/editor-usuario';

export const routes: Routes = [
  { path: '', component: Login },

  {
    path: 'main',
    component: Main,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'categorias', component: Categorias },
      { path: 'pedidos', component: Pedidos},
      { path: 'editor-categoria/:id', component: EditorCategoria },
      { path: 'produtos', component: Produtos },
      { path: 'clientes', component: Clientes},
      { path: 'editor-produto/:id', component: EditorProduto },
      { path: 'usuarios', component: Usuarios },
      {path: 'editor-usuario/:id', component: EditorUsuario},
      

      // aqui você adiciona também pages, settings etc

      // { path: 'settings', component: Settings },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
];