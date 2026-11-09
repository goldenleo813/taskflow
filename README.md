# TaskFlow

A modern, responsive task management application built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- Create, edit, and delete tasks
- Toggle task completion
- Priority levels: High, Medium, Low
- Due date support with overdue detection
- Tasks split into Active / Completed sections
- Persistent storage via `localStorage`

## Project Structure

```
src/
├── components/
│   ├── PriorityBadge.tsx   # Priority level badge
│   ├── TaskCard.tsx         # Individual task card with inline editing
│   ├── TaskForm.tsx         # Create/edit form with validation
│   └── TaskList.tsx         # List renderer with active/completed sections
├── hooks/
│   ├── useLocalStorage.ts   # Generic localStorage sync hook
│   └── useTasks.ts          # Task CRUD operations
├── test/
│   ├── setup.ts             # Vitest + jest-dom setup
│   ├── App.test.tsx
│   ├── TaskCard.test.tsx
│   ├── TaskForm.test.tsx
│   ├── TaskList.test.tsx
│   ├── PriorityBadge.test.tsx
│   ├── useLocalStorage.test.ts
│   └── useTasks.test.ts
├── types/
│   └── task.ts              # Task and Priority types
├── App.tsx
└── main.tsx
```

## Setup

```bash
pnpm install
pnpm dev
```

The app will be available at `http://localhost:5173`.

## Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start development server |
| `pnpm build` | Type-check and build for production |
| `pnpm preview` | Preview production build locally |
| `pnpm test` | Run all tests once |
| `pnpm test:watch` | Run tests in watch mode |

## Running Tests

```bash
pnpm test
```

Tests use **Vitest** as the test runner and **React Testing Library** for component tests. The test suite covers:

- `useLocalStorage` hook — persistence, error handling, functional updates
- `useTasks` hook — CRUD operations, ordering, persistence
- `PriorityBadge` — label and color rendering
- `TaskForm` — validation, pre-fill for editing, submit/cancel
- `TaskCard` — rendering, complete toggle, edit flow, delete confirmation
- `TaskList` — empty state, active/completed sections, counts
- `App` — full integration: add task, toggle form, header stats

## Production Build

```bash
pnpm build
```

Output is placed in `dist/`. Serve with `pnpm preview`.
