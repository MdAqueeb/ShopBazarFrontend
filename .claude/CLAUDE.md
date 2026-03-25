# CLAUDE.md — shopbazar-frontend

## Project Purpose

ShopBazar is an e-commerce frontend application. Currently in early scaffold stage, built on React 19 + TypeScript + Vite 8. The project is a private ES module (`"type": "module"`).

## Commands

- `npm run dev` — Start dev server with HMR
- `npm run build` — TypeScript compile + Vite production build
- `npm run lint` — Run ESLint across the project
- `npm run preview` — Preview the production build locally

## Key Architecture Decisions

- **Build tool**: Vite 8 with `@vitejs/plugin-react` (uses Oxc for fast JSX transforms)
- **Framework**: React 19 with the new automatic JSX runtime (`react-jsx`)
- **Language**: TypeScript 5.9 in strict mode — unused locals/parameters are errors, no unchecked side-effect imports
- **Styling**: Tailwind CSS — utility-first, no custom CSS files unless absolutely necessary
- **State management**: Redux Toolkit — slices, `createAsyncThunk` for async, typed hooks
- **Forms**: React Hook Form + Zod for schema-based validation
- **Notifications**: Toast notifications for user feedback (success, error, info)
- **Linting**: ESLint 9 flat config with typescript-eslint, react-hooks, and react-refresh plugins
- **Module system**: ESNext modules with bundler resolution

## Project Structure

```
src/
├── main.tsx          # Entry point — mounts <App /> into #root
├── App.tsx           # Root component
├── App.css           # Component styles (CSS nesting)
├── index.css         # Global styles, CSS variables, dark mode
└── assets/           # Static assets (SVGs, images)
public/               # Served as-is (favicon, icons)
index.html            # HTML shell — loads /src/main.tsx as module
```

## Code Conventions

### Files and naming
- Components: **PascalCase** filenames and function names (`App.tsx`, `function App()`)
- Styles: Colocated with components, same name (`App.css` next to `App.tsx`)
- Assets: lowercase or camelCase (`hero.png`, `react.svg`)
- CSS classes: **kebab-case** (`.counter`, `.framework`)

### Imports — order top to bottom
1. React / library imports (`import { useState } from 'react'`)
2. Local component/asset imports with relative paths (`import heroImg from './assets/hero.png'`)
3. Style imports last (`import './App.css'`)

### Components
- Functional components only — no class components
- Use React hooks for state and effects (`useState`, `useEffect`, etc.)
- Export components as default exports from their files

### Styling (Tailwind CSS)
- Use Tailwind utility classes directly in JSX — avoid writing custom CSS
- Use `cn()` helper (from `clsx` + `tailwind-merge`) for conditional/merged classes
- Only use `@apply` in rare cases where a utility class must live in CSS (e.g., base layer resets)
- Dark mode: use Tailwind's `dark:` variant
- Responsive: use Tailwind breakpoint prefixes (`sm:`, `md:`, `lg:`, `xl:`)
- Do not create `.css` files for component styling — Tailwind utilities should handle it

### Forms (React Hook Form + Zod)
- Always use `react-hook-form` for form state — never manage form inputs with raw `useState`
- Define a Zod schema for every form and infer the TypeScript type from it: `type FormData = z.infer<typeof schema>`
- Colocate the Zod schema in the same file as the form component (or in a shared `schemas/` file if reused)
- Use `zodResolver` to connect the schema to `useForm`
- Display field errors inline below each input using `formState.errors`
- Keep validation logic in the Zod schema, not in `onSubmit` handlers

### State Management (Redux Toolkit)
- Store setup in `src/store/` — one `store.ts` file for `configureStore`, one file per slice
- Name slice files as `<feature>Slice.ts` (e.g., `cartSlice.ts`, `authSlice.ts`)
- Use `createSlice` for sync state, `createAsyncThunk` for async operations (API calls)
- Define and export typed hooks: `useAppDispatch` and `useAppSelector` — never use raw `useDispatch`/`useSelector`
- Keep slice state normalized and minimal — derive computed values with selectors
- Colocate selectors in the slice file

### Toast Notifications
- Use toasts for transient user feedback: success confirmations, error alerts, info messages
- Keep toast messages short (one sentence) — do not dump error stacks into toasts
- Show success toasts after mutations (add to cart, place order, update profile)
- Show error toasts when API calls fail — pair with a retry action when appropriate
- Do not use toasts for validation errors — display those inline on the form

### TypeScript
- Strict mode is on — do not use `any` or suppress type errors without good reason
- `noUnusedLocals` and `noUnusedParameters` are enabled — clean up dead code
- Target is ES2023 — modern JS features are available

## Common Tasks

### Adding a new feature/component
1. Create `src/<FeatureName>.tsx` (PascalCase) with a default-exported functional component
2. Style with Tailwind utility classes directly in JSX — no separate CSS file needed
3. If the feature has state shared across components, create a Redux slice in `src/store/<feature>Slice.ts`
4. Import and render the component from `App.tsx` (or a future router)

### Adding a new page (when routing is added)
- Install a router (e.g., `react-router-dom`) and create a `src/pages/` directory
- Each page is a component following the same conventions above

### Adding a new form
1. Define a Zod schema for the form's fields
2. Create the form component using `useForm` with `zodResolver(schema)`
3. Use `register` to bind inputs and display `formState.errors` inline
4. Handle submission in `onSubmit` — dispatch Redux actions or call APIs here
5. Show a success toast on successful submission, error toast on failure

### Adding new Redux state
1. Create `src/store/<feature>Slice.ts` using `createSlice`
2. Define `initialState` with a TypeScript interface
3. Add reducers for sync updates, use `createAsyncThunk` for API calls with `extraReducers`
4. Export the slice's actions and reducer
5. Add the reducer to `configureStore` in `src/store/store.ts`
6. Access state with `useAppSelector`, dispatch with `useAppDispatch`

### Debugging
- Run `npm run dev` — Vite HMR will reflect changes instantly
- Use browser DevTools; React DevTools extension is recommended
- Check the terminal for TypeScript and build errors from Vite
- Run `npm run lint` to catch lint issues
- For type errors: check `tsconfig.app.json` — strict settings mean most issues surface at compile time

### Adding dependencies
- Use `npm install <package>` for runtime deps
- Use `npm install -D <package>` for dev-only deps
- After adding types packages (`@types/*`), restart the dev server

### Environment variables
- Vite exposes env vars prefixed with `VITE_` via `import.meta.env.VITE_*`
- Create `.env` or `.env.local` files at the project root (these are gitignored)
