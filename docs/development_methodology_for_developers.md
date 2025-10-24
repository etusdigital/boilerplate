# 📚 Lições Aprendidas - Metodologia de Desenvolvimento (Para desenvolvedores)

**Data**: 29/07/2025  
**Contexto**: Descrição PTBr da cursor-rule `@etus-methodology.mdc`
**Projeto**: Processo de Desenvolvimento de Features

---

## 🎯 **Objetivos**
Documentar a metodologia estabelecida para desenvolvimento de features, componentes e telas, garantindo consistência e aderência aos padrões da empresa. Essa é a metodologia da cursor-rule `@etus-methodology.mdc`

---

## 🏗️ **Estrutura Base - Design System**

### **Princípio Fundamental**
- ✅ **Usar SEMPRE o @Etus Design System** como base
- ✅ **Seguir padrões pré-estabelecidos** da empresa
- ❌ **Evitar alucinações** fora dos padrões estabelecidos
- ❌ **Não criar componentes customizados** sem necessidade declarada

### **Exceções Permitidas**
- ✅ **Apenas quando específico e necessário** (ex: vue-flow para steps)
- ✅ **Quando declaradamente pedido** pelo solicitante
- ✅ **Com justificativa técnica** clara e documentada

### **Regra de Ouro**
> "Tudo que formos fazer estará baseado no design system, exceto quando for algo muito específico e necessário"

---

## 🔄 **Metodologia de Desenvolvimento**

### **Fluxo Obrigatório**
```
1. 📝 Descrição
2. ❓ Questionamento  
3. 📋 Planejamento
4. 🏗️ Estruturação
5. ⚡ Execução
6. 🔍 Revisão
7. 🔧 Ajuste (se houver)
8. 📚 Documentação Final
```

### **🚨 REGRA CRÍTICA: Processo de Aprovação**

#### **Etapa 3: Planejamento - OBRIGATÓRIA APROVAÇÃO**
- ✅ **SEMPRE submeter** o plano de implementação completo ao usuário
- ✅ **AGUARDAR aprovação** antes de iniciar qualquer execução
- ✅ **Permitir ajustes** pontuais no planejamento
- ❌ **NUNCA iniciar execução** sem aprovação explícita

#### **Etapa 5: Execução - INCREMENTAL E APROVADA**
- ✅ **Executar APENAS UMA FASE** por vez
- ✅ **AGUARDAR aprovação** antes de prosseguir para próxima fase
- ✅ **Submeter resultado** de cada fase para validação
- ❌ **NUNCA executar múltiplas fases** simultaneamente
- ❌ **NUNCA prosseguir** sem aprovação da fase atual

#### **Fluxo de Execução Correto:**
```
1. Criar implementation_plan → SUBMETER → AGUARDAR APROVAÇÃO
2. Executar Fase 1 → SUBMETER → AGUARDAR APROVAÇÃO
3. Executar Fase 2 → SUBMETER → AGUARDAR APROVAÇÃO
4. Executar Fase N → SUBMETER → AGUARDAR APROVAÇÃO
5. Finalizar → Documentar lições aprendidas
```

#### **❌ ERRO COMUM: Execução em Bloco**
```
❌ ERRADO: Executar Fase 1 + 2 + 3 + 4 + 5 de uma vez
✅ CORRETO: Executar Fase 1 → Aprovação → Fase 2 → Aprovação...
```

### **🎯 Objetivo do Processo Incremental**
- **Controle de Qualidade**: Validação em cada etapa
- **Ajustes Pontuais**: Correções antes de prosseguir
- **Alinhamento Contínuo**: Garantir que está seguindo expectativas
- **Base para Cursor-Rules**: Processo estruturado para automação

### **1. 📝 Descrição**
- **O que**: Entender claramente o que precisa ser desenvolvido
- **Por que**: Compreender o objetivo e contexto
- **Para quem**: Identificar usuários e stakeholders

### **2. ❓ Questionamento**
- **Sempre perguntar ao máximo** as necessidades
- **Identificar padrões** existentes que podem ser reutilizados
- **Definir parâmetros** e restrições
- **Esclarecer edge cases** e cenários especiais

