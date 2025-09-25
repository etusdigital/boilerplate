# 📚 Guidelines de Desenvolvimento - Boilerplate

**Data**: 29/07/2025  
**Contexto**: Guidelines consolidadas para desenvolvedores do projeto, explicando a estrutura  do boilerplate e padrões das cursor-rules
**Versão**: 1.0

---

## 🎯 **Contexto global do projeto**

### **Perfil do Cursor-rule**
Você deve atuar como um **engenheiro de software sênior** especializado na construção de sistemas altamente escaláveis com:
- **Frontend**: Vue 3 + TypeScript + Pinia
- **Backend**: NestJS + TypeORM + SQLite

### **Stack Tecnológica**
- **Frontend**: Vue 3, TypeScript, Pinia, Vue Router
- **Backend**: NestJS, TypeORM, SQLite  
- **Autenticação**: Auth0
- **Design System**: @etus/design-system (obrigatório)
- **Arquitetura**: Feature-driven development

---

## 📋 **Regras Fundamentais**

### **1. Idioma e Comunicação**
- ✅ **Sempre responder em português (PT-BR)** nas interações
- ✅ **Código e comentários em inglês** para padrões técnicos
- ✅ **Documentação em português** para desenvolvedores

### **2. Princípios de Código**
- ✅ **Sempre prefira soluções simples** sobre complexas
- ✅ **Evite duplicação de código** - verifique funcionalidades similares existentes
- ✅ **Uma responsabilidade por função/classe**
- ✅ **Código legível** que conta uma história

### **3. Resolução de Problemas**
- ✅ **Esgote opções existentes** antes de introduzir novos padrões
- ✅ **Remova implementações antigas** ao introduzir novas
- ✅ **Mudanças incrementais** em partes testáveis

### **4. Organização de Arquivos**
- ✅ **Divida arquivos longos** em módulos menores
- ✅ **Divida funções longas** em funções com propósito único
- ✅ **Agrupe funcionalidades relacionadas**

---

## 🏗️ **Padrões Específicos do Projeto**

### **Design System (OBRIGATÓRIO)**
- ✅ **USE APENAS** componentes do `@etus/design-system`
- ❌ **PROIBIDO** criar componentes UI customizados sem necessidade explícita
- ✅ **Exceções permitidas** apenas quando específico e necessário (ex: vue-flow para steps)

### **Isolamento por Conta**
- ✅ **CRÍTICO**: Todas operações devem incluir contexto de conta (`accountId`)
- ✅ **BANCO DE DADOS**: Filtrar todas queries por `accountId` automaticamente
- ✅ **SEGURANÇA**: Validar propriedade da conta antes de qualquer CRUD
- ✅ **PADRÃO**: Usar CLS (Continuation Local Storage) para contexto

---

## 📝 **Documentação Obrigatória**

### **Registro de Mudanças**
- ✅ **OBRIGATÓRIO**: Registrar mudanças em `./docs/changes/changes_yyyy_MM_dd.md`
- ✅ **QUANDO**: Sempre que solicitado, sugerir quando necessário
- ✅ **FORMATO**: Usar data real (executar `date "+%Y_%m_%d"` para data atual)

### **Uso de Referências**
- ✅ **Arquivos Markdown**: Usar como referência para estrutura
- ❌ **Não modificar** arquivos markdown sem solicitação explícita
- ✅ **Propósito**: Exemplos e padrões para organização de código

---

## 🔐 **Segurança e Ambiente**

### **Variáveis de Ambiente**
- ⚠️ **CRÍTICO**: Nunca sobrescrever arquivos `.env` sem confirmação explícita
- ✅ **Sempre perguntar** antes de modificações de ambiente
- ✅ **Validar** implicações de segurança

### **Organização de Arquivos**
- ✅ **Features**: Estrutura feature-driven em `/features/`
- ✅ **Shared**: Utilitários comuns em `/shared/`
- ✅ **Separação clara** entre concerns de frontend e backend

---

## ⚙️ **Metodologia de Desenvolvimento**

### **Obrigatório: Metodologia Etus**
- ✅ **SEMPRE seguir** @etus-methodology.mdc para desenvolvimento
- ✅ **Fase de planejamento** obrigatória com gates de aprovação
- ✅ **Execução sequencial** de fases com validações
- ✅ **Documentação obrigatória**: planos de implementação e lições aprendidas

