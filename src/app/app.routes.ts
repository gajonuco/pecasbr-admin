import { Routes } from '@angular/router';
import { Login } from './componentes/login/login';
import { Main } from './componentes/main/main';
import { Dashboard } from './componentes/dashboard/dashboard';
import { Categorias } from './componentes/categorias/categorias';
import { EditorCategoria } from './componentes/editor-categoria/editor-categoria';
import { Peca } from './model/Peca';
import { EditorProduto } from './componentes/editor-produto/editor-produto';
import { Produtos } from './componentes/produtos/produtos';

export const routes: Routes = [
  { path: '', component: Login },

  {
    path: 'main',
    component: Main,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'categorias', component: Categorias },
      { path: 'editor-categoria/:id', component: EditorCategoria },
      { path: 'produtos', component: Produtos },
      { path: 'editor-produto/:id', component: EditorProduto },

      // aqui você adiciona também pages, settings etc

      // { path: 'settings', component: Settings },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
];