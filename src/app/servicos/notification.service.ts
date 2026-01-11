// src/app/servicos/notification.service.ts
import { Injectable } from '@angular/core';
import { Messaging, getToken, onMessage } from '@angular/fire/messaging';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    private tokenSubject = new BehaviorSubject<string | null>(null);
    public token$ = this.tokenSubject.asObservable();

    constructor(
        private messaging: Messaging,
        private http: HttpClient
    ) {
        console.log('🔔 NotificationService inicializado');
    }

    /**
     * Solicita permissão para notificações
     */
    async solicitarPermissao(): Promise<void> {
        try {
            console.log('📢 Solicitando permissão para notificações...');

            if (!('Notification' in window)) {
                console.error('❌ Este navegador não suporta notificações');
                alert('Seu navegador não suporta notificações push. Use Chrome, Firefox ou Edge.');
                return;
            }

            if (!('serviceWorker' in navigator)) {
                console.error('❌ Service Worker não disponível');
                return;
            }

            console.log('🔍 Status atual da permissão:', Notification.permission);

            if (Notification.permission === 'granted') {
                console.log('✅ Permissão já concedida anteriormente');
                await this.obterToken();
                this.escutarMensagensDoServiceWorker(); // 👈 Adicione aqui
                return;
            }

            if (Notification.permission === 'default') {
                console.log('❓ Solicitando permissão ao usuário...');
                const permission = await Notification.requestPermission();

                if (permission === 'granted') {
                    console.log('✅ Permissão concedida!');
                    await this.obterToken();
                } else {
                    console.log('❌ Permissão negada pelo usuário');
                    alert('Você negou as notificações. Para ativar depois, clique no ícone de cadeado na barra de endereço.');
                }
            } else {
                console.log('⛔ Permissão foi negada anteriormente');
            }

        } catch (error) {
            console.error('❌ Erro ao solicitar permissão:', error);
        }
    }

    /**
     * Obtém o token FCM do dispositivo
     */
    private async obterToken(): Promise<void> {
        try {
            console.log('🔑 Obtendo token FCM...');
            console.log('📝 VAPID Key:', environment.vapidKey.substring(0, 20) + '...');

            const registration = await navigator.serviceWorker.register(
                '/admin/firebase-messaging-sw.js'
                //{ scope: '/admin/' }
            );

            console.log('✅ Service Worker registrado:', registration);

            await navigator.serviceWorker.ready;
            console.log('✅ Service Worker pronto');

            const token = await getToken(this.messaging, {
                vapidKey: environment.vapidKey,
                serviceWorkerRegistration: registration
            });

            if (token) {
                console.log('✅ Token FCM obtido com sucesso!');
                console.log('🔑 Token completo:', token);

                this.tokenSubject.next(token);

                await this.inscreverNoTopico(token, 'estoque-alerts');

                this.mostrarNotificacaoTeste();

            } else {
                console.error('❌ Não foi possível obter o token');
            }

        } catch (error: any) {
            console.error('❌ Erro ao obter token:', error);
            console.error('Detalhes:', error.message);

            if (error.code === 'messaging/failed-service-worker-registration') {
                console.error('⚠️ Problema com Service Worker. Verifique se firebase-messaging-sw.js existe em /src/');
            }
        }
    }

/**
 * Escuta mensagens quando app está em foreground
 * 🔥 CORREÇÃO: Usa Service Worker para suportar actions
 */