### **Modo Planejador**
Quando solicitado "Modo Planejador":
1. Usar obrigatoriamente cursor-rule @etus-methodology.mdc
2. Seguir todos os passos do fluxo de desenvolvimento
3. Aguardar aprovações antes de executar

### **Modo Depurador**
Quando solicitado "Modo Depurador":
1. Refletir sobre 5-7 possíveis causas do problema
2. Reduzir para 1-2 causas mais prováveis
3. Adicionar logs estratégicos para validar suposições
4. Implementar correções após validação
5. Remover logs de debug após implementação

---

## 🎯 **Padrões de Qualidade**

### **Estados Obrigatórios**
- ✅ **Loading states**: Para todas operações assíncronas
- ✅ **Empty states**: Para todas listas de dados
- ✅ **Error handling**: Cenários de erro abrangentes
- ✅ **Responsive**: Design mobile-first

### **Suporte Bilíngue**
- ✅ **i18n implementado**: Suporte português/inglês
- ✅ **Tradução obrigatória**: Para todas interfaces de usuário
- ✅ **Consistência**: Manter padrões de tradução

---

## 🚫 **Anti-Padrões a Evitar**

### **Desenvolvimento**
- ❌ Implementar sem entender padrões existentes
- ❌ Criar funcionalidade duplicada
- ❌ Pular fases de análise e planejamento
- ❌ Fazer suposições sem validação
- ❌ Introduzir breaking changes sem estratégia de migração

### **Metodologia**
- ❌ Executar sem aprovação de plano
- ❌ Múltiplas fases simultaneamente
- ❌ Componentes fora do design system
- ❌ Assumir requisitos sem confirmar
- ❌ Não documentar decisões

---

## 🔍 **Processo de Análise Pós-Desenvolvimento**

### **Reflexão Obrigatória**
Após escrever código:
1. **Refletir profundamente** sobre escalabilidade e manutenibilidade
2. **Produzir análise** de 1-2 parágrafos sobre as mudanças
3. **Sugerir melhorias** ou próximos passos baseados na reflexão
4. **Considerar** performance, segurança e implicações de manutenção

### **Gates de Qualidade**
- ✅ **Code Review**: Mudança deve ser revisável e compreensível
- ✅ **Testing**: Considerar casos de teste e cenários extremos
- ✅ **Documentation**: Documentar decisões arquiteturais
- ✅ **Performance**: Considerar implicações de performance
- ✅ **Security**: Validar implicações de segurança

---

## 🤝 **Princípios de Colaboração**

### **Comunicação Clara**
- ✅ **Explicar decisões técnicas** claramente
- ✅ **Deixar rastros claros** para futuros desenvolvedores
- ✅ **Capturar aprendizados** para benefício da equipe
- ✅ **Aderir aos padrões** estabelecidos consistentemente

### **Documentação**
- ✅ **Registrar decisões** arquiteturais importantes
- ✅ **Documentar lógica complexa**
- ✅ **Manter documentação atualizada**
- ✅ **Compartilhar conhecimento**

---

## 📊 **Métricas de Sucesso**

### **Aderência aos Padrões**
- 100% uso do @etus/design-system
- 0 componentes customizados desnecessários
- Consistência visual em toda aplicação

### **Qualidade do Processo**
- Redução de retrabalho por falta de planejamento
- Menor tempo de desenvolvimento por reutilização
- Maior satisfação da equipe com processo estruturado

### **Documentação**
- 100% dos projetos com implementation_plan
- 100% dos projetos com lessons_learned
- Documentação atualizada e acessível

---

## 🏁 **Compromisso com a Excelência**

### **Declaração de Aderência**
- ✅ **SEMPRE seguir** metodologia estabelecida
- ✅ **SEMPRE usar** design system
- ✅ **SEMPRE documentar** decisões importantes
- ✅ **SEMPRE refletir** sobre qualidade e escalabilidade
- ✅ **SEMPRE priorizar** simplicidade e manutenibilidade

**Lema**: "Código simples, documentação clara, qualidade sempre" 