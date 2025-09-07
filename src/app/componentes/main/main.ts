import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.html',
  imports: [RouterOutlet, CommonModule, RouterModule],
  styleUrls: ['./main.css'],
})
export class Main implements OnInit {

  skipAnimation = true; // começa sem animação (útil para rotas iniciais)
  isLeftSidebarCollapsed = signal<boolean>(true);
  screenWidth = signal<number>(window.innerWidth);

  items = [
    { routeLink: 'dashboard', icon: 'fas fa-home', label: 'Dashboard' },
    { routeLink: 'categorias', icon: 'fas fa-list-ul', label: 'Categorias' },
    { routeLink:'pecas', icon: 'fas fa-box-open', label: 'Produtos' },
    { routeLink:'relatorios', icon: 'fas fa-chart-pie', label: 'Relatórios' },
    { routeLink: 'users', icon: 'fas fa-users', label: 'Usuários' },
    { routeLink: 'settings', icon: 'fas fa-key', label: 'Configurações' },
    { routeLink: 'logout', icon: 'fas fa-sign-out-alt', label: 'Sair' }
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