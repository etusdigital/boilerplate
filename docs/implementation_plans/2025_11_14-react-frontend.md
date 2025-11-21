# 📋 Plano de Implementação - Frontend React

**Data**: 14/11/2025
**Contexto**: Adicionar opção de frontend React ao boilerplate, permitindo escolha entre Vue ou React
**Objetivo**: Criar estrutura dual-frontend com paridade de funcionalidades

---

## 🎯 Visão Geral

Implementar frontend React equivalente ao Vue existente, com:
- Estrutura de monorepo (apps/frontend-react)
- Scripts para adicionar/remover frontends
- Templates reutilizáveis
- Paridade completa de features (accounts, users, settings)
- Mesmo backend compartilhado

---

## 📊 Abordagem Técnica

### Stack React Escolhida
- **Build Tool**: Vite (equivalente ao Vue)
- **State Management**: Zustand (equivalente ao Pinia)
- **Routing**: React Router v6 (equivalente ao Vue Router)
- **Auth**: @auth0/auth0-react (equivalente ao @auth0/auth0-vue)
- **i18n**: react-i18next (equivalente ao vue-i18n)
- **Styling**: TailwindCSS + shadcn/ui (substituindo @etus/design-system)
- **Testing**: React Testing Library + Vitest
- **HTTP Client**: Axios (mesmo do Vue)

### Estrutura de Diretórios
```
boilerplate/
├── apps/
│   ├── frontend/          → renomear para frontend-vue/
│   ├── frontend-react/    → novo React app
│   └── backend/           → compartilhado
├── templates/
│   ├── react/             → template completo React
│   └── vue/               → backup do Vue atual
├── scripts/
│   ├── add-react.sh       → adiciona React
│   ├── add-vue.sh         → adiciona Vue
│   └── remove-frontend.sh → remove frontend
└── install.sh             → modificado para escolha
```

---

## 📝 Fases de Implementação

### ✅ Fase 1: Preparação da Estrutura Base
**Status**: ⏳ Pendente
**Estimativa**: 30min

**Tasks**:
- [ ] Renomear `apps/frontend` para `apps/frontend-vue`
- [ ] Criar diretório `apps/frontend-react`
- [ ] Criar diretório `templates/react` e `templates/vue`
- [ ] Atualizar `turbo.json` para suportar ambos frontends
- [ ] Atualizar `package.json` root com novos scripts

**Critérios de Aceitação**:
- ✅ Estrutura de diretórios criada corretamente
- ✅ Vue continua funcionando em `apps/frontend-vue`
- ✅ turbo.json reconhece ambos apps
- ✅ Scripts do monorepo funcionam

**Detalhes Técnicos**:
```json
// turbo.json - adicionar tasks para react
{
  "tasks": {
    "dev": {
      "dependsOn": ["^build"],
      "cache": false,
      "persistent": true
    }
  }
}
```

```json
// package.json root - novos scripts
{
  "scripts": {
    "dev": "turbo run dev",
    "dev:vue": "turbo run dev --filter=frontend-vue",
    "dev:react": "turbo run dev --filter=frontend-react",
    "dev:backend": "turbo run dev --filter=backend"
  }
}
```

**Arquivos Envolvidos**:
- `apps/frontend/` → `apps/frontend-vue/`
- `turbo.json`
- `package.json` (root)

---

### ✅ Fase 2: Configuração Inicial React + Vite
**Status**: ⏳ Pendente
**Estimativa**: 45min

**Tasks**:
- [ ] Inicializar projeto React com Vite em `apps/frontend-react`
- [ ] Configurar TypeScript strict mode
- [ ] Configurar TailwindCSS v4
- [ ] Instalar e configurar shadcn/ui
- [ ] Configurar ESLint e Prettier
- [ ] Criar `vite.config.ts` com path aliases

**Critérios de Aceitação**:
- ✅ Projeto React roda com `pnpm dev` em porta 3002
- ✅ TailwindCSS funcionando
- ✅ shadcn/ui instalado e configurado
- ✅ Path aliases (@/) funcionando
- ✅ TypeScript sem erros

