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
import { Financeiro } from './componentes/financeiro/financeiro';
import { Pagamentos } from './componentes/pagamentos/pagamentos';
import { EditorPagamentos } from './componentes/editor-pagamentos/editor-pagamentos';
import { Fretes } from './componentes/fretes/fretes';
import { EditorFrete} from './componentes/editor-frete/editor-frete';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: Login },

  {
    path: 'main',
    component: Main,
    canActivate: [AuthGuard], // Protege toda a área administrativa
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'categorias', component: Categorias },
      { path: 'pedidos', component: Pedidos },
      { path: 'editor-categoria/:id', component: EditorCategoria },
      { path: 'produtos', component: Produtos },
      { path: 'clientes', component: Clientes },
      { path: 'fretes', component: Fretes },
      { path: 'editor-produto/:id', component: EditorProduto },
      { path: 'usuarios', component: Usuarios },
      { path: 'editor-usuario/:id', component: EditorUsuario },
      { path: 'financeiro', component: Financeiro },
      { path: 'pagamentos', component: Pagamentos },
      { path: 'editor-pagamentos/:id', component: EditorPagamentos },
      { path: 'editor-frete/:id', component: EditorFrete },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  
  // Rota wildcard para páginas não encontradas
  { path: '**', redirectTo: '' }
];