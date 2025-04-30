# Template Backend para CRUDs

Este é um projeto template baseado em NestJS para criação rápida de novos CRUDs. O projeto fornece uma estrutura base organizada e pronta para ser expandida conforme suas necessidades.

## Tecnologias Utilizadas

- [NestJS](https://nestjs.com/) - Framework Node.js para construção de aplicações escaláveis
- [TypeORM](https://typeorm.io/) - ORM para TypeScript e JavaScript
- [Swagger](https://swagger.io/) - Documentação da API

## Configuração do Projeto

```bash
# Instalação das dependências
$ npm install
```

## Executando o Projeto

```bash
# Modo de desenvolvimento
$ npm run start:dev

# Executando as migrations
$ npx typeorm migration:run -d dist/database/ormconfig.js

# Executando os seeds
$ npx typeorm-extension seed:run -d dist/database/ormconfig.js

# Modo de produção
$ npm run start:prod
```

Usuário de teste:
- Email: admin@etus.com
- Senha: o9ac08ZBrSgv

## Documentação da API

A documentação completa da API está disponível através do Swagger UI no seguinte endereço:

```
$(baseUrl)/api/docs
```

## Testes

```bash
# Testes unitários
$ npm run test

# Testes e2e
$ npm run test:e2e

# Cobertura de testes
$ npm run test:cov
```

## Estrutura do Projeto

O projeto segue uma estrutura modular, onde cada recurso (entidade) possui seu próprio módulo com:

- Controllers
- Services
- DTOs
- Entities
- Repositories

## Criando Novos CRUDs

Para criar um novo CRUD, você tem duas opções:

### Opção 1: Seguir o passo a passo manual

1. Crie uma nova entidade em `src/entities`
2. Gere um novo módulo usando o CLI do NestJS: `nest g resource nome-do-recurso`
3. Implemente os DTOs necessários
4. Configure as rotas no controller
5. Implemente a lógica de negócio no service

### Opção 2: Usar o Cursor com as regras predefinidas (Recomendado)

1. Consulte o arquivo `@cursor-rules.md` na raiz do projeto para ver a arquitetura completa
2. No Cursor, digite o comando para criar um novo CRUD seguindo o formato:
   ```
   "Crie um novo CRUD seguindo as regras do arquivo @cursor-rules.md para a entidade X com a seguinte tabela:
   - Tabela 1 com campos [...]"
   ```
3. O Cursor irá gerar automaticamente todos os arquivos necessários seguindo os padrões arquiteturais definidos, incluindo:
   - Migrations
   - Entities
   - Module
   - Controller
   - Service
   - DTOs
   - Testes

O arquivo `@cursor-rules.md` contém todas as regras e padrões arquiteturais do projeto, incluindo:
- Estrutura de migrations
- Padrões de nomenclatura
- Decorators necessários
- Configurações do TypeORM
- Estrutura de testes
- Melhores práticas

## Migrations e Seeds

O projeto utiliza TypeORM para gerenciamento de banco de dados. Para criar novas migrations:

```bash
# Criar uma nova migration
$ npm run typeorm:create-migration nome-da-migration

# Gerar uma migration baseada nas alterações das entidades
$ npm run typeorm:generate-migration nome-da-migration
```

## Licença

Este projeto está licenciado sob a licença MIT.
