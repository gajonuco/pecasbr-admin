// src/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

console.log('🔧 [SW] Carregando Service Worker...');

firebase.initializeApp({
    apiKey: "AIzaSyAjt1KtbR8Nm2wMLagbOU5X_2kMHlyxOVA",
    authDomain: "oficina-mecanica-pwa.firebaseapp.com",
    projectId: "oficina-mecanica-pwa",
    storageBucket: "oficina-mecanica-pwa.firebasestorage.app",
    messagingSenderId: "382668018602",
    appId: "1:382668018602:web:4caa3d2624eb5541ecd1d3",
    measurementId: "G-8HQ40153L7"
});

const messaging = firebase.messaging();
console.log('✅ [SW] Firebase Messaging inicializado');

// ===== RECEBE NOTIFICAÇÕES EM BACKGROUND =====
messaging.onBackgroundMessage((payload) => {
  console.log('📬 [SW] ===== NOTIFICAÇÃO EM BACKGROUND =====');
  console.log('[SW] Payload completo:', payload);
  
  // 🔥 CORREÇÃO: Busca dados de payload.data (não payload.notification)
  // Agora o backend envia apenas "data", sem campo "notification"
  const titulo = payload.data?.titulo || 'Alerta de Estoque';
  const corpo = payload.data?.corpo || 'Verifique o sistema';
  const tipo = payload.data?.tipo || 'info';
  const idPeca = payload.data?.idPeca || '';
  const targetUrl = payload.data?.url || 'https://www.projetoreal.dev.br/admin/main/produtos';
  
  console.log('[SW] 📋 Dados extraídos:');
  console.log('   Título:', titulo);
  console.log('   Corpo:', corpo);
  console.log('   Tipo:', tipo);
  console.log('   ID Peça:', idPeca);
  console.log('   🎯 Target URL:', targetUrl);

  const options = {
    body: corpo,
    icon: '/admin/favicon.ico',
    badge: '/admin/favicon.ico',
    vibrate: [200, 100, 200, 100, 200],
    tag: `estoque-${tipo}-${idPeca}`,
    renotify: true,
    requireInteraction: tipo === 'CRITICO' || tipo === 'ZERADO',
    data: {
      url: targetUrl,
      tipo: tipo,
      idPeca: idPeca,
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
    ]
  };

  console.log('[SW] ✅ Mostrando notificação customizada (única)');
  return self.registration.showNotification(titulo, options);
});

// ===== CLIQUE NA NOTIFICAÇÃO =====
self.addEventListener('notificationclick', (event) => {
  console.log('🖱️ [SW] ===== CLIQUE NA NOTIFICAÇÃO =====');
  console.log('[SW] Action:', event.action);
  console.log('[SW] Data:', event.notification.data);
  
  event.notification.close();

  if (event.action === 'close') {
    console.log('[SW] ❌ Usuário fechou a notificação');
    return;
  }

  const targetUrl = event.notification.data?.url;
  
  if (!targetUrl) {
    console.error('[SW] ❌ URL não encontrada nos dados da notificação');
    return;
  }

  console.log('[SW] 🎯 Redirecionando para:', targetUrl);

 // 👇 Notifica o app que a notificação foi clicada
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        clientList.forEach(client => {
          client.postMessage({
            type: 'NOTIFICATION_CLICKED',
            url: targetUrl,
            data: event.notification.data
          });
        });
        return handleNotificationClick(targetUrl);
      })
  );
});

/**
 * Função otimizada para gerenciar cliques
 */
async function handleNotificationClick(url) {
  try {
    console.log('[SW] 🔍 Buscando janelas abertas...');
    
    const clientList = await clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    });

    console.log(`[SW] 📊 Janelas encontradas: ${clientList.length}`);

    // Tenta encontrar uma janela do mesmo domínio
    for (const client of clientList) {
      const clientUrl = new URL(client.url);
      const targetUrlObj = new URL(url);
      
      console.log('[SW] 📍 Verificando cliente:', {
        clientOrigin: clientUrl.origin,
        targetOrigin: targetUrlObj.origin,
        match: clientUrl.origin === targetUrlObj.origin
      });

      // Se é do mesmo domínio, foca e navega
      if (clientUrl.origin === targetUrlObj.origin) {
        console.log('[SW] ✅ Encontrou janela do mesmo domínio');
        
        await client.focus();
        
        if ('navigate' in client) {
          console.log('[SW] ✅ Navegando via client.navigate()');
          await client.navigate(url);
          return client;
        } else {
          console.log('[SW] ⚠️ Navegando via postMessage');
          client.postMessage({
            type: 'NAVIGATE',
            url: url
          });
          return client;
        }
      }
    }

    // Se não encontrou janela do mesmo domínio, abre nova
    console.log('[SW] 🆕 Abrindo nova janela...');
    const newClient = await clients.openWindow(url);
    
    if (newClient) {
      console.log('[SW] ✅ Nova janela aberta com sucesso');
      return newClient;
    } else {
      console.error('[SW] ❌ Falha ao abrir nova janela');
    }

  } catch (error) {
    console.error('[SW] ❌ ERRO:', error);
    
    // Fallback: força abertura
    try {
      console.log('[SW] 🔄 Tentando fallback com openWindow...');
      return await clients.openWindow(url);
    } catch (fallbackError) {
      console.error('[SW] ❌ Fallback falhou:', fallbackError);
    }
  }
  
  return null;
}

// ===== LISTENER PARA MENSAGENS =====
self.addEventListener('message', (event) => {
  console.log('[SW] 📨 Mensagem recebida:', event.data);
  
  if (event.data?.type === 'NAVIGATE') {
    console.log('[SW] 🔄 Navegação solicitada');
  }
});

// ===== INSTALAÇÃO =====
self.addEventListener('install', (event) => {
  console.log('📥 [SW] Instalando...');
  self.skipWaiting();
});

// ===== ATIVAÇÃO =====
self.addEventListener('activate', (event) => {
  console.log('✅ [SW] Ativado');
  event.waitUntil(clients.claim());
});

console.log('🎯 [SW] Service Worker pronto!');