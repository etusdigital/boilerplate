# Frontend - Next.js

Next.js 15 App Router frontend for the boilerplate project.

## Features

- Next.js 15 with App Router
- React 18
- TypeScript
- Auth0 Authentication
- TailwindCSS v4
- Zustand State Management
- i18next Internationalization
- Shared UI Components (@boilerplate/ui-react)

## Development

```bash
pnpm dev
```

## Build

```bash
pnpm build
pnpm start
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

- Auth0 credentials
- Backend API URL

## Project Structure

```
app/
├── (auth)/              # Auth pages (login, callback)
├── (protected)/         # Protected pages (dashboard, users, etc)
├── _components/         # Shared components
├── _lib/                # Shared utilities, stores, API client
│   ├── i18n/           # Internationalization
│   ├── store.ts        # Zustand store
│   ├── api-client.ts   # Axios client
│   └── utils.ts        # Utility functions
├── api/                # API routes
│   └── auth/           # Auth0 routes
├── layout.tsx          # Root layout
└── globals.css         # Global styles

features/                # Feature modules
├── users/
├── accounts/
└── settings/
```

## Authentication

This template uses Auth0 for authentication with Next.js App Router:

- Server-side session management with `@auth0/nextjs-auth0`
- Protected routes via middleware
- Client-side user context with `UserProvider`

## Styling

- TailwindCSS v4 for utility-first styling
- Shared UI components from `@boilerplate/ui-react` workspace package
- Google Material Icons for icons
- Dark mode support via `next-themes`

## State Management

- Zustand for global state
- Local state with React hooks
- Server state with Next.js data fetching

## Internationalization

- i18next with react-i18next
- Portuguese (default) and English support
- Translations in `app/_lib/i18n/locales/`
