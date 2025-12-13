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

  constructor(private router: Router) {}

  skipAnimation = true;
  isLeftSidebarCollapsed = signal<boolean>(true);
  screenWidth = signal<number>(window.innerWidth);
  isMobile = signal<boolean>(false);

  items = [
    { routeLink: 'dashboard', icon: 'fas fa-chart-pie', label: 'Dashboard' }, 
    { routeLink: 'categorias', icon: 'fas fa-list-ul', label: 'Categorias' },
    { routeLink: 'produtos', icon: 'fas fa-box-open', label: 'Produtos' },
    { routeLink: 'financeiro', icon: 'fas fa-dollar-sign', label: 'Financeiro' },
    { routeLink: 'pagamentos', icon: 'fas fa-credit-card', label: 'Pagamentos'},
    { routeLink: 'fretes', icon: 'fas fa-shipping-fast', label: 'Fretes'},
    { routeLink: 'pedidos', icon: 'far fa-file-alt', label: 'Pedidos' },
    { routeLink: 'clientes', icon: 'fas fa-users', label: 'Clientes' },
    { routeLink: 'usuarios', icon: 'fas fa-key', label: 'Usuários' },
    { routeLink: 'logout', icon: 'fas fa-sign-out-alt', label: 'Sair'}
  ];

  @HostListener('window:resize')
  onResize() {
    this.screenWidth.set(window.innerWidth);
    this.checkMobileView();
  }

  ngOnInit(): void {
    this.checkMobileView();
    this.isLeftSidebarCollapsed.set(true);

    setTimeout(() => {
      this.skipAnimation = false;
    }, 0);
  }

  private checkMobileView(): void {
    const mobile = this.screenWidth() < 768;
    this.isMobile.set(mobile);
    
    if (mobile) {
      this.isLeftSidebarCollapsed.set(true);
    }
  }

  toggleCollapse(): void {
    this.isLeftSidebarCollapsed.set(!this.isLeftSidebarCollapsed());
  }

  onMenuClick(item: any): void {
    // Em mobile, fecha o menu ao clicar em qualquer item
    if (this.isMobile()) {
      this.closeSidenav();
    }

    if (item.routeLink === 'logout') {
      localStorage.removeItem('Token');
      this.router.navigate(['']);
    }
  }

  closeSidenav(): void {
    this.isLeftSidebarCollapsed.set(true);
  }

  get sizeClass(): string {
    // Em mobile, não ajusta o body (menu é overlay)
    if (this.isMobile()) {
      return '';
    }

    // Desktop: ajusta conforme estado do menu
    if (!this.isLeftSidebarCollapsed()) {
      return 'body-trimmed';
    }
    return 'body-collapsed';
  }
}