**Detalhes Técnicos**:
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3002, // Diferente do Vue (3000)
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

```json
// package.json
{
  "name": "frontend-react",
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.22.0",
    "zustand": "^4.5.0",
    "@auth0/auth0-react": "^2.2.4",
    "react-i18next": "^14.0.5",
    "i18next": "^23.10.0",
    "axios": "^1.6.8",
    "tailwindcss": "^4.1.12"
  }
}
```

**Arquivos Envolvidos**:
- `apps/frontend-react/package.json`
- `apps/frontend-react/vite.config.ts`
- `apps/frontend-react/tsconfig.json`
- `apps/frontend-react/tailwind.config.js`

---

### ✅ Fase 3: Estrutura de Diretórios e Feature Folders
**Status**: ⏳ Pendente
**Estimativa**: 30min

**Tasks**:
- [ ] Criar estrutura `src/app/` (router, stores, i18n, auth)
- [ ] Criar estrutura `src/features/` (accounts, users, settings)
- [ ] Criar estrutura `src/shared/` (api, components, utils)
- [ ] Configurar barrel exports (index.ts) em cada feature
- [ ] Criar arquivos de types para cada feature

**Critérios de Aceitação**:
- ✅ Estrutura de pastas espelha a do Vue
- ✅ Cada feature tem composables, components, types, views
- ✅ Exports organizados corretamente

**Detalhes Técnicos**:
```
src/
├── app/
│   ├── router/
│   │   └── index.tsx
│   ├── stores/
│   │   └── mainStore.ts (Zustand)
│   ├── auth/
│   │   └── index.ts (Auth0)
│   └── i18n/
│       ├── locales/
│       │   ├── en.ts
│       │   └── pt.ts
│       └── index.ts
├── features/
│   ├── accounts/
│   │   ├── hooks/
│   │   │   └── useAccounts.ts
│   │   ├── components/
│   │   │   └── AccountForm.tsx
│   │   ├── types/
│   │   │   └── account.type.ts
│   │   ├── pages/
│   │   │   └── AccountsPage.tsx
│   │   ├── routes.tsx
│   │   └── index.ts
│   ├── users/
│   │   └── (mesma estrutura)
│   └── settings/
│       └── (mesma estrutura)
└── shared/
    ├── api/
    │   └── index.ts
    ├── components/
    │   └── (componentes compartilhados)
    └── utils/
```

**Arquivos Envolvidos**:
- `apps/frontend-react/src/app/`
- `apps/frontend-react/src/features/`
- `apps/frontend-react/src/shared/`

---

### ✅ Fase 4: Configuração de Autenticação (Auth0)
**Status**: ⏳ Pendente
**Estimativa**: 45min

**Tasks**:
- [ ] Instalar e configurar `@auth0/auth0-react`
- [ ] Criar `Auth0Provider` wrapper
- [ ] Criar hook `useAuth0Context`
- [ ] Implementar login/logout
- [ ] Configurar callback route
- [ ] Criar guard de proteção de rotas

**Critérios de Aceitação**:
- ✅ Auth0 funcionando igual ao Vue
- ✅ Login/logout funcionando
- ✅ Token JWT sendo obtido
- ✅ Rotas protegidas funcionando

**Detalhes Técnicos**:
```typescript
// src/app/auth/index.ts
import { Auth0Provider } from '@auth0/auth0-react'

export const auth0Config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  authorizationParams: {
    redirect_uri: import.meta.env.VITE_AUTH0_REDIRECT_URI,
    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
  },
}

// App.tsx
<Auth0Provider {...auth0Config}>
  <Router />
</Auth0Provider>
```

**Arquivos Envolvidos**:
- `apps/frontend-react/src/app/auth/index.ts`
- `apps/frontend-react/src/App.tsx`
- `apps/frontend-react/.env.example`

---

