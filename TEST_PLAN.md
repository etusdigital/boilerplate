# Test Plan - Boilerplate Installation & Frontend Management

**Objetivo**: Validar todo o fluxo de instalação e gerenciamento de frontends

**Data**: 2025-11-18

---

## 🧪 Estratégia de Testes

Este plano está dividido em duas fases:

### Fase 1: Testes Locais de Scripts (✅ Executável Imediatamente)
Validar que os scripts de gerenciamento de frontend funcionam corretamente quando executados diretamente no repositório local.

### Fase 2: Teste de Instalação Completa (⚠️ Requer Push para GitHub)
Validar o fluxo completo de instalação via curl one-liner, que é como usuários reais instalarão o boilerplate.

**IMPORTANTE**: A Fase 2 só pode ser executada após:
1. Commit de todas as mudanças (scripts/, templates/, etc.)
2. Push para o repositório GitHub master branch
3. Aguardar propagação das mudanças no GitHub

---

## 📋 FASE 1: Testes Locais de Scripts

**Pré-requisitos**:
- Estar no diretório raiz do repositório boilerplate
- Backend já instalado e funcional
- Nenhum frontend instalado (apps/ deve conter apenas backend/)

### ✅ Cenário 1.1: Adicionar React Frontend

**Objetivo**: Validar que add-react.sh cria frontend React funcional

**Passos**:
```bash
# 1. Verificar estado inicial
ls apps/
# Esperado: apenas backend/

# 2. Executar script de adição
bash scripts/add-react.sh

# 3. Verificar que frontend foi criado
ls apps/
# Esperado: backend/ e frontend-react/

# 4. Verificar conteúdo do frontend
ls apps/frontend-react/
# Esperado: src/, public/, package.json, vite.config.ts, etc.

# 5. Verificar dependencies instaladas
ls apps/frontend-react/node_modules/ | head -10

# 6. Testar build
cd apps/frontend-react
pnpm build
# Esperado: Build successful, dist/ criado

# 7. Testar dev server
pnpm dev
# Esperado: Server inicia em localhost:3000
# Ctrl+C para parar
```

**Critérios de Sucesso**:
- [ ] Script completa sem erros
- [ ] apps/frontend-react/ criado com estrutura completa
- [ ] node_modules instalado (~80MB)
- [ ] .env configurado
- [ ] Build funciona sem erros
- [ ] Dev server inicia corretamente
- [ ] Mensagem de sucesso exibida com instruções

---

### ✅ Cenário 1.2: Adicionar Vue Frontend

**Objetivo**: Validar que add-vue.sh cria frontend Vue funcional

**Passos**:
```bash
# 1. Remover React se existir
bash scripts/remove-frontend.sh
# Escolher: 1 (React)
# Confirmar: yes

# 2. Verificar estado
ls apps/
# Esperado: apenas backend/

# 3. Executar script de adição
bash scripts/add-vue.sh

# 4. Verificar que frontend foi criado
ls apps/
# Esperado: backend/ e frontend-vue/

# 5. Verificar conteúdo
ls apps/frontend-vue/
# Esperado: src/, public/, package.json, vite.config.ts, etc.

# 6. Testar build
cd apps/frontend-vue
pnpm build

# 7. Testar dev server
pnpm dev
# Esperado: Server inicia em localhost:3000
```

**Critérios de Sucesso**:
- [ ] Script completa sem erros
- [ ] apps/frontend-vue/ criado com estrutura completa
- [ ] node_modules instalado (~71MB)
- [ ] .env configurado
- [ ] Build funciona
- [ ] Dev server inicia

---

### ✅ Cenário 1.3: Adicionar Ambos Frontends

**Objetivo**: Validar instalação de React + Vue simultaneamente