**Perguntas Essenciais:**
- Qual o padrão visual esperado?
- Há componentes similares no design system?
- Quais são os estados necessários (loading, error, empty)?
- Como deve se comportar em diferentes dispositivos?
- Há integrações com outras partes do sistema?

### **3. 📋 Planejamento**
- **Criar implementation_plan** detalhado
- **Dividir em fases** lógicas e testáveis
- **Definir critérios de aceitação** claros
- **Identificar dependências** e riscos

### **4. 🏗️ Estruturação**
- **Definir arquitetura** dos componentes
- **Mapear interfaces** e tipos TypeScript
- **Planejar composables** e reutilização
- **Estruturar arquivos** seguindo convenções

### **5. ⚡ Execução**
- **Implementar fase por fase** conforme planejado
- **Testar cada etapa** antes de avançar
- **Seguir padrões** estabelecidos
- **Documentar decisões** importantes

### **6. 🔍 Revisão**
- **Validar funcionamento** completo
- **Verificar aderência** aos padrões
- **Testar edge cases** identificados
- **Confirmar critérios** de aceitação

### **7. 🔧 Ajuste (se houver)**
- **Implementar correções** necessárias
- **Otimizar performance** se aplicável
- **Melhorar UX** baseado em feedback
- **Refatorar código** se necessário

### **8. 📚 Documentação Final**
- **Atualizar implementation_plan** com status final
- **Criar lessons_learned** com insights
- **Documentar padrões** reutilizáveis
- **Registrar decisões** arquiteturais

---

## 📁 **Documentação Obrigatória**

### **Implementation Plans**
- **Localização**: `apps/frontend/implementation_plans/`
- **Formato**: `[feature-name]_yyyy_MM_dd.md`
- **Conteúdo**: Fases, tasks, critérios, detalhes técnicos

### **Lessons Learned**
- **Localização**: `apps/frontend/lessons_learned/`
- **Formato**: `[topic-name]_yyyy_MM_dd.md`
- **Conteúdo**: Padrões, armadilhas, recomendações

---

## 📝 **Versionamento e Evolução da Documentação**

### **Regras de Versionamento**

#### **Data no Nome do Arquivo**
- ✅ **Data = Data de Criação** do arquivo
- ✅ **Manter mesmo arquivo** durante evolução da funcionalidade
- ❌ **Não criar novos arquivos** para mesma funcionalidade

#### **Evolução de Conteúdo**

**Cenário 1: Continuidade do Desenvolvimento**
- ✅ **Evoluir o mesmo arquivo** sem novos apontamentos
- ✅ **Atualizar status** e informações existentes
- ✅ **Manter cronologia** natural do desenvolvimento

**Cenário 2: Conhecimento Novo Não Abordado**
- ✅ **Criar novo tópico** dentro do mesmo arquivo
- ✅ **Incluir título, data da alteração** e descrição
- ✅ **Preservar conteúdo anterior** intacto

**Cenário 3: Pontos Conflitantes**
- ✅ **Atualizar informações** conflitantes diretamente
- ✅ **Sobrescrever** informações obsoletas
- ✅ **Manter coerência** do documento

### **Estrutura para Novos Tópicos**

```markdown
---

## 🆕 **[Título do Novo Tópico]**
**Data**: DD/MM/YYYY  
**Contexto**: [Descrição do contexto da adição]

[Conteúdo do novo conhecimento]

---
```

### **Benefícios desta Abordagem**

✅ **Histórico Centralizado**: Todo conhecimento sobre uma funcionalidade em um local  
✅ **Evolução Natural**: Documentação cresce junto com o desenvolvimento  
✅ **Facilita Cursor-Rules**: Base sólida para automação futura  
✅ **Reduz Fragmentação**: Evita múltiplos arquivos sobre mesmo tema  

### **Objetivo Final: Cursor-Rules**
Esta metodologia de documentação está sendo estruturada para:
- **Alimentar cursor-rules** poderosas e precisas
- **Criar base de conhecimento** consistente e evolutiva  
- **Permitir automação** de padrões estabelecidos
- **Facilitar onboarding** de novos desenvolvedores

---

## ⚠️ **Armadilhas a Evitar**

