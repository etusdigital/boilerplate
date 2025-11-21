# Etus Boilerplate - Multi-Tenant SaaS

Boilerplate completo para aplicações SaaS multi-tenant com opção de frontend Vue 3 ou React 18, compartilhando o mesmo backend NestJS.

## 🎯 Visão Geral

Este boilerplate oferece:
- **Dual Frontend**: Escolha entre Vue 3 ou React 18 (ou use ambos)
- **Backend NestJS**: API robusta com TypeORM, Auth0 e multi-tenancy
- **Monorepo Turborepo**: Gerenciamento eficiente com pnpm workspaces
- **Multi-Tenant**: Isolamento completo de dados por conta
- **Autenticação**: Auth0 JWT com roles e permissões
- **i18n**: Suporte a múltiplos idiomas (PT/EN)

## 📂 Estrutura do Projeto

```
boilerplate/
├── apps/
│   └── backend/           # Backend NestJS + TypeORM + Auth0
├── templates/
│   ├── react/             # Template React completo
│   └── vue/               # Template Vue completo
├── scripts/
│   ├── add-react.sh       # Adiciona frontend React
│   ├── add-vue.sh         # Adiciona frontend Vue
│   └── remove-frontend.sh # Remove frontend
└── install.sh             # Script de instalação principal
```

**Nota**: Os frontends (Vue/React) NÃO estão inclusos por padrão. Use os scripts para adicionar o frontend de sua escolha.

## 🚀 Requisitos

- Node.js >= 18
- pnpm >= 8.15.5
- Git

## 📦 Instalação

### Método 1: Instalação Rápida (Recomendado)

Execute o seguinte comando em seu terminal:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/etusdigital/boilerplate/HEAD/install.sh)"
```

Este comando irá:
- Verificar e instalar pnpm se necessário
- Baixar o boilerplate
- Configurar backend e arquivos de ambiente
- Instalar dependências do backend
- Executar migrations e seeds
- Opcionalmente criar um usuário administrador
- Inicializar repositório git

**⚠️ IMPORTANTE**: Após a instalação, você DEVE escolher e adicionar um frontend:

```bash
cd nome-do-projeto

# Escolha um:
bash scripts/add-react.sh   # Para adicionar React
bash scripts/add-vue.sh      # Para adicionar Vue
```

### Método 2: Instalação Manual

1. Clone o repositório:

```bash
git clone https://github.com/etusdigital/boilerplate.git nome-do-projeto
cd nome-do-projeto
```

2. Instale as dependências do backend:

```bash
cd apps/backend
pnpm install
cd ../..
```

3. Configure o arquivo de ambiente do backend:

```bash
cp apps/backend/.env.example apps/backend/.env
```

4. Execute as migrations e seeds:

```bash
pnpm run migration
```

5. **Adicione um frontend** (escolha React ou Vue):

```bash
# Escolha um:
bash scripts/add-react.sh   # Para adicionar React
bash scripts/add-vue.sh      # Para adicionar Vue
```

O script irá:
- Copiar o template para `apps/frontend-react` ou `apps/frontend-vue`
- Criar arquivo `.env` baseado no `.env.example`
- Instalar dependências do frontend

## 🎨 Gerenciamento de Frontends

O boilerplate NÃO inclui frontends por padrão. Você deve escolher e adicionar o frontend desejado após a instalação.

### Adicionar Frontend React

```bash
bash scripts/add-react.sh
```

Este script irá:
- Verificar se React já existe
- Copiar template para `apps/frontend-react`
- Configurar `.env` automaticamente
- Instalar dependências com pnpm

### Adicionar Frontend Vue

```bash
bash scripts/add-vue.sh
```

Este script irá:
- Verificar se Vue já existe
- Copiar template para `apps/frontend-vue`
- Configurar `.env` automaticamente
- Instalar dependências com pnpm

### Remover Frontend

```bash
bash scripts/remove-frontend.sh
```

O script irá:
- Perguntar qual frontend remover (React ou Vue)
- Solicitar confirmação (ação irreversível)
- Remover completamente o frontend escolhido

## 💻 Desenvolvimento

### Iniciar Todos os Serviços

```bash
pnpm dev
```

### Iniciar Serviços Específicos

```bash
pnpm dev:vue      # Apenas Vue frontend (porta 3000)
pnpm dev:react    # Apenas React frontend (porta 3000)
pnpm dev:backend  # Apenas backend (porta 3001)
```

## 🗄️ Banco de Dados

### Migrations e Seeds

Para rodar as migrations e seeds:

```bash
pnpm run migration
```

### Usuário de Teste

Após executar as migrations e seeds:

- Email: `admin@etus.com`
- Senha: `o9ac08ZBrSgv`

### Tecnologia

- **Desenvolvimento**: SQLite
- **Produção**: PostgreSQL, MySQL ou outros bancos relacionais suportados pelo TypeORM

## 🔐 Configuração Auth0

### 1. Criar API Application

- Acesse o [Auth0 Dashboard](https://manage.auth0.com/)
- Crie uma nova API Application
- Configure as URLs permitidas (http://localhost:3000, http://localhost:3001)
- Copie o `Domain`, `Client ID`, `Client Secret` e `Audience`

### 2. Criar SPA Application

- Crie uma nova Single Page Application
- Configure Allowed Callback URLs: `http://localhost:3000/callback`
- Configure Allowed Logout URLs: `http://localhost:3000`
- Configure Allowed Web Origins: `http://localhost:3000`
- Copie o `Client ID`

