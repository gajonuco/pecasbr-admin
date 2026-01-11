// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { NotificationService } from './servicos/notification.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet], // Adicione seus outros imports aqui
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  title = 'Oficina Mecânica PWA';

  constructor(private notificationService: NotificationService) {
    console.log('🚀 AppComponent inicializado');
  }

  ngOnInit(): void {
    console.log('🔔 Inicializando sistema de notificações...');

    // Aguarda 1 segundo para garantir que o app carregou
    setTimeout(() => {
      this.inicializarNotificacoes();
    }, 1000);

    // ===== LISTENER PARA NAVEGAÇÃO VIA SERVICE WORKER =====
    // (fallback para navegadores que não suportam client.navigate())
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('📨 Mensagem do Service Worker:', event.data);
        
        if (event.data && event.data.type === 'NAVIGATE') {
          console.log('🔄 Navegando para:', event.data.url);
          window.location.href = event.data.url;
        }
      });
    }
  }

  private async inicializarNotificacoes(): Promise<void> {
    try {
      // Verifica se já tem permissão
      const status = this.notificationService.getPermissionStatus();
      console.log('📊 Status atual das notificações:', status);

      if (status === 'granted') {
        console.log('✅ Permissão já concedida - ativando escuta');
        await this.notificationService.solicitarPermissao();
        this.notificationService.escutarMensagens();
      } else if (status === 'default') {
        console.log('❓ Primeira vez - solicitando permissão');
        
        // Mostra um alerta amigável antes de pedir permissão
        this.mostrarAlertaPermissao();
      } else {
        console.log('⛔ Permissão negada - usuário não receberá notificações');
      }

    } catch (error) {
      console.error('❌ Erro ao inicializar notificações:', error);
    }
  }

  /**
   * Mostra um alerta amigável explicando as notificações
   */
  private mostrarAlertaPermissao(): void {
    // Você pode usar um modal do PrimeNG ou um alert simples
    const aceitar = confirm(
      '🔔 Ativar Alertas de Estoque?\n\n' +
      'Receba notificações automáticas quando:\n' +
      '• Produtos ficarem com estoque baixo\n' +
      '• Produtos atingirem estoque crítico\n' +
      '• Produtos esgotarem\n\n' +
      'Clique em OK para ativar.'
    );

    if (aceitar) {
      this.notificationService.solicitarPermissao();
      this.notificationService.escutarMensagens();
    } else {
      console.log('ℹ️ Usuário optou por não ativar notificações');
    }
  }

  /**
   * Método para testar notificação manualmente
   * Pode ser chamado de um botão no menu de configurações
   */
  public testarNotificacao(): void {
    if (this.notificationService.isNotificacoesHabilitadas()) {
      new Notification('🧪 Teste de Notificação', {
        body: 'Se você está vendo isso, as notificações estão funcionando!',
        icon: '/assets/icons/icon-192x192.png',
        vibrate: [200, 100, 200]
      }as NotificationOptions);
    } else {
      alert('Notificações não estão habilitadas. Ative nas configurações do navegador.');
    }
  }
}