escutarMensagens(): void {
    console.log('👂 Iniciando escuta de mensagens...');

    onMessage(this.messaging, async (payload) => {
        console.log('📨 ===== MENSAGEM RECEBIDA (APP ABERTO) =====');
        console.log('📬 Payload completo:', payload);

        // Extrai dados do payload
        const titulo = payload.data?.['titulo'] || 'Alerta de Estoque';
        const corpo = payload.data?.['corpo'] || 'Verifique o sistema';
        const tipo = payload.data?.['tipo'] || 'info';
        const url = payload.data?.['url'] || '/admin/main/produtos';
        const idPeca = payload.data?.['idPeca'] || '';

        console.log('📋 Dados extraídos:');
        console.log('   Título:', titulo);
        console.log('   Corpo:', corpo);
        console.log('   Tipo:', tipo);
        console.log('   URL:', url);

        // 🔥 USA SERVICE WORKER para mostrar notificação (suporta actions)
        try {
            const registration = await navigator.serviceWorker.ready;
            
            await registration.showNotification(titulo, {
                body: corpo,
                icon: '/admin/favicon.ico',
                badge: '/admin/favicon.ico',
                tag: `estoque-${tipo}-${idPeca}`,
                requireInteraction: true,
                vibrate: [200, 100, 200],
                data: { 
                    url,
                    tipo,
                    idPeca,
                    timestamp: Date.now()
                },
                actions: [
                    {
                        action: 'open',
                        title: '📦 Ver Produto'
                    },
                    {
                        action: 'close',
                        title: 'Fechar'
                    }
                    ] as any
                } as NotificationOptions);

            console.log('✅ Notificação mostrada via Service Worker');

        } catch (error) {
            console.error('❌ Erro ao mostrar notificação:', error);
            
            // Fallback: notificação simples sem actions
            if (Notification.permission === 'granted') {
                const notification = new Notification(titulo, {
                    body: corpo,
                    icon: '/admin/favicon.ico',
                    badge: '/admin/favicon.ico',
                    tag: `estoque-${tipo}`
                });

                notification.onclick = (event) => {
                    event.preventDefault();
                    window.focus();
                    window.location.href = url;
                    notification.close();
                };
            }
        }

        // Toast interno (se você usar)
        this.mostrarToastInterno(titulo, corpo, tipo);
    });

    console.log('✅ Escuta de mensagens ativa');
}

// Adicione este método na classe NotificationService

/**
 * Escuta mensagens do Service Worker
 */
private escutarMensagensDoServiceWorker(): void {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('message', (event) => {
            console.log('📨 Mensagem do Service Worker:', event.data);
            
            if (event.data?.type === 'NOTIFICATION_CLICKED') {
                // Você pode fazer algo quando a notificação for clicada
                console.log('🖱️ Notificação clicada:', event.data.url);
            }
        });
    }
}

    /**
     * Inscreve o token em um tópico do Firebase
     */
    private async inscreverNoTopico(token: string, topico: string): Promise<void> {
        try {
            console.log(`📢 Inscrevendo no tópico: ${topico}`);

            const response = await this.http.post<any>(
                `${environment.apiURL}/api/notifications/subscribe`,
                { token, topic: topico }
            ).toPromise();

            console.log(`✅ Inscrito no tópico: ${topico}`, response);

        } catch (error) {
            console.error(`❌ Erro ao inscrever no tópico ${topico}:`, error);
        }
    }

    /**
     * Mostra uma notificação de teste para confirmar que está funcionando
     */
    private mostrarNotificacaoTeste(): void {
        if (Notification.permission === 'granted') {
            console.log('🧪 Mostrando notificação de teste...');

            const notification = new Notification('Sistema de Alertas Ativo! 🎉', {
                body: 'Você receberá notificações quando o estoque estiver baixo, crítico ou zerado.',
                icon: '/admin/favicon.ico',
                badge: '/admin/favicon.ico',
                tag: 'estoque-alert'
            } as NotificationOptions);

            setTimeout(() => notification.close(), 5000);
        }
    }

    /**
     * Mostra toast interno do Angular (se você tiver MessageService do PrimeNG)
     */
    private mostrarToastInterno(titulo: string, corpo: string, tipo: string): void {
        // Se você estiver usando PrimeNG Toast, descomente:
        /*
        const severity = tipo === 'ZERADO' ? 'error' 
                       : tipo === 'CRITICO' ? 'warn'
                       : 'info';
        
        this.messageService.add({
          severity,
          summary: titulo,
          detail: corpo,
          life: tipo === 'CRITICO' ? 0 : 5000
        });
        */

        console.log('💬 Toast interno:', { titulo, corpo, tipo });
    }

    /**
     * Verifica se notificações estão habilitadas
     */
    isNotificacoesHabilitadas(): boolean {
        return Notification.permission === 'granted';
    }

    /**
     * Obtém o status da permissão
     */
    getPermissionStatus(): NotificationPermission {
        return Notification.permission;
    }

    /**
     * Remove inscrição de um tópico
     */
    async desinscreverDoTopico(topico: string): Promise<void> {
        const token = this.tokenSubject.value;
        if (!token) {
            console.error('❌ Sem token para desinscrever');
            return;
        }

        try {
            await this.http.post(
                `${environment.apiURL}/api/notifications/unsubscribe`,
                { token, topic: topico }
            ).toPromise();

            console.log(`✅ Desinscrito do tópico: ${topico}`);
        } catch (error) {
            console.error(`❌ Erro ao desinscrever do tópico ${topico}:`, error);
        }
    }
}