**Passos**:
```bash
# 1. Estado limpo
bash scripts/remove-frontend.sh
# Remover todos se existirem

# 2. Adicionar React
bash scripts/add-react.sh

# 3. Adicionar Vue
bash scripts/add-vue.sh

# 4. Verificar estrutura
ls apps/
# Esperado: backend/, frontend-react/, frontend-vue/

# 5. Testar React
cd apps/frontend-react && pnpm dev
# Verificar localhost:3000, Ctrl+C

# 6. Testar Vue
cd ../frontend-vue && pnpm dev
# Verificar localhost:3000, Ctrl+C

# 7. Testar com backend
# Terminal 1: cd apps/backend && pnpm dev
# Terminal 2: cd apps/frontend-react && pnpm dev
# Browser: localhost:3000 - fazer login, criar um user
# Ctrl+C frontend React
# Terminal 2: cd ../frontend-vue && pnpm dev
# Browser: localhost:3000 - verificar que user existe (mesmo backend)
```

**Critérios de Sucesso**:
- [ ] Ambos frontends instalados sem conflitos
- [ ] React funciona independentemente
- [ ] Vue funciona independentemente
- [ ] Ambos compartilham mesmo backend
- [ ] Dados persistem entre frontends

---

### ✅ Cenário 1.4: Remover Frontend

**Objetivo**: Validar que remove-frontend.sh limpa corretamente

**Passos**:
```bash
# 1. Garantir que React existe
bash scripts/add-react.sh

# 2. Executar remoção
bash scripts/remove-frontend.sh
# Escolher: 1 (React)
# Confirmar: yes

# 3. Verificar remoção
ls apps/
# Esperado: apenas backend/

# 4. Verificar que não há resíduos
ls apps/frontend-react/ 2>/dev/null
# Esperado: erro "No such file or directory"
```

**Critérios de Sucesso**:
- [ ] Script exibe menu de escolha
- [ ] Confirmação solicitada
- [ ] Frontend removido completamente
- [ ] Nenhum resíduo deixado
- [ ] Mensagem de sucesso exibida

---

### ✅ Cenário 1.5: Validação de Erros

**Objetivo**: Testar comportamento com erros esperados

**Passos**:
```bash
# 1. Tentar adicionar frontend duplicado
bash scripts/add-react.sh
bash scripts/add-react.sh
# Esperado: Erro "React frontend already exists"

# 2. Tentar remover frontend inexistente
bash scripts/remove-frontend.sh
# Escolher: 1 (React)
# Se React não existe, esperado: Erro "React frontend not found"

# 3. Tentar adicionar sem templates (simular corrupção)
mv templates templates-backup
bash scripts/add-react.sh
# Esperado: Erro "React template not found at templates/react"
mv templates-backup templates
```

**Critérios de Sucesso**:
- [ ] Scripts detectam frontends duplicados
- [ ] Scripts detectam frontends inexistentes
- [ ] Scripts detectam templates ausentes
- [ ] Mensagens de erro são claras e úteis
- [ ] Scripts terminam com exit code != 0

---

## 📋 FASE 2: Teste de Instalação Completa via GitHub

**⚠️ PRÉ-REQUISITO OBRIGATÓRIO**:
```bash
# No repositório local, fazer:
git add .
git commit -m "feat: add frontend management scripts and templates"
git push origin master

# Aguardar ~1 minuto para propagação no GitHub
```

**Verificar que mudanças estão no GitHub**:
- Acessar: https://github.com/etusdigital/boilerplate
- Verificar que scripts/ e templates/ existem no repositório

---

### ✅ Cenário 2.1: Instalação Fresh com React

**Objetivo**: Validar instalação completa via curl one-liner

**Ambiente**: Pasta temporária limpa ou container Docker

```bash
# Opção A: Pasta temporária
mkdir -p ~/boilerplate-install-test
cd ~/boilerplate-install-test

# Opção B: Docker (recomendado)
docker run -it --rm node:18 bash
cd /tmp
```

