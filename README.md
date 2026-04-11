# Fashion Store Admin

## 📋 Visão Geral

O **Fashion Store Admin** é um painel administrativo construído em Angular 20 para gerenciar operações de uma loja de moda e acessórios. O projeto foi concebido para oferecer um controle completo sobre produtos, categorias, pedidos, clientes, finanças e logística, com foco em experiência de usuário e manutenção sustentável.

## 🎯 Objetivo

Esta aplicação auxilia equipes de operações e vendas a:
- Controlar o catálogo de produtos, variações, cores e tamanhos
- Gerenciar imagens, estoques e registros automáticos de inventário
- Processar pedidos e acompanhar status
- Administrar clientes, usuários e permissões
- Registrar operações financeiras e fretes
- Monitorar indicadores por meio de dashboards

## 🛠️ Tecnologias Principais

- Angular 20.3.13
- PrimeNG 20.3.0 + PrimeIcons
- Firebase (Authentication, Firestore, Messaging)
- CKEditor 5
- Chart.js 4.5.1
- DataTables.net
- Moment.js, JWT Decode, RxJS
- Angular CLI 20.1.3
- Progressive Web App (PWA)

## 📁 Estrutura do Projeto

- `src/app/componentes/` — componentes standalone organizados por domínio
- `src/app/servicos/` — serviços responsáveis por chamada HTTP e lógica de negócio
- `src/app/model/` — modelos de domínio, interfaces e tipos
- `src/app/dto/` — DTOs para comunicação com a API
- `src/app/guards/` — proteção e autorização de rotas
- `src/app/interceptors/` — interceptadores para JWT e tratamento de erros
- `src/environments/` — configuração de ambiente para dev e prod

## 🧩 Funcionalidades Principais

- Dashboard com métricas e gráficos de venda
- CRUD de produtos, categorias, variações, cores e tamanhos
- Upload de imagens com drag-and-drop e preview
- Gestão de pedidos com filtros avançados
- Cadastro e controle de clientes e usuários
- Controle de formas de pagamento e fretes
- Integração de notificações Firebase
- Suporte a PWA para uso offline básico

## 📋 Pré-requisitos

Instale antes de começar:
- Node.js 18+
- npm 10+
- Angular CLI global (`npm install -g @angular/cli`)
- Conta Firebase para autenticação e base de dados

## 🚀 Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/gajonuco/pecasbr-admin.git
   cd pecasbr-admin
   ```
2. Instale dependências:
   ```bash
   npm install
   ```
3. Configuração Firebase:
   - Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
   - Ative Authentication, Firestore e Messaging
   - Atualize `src/environments/environment.ts` e `src/environments/environment.prod.ts`
4. Configure a API backend e demais variáveis de ambiente.

## ⚙️ Configuração do Ambiente

### Exemplo de `src/environments/environment.ts`
```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_PROJECT.firebaseapp.com',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_PROJECT.appspot.com',
    messagingSenderId: 'YOUR_SENDER_ID',
    appId: 'YOUR_APP_ID'
  },
  apiUrl: 'https://api.fashionstore.example.com/api'
};
```

## ▶️ Execução

### Desenvolvimento
```bash
npm start
# ou
npm start
# ou
ng serve
```
Acesse `http://localhost:4200/`.

### Produção
```bash
npm run build
# ou
ng build --configuration production
```
Saída: `dist/fashion_store_admin/browser/`

### Comandos úteis
- `ng serve --port 4201`
- `ng serve --host 0.0.0.0`
- `ng serve --ssl`

## 🧪 Testes

Execute testes unitários:
```bash
npm test
# ou
ng test
```

## 🔗 Integração com Backend

O frontend consome APIs RESTful idealmente implementadas em Java/Spring Boot.

### Endpoints esperados
- `POST /auth/login`
- `GET /api/produtos`
- `POST /api/produtos`
- `PUT /api/produtos/{id}`
- `GET /api/pedidos`
- `GET /api/usuarios`
- `GET /api/relatorios/vendas`

### Configuração de API
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://api.fashionstore.com/api'
};
```

## 📱 Progressive Web App (PWA)

O projeto oferece recursos PWA:
- Service Worker para cache de conteúdo
- Manifest Web App para instalação
- Push Notifications via Firebase
- Modo offline para navegação básica

### Testando PWA localmente
```bash
npm run build
npx http-server dist/fashion_store_admin/browser -p 8080
```
Acesse `http://localhost:8080`.

## 🚀 Deploy

### Firebase Hosting
1. Instale o Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. Faça login:
   ```bash
   firebase login
   ```
3. Inicialize:
   ```bash
   firebase init hosting
   ```
4. Deploy:
   ```bash
   npm run build
   firebase deploy
   ```

### Alternativas
- Vercel / Netlify
- AWS S3 + CloudFront
- Docker / Kubernetes

## ⚡ Performance e Qualidade

### Otimizações
- Lazy loading de módulos
- Uso de `OnPush` quando aplicável
- Minificação e tree-shaking via Angular CLI
- Cache de assets estáticos

### Análise de bundle
```bash
npm install -g webpack-bundle-analyzer
ng build --stats-json
npx webpack-bundle-analyzer dist/fashion_store_admin/browser/stats.json
```

## 🧠 Boas Práticas

- Organização por domínio funcional
- Separação entre UI, serviços e modelos
- Documentação de contratos de API
- Commits claros e revisão de PRs

## 🛠️ Troubleshooting

### Problemas comuns
- Falha no `npm install`: limpe cache e reinstale
- Build falha: valide `environment.ts`
- Autenticação não funciona: verifique token JWT e regras do Firebase
- PWA não registra: use HTTPS ou `ng serve --ssl`

### Diagnóstico
- `ng serve --verbose`
- Console do navegador
- Aba Network do DevTools
- Firebase Console para logs

## 🤝 Contribuição

1. Fork o repositório
2. Crie uma branch de feature
3. Faça commits atômicos
4. Abra Pull Request
5. Atualize documentação e testes

### Convenções
- Use Prettier
- Siga Angular Style Guide
- Garanta cobertura e builds estáveis

## 🗺️ Roadmap

- [ ] Internacionalização (i18n)
- [ ] Pagamentos externos
- [ ] Relatórios customizados
- [ ] Atualizações em tempo real
- [ ] Insights de vendas

## 📝 Changelog

### v1.0.0
- Implementação inicial do painel administrativo
- Integração com Firebase
- Suporte a PWA e upload drag-and-drop

## 📄 Licença

Licenciado sob MIT.
