# ShopBazar Components Skill — Reference Index

**Complete guide to building production-grade e-commerce interfaces with ShopBazar architecture.**

## Quick Navigation

### Component Patterns
- **[Product Card Pattern](./product-card-pattern.md)** — Atomic unit of e-commerce UI with conversion optimization
  - Image optimization, ratings, pricing, stock status
  - Responsive variants, lazy loading, memoization

### Shopping Experience
- **[Checkout Flow](./checkout-flow.md)** — Multi-step checkout architecture with Redux
  - Step-by-step components (cart, shipping, payment, review, confirmation)
  - Form validation with Zod, async thunks, promo codes
  - Progress indicators, error handling, guest checkout

### State Management
- **[Redux Patterns](./redux-patterns.md)** — Scalable state architecture
  - Normalized state design, entity adapters
  - Async thunks with error handling, memoized selectors
  - Cart slice pattern, product filters, pagination
  - Optimistic updates, rollback strategies

### Forms & Validation
- **[Form Patterns](./form-patterns.md)** — React Hook Form + Zod recipes
  - Basic forms, complex forms, dynamic fields
  - File uploads, conditional validation
  - Reusable form components, server-side validation

### Performance
- **[Performance Guide](./performance-guide.md)** — Core Web Vitals, optimization strategies
  - Image optimization (format, size, responsiveness, CDN)
  - Code splitting, lazy loading, route-based chunks
  - React render optimization (memoization, useCallback, useMemo)
  - Virtual scrolling for large lists, bundle analysis
  - Performance monitoring, caching strategies

### Testing
- **[Testing Guide](./testing-guide.md)** — Unit, integration, and E2E testing patterns
  - **REQUIRED**: Every component must have a corresponding `.test.tsx` file
  - Unit tests (component rendering, interactions, props)
  - Redux-connected component testing
  - Form validation testing
  - Accessibility testing with jest-axe
  - Best practices and common patterns

## Common Workflows

### Building a New Product Page
1. Read: [Product Card Pattern](./product-card-pattern.md)
2. Reference: [Redux Patterns](./redux-patterns.md) — product slice setup
3. Implement: Gallery, details, variants, reviews
4. **Create test file**: `ProductCard.test.tsx` (see [Testing Guide](./testing-guide.md))
   - Test rendering, interactions, Redux integration
   - Aim for 80%+ coverage
5. Optimize: [Performance Guide](./performance-guide.md) — image lazy loading
6. Verify: Run tests (`npm test`), check Lighthouse (90+)

### Building Checkout
1. Read: [Checkout Flow](./checkout-flow.md) — architecture overview
2. Reference: [Redux Patterns](./redux-patterns.md) — checkout slice
3. Implement: Each step following the pattern
4. Validate: [Form Patterns](./form-patterns.md) — Zod schemas
5. **Create test files** for each step: `ShippingStep.test.tsx`, `PaymentStep.test.tsx`, etc.
   - See [Testing Guide](./testing-guide.md) for form testing patterns
6. Optimize: [Performance Guide](./performance-guide.md) — code splitting
7. Verify: Run tests, verify form validation, accessibility check

### Building a New Form
1. Read: [Form Patterns](./form-patterns.md) — basic pattern
2. Design: Zod schema in `schemas/<name>.ts`
3. Implement: Form component with `react-hook-form`
4. **Create test file**: `FormName.test.tsx`
   - Test validation (happy path + error scenarios)
   - Test submission handling (success + failure)
   - See [Testing Guide](./testing-guide.md) — Form Component Testing
5. Integrate: Redux async thunk for submission if needed
6. Verify: Run tests, all validation errors display correctly

### Optimizing Performance
1. Run Lighthouse audit (Chrome DevTools)
2. Read: [Performance Guide](./performance-guide.md)
3. Identify bottleneck (images, JS bundle, React renders, API)
4. Apply relevant optimization from guide
5. Re-audit, measure improvement

## Architecture Overview