**Passos**:
```bash
# 1. Executar instalação via curl
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/etusdigital/boilerplate/HEAD/install.sh)"

# Inputs esperados:
#   - Project name: test-react-app
#   - Create user? y
#   - Name: Admin Test
#   - Email: admin@test.com
#   - Frontend choice? 1 (React)

# 2. Verificar estrutura criada
ls
# Esperado: test-react-app/

cd test-react-app
ls apps/
# Esperado: backend/ e frontend-react/

# 3. Verificar git inicializado
git log --oneline
# Esperado: commit inicial

# 4. Verificar backend
cd apps/backend
pnpm dev
# Esperado: Backend rodando em localhost:3001
# Ctrl+C

# 5. Verificar frontend
cd ../frontend-react
pnpm dev
# Esperado: Frontend em localhost:3000
# Ctrl+C

# 6. Testar integração
# Terminal 1: cd apps/backend && pnpm dev
# Terminal 2: cd apps/frontend-react && pnpm dev
# Browser: localhost:3000
# - Login Auth0
# - Navegar /users, /accounts, /settings
# - Verificar dados carregam
```

**Critérios de Sucesso**:
- [ ] Curl download funciona
- [ ] install.sh executa sem erros
- [ ] Projeto criado no diretório correto
- [ ] Backend instalado e funciona
- [ ] React frontend instalado e funciona
- [ ] Git inicializado com commit inicial
- [ ] Usuário super admin criado
- [ ] Migrations executadas
- [ ] .env configurados
- [ ] Integração frontend-backend funciona

---

### ✅ Cenário 2.2: Instalação Fresh com Vue

**Objetivo**: Validar instalação via curl com Vue

**Passos**:
```bash
# 1. Nova pasta limpa
cd /tmp
mkdir test-vue && cd test-vue

# 2. Executar instalação
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/etusdigital/boilerplate/HEAD/install.sh)"

# Inputs:
#   - Project name: test-vue-app
#   - Create user? n
#   - Frontend choice? 2 (Vue)

# 3. Verificar estrutura
cd test-vue-app
ls apps/
# Esperado: backend/ e frontend-vue/

# 4. Testar backend e frontend
cd apps/backend && pnpm dev
# Ctrl+C
cd ../frontend-vue && pnpm dev
# Verificar localhost:3000
```

**Critérios de Sucesso**:
- [ ] Instalação completa sem erros
- [ ] Vue frontend criado
- [ ] Backend funciona
- [ ] Frontend Vue funciona
- [ ] Integração funciona

---

### ✅ Cenário 2.3: Instalação com Ambos Frontends

**Objetivo**: Validar opção "Both" no install.sh

**Passos**:
```bash
# 1. Nova instalação
cd /tmp && mkdir test-both && cd test-both

# 2. Executar
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/etusdigital/boilerplate/HEAD/install.sh)"

# Inputs:
#   - Project name: test-both-app
#   - Create user? n
#   - Frontend choice? 3 (Both)

# 3. Verificar
cd test-both-app
ls apps/
# Esperado: backend/, frontend-react/, frontend-vue/

# 4. Testar ambos
cd apps/frontend-react && pnpm dev
# Ctrl+C
cd ../frontend-vue && pnpm dev
```

**Critérios de Sucesso**:
- [ ] Ambos frontends instalados
- [ ] React funciona
- [ ] Vue funciona
- [ ] Mensagem de sucesso menciona ambos

---

### ✅ Cenário 2.4: Instalação Skip Frontend

**Objetivo**: Validar opção "Skip" + adicionar manualmente depois

**Passos**:
```bash
# 1. Nova instalação
cd /tmp && mkdir test-skip && cd test-skip

# 2. Executar
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/etusdigital/boilerplate/HEAD/install.sh)"

# Inputs:
#   - Project name: test-skip-app
#   - Create user? n
#   - Frontend choice? 4 (Skip)

# 3. Verificar
cd test-skip-app
ls apps/
# Esperado: apenas backend/

# 4. Adicionar React manualmente
bash scripts/add-react.sh
ls apps/
# Esperado: backend/ e frontend-react/

# 5. Remover e adicionar Vue
bash scripts/remove-frontend.sh
# Escolher: 1 (React)

bash scripts/add-vue.sh
ls apps/
# Esperado: backend/ e frontend-vue/
```