### ✅ Fase 5: State Management com Zustand
**Status**: ⏳ Pendente
**Estimativa**: 1h

**Tasks**:
- [ ] Criar `mainStore` com Zustand (equivalente ao Pinia)
- [ ] Implementar user state
- [ ] Implementar selectedAccount state
- [ ] Implementar language state
- [ ] Implementar loading state
- [ ] Integrar com Auth0 para popular user
- [ ] Implementar getLogin() para backend

**Critérios de Aceitação**:
- ✅ Store funcionando equivalente ao Vue
- ✅ User data carregada após login
- ✅ Account selecionado gerenciado
- ✅ Persistência no localStorage

**Detalhes Técnicos**:
```typescript
// src/app/stores/mainStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/features/users/types/user.type'
import type { Account } from '@/features/accounts/types/account.type'

interface MainStore {
  user: User | null
  isLoading: boolean
  selectedAccount: Account | null
  currentLanguage: string
  setUser: (user: User) => void
  setLoading: (loading: boolean) => void
  changeAccount: (accountId: string) => void
  setLanguage: (language: string) => void
}

export const useMainStore = create<MainStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      selectedAccount: null,
      currentLanguage: 'pt',
      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ isLoading: loading }),
      changeAccount: (accountId) => {
        // Implementar lógica similar ao Vue
      },
      setLanguage: (language) => set({ currentLanguage: language }),
    }),
    {
      name: 'main-store',
      partialize: (state) => ({
        selectedAccount: state.selectedAccount,
        currentLanguage: state.currentLanguage,
      }),
    }
  )
)
```

**Arquivos Envolvidos**:
- `apps/frontend-react/src/app/stores/mainStore.ts`

---

### ✅ Fase 6: Configuração de API Client e Interceptors
**Status**: ⏳ Pendente
**Estimativa**: 30min

**Tasks**:
- [ ] Criar axios instance com baseURL
- [ ] Configurar request interceptor para JWT
- [ ] Configurar request interceptor para account-id
- [ ] Configurar response interceptor para erros
- [ ] Exportar api client

**Critérios de Aceitação**:
- ✅ API client funcionando igual ao Vue
- ✅ JWT automaticamente adicionado aos requests
- ✅ account-id automaticamente adicionado
- ✅ Erros tratados corretamente

**Detalhes Técnicos**:
```typescript
// src/shared/api/index.ts
import axios from 'axios'
import { useMainStore } from '@/app/stores/mainStore'
import { useAuth0 } from '@auth0/auth0-react'

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(async (config) => {
  const { getAccessTokenSilently } = useAuth0()
  const { selectedAccount } = useMainStore.getState()

  const token = await getAccessTokenSilently()
  config.headers['Authorization'] = `Bearer ${token}`
  config.headers['account-id'] = selectedAccount?.id

  return config
})

export default api
```

**Arquivos Envolvidos**:
- `apps/frontend-react/src/shared/api/index.ts`

---

### ✅ Fase 7: Internacionalização (i18n)
**Status**: ⏳ Pendente
**Estimativa**: 45min

**Tasks**:
- [ ] Instalar e configurar react-i18next
- [ ] Copiar traduções do Vue (en.ts e pt.ts)
- [ ] Criar I18nProvider
- [ ] Implementar hook useTranslation
- [ ] Integrar com mainStore para persistência

**Critérios de Aceitação**:
- ✅ i18n funcionando em português e inglês
- ✅ Traduções equivalentes ao Vue
- ✅ Mudança de idioma persistida
- ✅ Hook useTranslation funcionando

**Detalhes Técnicos**:
```typescript
// src/app/i18n/index.ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en'
import pt from './locales/pt'

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    pt: { translation: pt },
  },
  lng: localStorage.getItem('app_lang') || 'pt',
  fallbackLng: 'pt',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
```

**Arquivos Envolvidos**:
- `apps/frontend-react/src/app/i18n/index.ts`
- `apps/frontend-react/src/app/i18n/locales/en.ts`
- `apps/frontend-react/src/app/i18n/locales/pt.ts`

