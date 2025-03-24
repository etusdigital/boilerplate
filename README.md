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

## Build

Para criar builds de produção:

```bash
npm run build
```

## Banco de Dados

O projeto utiliza:
- SQLite para desenvolvimento
- Configurável para outros bancos relacionais em produção

Para configurar o banco de dados em produção, edite o arquivo `backend/prisma/schema.prisma` e a variável de ambiente `DATABASE_URL`. 