**Critérios de Sucesso**:
- [ ] Instalação sem frontend funciona
- [ ] Apenas backend instalado
- [ ] Scripts disponíveis em scripts/
- [ ] Templates disponíveis em templates/
- [ ] add-react.sh funciona após instalação
- [ ] add-vue.sh funciona após instalação
- [ ] remove-frontend.sh funciona

---

## 🔍 Checklist de Integração Completa

### Backend
- [ ] Migrations executam sem erros
- [ ] Seeds criam dados iniciais
- [ ] Usuário de teste criado (quando solicitado)
- [ ] Backend inicia em porta 3001
- [ ] Swagger docs acessível em /api/docs
- [ ] CORS permite localhost:3000

### Frontend (React ou Vue)
- [ ] Frontend inicia em porta 3000
- [ ] .env configurado automaticamente
- [ ] Auth0 redirect funciona
- [ ] Login funciona
- [ ] HomePage exibe usuário logado
- [ ] Navegação entre rotas funciona

### Integração
- [ ] POST /users/login retorna user data
- [ ] selectedAccount populado
- [ ] Header account-id enviado automaticamente
- [ ] GET /users retorna lista filtrada
- [ ] GET /accounts retorna lista filtrada
- [ ] Multi-tenancy funciona (dados isolados)

### Git
- [ ] .gitignore ignora apps/frontend-*
- [ ] git status não mostra frontends
- [ ] Templates rastreados pelo git
- [ ] Scripts rastreados pelo git
- [ ] Commit inicial criado

---

## 📊 Resultados Esperados

### Tamanhos
- templates/react: ~284KB (sem node_modules)
- templates/vue: ~276KB (sem node_modules)
- apps/frontend-react (após install): ~5.2MB + 80MB node_modules
- apps/frontend-vue (após install): ~348KB + 71MB node_modules

### Performance
- add-react.sh: ~20 segundos (install + build)
- add-vue.sh: ~20 segundos (install + build)
- install.sh completo: < 5 minutos
- Backend start: < 5 segundos
- Frontend start: < 3 segundos

---

## 📝 Registro de Testes

### Fase 1: Testes Locais
| Cenário | Status | Notas | Testado por | Data |
|---------|--------|-------|-------------|------|
| 1.1 - Add React | ⬜ | | | |
| 1.2 - Add Vue | ⬜ | | | |
| 1.3 - Add Both | ⬜ | | | |
| 1.4 - Remove | ⬜ | | | |
| 1.5 - Errors | ⬜ | | | |

### Fase 2: Instalação GitHub
| Cenário | Status | Notas | Testado por | Data |
|---------|--------|-------|-------------|------|
| 2.1 - Install React | ⬜ | | | |
| 2.2 - Install Vue | ⬜ | | | |
| 2.3 - Install Both | ⬜ | | | |
| 2.4 - Install Skip | ⬜ | | | |

**Legenda**: ⬜ Pendente | 🟡 Em progresso | ✅ Passou | ❌ Falhou

---

## 🐛 Bugs Encontrados

| # | Fase | Cenário | Bug | Severidade | Status | Resolução |
|---|------|---------|-----|------------|--------|-----------|
| 1 | | | | | | |

---

## ✅ Aprovação Final

### Fase 1: Scripts Locais
- [ ] Todos os cenários locais passaram
- [ ] Scripts funcionam conforme esperado
- [ ] Tratamento de erros adequado
- [ ] Mensagens claras e úteis

### Fase 2: Instalação GitHub
- [ ] Instalação via curl funciona
- [ ] Todas as opções de frontend funcionam
- [ ] Integração frontend-backend funciona
- [ ] Documentação está correta

**Testado por**: _________________
**Data**: _________________
**Status**: [ ] APROVADO [ ] REPROVADO