---

### ✅ Fase 8: Implementação de Features (Users, Accounts, Settings)
**Status**: ⏳ Pendente
**Estimativa**: 3h

**Tasks**:
- [ ] Implementar feature `users`
  - [ ] Hook useUsers (equivalente ao composable)
  - [ ] Hook useUserForm
  - [ ] Componente UserForm
  - [ ] Página UsersPage
  - [ ] Types e interfaces
  - [ ] Rotas
- [ ] Implementar feature `accounts`
  - [ ] Hook useAccounts
  - [ ] Componente AccountForm
  - [ ] Página AccountsPage
  - [ ] Types e interfaces
  - [ ] Rotas
- [ ] Implementar feature `settings`
  - [ ] Página SettingsPage
  - [ ] Rotas

**Critérios de Aceitação**:
- ✅ Todas features funcionando igual ao Vue
- ✅ CRUD completo para users e accounts
- ✅ Paginação funcionando
- ✅ Loading, error e empty states
- ✅ Toasts de sucesso/erro funcionando

**Detalhes Técnicos**:
```typescript
// src/features/users/hooks/useUsers.ts
import { useState } from 'react'
import api from '@/shared/api'
import { useToast } from '@/shared/hooks/useToast'
import { useTranslation } from 'react-i18next'
import type { User, PaginationMeta } from '../types/user.type'

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
    currentPage: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 1,
  })
  const { toast } = useToast()
  const { t } = useTranslation()

  const getAllUsers = async (params = {}) => {
    setIsLoading(true)
    try {
      const response = await api.get('/users', { params })
      setUsers(response.data.data)
      setPaginationMeta(response.data.meta)
      return response.data
    } catch (error: any) {
      toast({
        message: t('users.messages.fetchUsersError', [error.response?.data?.message]),
        type: 'danger',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // saveUser, deleteUser, getUserWithRelations...

  return {
    users,
    isLoading,
    paginationMeta,
    getAllUsers,
    // ... outros métodos
  }
}
```

**Arquivos Envolvidos**:
- `apps/frontend-react/src/features/users/`
- `apps/frontend-react/src/features/accounts/`
- `apps/frontend-react/src/features/settings/`

---

### ✅ Fase 9: Configuração de Rotas e Navegação
**Status**: ⏳ Pendente
**Estimativa**: 1h

**Tasks**:
- [ ] Configurar React Router v6
- [ ] Criar rotas core (Home, Callback, NotFound)
- [ ] Integrar rotas de features
- [ ] Criar ProtectedRoute component
- [ ] Implementar route guards
- [ ] Criar Layout component com navegação
- [ ] Integrar menu lateral com rotas

**Critérios de Aceitação**:
- ✅ Navegação funcionando entre páginas
- ✅ Rotas protegidas requerem autenticação
- ✅ Menu lateral mostra rotas disponíveis
- ✅ 404 page funcionando

**Detalhes Técnicos**:
```typescript
// src/app/router/index.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { userRoutes } from '@/features/users'
import { accountRoutes } from '@/features/accounts'
import { settingsRoutes } from '@/features/settings'
import HomePage from '@/app/pages/HomePage'
import CallbackPage from '@/app/pages/CallbackPage'
import NotFoundPage from '@/app/pages/NotFoundPage'
import Layout from '@/app/components/Layout'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      ...userRoutes,
      ...accountRoutes,
      ...settingsRoutes,
    ],
  },
  { path: '/callback', element: <CallbackPage /> },
  { path: '*', element: <NotFoundPage /> },
])

export default router
```

**Arquivos Envolvidos**:
- `apps/frontend-react/src/app/router/index.tsx`
- `apps/frontend-react/src/app/components/Layout.tsx`

---

### ✅ Fase 10: Scripts de Instalação e Templates
**Status**: ⏳ Pendente
**Estimativa**: 2h

