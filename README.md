# SMS BRA - Frontend Integrado com API

Frontend completamente integrado com a API real do backend, mantendo o design minimalista do Ant Design.

## 🚀 Tecnologias Utilizadas

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Ant Design (antd)** - Biblioteca de componentes UI
- **CSS Modules** - Estilização modular
- **Axios** - Cliente HTTP para API
- **js-cookie** - Gerenciamento de cookies
- **React Context** - Gerenciamento de estado global

## ✨ Características da Integração

### API Real Integrada
- **Serviços completos** para autenticação, SMS, créditos e pagamentos
- **Interceptors HTTP** para tratamento automático de tokens
- **Tratamento de erros** robusto com feedback visual
- **Estados de loading** em todas as operações

### Autenticação Completa
- **Login/Logout** com JWT tokens
- **Registro de usuários** com validação
- **Proteção de rotas** automática
- **Refresh token** automático
- **Persistência de sessão** via cookies

### Gerenciamento de Estado
- **Context API** integrado com serviços reais
- **Estados globais** sincronizados com backend
- **Cache inteligente** de dados
- **Atualizações em tempo real**

## 📱 Funcionalidades Integradas

### 🔐 **Autenticação**
- Login com email/senha via API
- Registro de novos usuários
- Logout com limpeza de tokens
- Recuperação automática de sessão
- Tratamento de tokens expirados

### 📊 **Dashboard**
- Estatísticas em tempo real da API
- Lista de números SMS ativos
- Criação de novos números via API
- Atualização de status automática
- Cancelamento de números

### 💳 **Compra de Créditos**
- Pacotes carregados da API
- Integração com gateways de pagamento
- Processamento PIX e cartão
- Histórico de transações
- Atualização automática de saldo

### 📱 **Gerenciamento SMS**
- Listagem de números via API
- Status em tempo real
- Códigos recebidos automaticamente
- Histórico completo
- Filtros e paginação

## 🛠 Configuração da API

### Variáveis de Ambiente
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Endpoints Integrados
```typescript
// Autenticação
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET  /api/auth/profile

// SMS
GET  /api/sms/numbers
POST /api/sms/numbers
GET  /api/sms/services
GET  /api/sms/countries
POST /api/sms/numbers/:id/refresh
POST /api/sms/numbers/:id/cancel

// Créditos
GET  /api/credits/packages
POST /api/credits/purchase
GET  /api/credits/transactions
GET  /api/credits/balance

// Pagamentos
GET  /api/payments/methods
POST /api/payments/pix
POST /api/payments/credit-card
GET  /api/payments/:id/status
```

## 🔧 Como Executar

### Pré-requisitos
- Node.js 18+
- Backend SMS BRA rodando na porta 5000
- Banco de dados configurado

### Instalação
```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Editar .env.local com a URL da API

# Executar em desenvolvimento
npm run dev

# Acessar aplicação
http://localhost:3000
```

### Build para Produção
```bash
# Gerar build otimizado
npm run build

# Executar build
npm start
```

## 📁 Estrutura da Integração

```
src/
├── lib/
│   └── api.ts              # Configuração Axios
├── services/               # Serviços da API
│   ├── auth.ts            # Autenticação
│   ├── sms.ts             # SMS e números
│   ├── credits.ts         # Créditos e pacotes
│   └── payments.ts        # Pagamentos
├── contexts/
│   └── AppContext.tsx     # Estado global integrado
└── app/                   # Páginas integradas
    ├── login/             # Login com API
    ├── register/          # Registro com API
    ├── dashboard/         # Dashboard com dados reais
    └── buy-credits/       # Compra integrada
```

## 🔒 Segurança Implementada

### Autenticação
- **JWT Tokens** com expiração automática
- **Refresh tokens** para renovação
- **Interceptors** para injeção automática
- **Logout automático** em caso de token inválido

### Proteção de Dados
- **HTTPS** obrigatório em produção
- **Cookies seguros** com flags apropriadas
- **Sanitização** de inputs
- **Validação** client-side e server-side

### Tratamento de Erros
- **Interceptors** para erros HTTP
- **Fallbacks** para falhas de rede
- **Mensagens** de erro amigáveis
- **Logs** detalhados para debug

## 🧪 Funcionalidades Testadas

### Integração Completa
- ✅ Autenticação com backend real
- ✅ Carregamento de dados via API
- ✅ Estados de loading e erro
- ✅ Navegação protegida
- ✅ Persistência de sessão
- ✅ Refresh automático de dados

### Fluxos Principais
- ✅ Login → Dashboard → Logout
- ✅ Registro → Verificação → Dashboard
- ✅ Criação de números SMS
- ✅ Compra de créditos
- ✅ Atualização de status

## 🚀 Deploy em Produção

### Configurações Necessárias
```bash
# Variáveis de produção
NEXT_PUBLIC_API_URL=https://api.smsbra.com/api
NODE_ENV=production
```

### Plataformas Suportadas
- **Vercel** (recomendado para Next.js)
- **Netlify** com adaptações
- **AWS Amplify** 
- **Servidor próprio** com Node.js

### Checklist de Deploy
- [ ] Configurar variáveis de ambiente
- [ ] Testar conexão com API de produção
- [ ] Configurar domínio e SSL
- [ ] Testar fluxos críticos
- [ ] Monitorar logs e erros

## 📝 Diferenças da Versão Mock

### Dados Reais
- **Substituição completa** dos dados mock
- **Integração real** com backend
- **Estados de loading** reais
- **Tratamento de erros** da API

### Funcionalidades Ativas
- **Autenticação** funcional
- **CRUD** de números SMS
- **Transações** reais
- **Pagamentos** integrados

### Dependências do Backend
- **Requer backend** rodando
- **Banco de dados** configurado
- **APIs externas** (SMS Active, pagamentos)
- **Variáveis de ambiente** configuradas

## 🔧 Troubleshooting

### Problemas Comuns
```bash
# Erro de conexão com API
- Verificar se backend está rodando
- Conferir URL da API no .env.local
- Verificar CORS no backend

# Token expirado
- Logout automático implementado
- Refresh token automático
- Verificar configuração JWT no backend

# Dados não carregam
- Verificar network tab no DevTools
- Conferir logs do backend
- Verificar autenticação
```

---

**Frontend completamente integrado com API real, mantendo o design minimalista e moderno!** 🎉

**Pronto para produção** com autenticação, gerenciamento de estado e todas as funcionalidades integradas com o backend.

