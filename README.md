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

- Node.js >= 18.13.0
- npm >= 8.19.3

## Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm run install:all
```

## Desenvolvimento

Para iniciar o ambiente de desenvolvimento:

```bash
npm run dev
```

Isso iniciará:
- Frontend em http://localhost:5173
- Backend em http://localhost:3001


## Migrations e Seeds

Para rodar as migrations e seeds:

```bash
pnpm run migration
```
Usuário de teste:
- Email: admin@etus.com
- Senha: o9ac08ZBrSgv


## Build

Para criar builds de produção:

```bash
npm run build
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

- Se clonou o projeto usando o nosso npx e já tinha um pnpm configurado, você não precisará fazer nada e apenas rodar o pnpm run dev.
- Se clonou o projeto usando o npx e não tinha um pnpm configurado, você precisará rodar o pnpm install para instalar as dependências. Após isso você precisa instalar as migrations e seeds com o comando `pnpm run migration`.
- Consulte os documentos `docs/development_methodology_for_developers.md` e `docs/project_guidelines_for_developers.md` para entender melhor a estrutura das cursor-rules do projeto
