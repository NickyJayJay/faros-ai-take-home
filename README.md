# Employee Insights Dashboard

## Prerequisites

- Node.js 20+
- npm
- Mock server running at `http://localhost:4000` (provided separately)

## Setup

### 1. Start the mock server

```bash
cd mock-server
npm install
cp .env.example .env
npm start
```

Verify: `http://localhost:4000/health` should return `200`.

### 2. Start the frontend

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check + production build |
| `npm test` | Run test suite (38 tests) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Lint with ESLint |
| `npm run format` | Format with Prettier |
| `npm run typecheck` | One-shot type check |
| `npm run typecheck:watch` | Type check in watch mode |

## Tech Stack

- React 19 + TypeScript + Vite
- Apollo Client v4 (GraphQL)
- Tailwind CSS v4 + shadcn/ui
- Vitest + React Testing Library

## Project Structure

```
src/
├── components/
│   ├── ai/              # AI insights: consent, insight card, confidence
│   ├── common/          # ErrorBoundary, DevFlagToggle, StatusBadge, TeamChip
│   ├── employees/       # Table, search, filters, pagination, detail panel
│   ├── layout/          # Header, breadcrumb
│   └── ui/              # shadcn/ui primitives
├── contexts/            # ConsentContext, FeatureFlagContext
├── graphql/             # Apollo client, queries
├── hooks/               # useEmployees, useAIInsights, useFeatureFlag, etc.
├── lib/                 # pii-filter, telemetry-client, consent, feature-flags
└── types/               # TypeScript type definitions
```

## Key Features

- **Employee Dashboard** — Table with search, multi-step filters, cursor pagination, detail panel
- **AI Insights** — Consent flow, PII filtering, confidence indicators, error handling with retry
- **Production Readiness** — Telemetry (batched), feature flags (localStorage), error boundaries
- **Testing** — 38 tests covering PII filter, feature flags, consent management, telemetry