### **1. Não Seguir o Processo de Aprovação** 🚨
- ❌ Executar implementação sem aprovação do plano
- ❌ Executar múltiplas fases simultaneamente
- ❌ Prosseguir sem aprovação de cada fase
- ❌ Assumir que o plano está correto sem validação

### **2. Não Seguir o Design System**
- ❌ Criar componentes do zero quando há equivalentes
- ❌ Usar bibliotecas externas sem necessidade
- ❌ Inventar padrões visuais próprios

### **3. Pular Etapas da Metodologia**
- ❌ Começar a desenvolver sem questionamento
- ❌ Não criar documentation plans
- ❌ Não documentar lições aprendidas

### **4. Não Questionar Suficientemente**
- ❌ Assumir requisitos sem confirmar
- ❌ Não identificar padrões existentes
- ❌ Não esclarecer edge cases

### **5. Não Documentar Decisões**
- ❌ Deixar código sem contexto
- ❌ Não registrar por que certas decisões foram tomadas
- ❌ Não compartilhar aprendizados

### **6. Fragmentar Documentação**
- ❌ Criar múltiplos arquivos para mesma funcionalidade
- ❌ Não evoluir documentação existente
- ❌ Perder histórico de decisões

---

## 🚀 **Benefícios da Metodologia**

### **1. Consistência**
- Todos os desenvolvimentos seguem o mesmo padrão
- Reduz variabilidade e inconsistências
- Facilita manutenção e evolução

### **2. Qualidade**
- Questionamento prévio evita retrabalho
- Planejamento reduz bugs e problemas
- Revisão garante aderência aos padrões

### **3. Eficiência**
- Reutilização de padrões existentes
- Menos tempo gasto em decisões de design
- Documentação facilita desenvolvimentos futuros

### **4. Conhecimento Compartilhado**
- Lições aprendidas beneficiam toda equipe
- Padrões documentados aceleram novos projetos
- Reduz dependência de pessoas específicas

### **5. Base para Automação**
- Documentação estruturada alimenta cursor-rules
- Padrões claros permitem automação de tarefas
- Metodologia consistente facilita templates

---

## 📊 **Métricas de Sucesso**

### **Aderência aos Padrões**
- 100% dos componentes usando design system
- 0 componentes customizados desnecessários
- Consistência visual em toda aplicação

### **Documentação**
- 100% dos projetos com implementation_plan
- 100% dos projetos com lessons_learned
- Documentação atualizada e acessível

### **Qualidade do Processo**
- Redução de retrabalho por falta de questionamento
- Menor tempo de desenvolvimento por reutilização
- Maior satisfação da equipe com processo estruturado

### **Evolução da Documentação**
- Documentos evoluem junto com funcionalidades
- Conhecimento centralizado por tema
- Base sólida para cursor-rules futuras

---

## 🏁 **Conclusão**

A metodologia estabelecida garante:
1. **Aderência ao Design System** - Consistência visual e funcional
2. **Processo Estruturado** - Do questionamento à documentação
3. **Qualidade Garantida** - Revisão e ajustes sistemáticos
4. **Conhecimento Preservado** - Documentação evolutiva e centralizada
5. **Base para Automação** - Estrutura para cursor-rules poderosas

**Lema**: "Questionar primeiro, desenvolver depois, documentar sempre"

---

## 🤝 **Compromisso com a Metodologia**

### **Declaração de Aderência**
- ✅ **SEMPRE seguir** o processo de aprovação
- ✅ **SEMPRE executar** fase por fase
- ✅ **SEMPRE aguardar** aprovação antes de prosseguir
- ✅ **SEMPRE submeter** planos para validação
- ✅ **SEMPRE documentar** lições aprendidas

### **Consequências do Não Cumprimento**
- ❌ **Retrabalho** por falta de alinhamento
- ❌ **Perda de qualidade** por falta de validação
- ❌ **Fragmentação** do conhecimento
- ❌ **Prejuízo** para cursor-rules futuras

### **Benefícios da Aderência Rigorosa**
- ✅ **Maior assertividade** nas entregas
- ✅ **Melhor qualidade** do código
- ✅ **Conhecimento estruturado** para automação
- ✅ **Processo escalável** para toda equipe

---

## 📝 **Próximos Passos**