### 3. Configurar Actions

Crie uma Action no fluxo de Login para adicionar roles ao token:

```javascript
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://boilerplate.app/roles';
  const roles = event.user.app_metadata?.roles || [];
  if (event.authorization) {
    api.idToken.setCustomClaim(namespace, roles);
    api.accessToken.setCustomClaim(namespace, roles);
  }
};
```

### 4. Configurar Variáveis de Ambiente

**Backend** (`apps/backend/.env`):
```env
JWKS_URI=https://YOUR_DOMAIN.auth0.com/.well-known/jwks.json
IDP_ISSUER=https://YOUR_DOMAIN.auth0.com/
IDP_AUDIENCE=YOUR_API_AUDIENCE
AUTH0_DOMAIN=YOUR_DOMAIN.auth0.com
AUTH0_CLIENT_ID=YOUR_API_CLIENT_ID
AUTH0_CLIENT_SECRET=YOUR_API_CLIENT_SECRET
```

**Frontend Vue** (`apps/frontend-vue/.env`):
```env
VITE_AUTH0_DOMAIN=YOUR_DOMAIN.auth0.com
VITE_AUTH0_CLIENT_ID=YOUR_SPA_CLIENT_ID
VITE_AUTH0_REDIRECT_URI=http://localhost:3000/callback
VITE_AUTH0_AUDIENCE=YOUR_API_AUDIENCE
VITE_BACKEND_URL=http://localhost:3001
```

**Frontend React** (`apps/frontend-react/.env`):
```env
VITE_AUTH0_DOMAIN=YOUR_DOMAIN.auth0.com
VITE_AUTH0_CLIENT_ID=YOUR_SPA_CLIENT_ID
VITE_AUTH0_REDIRECT_URI=http://localhost:3000/callback
VITE_AUTH0_AUDIENCE=YOUR_API_AUDIENCE
VITE_BACKEND_URL=http://localhost:3001
```

## 🏗️ Build para Produção

```bash
pnpm build
```

Isso irá criar builds otimizados de todos os apps no monorepo.

## 🧪 Testes

### Frontend Vue

```bash
cd apps/frontend-vue
pnpm test              # Unit tests
pnpm test:coverage     # Coverage report
```

### Frontend React

```bash
cd apps/frontend-react
pnpm test              # Unit tests
pnpm test:coverage     # Coverage report
```

### Backend

```bash
cd apps/backend
pnpm test              # Unit tests
pnpm test:e2e          # E2E tests
```

## 📚 Stack Tecnológica

### Frontend Vue
- Vue 3 + Composition API
- Pinia (State Management)
- Vue Router
- @auth0/auth0-vue
- vue-i18next
- @etus/design-system
- TailwindCSS
- Vite

### Frontend React
- React 18 + Hooks
- Zustand (State Management)
- React Router v6
- @auth0/auth0-react
- react-i18next
- TailwindCSS v4
- Vite

### Backend
- NestJS
- TypeORM
- SQLite (dev) / PostgreSQL (prod)
- Auth0 JWT
- Swagger/OpenAPI
- Class Validator
- ClsModule (Context)

### Monorepo
- Turborepo
- pnpm workspaces
- Shared configs (ESLint, TypeScript, Jest)

## 🎓 Documentação

- **Metodologia de Desenvolvimento**: `docs/development_methodology_for_developers.md`
- **Guidelines do Projeto**: `docs/project_guidelines_for_developers.md`
- **Planos de Implementação**: `docs/implementation_plans/`
- **Lições Aprendidas**: `docs/lessons_learned/`
- **Instruções para Claude Code**: `CLAUDE.md`

## 🔒 Multi-Tenancy

Este boilerplate implementa multi-tenancy com isolamento completo de dados:

- Cada requisição é filtrada por `account-id` (header automático)
- Backend usa ClsModule para contexto de conta
- Soft deletes em todas as entidades
- Audit logging automático
- RolesGuard baseado em banco de dados

## 🌐 Internacionalização

Suporte completo a múltiplos idiomas:
- Português (pt)
- Inglês (en)

Adicionar novo idioma:
1. Criar arquivo em `src/app/i18n/locales/[lang].ts`
2. Registrar no `i18n/index.ts`
3. Adicionar traduções

## 📝 Comandos Úteis

```bash
# Desenvolvimento
pnpm dev                 # Inicia todos os serviços
pnpm dev:vue             # Inicia apenas Vue
pnpm dev:react           # Inicia apenas React
pnpm dev:backend         # Inicia apenas backend

# Build
pnpm build               # Build de todos os apps
pnpm build --filter=backend   # Build apenas do backend

# Testes
pnpm test                # Testes de todos os apps
pnpm lint                # Lint de todos os apps
pnpm format              # Format com Prettier

# Database
pnpm run migration       # Executa migrations e seeds
cd apps/backend && npx typeorm migration:generate src/database/migrations/MigrationName
cd apps/backend && npx typeorm migration:run

# Scripts
bash scripts/add-react.sh      # Adiciona React
bash scripts/add-vue.sh        # Adiciona Vue
bash scripts/remove-frontend.sh # Remove frontend
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 🆘 Suporte

Para dúvidas, issues ou sugestões, abra uma issue no repositório.
