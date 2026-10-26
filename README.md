# PeçasBR Admin

## Visão geral

**PeçasBR Admin** é o painel administrativo (Angular 20, *standalone components*) usado para operar a loja **PeçasBR** — o mesmo domínio de produto do front-end de vendas [`pecasbr-loja`](https://github.com/gajonuco/pecasbr-loja). Internamente o repositório/projeto Angular ainda carrega nomes de uma versão anterior do produto: `package.json`/`angular.json` usam `pecasbr-admin`/`pecasbr_admin`, mas o título em runtime (`app.ts`) e o nome do projeto Firebase (`oficina-mecanica-pwa`) ainda dizem "Oficina Mecânica" — a marca já exibida ao usuário, porém, é **PeçasBR Admin** (ver `index.html` e `manifest.webmanifest`).

A aplicação é publicada sob o caminho **`/admin/`** (`baseHref`/`deployUrl` em `angular.json`, `scope` do manifesto PWA) — ou seja, espera-se que rode como uma rota/subdomínio administrativo ao lado da loja, não isoladamente na raiz do domínio.

Módulos cobertos pelo painel:

- dashboard com ranking de produtos mais pedidos e últimos pedidos
- catálogo: categorias, produtos (com variações de cor/tamanho, galeria de imagens com upload *drag-and-drop* e descrição em rich text)
- pedidos: filtros por status, troca de status e geração de registro financeiro (parcelas) ao confirmar pagamento
- financeiro: acompanhamento e alteração de status dos registros/parcelas geradas a partir dos pedidos
- formas de pagamento e fretes (CRUD)
- clientes (CRUD, busca por letra/palavra-chave, preenchimento de endereço via CEP)
- usuários administrativos (listagem, ativar/inativar, criação/edição)
- notificações push (Firebase Cloud Messaging) de alertas de estoque baixo/crítico/zerado

## Tecnologias principais

- Angular 20.3 (componentes *standalone*; builder clássico `@angular-devkit/build-angular:browser`, não o builder esbuild usado no front-end de vendas)
- PrimeNG 20.3 (tema Lara) + PrimeIcons — componentes de formulário, tabelas e diálogos
- DataTables.net + jQuery (carregados como scripts globais) — grades de dados nas telas de listagem
- Bootstrap 5 e Font Awesome Pro — via CDN em `index.html` (toasts, layout, ícones)
- CKEditor 5 (build *classic*) — descrição rica de produtos e categorias
- Chart.js 4 — registrado globalmente em `main.ts`; carregado tanto via npm quanto via CDN em `index.html` (duplicado)
- `@angular/fire` + `firebase` — **apenas Firebase Cloud Messaging** (push notifications); não há uso de Firebase Authentication nem Firestore no código atual
- `jwt-decode`, `moment`
- `@angular/service-worker` — dependência presente, mas o service worker do Angular está **desativado no build de produção** (ver [Observações técnicas](#observações-técnicas-e-débito-conhecido))
- Karma, Jasmine e Angular TestBed — testes unitários (35 arquivos `*.spec.ts`)

## Estrutura do projeto

```
src/
├── app/
│   ├── componentes/
│   │   ├── login/                    # autenticação (JWT)
│   │   ├── main/                     # shell da área logada (layout + <router-outlet>)
│   │   ├── dashboard/                # ranking de produtos e últimos pedidos
│   │   ├── ranking-produto/, ultimos-pedidos/, grafico-vendas/, aniversariantes/  # widgets do dashboard
│   │   ├── categorias/, editor-categoria/
│   │   ├── produtos/, editor-produto/, editor-variacoes/, upload-imagem-drag-drop/
│   │   ├── pedidos/                  # listagem, filtro, status, geração de financeiro
│   │   ├── financeiro/               # registros financeiros/parcelas
│   │   ├── pagamentos/, editor-pagamentos/
│   │   ├── fretes/, editor-frete/
│   │   ├── clientes/
│   │   └── usuarios/, editor-usuario/
│   ├── servicos/                     # chamadas HTTP por domínio
│   ├── model/                        # classes/interfaces de domínio
│   ├── dto/                          # payloads e filtros usados pela API
│   ├── guards/auth.guard.ts          # protege a árvore de rotas /main
│   └── interceptors/auth.interceptor.ts  # injeta Bearer token e trata 401/403/413
├── environments/                     # environment.ts (dev) / environment.prod.ts
├── firebase-messaging-sw.js          # service worker do Firebase Cloud Messaging
└── manifest.webmanifest              # nome "PeçasBR Admin", scope /admin/

public/            # favicon, ícones do manifesto e logo (servidos na raiz do build, fora de src/)
angular.json        # projeto "pecasbr_admin"; baseHref/deployUrl "/admin/"
```

## Rotas

| Caminho                          | Componente        | Observação                          |
|-----------------------------------|--------------------|---------------------------------------|
| `/`                                | `Login`             | tela de autenticação                  |
| `/main`                            | `Main`              | shell protegido por `AuthGuard`; redireciona para `dashboard` |
| `/main/dashboard`                  | `Dashboard`         |                                        |
| `/main/categorias`                 | `Categorias`        |                                        |
| `/main/editor-categoria/:id`       | `EditorCategoria`   | `:id` novo ou existente               |
| `/main/produtos`                   | `Produtos`          |                                        |
| `/main/editor-produto/:id`         | `EditorProduto`     |                                        |
| `/main/pedidos`                    | `Pedidos`           |                                        |
| `/main/financeiro`                 | `Financeiro`        |                                        |
| `/main/pagamentos`                 | `Pagamentos`        |                                        |
| `/main/editor-pagamentos/:id`      | `EditorPagamentos`  |                                        |
| `/main/fretes`                     | `Fretes`            |                                        |
| `/main/editor-frete/:id`           | `EditorFrete`       |                                        |
| `/main/clientes`                   | `Clientes`          |                                        |
| `/main/usuarios`                   | `Usuarios`          |                                        |
| `/main/editor-usuario/:id`         | `EditorUsuario`     |                                        |
| `**`                               | —                   | redireciona para `/`                  |

## Funcionalidades por módulo

**Autenticação**
- login via `POST /login` (API própria — **não é Firebase Authentication**); token JWT salvo em `localStorage` sob a chave `Token` (diferente da chave `clienteToken` usada pelo front-end de vendas)
- `TokenService` valida expiração do JWT no cliente (`jwt-decode`); `AuthGuard` protege toda a árvore `/main`
- `AuthInterceptor` (baseado em classe/`HTTP_INTERCEPTORS`, diferente do interceptor funcional do `pecasbr-loja`) injeta o Bearer token, desloga e redireciona em respostas 401/403, e alerta especificamente em 413 (payload grande — ex.: upload de imagem)

**Dashboard**
- `RankingProduto` (produtos mais pedidos) e `UltimosPedidos` são exibidos
- `GraficoVendas` (Chart.js) e `Aniversariantes` existem como componentes e são importados no `Dashboard`, mas **não aparecem no template atual** — o bloco de aniversariantes está comentado em `dashboard.html` e o gráfico de vendas não é incluído em lugar nenhum

**Categorias** — listagem e editor dedicado (CKEditor para descrição)

**Produtos**
- listagem com toggles de **destaque**, **disponível** e **pronta entrega**, todos bloqueados quando o produto está sem estoque
- busca de compradores por produto (modal)
- editor de produto: descrição em rich text (CKEditor), upload de imagens por *drag-and-drop* (múltiplas, com imagem principal e reordenação) e editor de variações de cor/tamanho com controle de estoque por variação

**Pedidos**
- filtro por status (`FiltroPedidoDTO`) e fluxo de status: `NOVO_PEDIDO → PAGO → EM_TRANSPORTE → ENTREGUE → PÓS-VENDA → FINALIZADO` (ou `CANCELADO`)
- modal de detalhe/edição do pedido
- ao marcar um pedido como pago, abre modal para gerar o **registro financeiro** (forma de pagamento, dia de vencimento, número de parcelas)

**Financeiro** — lista os registros/parcelas gerados a partir dos pedidos, permite alterar status (inclusive excluir, com confirmação)

**Pagamentos** e **Fretes** — CRUD simples (listagem + editor dedicado); fretes também tem toggle de disponibilidade na própria listagem

**Clientes** — listagem com filtro por letra inicial ou palavra-chave, criação/edição via modal, preenchimento automático de endereço por CEP (ver nota sobre o provedor usado)

**Usuários** — listagem de usuários administrativos, ativar/inativar diretamente na lista, criação/edição via `EditorUsuario`

**Notificações push (estoque)**
- ao carregar o app, `NotificationService` solicita permissão do navegador (via `confirm()`) e, se concedida, obtém um token FCM e se inscreve no tópico `estoque-alerts` (`POST /api/notifications/subscribe`)
- mensagens em primeiro plano são tratadas por `NotificationService.escutarMensagens()`; em segundo plano, por `firebase-messaging-sw.js` — ambos mostram notificações nativas com ação "Ver produto/pedido" que navega para a página relevante
- usado hoje para alertas de estoque baixo/crítico/zerado (tipo `PAGAMENTO` também previsto no *service worker*)

## Integrações e serviços externos

| Serviço | Uso | Observação |
|---|---|---|
| API REST própria (`environment.apiURL`) | login, produtos, categorias, pedidos, financeiro, pagamentos, fretes, clientes, usuários, upload de imagens, inscrição em notificações | backend não incluído neste repositório |
| [ViaCEP](https://viacep.com.br) | preenchimento de endereço (clientes) | **diferente** da API de CEP usada pelo `pecasbr-loja` (que usa opencep.com) — vale alinhar se isso não for intencional |
| Firebase Cloud Messaging | push notifications de alertas de estoque | único uso de Firebase no projeto; não há Authentication nem Firestore |

## Configuração de ambiente

`src/environments/environment.ts` (dev) e `environment.prod.ts` (prod) definem:

- `apiURL` — base da API REST
- `imageURL` — base para exibição de imagens de produto já hospedadas
- `firebase` — config do projeto Firebase (`oficina-mecanica-pwa`) usado só para Messaging
- `vapidKey` — chave pública VAPID para registro de push notifications

> As credenciais do Firebase (incluindo a VAPID key) estão versionadas em texto puro nesses arquivos e também duplicadas em `src/firebase-messaging-sw.js`. Chaves web do Firebase não são, por si só, segredos de servidor, mas vale confirmar que as regras de segurança do projeto Firebase (`oficina-mecanica-pwa`) estão corretamente restritas antes de contar com isso em produção.

O `fileReplacement` de produção é aplicado automaticamente pelo `angular.json` ao rodar `ng build` (configuração padrão `production`).

## Scripts disponíveis

- `npm start` — `ng serve`
- `npm run build` — build de produção em `dist/pecasbr_admin/browser/`
- `npm run watch` — build em modo *watch*, configuração de desenvolvimento
- `npm test` — testes unitários via Karma/Jasmine (35 arquivos `*.spec.ts`)

## Setup local

### Requisitos

- Node.js 18+ (compatível com Angular CLI 20.3)
- npm 10+
- uma instância da API backend acessível (ver `environment.ts` para a URL esperada em desenvolvimento: `http://localhost:8080`)
- um projeto Firebase com **Cloud Messaging** habilitado, caso queira testar as notificações push (não é necessário para as demais funcionalidades)

### Instalar dependências

```bash
npm install
```

### Executar em desenvolvimento

```bash
npm start
```

Acesse `http://localhost:4200/admin/` (o `baseHref` configurado é `/admin/`). Diferente do `pecasbr-loja`, este projeto não tem `proxy.conf.json`: as chamadas vão direto para a `apiURL` configurada em `environment.ts`, então ajuste-a ou garanta CORS liberado na API local.

### Build de produção

```bash
npm run build
```

Saída em `dist/pecasbr_admin/browser/`, pronta para ser servida sob o caminho `/admin/`.

## Testes

```bash
npm test
```

Karma + Jasmine (builder clássico `@angular-devkit/build-angular:karma`), cobrindo componentes, serviços, guard e interceptor. Não há testes end-to-end configurados.

## PWA e notificações

- o manifesto (`manifest.webmanifest`) declara o app como "PeçasBR Admin" / "Manager", com `scope` e `start_url` em `/admin/`
- **não há cache offline via Angular Service Worker**: `angular.json` define `"serviceWorker": false` na configuração de produção, apesar de `@angular/service-worker` constar como dependência e de existirem arquivos de configuração (`ngsw-confg.json` — note o nome com erro de digitação — e `ngsw-config.json.bak`) não referenciados em lugar nenhum
- o único *service worker* efetivamente registrado é `firebase-messaging-sw.js`, usado exclusivamente para receber notificações push em segundo plano

## Observações técnicas e débito conhecido

- **PWA/offline**: ver seção acima — o app não funciona offline apesar de ter manifesto PWA; só o canal de push está ativo.
- **Firebase**: a dependência `@angular/fire` cobre Auth/Firestore/Messaging, mas só Messaging é usado. O login é 100% via API própria (JWT), não via Firebase.
- **Widgets do dashboard não conectados**: `GraficoVendas` e `Aniversariantes` existem, têm serviços de apoio prontos (`PedidosServico.recuperarTotaisDaSemana`, `ClienteServico.buscarAniversariantes`) mas não estão no template do `Dashboard` atualmente — `Aniversariantes` está comentado, `GraficoVendas` não é referenciado em HTML algum.
- **CEP divergente entre os dois repositórios**: este admin usa ViaCEP; o `pecasbr-loja` usa opencep.com. Mesma necessidade (consulta de CEP), provedores diferentes.
- **`angular.json` aponta para `src/public`** na configuração de teste, mas os assets estáticos reais (favicon, ícones, logo) estão em `public/` na raiz do projeto — a pasta `src/public` não existe no repositório.
- **Padrões de autenticação divergentes do `pecasbr-loja`**: aqui o guard e o interceptor são baseados em classe (`CanActivate`, `HTTP_INTERCEPTORS`); no front-end de vendas são funções (`CanActivateFn`, `HttpInterceptorFn`). Funciona, mas vale unificar se os dois projetos forem evoluir juntos.
- Há bastante `console.log`/emojis de depuração deixados em serviços de notificação e em alguns componentes (ex.: `produtos.ts`, `login.ts`) — útil durante o desenvolvimento das notificações push, mas vale revisar antes de um build final de produção.

## Próximos passos recomendados

- decidir se `GraficoVendas` e `Aniversariantes` voltam ao dashboard ou são removidos
- avaliar reativar o Angular Service Worker (cache de assets) já que o manifesto PWA já existe, ou remover as referências a PWA offline da documentação/ícones se isso não for prioridade
- unificar o provedor de CEP usado entre `pecasbr-admin` e `pecasbr-loja`
- migrar guard/interceptor para a API funcional usada no `pecasbr-loja`, se a consistência entre os dois repositórios for desejada
- adicionar testes E2E para os fluxos de pedido → financeiro e produto → variações/imagens
- revisar e reduzir os logs de depuração antes de builds de produção

---

Desenvolvido para operar o catálogo, pedidos e atendimento da loja PeçasBR.