1. Aplicar metodologia em todos os novos desenvolvimentos
2. Revisar projetos existentes para aderência aos padrões
3. Criar templates para implementation_plans e lessons_learned
4. Treinar equipe na metodologia estabelecida
5. Evoluir documentação existente seguindo regras de versionamento
6. Preparar base de conhecimento para cursor-rules futuras 

---

## 🆕 **Metodologia de Análise e Correção de Problemas**
**Data**: 02/07/2025  
**Contexto**: Estruturação do processo de identificação e correção de falhas em implementações

### **Objetivo**
Estabelecer um processo estruturado para analisar e corrigir problemas identificados em implementações, garantindo que as correções sejam precisas e alinhadas com os critérios originais.

### **Fluxo de Análise e Correção**
```
1. 🔍 Identificação do Problema
2. 📋 Recuperação dos Critérios Originais  
3. 🎯 Análise de Gap (O que deveria ser vs. O que está)
4. ❓ Questionamento Estruturado ao Usuário
5. 📝 Coleta de Informações Específicas
6. 🔧 Implementação das Correções
7. ✅ Validação Final
```

### **1. 🔍 Identificação do Problema**
**Quando o usuário reporta**: "algo não está de acordo" ou "comportamento não está como esperado"

**Ações Imediatas:**
- ✅ Registrar o problema reportado
- ✅ Identificar a fase/etapa específica afetada
- ✅ Não assumir qual é o problema real

### **2. 📋 Recuperação dos Critérios Originais**
**Buscar no implementation_plan:**
- ✅ **Tasks** da fase específica
- ✅ **Critérios de Aceitação** definidos
- ✅ **Detalhes Técnicos** especificados
- ✅ **Comportamentos esperados** documentados

### **3. 🎯 Análise de Gap**
**Estruturar comparação:**
```markdown
## 📊 Análise de Gap - [Fase X]

### O que DEVERIA estar funcionando:
- [ ] Critério 1 (conforme plano)
- [ ] Critério 2 (conforme plano)
- [ ] Comportamento X (conforme detalhes técnicos)

### O que PODE estar com problema:
- ❓ Comportamento Y não está conforme esperado
- ❓ Estado Z não está sendo aplicado corretamente
- ❓ Integração W pode estar falhando
```

### **4. ❓ Questionamento Estruturado ao Usuário**
**Perguntas Obrigatórias:**
1. **Contexto Específico**: "Em qual cenário exato você identificou o problema?"
2. **Comportamento Atual**: "O que está acontecendo atualmente?"
3. **Comportamento Esperado**: "O que deveria estar acontecendo?"
4. **Reprodução**: "Quais passos levam ao problema?"
5. **Ambiente**: "Em que condições isso acontece (criação/edição/dados específicos)?"

**Perguntas Direcionadas por Fase:**
- **Fase 1-2**: Problemas de interface, carregamento, API
- **Fase 3**: Problemas de seleção, persistência em criação
- **Fase 4**: Problemas de estados, comportamentos de edição
- **Fase 5**: Problemas de merge, duplicação, ordenação

### **5. 📝 Coleta de Informações Específicas**
**Estruturar coleta sequencial:**
```markdown
## 🔍 Informações para Correção

### Informação 1: [Pergunta específica]
**Resposta do usuário**: [Aguardando]
**Impacto**: [Como isso afeta a correção]

### Informação 2: [Pergunta específica]  
**Resposta do usuário**: [Aguardando]
**Impacto**: [Como isso afeta a correção]
```

### **6. 🔧 Implementação das Correções**
**Após coleta completa:**
- ✅ **Criar Plano de Correção** estruturado quando necessário
- ✅ Implementar correções baseadas nas informações coletadas
- ✅ Manter aderência aos critérios originais
- ✅ Testar cenários específicos reportados
- ✅ Validar que não quebrou outras funcionalidades

### **6.1 📋 Planos de Correção**
**Quando criar:**
- Quando as correções são complexas e envolvem múltiplas etapas
- Quando há alterações significativas na lógica existente
- Quando é necessário quebrar em sub-etapas para melhor controle

**Onde anexar:**
- ✅ **Anexar no implementation_plan** logo após a fase específica
- ✅ **Formato**: `## 🔧 Plano de Correção - Fase X`
- ✅ **Estrutura**: Problemas identificados → Etapas de correção → Critérios de validação

