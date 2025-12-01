# Arquitetura dos Templates React e Next.js

> **Documentação Técnica Completa**
> Data: 28 de Novembro de 2024
> Versão: 1.0

## Índice

1. [Estrutura Geral do Boilerplate](#1-estrutura-geral-do-boilerplate)
2. [Pacote Compartilhado (`@boilerplate/ui-react`)](#2-pacote-compartilhado-boilerplateui-react)
3. [Fluxo Completo do CSS](#3-fluxo-completo-do-css)
4. [Especificidade e Prioridade CSS](#4-especificidade-e-prioridade-css)
5. [Configurações Tailwind](#5-configurações-tailwind)
6. [CSS Sobrescrito e Inútil](#6-css-sobrescrito-e-inútil)
7. [Resumo Executivo](#7-resumo-executivo)

---

## 1. ESTRUTURA GERAL DO BOILERPLATE

```
boilerplate/
├─ packages/
│  └─ ui-react/              ← PACOTE COMPARTILHADO
│     ├─ src/
│     │  ├─ assets/
│     │  │  └─ main.css      ← 184 linhas - DESIGN SYSTEM único
│     │  ├─ components/
│     │  │  ├─ ui/           ← 14 componentes Shadcn/UI
│     │  │  └─ shared/       ← 3 componentes customizados
│     │  ├─ lib/
│     │  │  └─ utils.ts      ← Função `cn()` para tailwind-merge
│     │  └─ index.ts         ← Exporta tudo
│     └─ package.json        ← Exports: "." e "./styles"
│
├─ templates/
│  ├─ react/                 ← TEMPLATE REACT
│  │  ├─ src/
│  │  │  ├─ main.tsx         ← import '@boilerplate/ui-react/styles'
│  │  │  ├─ features/        ← Features do app (users, accounts)
│  │  │  └─ app/             ← App components
│  │  ├─ tailwind.config.js  ← Config Tailwind (content paths)
│  │  ├─ postcss.config.js   ← ⚠️ PostCSS com Tailwind plugin
│  │  ├─ vite.config.ts      ← ⚠️ Vite com Tailwind plugin
│  │  └─ package.json        ← "@boilerplate/ui-react": "workspace:*"
│  │
│  └─ nextjs/                ← TEMPLATE NEXT.JS
│     ├─ app/
│     │  ├─ globals.css      ← @import '@boilerplate/ui-react/styles'
│     │  └─ layout.tsx
│     ├─ features/           ← Features do app
│     ├─ tailwind.config.js  ← Config Tailwind (content paths)
│     ├─ postcss.config.js   ← PostCSS com Tailwind plugin
│     ├─ next.config.js      ← transpilePackages: ['@boilerplate/ui-react']
│     └─ package.json        ← "@boilerplate/ui-react": "workspace:*"
```

---

## 2. PACOTE COMPARTILHADO (`@boilerplate/ui-react`)

### 2.1 Propósito e Arquitetura

O pacote `@boilerplate/ui-react` é o **núcleo do design system** compartilhado entre React e Next.js.

**Estrutura de Exports** (`package.json`):
```json
{
  "exports": {
    ".": "./src/index.ts",              ← Componentes TS
    "./styles": "./src/assets/main.css"  ← CSS único
  }
}
```

Isso permite dois tipos de imports:
```typescript
// Import componentes
import { Button, Table, TablePagination } from '@boilerplate/ui-react'

// Import CSS
import '@boilerplate/ui-react/styles'  // React
@import '@boilerplate/ui-react/styles'; /* Next.js */
```

### 2.2 Componentes (`/packages/ui-react/src/components/`)

**Componentes UI (14 arquivos):**
- Baseados em Shadcn/UI + Radix UI
- `alert-dialog.tsx`, `avatar.tsx`, `button.tsx`, `checkbox.tsx`
- `dropdown-menu.tsx`, `input.tsx`, `label.tsx`, `select.tsx`
- `sheet.tsx`, `skeleton.tsx`, `sonner.tsx`, `table.tsx`
- `textarea.tsx`, `tooltip.tsx`

**Componentes Shared (3 arquivos):**
- `TablePagination.tsx` - Paginação de tabelas (174 linhas)
- `SortableTableHead.tsx` - Cabeçalho ordenável (40 linhas)
- `TitleBar.tsx` - Barra de título de páginas (42 linhas)

**Características:**
- TypeScript com tipos fortes
- Usam `cn()` do `lib/utils.ts` para merge de classes Tailwind
- Dependem de CSS customizado do `main.css`
- Todos exportados via `/src/index.ts`

### 2.3 CSS Centralizado (`/packages/ui-react/src/assets/main.css`)

Este é o **coração do design system**. 184 linhas divididas em:

#### LINHA 1: Import Tailwind v4
```css
@import "tailwindcss";
```
- Importa o engine CSS-first do Tailwind v4
- Não é o clássico `@tailwind base/components/utilities`
- Novo sistema do Tailwind v4

#### LINHAS 3-86: @theme{} - Design Tokens
```css
@theme {
  /* Spacing Tokens (20 linhas) */
  --spacing-xxs: 0.25rem;   /* 4px */
  --spacing-xs: 0.5rem;     /* 8px */
  --spacing-sm: 0.75rem;    /* 12px */
  --spacing-base: 1.08rem;  /* ~17px */
  --spacing-md: 1.25rem;    /* 20px */
  --spacing-lg: 1.5rem;     /* 24px */
  --spacing-xl: 2rem;       /* 32px */
  --spacing-2xl: 2.5rem;    /* 40px */

  /* Table Spacing (específico) */
  --spacing-table-head-y: 0.55rem;  /* 8.8px */
  --spacing-table-cell-y: 0.55rem;  /* 8.8px */

  /* Border Tokens (10 linhas) */
  --border-width-xxs: px;
  --border-width-xs: 2px;
  --radius-base: 0.5rem;    /* 8px */
  --radius-sm: 0.375rem;    /* 6px */
  --radius-md: 0.75rem;     /* 12px */
  --radius-lg: 1rem;        /* 16px */

  /* Line Height Tokens (12 linhas) */
  --line-height-xxs: 1;
  --line-height-xs: 1.25;
  --line-height-sm: 1.375;
  --line-height-base: 1.5;
  --line-height-lg: 1.75;
  --line-height-xl: 2;

  /* Color Tokens - Light Mode (28 linhas) */
  --color-background: #fbfaf9;
  --color-foreground: #09090b;
  --color-card: #ffffff;
  --color-primary: #066e3e;
  --color-destructive: #ef4444;
  --color-table-text: #151514;
  /* ... (20+ cores) */
}
```

**O que é `@theme`?**
- Recurso específico do Tailwind v4
- Define CSS variables que viram classes utilitárias
- `--spacing-lg` gera `.gap-lg`, `.p-lg`, `.m-lg`
- `--color-primary` gera `.bg-primary`, `.text-primary`, `.border-primary`

#### LINHAS 88-110: Dark Mode
```css
.dark {
  --color-background: #09090b;
  --color-foreground: #fafafa;
  /* ... overrides de cores */
}
```
- Sobrescreve variáveis para tema escuro
- Ativado via classe `.dark` no `<html>`

#### LINHAS 112-134: Dark Mode Form Fields
```css
.dark input,
.dark textarea,
.dark select {
  background-color: #18181b !important;
  border-color: #3f3f46 !important;
  color: #fafafa !important;
}
```
- Estilos específicos para inputs em modo escuro
- Usa `!important` para garantir aplicação

#### LINHAS 136-167: Global Styles
```css
html, body { height: 100%; overflow-x: hidden; }
body {
  background-color: #FBFCFD;
  font-family: 'Space Grotesk', sans-serif;
  font-smoothing: antialiased;
  line-height: 1.5;
  margin: 0;
  padding: 0;
}
#root { height: 100%; overflow-x: hidden; }
.main-container { max-width: 1900px; margin: 0 auto; }
```

#### LINHAS 169-184: Icon Styles
```css
span.material-symbols-rounded {
  font-size: 20px;
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
```

---

## 3. FLUXO COMPLETO DO CSS

### 3.1 Template React - Processamento do CSS

```
┌─────────────────────────────────────────────────────────┐
│ 1. INÍCIO: src/main.tsx                                 │
│    import '@boilerplate/ui-react/styles'                │
└──────────────────┬──────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────┐
│ 2. RESOLUÇÃO: pnpm workspace protocol                   │
│    '@boilerplate/ui-react/styles' →                     │
│    /packages/ui-react/src/assets/main.css               │
└──────────────────┬──────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────┐
│ 3. ⚠️ PROCESSAMENTO DUPLO (PROBLEMA!)                   │
│                                                          │
│    CAMINHO A: Vite Plugin                               │
│    ├─ vite.config.ts: tailwindcss()                     │
│    ├─ Processa main.css via @tailwindcss/vite          │
│    └─ Gera CSS com base em @theme + content scanning   │
│                                                          │
│    CAMINHO B: PostCSS Plugin (executado DEPOIS)         │
│    ├─ postcss.config.js: '@tailwindcss/postcss'        │
│    ├─ Processa CSS NOVAMENTE                            │
│    └─ Pode SOBRESCREVER CSS do Caminho A               │
└──────────────────┬──────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────┐
│ 4. CONTENT SCANNING: tailwind.config.js                │
│    content: [                                            │
│      './src/**/*.{ts,tsx}',  ← Escaneia template       │
│      '../../packages/ui-react/src/**/*.{ts,tsx}'        │
│                               ← Escaneia pacote shared  │
│    ]                                                     │
│                                                          │
│    Tailwind JIT encontra classes usadas:                │
│    - Em /templates/react/src/: py-4, px-3, etc         │
│    - Em /packages/ui-react/src/: todas as classes      │
└──────────────────┬──────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────┐
│ 5. GERAÇÃO DE CSS FINAL                                 │
│    ├─ @theme → Classes utilitárias (gap-lg, p-base)    │
│    ├─ Classes padrão Tailwind (py-4, px-3)             │
│    ├─ Global styles (body, .dark, etc)                 │
│    └─ Bundle final injetado no HTML                    │
└─────────────────────────────────────────────────────────┘
```

#### ⚠️ PROBLEMA IDENTIFICADO: Processamento Duplo

O React template tem **PROCESSAMENTO DUPLO** do Tailwind:
1. **Vite plugin** (`@tailwindcss/vite`) processa primeiro
2. **PostCSS plugin** (`@tailwindcss/postcss`) processa depois

Isso causa:
- **CSS gerado duas vezes**
- **Ordem de classes imprevisível**
- **Possível sobrescrita** de classes
- **`py-4 px-3` podem não funcionar** se segunda passada zerar padding

**Em Tailwind v4, você deve usar APENAS UM:**
- OU `@tailwindcss/vite` (para Vite)
- OU `@tailwindcss/postcss` (para outros bundlers)
- NUNCA os dois juntos!

### 3.2 Template Next.js - Processamento do CSS

```
┌─────────────────────────────────────────────────────────┐
│ 1. INÍCIO: app/globals.css                              │
│    @import '@boilerplate/ui-react/styles';              │
└──────────────────┬──────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────┐
│ 2. RESOLUÇÃO: pnpm workspace + transpilePackages        │
│    next.config.js:                                       │
│      transpilePackages: ['@boilerplate/ui-react']       │
│                                                          │
│    Next.js transpila o pacote e resolve o import        │
│    '@boilerplate/ui-react/styles' →                     │
│    /packages/ui-react/src/assets/main.css               │
└──────────────────┬──────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────┐
│ 3. PROCESSAMENTO ÚNICO: PostCSS                         │
│    ├─ postcss.config.js: '@tailwindcss/postcss'        │
│    ├─ Processa main.css UMA VEZ                         │
│    └─ Gera CSS baseado em @theme + content scanning    │
└──────────────────┬──────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────┐
│ 4. CONTENT SCANNING: tailwind.config.js                │
│    content: [                                            │
│      './app/**/*.{js,ts,jsx,tsx}',  ← Escaneia template│
│      './features/**/*.{js,ts,jsx,tsx}',                 │
│      '../../packages/ui-react/src/**/*.{ts,tsx}'        │
│                                      ← Escaneia shared  │
│    ]                                                     │
└──────────────────┬──────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────┐
│ 5. BUILD NEXT.JS                                        │
│    ├─ CSS é processado e otimizado                     │
│    ├─ Colocado em _next/static/css/                    │
│    └─ Injetado automaticamente no HTML                  │
└─────────────────────────────────────────────────────────┘
```

**✅ Next.js está CORRETO:**
- Usa apenas `@tailwindcss/postcss` (processamento único)
- Sem conflitos de CSS

---

## 4. ESPECIFICIDADE E PRIORIDADE CSS

### 4.1 Ordem de Carregamento

```
1. Tailwind Preflight (reset básico)
   ↓
2. @theme variables (CSS custom properties)
   ↓
3. Utilidades Tailwind geradas (classes .py-4, .px-3, etc)
   ↓
4. Global styles do main.css (body, .dark, etc)
   ↓
5. Component styles inline (style={{...}})
```

### 4.2 Especificidade CSS (menor → maior)

```
Especificidade    Exemplo                          Peso
────────────────────────────────────────────────────────
0,0,0,1          elemento (td, div, span)           1
0,0,1,0          .classe                           10
0,0,1,1          .classe elemento (div.card)       11
0,0,2,0          .classe1 .classe2                 20
0,1,0,0          #id                              100
1,0,0,0          style="..."                     1000
∞                !important                        ∞
```

**Exemplo no nosso caso:**

```css
/* Especificidade 0,0,1,0 (10) */
.py-4 { padding-top: 1rem; padding-bottom: 1rem; }

/* Especificidade 0,0,2,1 (21) - GANHA */
.TableFooter td { padding: 0; }

/* Especificidade 1,0,0,0 (1000) - FORÇA */
style="padding: 1rem 0.75rem"
```

Se houver um seletor como `.TableFooter td` definido em algum lugar, ele **sobrescreve** `.py-4` mesmo que apareça primeiro no CSS, porque tem maior especificidade (classe + elemento = 21 vs classe = 10).

### 4.3 O que Tailwind v4 `@theme` Gera

```css
/* Input: @theme { --spacing-lg: 1.5rem; } */

/* Output gerado pelo Tailwind: */
.gap-lg { gap: var(--spacing-lg); }
.p-lg { padding: var(--spacing-lg); }
.px-lg { padding-left: var(--spacing-lg); padding-right: var(--spacing-lg); }
.py-lg { padding-top: var(--spacing-lg); padding-bottom: var(--spacing-lg); }
.m-lg { margin: var(--spacing-lg); }
/* ... */

/* No browser, resolve para: */
.p-lg { padding: 1.5rem; }
```

**Classes Padrão Tailwind** (py-4, px-3) são geradas automaticamente pelo Tailwind baseado na escala padrão:
```css
/* Tailwind scale padrão: */
.py-0 { padding-top: 0; padding-bottom: 0; }
.py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
.py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
.py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
.py-4 { padding-top: 1rem; padding-bottom: 1rem; }
/* ... até py-96 */
```

### 4.4 Por Que CSS Pode Não Funcionar

**Cenário 1: Classe não gerada**
- Tailwind JIT não encontrou a classe nos arquivos escaneados
- Solução: Verificar `content` paths no `tailwind.config.js`

**Cenário 2: CSS sobrescrito**
- Outro seletor com maior especificidade está aplicando padding: 0
- Solução: Inspecionar DevTools > Styles > Ver regras riscadas

**Cenário 3: Processamento duplo** (nosso caso!)
- Dois plugins processam o mesmo CSS
- Segunda passagem sobrescreve a primeira
- Ordem das classes no CSS final é imprevisível
- Solução: Remover plugin duplicado

**Cenário 4: Cache do bundler**
- Mudanças no config não refletem sem reiniciar
- Solução: Limpar cache e reiniciar dev server

---

## 5. CONFIGURAÇÕES TAILWIND

### 5.1 React `tailwind.config.js`

```javascript
export default {
  darkMode: ["class"],  // Dark mode via classe no <html>
  content: [
    './pages/**/*.{ts,tsx}',     // ← Não existe no template
    './components/**/*.{ts,tsx}', // ← Redundante (coberto por ./src)
    './app/**/*.{ts,tsx}',       // ← Redundante (coberto por ./src)
    './src/**/*.{ts,tsx}',       // ← ÚNICO NECESSÁRIO
    '../../packages/ui-react/src/**/*.{js,ts,jsx,tsx}',  // ← Pacote shared
  ],
  theme: {
    extend: {
      spacing: {
        '70': '17.5rem', // Para sidebar width
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],  // ⚠️ Conflita com main.css!
      },
    },
  },
  plugins: [],
}
```

**Problemas:**
1. **Content paths redundantes** - 3 dos 4 paths são desnecessários
2. **fontFamily conflita** - `main.css` usa `'Space Grotesk'`, config usa `'Poppins'`
3. **Não há safeguards** contra processamento duplo

### 5.2 Next.js `tailwind.config.js`

```javascript
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui-react/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      spacing: {
        'xxs': '0.25rem',
        // ... vários tokens duplicados do @theme!
        '43': '10.75rem',  // Para sidebar
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

**Problemas:**
1. **Duplicação de tokens** - spacing já está definido em `@theme`
2. **Config JS + @theme CSS** = duas fontes de verdade
3. **Inconsistência** - React usa `'70'` para sidebar, Next usa `'43'`

---

## 6. CSS SOBRESCRITO E INÚTIL

### 6.1 Duplicação de Spacing Tokens

**NO @theme** (`main.css`):
```css
@theme {
  --spacing-xxs: 0.25rem;
  --spacing-xs: 0.5rem;
  --spacing-sm: 0.75rem;
  /* ... */
}
```

**NO tailwind.config.js** (Next):
```javascript
theme: {
  extend: {
    spacing: {
      'xxs': '0.25rem',  // DUPLICADO!
      'xs': '0.5rem',    // DUPLICADO!
      'sm': '0.75rem',   // DUPLICADO!
    }
  }
}
```

**Resultado:**
- Tailwind gera `.gap-xxs`, `.p-xxs` duas vezes (de @theme e de config)
- Segunda definição sobrescreve primeira
- CSS final tem duplicatas que inflam o tamanho

### 6.2 Font Family Conflitante

**NO main.css:**
```css
body {
  font-family: 'Space Grotesk', sans-serif;
}
```

**NO tailwind.config.js** (React):
```javascript
theme: {
  extend: {
    fontFamily: {
      sans: ['Poppins', 'sans-serif'],  // ← Conflita!
    }
  }
}
```

**Resultado:**
- `body` usa `'Space Grotesk'`
- Classes `.font-sans` usam `'Poppins'`
- Inconsistência visual no app

### 6.3 Content Paths Redundantes

```javascript
content: [
  './pages/**/*.{ts,tsx}',     // Não existe
  './components/**/*.{ts,tsx}', // Dentro de ./src
  './app/**/*.{ts,tsx}',       // Dentro de ./src
  './src/**/*.{ts,tsx}',       // Único necessário
]
```

**Impacto:**
- Tailwind escaneia arquivos 3-4 vezes
- Performance reduzida (mínima, mas existe)
- Confusão para desenvolvedores

### 6.4 Processamento Duplo no React

**MAIOR PROBLEMA:**

```
vite.config.ts:
  plugins: [tailwindcss()]  ← Processamento 1

postcss.config.js:
  plugins: { '@tailwindcss/postcss': {} }  ← Processamento 2
```

Isso causa:
- **CSS gerado duas vezes**
- **Ordem de classes imprevisível**
- **Possível sobrescrita** de classes
- **`py-4 px-3` podem não funcionar** se segunda passada zerar padding

---

## 7. RESUMO EXECUTIVO

### ✅ O QUE ESTÁ FUNCIONANDO BEM

1. **Pacote compartilhado** - Centraliza componentes e CSS
2. **Design system em @theme** - CSS variables bem organizadas
3. **pnpm workspaces** - Resolve dependências corretamente
4. **Next.js config** - Processamento único (correto)

### 🔴 PROBLEMAS CRÍTICOS

1. **React: Processamento duplo do Tailwind**
   - Vite plugin + PostCSS plugin = conflito
   - Explica por que classes não aplicam

2. **Duplicação de tokens**
   - `@theme` + `tailwind.config.js theme.extend` = duas fontes
   - Causa CSS redundante

3. **Font family inconsistente**
   - `main.css` usa `Space Grotesk`
   - Config usa `Poppins`

### 🟡 PROBLEMAS MODERADOS

1. Content paths redundantes
2. Sidebar spacing inconsistente entre templates
3. Falta de documentação sobre fluxo CSS

---

## 8. PRÓXIMOS PASSOS

Para corrigir os problemas identificados, recomenda-se:

1. **Remover processamento duplo no React**
   - Manter apenas `@tailwindcss/vite` no `vite.config.ts`
   - Remover `@tailwindcss/postcss` do `postcss.config.js`

2. **Consolidar spacing tokens**
   - Usar apenas `@theme` como fonte de verdade
   - Remover duplicatas do `tailwind.config.js`

3. **Padronizar font family**
   - Decidir entre `Space Grotesk` ou `Poppins`
   - Aplicar consistentemente

4. **Limpar content paths**
   - Manter apenas `./src/**/*.{ts,tsx}`
   - Remover paths redundantes

5. **Documentar fluxo CSS**
   - Criar guia para desenvolvedores
   - Explicar processamento Tailwind v4

---

**Documento criado em:** 28/11/2024
**Última atualização:** 28/11/2024
**Autor:** Claude (Análise Técnica)