**Tasks**:
- [ ] Criar `templates/react/` com template completo
- [ ] Criar `templates/vue/` com backup do Vue
- [ ] Criar script `scripts/add-react.sh`
- [ ] Criar script `scripts/add-vue.sh`
- [ ] Criar script `scripts/remove-frontend.sh`
- [ ] Modificar `install.sh` para escolha interativa
- [ ] Atualizar backend CORS para porta 3002
- [ ] Criar documentação de uso dos scripts
- [ ] Atualizar README.md
- [ ] Atualizar CLAUDE.md

**Critérios de Aceitação**:
- ✅ install.sh permite escolher Vue, React ou ambos
- ✅ Scripts add-*.sh funcionam corretamente
- ✅ Scripts não destroem trabalho existente
- ✅ Backend aceita requests de ambos frontends
- ✅ Documentação clara e completa

**Detalhes Técnicos**:
```bash
# scripts/add-react.sh
#!/bin/bash

echo "🚀 Adicionando React frontend ao projeto..."

# Verificar se já existe
if [ -d "apps/frontend-react" ]; then
    echo "❌ React frontend já existe"
    exit 1
fi

# Copiar template
cp -r templates/react apps/frontend-react

# Instalar dependências
cd apps/frontend-react && pnpm install

# Configurar .env
cp .env.example .env

# Atualizar backend CORS
echo "🔧 Atualize manualmente o CORS do backend para incluir http://localhost:3002"

echo "✅ React frontend adicionado com sucesso!"
echo "Rode: pnpm dev:react"
```

```bash
# install.sh - adicionar escolha
echo "Qual frontend você deseja instalar?"
echo "1) Apenas Vue"
echo "2) Apenas React"
echo "3) Ambos (Vue + React)"
read -p "Escolha (1/2/3): " choice

case $choice in
  1)
    cp -r templates/vue apps/frontend-vue
    ;;
  2)
    cp -r templates/react apps/frontend-react
    ;;
  3)
    cp -r templates/vue apps/frontend-vue
    cp -r templates/react apps/frontend-react
    ;;
esac
```

```typescript
// apps/backend/src/main.ts - atualizar CORS
app.enableCors({
  origin: [
    'http://localhost:3000',  // Vue
    'http://localhost:3002',  // React
  ],
  credentials: true,
});
```

**Arquivos Envolvidos**:
- `templates/react/` (todos os arquivos)
- `templates/vue/` (backup)
- `scripts/add-react.sh`
- `scripts/add-vue.sh`
- `scripts/remove-frontend.sh`
- `install.sh`
- `apps/backend/src/main.ts`
- `README.md`
- `CLAUDE.md`

---

## 📚 Traduções Necessárias

Todas as traduções já existem no Vue, apenas copiar para React:
- `apps/frontend-vue/src/app/languages/locales/en.ts` → `apps/frontend-react/src/app/i18n/locales/en.ts`
- `apps/frontend-vue/src/app/languages/locales/pt.ts` → `apps/frontend-react/src/app/i18n/locales/pt.ts`

---

## ✅ Critérios de Sucesso Final

- [ ] Ambos frontends (Vue e React) rodam simultaneamente
- [ ] Ambos consomem o mesmo backend
- [ ] Paridade completa de funcionalidades
- [ ] Scripts de adição/remoção funcionam
- [ ] Documentação completa
- [ ] Testes básicos funcionando
- [ ] CLAUDE.md atualizado com nova arquitetura

---

## 🎯 Próximos Passos Após Implementação

1. Criar testes E2E para ambos frontends
2. Documentar padrões de migração Vue → React
3. Criar guia de escolha (quando usar Vue vs React)
4. Adicionar CI/CD para ambos frontends

---

## 📝 Observações

- React usa hooks (useUsers) em vez de composables (useUsers)
- Zustand substitui Pinia (API similar)
- shadcn/ui substitui @etus/design-system
- Estrutura de pastas mantém paridade com Vue
- Backend permanece 100% inalterado
- Account isolation funciona transparentemente para ambos