```
ShopBazar Frontend Architecture
───────────────────────────────

Pages (Route components)
  ├── HomePage
  ├── ProductPage
  ├── CheckoutPage
  └── ProfilePage

Components (Reusable UI)
  ├── ProductCard (see: Product Card Pattern)
  ├── Cart/* (see: Redux Patterns — Cart Slice)
  ├── Checkout/* (see: Checkout Flow)
  └── Forms/* (see: Form Patterns)

Redux Store
  ├── productSlice (see: Redux Patterns — Normalized State)
  ├── cartSlice (see: Redux Patterns — Cart Slice)
  ├── checkoutSlice (see: Checkout Flow)
  ├── authSlice
  └── wishlistSlice

Services & Utils
  ├── api.ts (API client)
  ├── schemas/ (Zod validation)
  ├── hooks/ (custom hooks)
  └── utils/ (formatting, helpers)
```

## Key Principles

### Conversion-First
Every component optimizes for user action:
- Clear CTAs with strong verbs
- Reduce friction (one-click checkout, pre-filled forms)
- Build trust (reviews, security badges, return policy)
- Show progress (checkout steps, loading states)
- Mobile-first design

### Type-Safe
- TypeScript strict mode enabled
- Zod schemas for all forms
- Redux typed hooks (useAppDispatch, useAppSelector)
- No `any` types without justification

### Performance by Default
- Lazy-load images, routes, components
- Memoize expensive renders and selectors
- Code-split by route
- Target Lighthouse 90+
- Monitor Core Web Vitals

### Redux Discipline
- Normalized state (IDs + entities)
- Memoized selectors (never derive in components)
- Async thunks for API calls
- Colocate selectors with slices
- Optimistic updates where appropriate

## Dependencies & Setup

**Required:**
- React 19
- TypeScript 5.9
- Redux Toolkit
- React Hook Form
- Zod
- Tailwind CSS
- Vite 8

**Optional (recommended):**
- `clsx` + `tailwind-merge` (cn() utility)
- `axios` (API client)
- `react-hot-toast` (notifications)
- `react-window` (virtual scrolling)

## Testing Checklist

**MANDATORY: Every component must have a corresponding `.test.tsx` file.**

Before shipping any component:
- ✅ **Test file exists** at `ComponentName.test.tsx` (same directory as component)
- ✅ **Unit tests pass** (`npm test`): rendering, interactions, Redux, forms
- ✅ **Test coverage** ≥ 80% (statements, branches, functions, lines)
- ✅ **Integration tests** verify Redux actions, async thunks, API calls
- ✅ **Accessibility tests** (jest-axe): no ARIA violations
- ✅ Form validation (happy path + all error states)
- ✅ Redux integration (correct dispatches, selectors)
- ✅ Type safety (no `any`, all props typed)
- ✅ Mobile responsive (test on iPhone SE, Pixel 5)
- ✅ Lighthouse audit: 90+
- ✅ Performance (no unnecessary re-renders, lazy loading)
- ✅ Conversion optimization (CTA clarity, trust signals)

## FAQ

**Q: Do I need a test file for every component?**
A: **YES**. Every component must have a corresponding `.test.tsx` file in the same directory. This is non-negotiable. See [Testing Guide](./testing-guide.md) for patterns.

**Q: When should I use Redux vs. component state?**
A: Redux for global (cart, auth, products), component state for local (form input, modal open). Never use Redux for form inputs — use react-hook-form instead.

**Q: How do I handle optimistic updates?**
A: See Redux Patterns — "Async Thunk Error Handling". Update store immediately, rollback on error.

**Q: What's the best way to optimize images?**
A: See Performance Guide — "Image Optimization". Use CDN, WebP format, srcset, lazy loading.

**Q: How do I prevent unnecessary re-renders?**
A: Use memoized selectors (Redux), memo() component wrapper, useCallback for handlers. See Performance Guide.

**Q: Should I use Tailwind @apply?**
A: Avoid it. Use utility classes directly in JSX. Only use @apply for base layer resets.

**Q: How do I validate forms server-side and show errors?**
A: See Form Patterns — "Form Submission Handling". Use try/catch, set errors via useState.

**Q: How do I test Redux-connected components?**
A: Wrap component in Redux Provider with mocked store. See [Testing Guide](./testing-guide.md) — "Redux-Connected Component Testing".

## Contact & Issues

- ShopBazar documentation: See `.claude/CLAUDE.md`
- GitHub issues: Report skill improvements or bugs
- Performance questions: See Performance Guide — "Monitoring Checklist"

---

**Last updated:** 2026-03-31
**Skill version:** 1.1
**Note:** Testing requirement (test files mandatory) added in v1.1