**Benefícios:**
- ✅ Mantém histórico de problemas e soluções
- ✅ Permite validação antes da implementação
- ✅ Facilita revisão e aprendizado futuro

### **7. ✅ Validação Final**
- ✅ Confirmar que problema original foi resolvido
- ✅ Verificar critérios de aceitação da fase
- ✅ Documentar correções realizadas
- ✅ Atualizar implementation_plan se necessário

---

### **Template de Análise de Problemas**

```markdown
# 🚨 Análise de Problema - [Fase X]

## 📋 Critérios Originais
[Recuperados do implementation_plan]

## 🎯 Gap Identificado
**O que deveria funcionar:**
- [ ] Item 1
- [ ] Item 2

**O que pode estar com problema:**
- ❓ Problema A
- ❓ Problema B

## ❓ Questionamentos para o Usuário

### 1. Contexto Específico
**Pergunta**: [Pergunta específica]
**Por que precisamos saber**: [Justificativa]

### 2. Comportamento Atual vs. Esperado
**Pergunta**: [Pergunta específica]
**Por que precisamos saber**: [Justificativa]

## 📝 Próximos Passos
1. Aguardar respostas do usuário
2. Implementar correções baseadas nas informações
3. Validar funcionamento completo
```

### **Benefícios desta Metodologia**
✅ **Correções Precisas**: Baseadas em critérios claros e informações específicas  
✅ **Evita Suposições**: Questionamento estruturado elimina "achismos"  
✅ **Eficiência**: Coleta sequencial evita idas e vindas desnecessárias  
✅ **Qualidade**: Validação sistemática garante que correção resolve o problema real  
✅ **Documentação**: Registro do processo para aprendizado futuro  

---

## 🆕 **Responsabilidades e Regras dos Documentos**
**Data**: 02/07/2025  
**Contexto**: Definição clara das responsabilidades de cada tipo de documento para evitar mistura de conteúdo

### **Objetivo**
Estabelecer regras claras sobre o que deve e não deve ser incluído em cada tipo de documento, garantindo que cada arquivo tenha sua função específica bem definida.

### **📋 Tipos de Documentos e Suas Responsabilidades**

#### **1. 🔧 Metodologia de Desenvolvimento (`development_methodology_*.md`)**
**Propósito**: Como planejar e fazer, não o que fazer

**✅ DEVE conter:**
- Conjunto de regras, normas e padrões para desenvolvimento
- Descrição dos fluxos de desenvolvimento
- Fluxo de correção de problemas
- Processos e metodologias
- Templates de análise e correção
- Regras de documentação
- Princípios e diretrizes

**❌ NÃO deve conter:**
- Código implementado
- Detalhes técnicos específicos de features
- Registros de implementação
- Exemplos de código completos

#### **2. 📋 Plano de Implementação (`*_implementation_plan_*.md`)**
**Propósito**: Registro visual da execução planejada e informações para entendimento das features

**✅ DEVE conter:**
- Fases e etapas do desenvolvimento
- Tasks e critérios de aceitação
- Status de progresso (✅ / ❌)
- Detalhes técnicos conceituais
- Arquivos envolvidos
- Traduções necessárias
- Planos de correção estruturados
- Contexto e objetivos das features

**❌ NÃO deve conter:**
- Código implementado completo
- Snippets de código extensos
- Implementações detalhadas
- Exemplos de código funcional

#### **3. 📚 Lições Aprendidas (`*_lessons_learned_*.md`)**
**Propósito**: Aprender com o desenvolvimento - pontos positivos e negativos

**✅ PODE conter (moderadamente e pontualmente):**
- Aprendizados arquiteturais
- Templates e padronizações
- Boas práticas adotadas
- Armadilhas evitadas
- Padrões de design estabelecidos
- Snippets pequenos para ilustrar padrões
- Estruturas de componentes (templates)

**❌ NÃO deve conter:**
- Códigos inteiros desenvolvidos
- Implementações completas
- Detalhes de implementação específica
- Histórico de desenvolvimento passo a passo

### **🎯 Regras de Ouro**

