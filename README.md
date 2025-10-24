# Projeto Monolítico Vue 3 + Express

Este é um projeto monolítico que utiliza Vue 3 para o frontend e Express para o backend, ambos com TypeScript.

## Estrutura do Projeto

```
.
├── frontend/     # Aplicação Vue 3
├── backend/      # API Express
└── package.json  # Scripts principais
```

## Requisitos

- Node.js >= 18
- pnpm >= 8.15.5

## Instalação

### Método 1: Instalação Rápida (Recomendado)

Execute o seguinte comando em seu terminal:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/etusdigital/boilerplate/HEAD/install.sh)"
```

Este comando irá:

- Verificar e instalar pnpm se necessário
- Baixar o boilerplate
- Configurar os arquivos de ambiente
- Instalar dependências
- Executar migrations e seeds
- Opcionalmente criar um usuário administrador

### Método 2: Instalação Manual

1. Clone o repositório:

```bash
git clone https://github.com/etusdigital/boilerplate.git nome-do-projeto
cd nome-do-projeto
```

2. Instale as dependências:

```bash
pnpm install
```

3. Configure os arquivos de ambiente:

```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
```

4. Execute as migrations e seeds:

```bash
pnpm run migration
```

## Desenvolvimento

Para iniciar o ambiente de desenvolvimento:

```bash
pnpm dev
```

Isso iniciará:

- Frontend em <http://localhost:3000>
- Backend em <http://localhost:3001>

## Migrations e Seeds

Para rodar as migrations e seeds:

```bash
pnpm run migration
```

Usuário de teste:

- Email: <admin@etus.com>
- Senha: o9ac08ZBrSgv

## Build

Para criar builds de produção:

```bash
pnpm build
```

## Banco de Dados

O projeto utiliza:

- SQLite para desenvolvimento
- Configurável para outros bancos relacionais em produção

## Configuração Auth0

- Criar uma nova aplicação de API no Auth0 liberando os acessos de URLs. Libere também o acesso a aplicacação API Explorer Application com todas as permissões.
- Criar nova aplicação de SPA no Auth0 liberando os acessos de URLs
- Configurar o client id, audience e secret no arquivo `backend/.env`
- Configurar o client id e secret no arquivo `frontend/.env`

## Observações

- O script de instalação automatiza todo o processo de configuração, incluindo a instalação do pnpm se necessário
- Para projetos existentes, você pode usar o método de instalação manual
- Consulte os documentos `docs/development_methodology_for_developers.md` e `docs/project_guidelines_for_developers.md` para entender melhor a estrutura das cursor-rules do projeto
