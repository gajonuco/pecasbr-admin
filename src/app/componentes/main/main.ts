import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, signal } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.html',
  imports: [RouterOutlet, CommonModule, RouterModule],
  styleUrls: ['./main.css'],
})
export class Main implements OnInit {

  

constructor( private router:Router){}



  skipAnimation = true; // começa sem animação (útil para rotas iniciais)
  isLeftSidebarCollapsed = signal<boolean>(true);
  screenWidth = signal<number>(window.innerWidth);

  items = [
    { routeLink: 'dashboard', icon: 'fas fa-chart-pie', label: 'Dashboard' },
    { routeLink: 'categorias', icon: 'fas fa-list-ul', label: 'Categorias' },
    { routeLink:'produtos', icon: 'fas fa-box-open', label: 'Produtos' },
    { routeLink:'financeiro', icon: 'fas fa-dollar-sign', label: 'Financeiro' },
    { routeLink: 'pagamentos', icon: 'fas fa-credit-card', label: 'Pagamentos'},
    { routeLink:'pedidos', icon: 'far fa-file-alt', label: 'Pedidos' },
    { routeLink: 'clientes', icon: 'fas fa-users', label: 'Clientes' },
    { routeLink: 'usuarios', icon: 'fas fa-key', label: 'Usuários' },
    { routeLink: 'logout', icon: 'fas fa-sign-out-alt', label: 'Sair'}
  ];


  @HostListener('window:resize')
  onResize() {
    this.screenWidth.set(window.innerWidth);
    if (this.screenWidth() < 768) {
      this.isLeftSidebarCollapsed.set(true);
    }
  }

    

  ngOnInit(): void {
    if (this.screenWidth() < 768) {
      this.isLeftSidebarCollapsed.set(true);
    }

    // define estado inicial colapsado sem animar
    this.isLeftSidebarCollapsed.set(true);

    // após carregar a rota, reativa animação
    setTimeout(() => {
      this.skipAnimation = false;
    }, 0);
  }

  toggleCollapse(): void {
    this.isLeftSidebarCollapsed.set(!this.isLeftSidebarCollapsed());
  }

  onMenuClick(item: any): void {
    if (item.routeLink === 'logout') {
      localStorage.removeItem('Token');
      this.router.navigate(['']);
    }
  }

  closeSidenav(): void {
    this.isLeftSidebarCollapsed.set(true);
  }

  get sizeClass(): string {
    if (!this.isLeftSidebarCollapsed()) {
      return this.screenWidth() > 768 ? 'body-trimmed' : 'body-md-screen';
    }
    return '';
  }
}