#### **Regra 1: Separação de Responsabilidades**
- **Metodologia**: COMO fazer
- **Plano**: O QUE fazer e status
- **Lições**: O QUE aprender

#### **Regra 2: Código nos Documentos**
- **Metodologia**: ❌ NUNCA código
- **Plano**: ❌ NUNCA código completo
- **Lições**: ✅ Apenas snippets pequenos para ilustrar padrões

#### **Regra 3: Foco de Cada Documento**
- **Metodologia**: Processo e regras
- **Plano**: Execução e progresso
- **Lições**: Aprendizado e padrões

### **🔍 Exemplos de Uso Correto**

#### **Metodologia - Exemplo Correto:**
```markdown
### Fluxo de Correção de Problemas
1. Identificar o problema
2. Recuperar critérios originais
3. Implementar correção
4. Validar resultado
```

#### **Plano - Exemplo Correto:**
```markdown
### Etapa 4.1: Corrigir Estado Inicial ✅
**Tasks:**
- [x] Remover validação de órfãs no carregamento
- [x] Implementar estado local persistente
**Critérios:** Estado inicial sem flash de erro
```

#### **Lições - Exemplo Correto:**
```markdown
### Padrão de Ícones
```css
.action-icon {
    color: var(--color-neutral-600);
}
```
**Regra:** Sempre usar cores neutras para ícones de ação
```
### **🚫 Exemplos de Uso Incorreto**

#### **❌ Metodologia com Código:**
```markdown
// ERRADO: Não colocar implementações na metodologia
const unlockProperty = (propertyName: string) => {
    // implementação completa...
}
```

#### **❌ Plano com Código Completo:**
```markdown
// ERRADO: Não colocar código funcional no plano
**Implementação Técnica:**
const convertToJsonbFormat = (selectedValues: Record<string, string>): any[] => {
    // 50 linhas de código...
}
```

### **🎯 Benefícios da Separação Correta**

1. **Clareza**: Cada documento tem propósito específico
2. **Manutenibilidade**: Fácil localização de informações
3. **Cursor-Rules**: Base sólida para automação
4. **Escalabilidade**: Padrão replicável para outras features
5. **Legibilidade**: Documentos focados e objetivos

### **📝 Checklist de Validação**

Antes de salvar qualquer documento, verificar:

**Para Metodologia:**
- [ ] Contém apenas processos e regras?
- [ ] Não há código implementado?
- [ ] Foca no "como fazer"?

**Para Plano:**
- [ ] Contém status e progresso?
- [ ] Não há código completo?
- [ ] Foca no "o que fazer"?

**Para Lições:**
- [ ] Contém aprendizados e padrões?
- [ ] Código é apenas ilustrativo?
- [ ] Foca no "o que aprender"?

---

## 🆕 **Lição Aprendida: Importância do Processo de Aprovação**
**Data**: 07/01/2025  
**Contexto**: Erro identificado durante desenvolvimento de múltiplas URLs

### **Problema Identificado**
Durante o desenvolvimento da funcionalidade de múltiplas URLs, foi cometido o erro de:
- Executar todas as fases do plano de implementação simultaneamente
- Não aguardar aprovação do plano antes de iniciar execução
- Não submeter cada fase individualmente para validação

### **Impacto do Erro**
- **Falta de controle**: Usuário não pôde validar cada etapa
- **Perda de qualidade**: Sem validação incremental
- **Quebra da metodologia**: Não seguiu processo estruturado
- **Prejuízo futuro**: Má base para cursor-rules

### **Correção Implementada**
- ✅ Adicionada seção **"REGRA CRÍTICA: Processo de Aprovação"**
- ✅ Incluída armadilha **"Não Seguir o Processo de Aprovação"**
- ✅ Criada seção **"Compromisso com a Metodologia"**
- ✅ Documentado fluxo correto vs. fluxo incorreto

### **Regra Reforçada**
```
NUNCA executar múltiplas fases simultaneamente
SEMPRE aguardar aprovação antes de prosseguir
SEMPRE submeter planos para validação prévia
```

### **Aplicação Futura**
- **Toda funcionalidade** deve seguir processo incremental
- **Toda fase** deve ser aprovada individualmente
- **Todo plano** deve ser validado antes da execução
- **Toda violação** deve ser documentada e corrigida

--- 
