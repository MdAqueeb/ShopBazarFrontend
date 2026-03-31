---
name: shopbazar-components
description: Build production-grade e-commerce React components with high conversion optimization, seamless shopping experiences, and performance excellence. Use this skill for ShopBazar product pages, checkout flows, cart experiences, product listings, filters, wishlists, and user-centric shopping interfaces. Generates tested, Redux-integrated, type-safe components following ShopBazar conventions.
license: Complete terms in LICENSE.txt
---

Build e-commerce React components that drive conversions and delight users. This skill combines ShopBazar-specific architecture patterns with proven e-commerce UX practices.

## Philosophy

Every component serves conversion: clear CTAs, friction-reducing flows, trust-building signals, and fast load times. Technical excellence (TypeScript, Redux, performance) enables beautiful UX.

**Three pillars:**
1. **Conversion-First UX** — Remove friction, clarify intent, build trust
2. **Type-Safe Architecture** — Redux integration, Zod validation, TypeScript strict mode
3. **Performance by Default** — Optimized renders, lazy loading, image optimization

## Before Coding

For any component, ask:
- **Goal**: What action does the user take? (browse, search, add to cart, checkout, review)
- **Friction points**: Where do users drop off? Slow pages? Unclear pricing? Confusing options?
- **Trust signals**: Reviews? Return policy? Security badges? Guarantees?
- **Data flow**: Where does state live? (Redux for global, component for local, form for inputs)
- **Performance budget**: Lighthouse targets? Image optimization strategy?

Then design and implement in three layers:

### Layer 1: Data & State (Redux + Zod)
- Define Redux slices for cart, products, filters, user wishlist
- Create Zod schemas for form validation (checkout, product options)
- Use typed hooks (`useAppDispatch`, `useAppSelector`)
- Colocate selectors with slices

### Layer 2: Logic & Forms (React Hook Form + Async Thunks)
- Use `react-hook-form` for all input forms (never raw `useState`)
- Wire forms to Redux async thunks for API calls
- Show inline validation errors (never toast validation)
- Handle optimistic updates for cart operations

### Layer 3: UI & Interaction (Tailwind + Motion)
- Build with Tailwind utility classes (no custom CSS unless unavoidable)
- Animate key moments: product load, add-to-cart, checkout progress
- Use `cn()` for conditional class merging
- Ensure mobile-responsive design with Tailwind breakpoints

## Component Patterns

### Product Display
- **Product Card**: Image, title, price, rating, quick-add button, hover effects
- **Product Detail**: Gallery, variants (color/size), quantity picker, CTAs (add to cart, wishlist, share)
- **Product List**: Grid/list toggle, filters (price range, category, brand), sorting, pagination
- **Image Gallery**: Thumbnail navigation, zoom-on-hover, alt text for SEO

### Shopping Cart Experience
- **Mini Cart**: Preview (3–5 items), subtotal, cart link, floating badge with count
- **Cart Page**: Line items (image, title, variant, price, quantity controls), savings display, promo code input, checkout CTA
- **Cart Item**: Quantity stepper, remove/save-for-later, price/subtotal, stock status

### Checkout Flow
- **Checkout Steps**: Progress indicator (1. Cart, 2. Shipping, 3. Payment, 4. Review)
- **Shipping Form**: Address auto-complete, shipping method selector with price display
- **Payment Form**: Card input, billing address option, security badge
- **Order Review**: Order summary, payment method, shipping address, edit links

### User Engagement
- **Wishlist**: Add/remove toggle, heart icon, item count badge, wishlist page with add-to-cart
- **Product Reviews**: Rating stars (1–5), filtered by rating, recent-first sorting, verified-badge for purchased items
- **Promotions**: Banner (limited-time, flash sale, BOGO), countdown timer, urgency signals

### Search & Discovery
- **Search Bar**: Auto-complete suggestions, recent searches, category pills, search-as-you-type
- **Filters**: Price range slider, category tree, multi-select filters, filter count badge, clear-all button
- **Sorting**: Relevance, price (low–high, high–low), newest, best-selling, rating

## Conversion Best Practices

### Reduce Friction
- ✅ One-click checkout (saved addresses, payment methods)
- ✅ Transparent pricing (no hidden fees; show tax/shipping upfront)
- ✅ Clear CTAs (strong verbs: "Add to Cart", "Buy Now", "Continue", not "Submit")
- ✅ Guest checkout option (don't force account creation)
- ✅ Progress indicators (checkout steps, loading states)
- ❌ Auto-play videos, intrusive pop-ups, slow page loads

### Build Trust
- ✅ Customer reviews & ratings (prominently on product pages)
- ✅ Return/refund policy linked (easy to find, clear terms)
- ✅ Security badges (SSL, payment providers, fraud protection)
- ✅ Shipping timeline (e.g., "Arrives Wed, Feb 5")
- ✅ Stock status (in-stock, low-stock, out-of-stock messaging)
- ✅ Guarantees (30-day money-back, satisfaction guarantee)

### Mobile Optimization
- ✅ Touch-friendly buttons (48px minimum)
- ✅ Single-column layouts (no horizontal scroll)
- ✅ Mobile-optimized forms (larger inputs, auto-fill)
- ✅ Fast page loads (optimize images, lazy load below-fold content)
- ✅ Readable text (16px+ font on mobile)

### Performance Targets
- ✅ Lighthouse: 90+ (Performance, Accessibility, Best Practices)
- ✅ Core Web Vitals: LCP <2.5s, FID <100ms, CLS <0.1
- ✅ Image optimization: WebP, srcset, lazy loading
- ✅ Code-split pages: route-based lazy loading with React.lazy

## ShopBazar-Specific Patterns

### Redux State Structure
```
store/
├── cartSlice.ts       // items[], subtotal, tax, shipping
├── productSlice.ts    // products[], filters, sorting, pagination
├── authSlice.ts       // user, isAuthenticated, token
├── wishlistSlice.ts   // wishlistItems[], count
└── checkoutSlice.ts   // formData, step, paymentMethod
```

### Form Patterns (React Hook Form + Zod)
```tsx
// schemas/checkout.ts
export const checkoutSchema = z.object({
  email: z.string().email("Invalid email"),
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional(),
  paymentMethod: z.enum(["card", "paypal"]),
  // ...
});

// CheckoutForm.tsx
type FormData = z.infer<typeof checkoutSchema>;
const form = useForm<FormData>({ resolver: zodResolver(checkoutSchema) });
```

### API Integration (createAsyncThunk)
```tsx
// store/cartSlice.ts
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }: { productId: string; quantity: number }) => {
    const res = await api.post("/cart", { productId, quantity });
    return res.data;
  }
);
```

### Component Structure
```tsx
// components/Product/ProductCard.tsx
interface ProductCardProps {
  product: Product;
  onAddToCart: (id: string) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="group rounded-lg border hover:shadow-lg transition-shadow">
      {/* Image with lazy loading */}
      <img
        src={product.image}
        alt={product.name}
        loading="lazy"
        className="w-full aspect-square object-cover rounded-t-lg"
      />
      {/* Details */}
      <div className="p-4">
        <h3 className="font-semibold">{product.name}</h3>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg font-bold">${product.price}</span>
          <button
            onClick={() => onAddToCart(product.id)}
            disabled={isAdding}
            className="btn btn-primary"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
```

## Design Tokens (Tailwind CSS)

Use these consistently across all components:

**Colors**
- Primary: `from-blue-600 to-blue-700` (CTA, active states)
- Accent: `amber-500` (badges, urgency, limited-time)
- Neutral: `gray-100` to `gray-900` (backgrounds, text hierarchy)
- Success: `green-600` (success messages, in-stock)
- Warning: `amber-600` (low stock, warnings)
- Error: `red-600` (out-of-stock, errors)

**Typography**
- Display: Font for headings (h1, h2)
- Serif/Handwritten: Prices, special offers (luxury feel)
- Mono: SKU, order IDs, codes

**Spacing**
- Component padding: `p-4` (16px)
- Section gap: `gap-8` (32px)
- Page margin: `px-4 md:px-8` (responsive)

## Testing & Quality

**IMPORTANT: Every component must have a corresponding test file.**

### Component File Structure
```
components/Product/
├── ProductCard.tsx          # Component
├── ProductCard.test.tsx     # Test file (REQUIRED)
├── ProductCard.types.ts     # Types (if shared)
└── index.ts                 # Barrel export
```

### Test File Naming Convention
- Component: `ComponentName.tsx`
- Test file: `ComponentName.test.tsx` (or `.spec.tsx`)
- Place test file in the **same directory** as the component

### Testing Requirements (Before Shipping)

**Unit Tests (Jest + React Testing Library)**
- ✅ Component renders without crashing
- ✅ Props are passed correctly and used
- ✅ User interactions work (click, input, form submission)
- ✅ Conditional rendering (loading, error, empty states)
- ✅ Redux integration (dispatches, selectors work correctly)
- ✅ Form validation (success + error scenarios)
- ✅ Accessibility (ARIA labels, keyboard navigation)

**Integration Tests**
- ✅ Component works with Redux store
- ✅ Async operations (API calls, async thunks)
- ✅ Navigation and routing (if applicable)

**Visual/E2E Tests** (recommended)
- ✅ Mobile responsiveness (test on multiple breakpoints)
- ✅ Hover/focus states render correctly
- ✅ Animation/transition behavior

**Performance & Quality Checks**
- ✅ Lighthouse audit (90+)
- ✅ Mobile responsiveness (test on iPhone SE, Pixel)
- ✅ Form validation (happy path + error states)
- ✅ Redux integration (correct selectors, dispatches)
- ✅ Type safety (no `any`, all props typed)
- ✅ Accessibility (focus states, ARIA labels, keyboard nav)
- ✅ Performance (no unnecessary re-renders, memoization where needed)

### Example Test File

```tsx
// components/Product/ProductCard.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import ProductCard from "./ProductCard";
import cartSlice from "@/store/cartSlice";

const mockProduct = {
  id: "1",
  name: "Test Product",
  price: 29.99,
  image: "/test-image.jpg",
  rating: 4.5,
  stock: 10,
};

const renderWithRedux = (component: React.ReactElement) => {
  const store = configureStore({
    reducer: {
      cart: cartSlice,
    },
  });

  return render(<Provider store={store}>{component}</Provider>);
};

describe("ProductCard", () => {
  // ✅ Component renders
  it("renders product card with product details", () => {
    renderWithRedux(<ProductCard product={mockProduct} />);

    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(`$${mockProduct.price}`)).toBeInTheDocument();
  });

  // ✅ Props are used correctly
  it("displays product image with correct alt text", () => {
    renderWithRedux(<ProductCard product={mockProduct} />);

    const image = screen.getByAltText(mockProduct.name);
    expect(image).toHaveAttribute("src", mockProduct.image);
    expect(image).toHaveAttribute("loading", "lazy");
  });

  // ✅ User interactions
  it("dispatches addToCart when button is clicked", async () => {
    const user = userEvent.setup();
    renderWithRedux(<ProductCard product={mockProduct} />);

    const addButton = screen.getByRole("button", { name: /add to cart/i });
    await user.click(addButton);

    expect(addButton).toBeDisabled(); // Shows loading state
  });

  // ✅ Conditional rendering
  it("shows out-of-stock state when stock is 0", () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    renderWithRedux(<ProductCard product={outOfStockProduct} />);

    const addButton = screen.getByRole("button", { name: /add to cart/i });
    expect(addButton).toBeDisabled();
  });

  // ✅ Star rating rendering
  it("displays correct number of stars for rating", () => {
    renderWithRedux(<ProductCard product={mockProduct} />);

    const stars = screen.getAllByText("★");
    expect(stars.length).toBe(5); // Total stars
  });

  // ✅ Wishlist toggle
  it("toggles wishlist heart icon on click", async () => {
    const user = userEvent.setup();
    renderWithRedux(<ProductCard product={mockProduct} />);

    const wishlistButton = screen.getByRole("button", { name: /wishlist/i });
    await user.click(wishlistButton);

    expect(wishlistButton).toHaveTextContent("❤️"); // Favorited
  });

  // ✅ Accessibility
  it("has proper accessibility attributes", () => {
    renderWithRedux(<ProductCard product={mockProduct} />);

    const addButton = screen.getByRole("button", { name: /add to cart/i });
    expect(addButton).toHaveAccessibleName();

    const image = screen.getByAltText(mockProduct.name);
    expect(image).toHaveAttribute("alt");
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests for a specific component
npm test ProductCard

# Run tests in watch mode (auto-rerun on save)
npm test -- --watch

# Run tests with coverage report
npm test -- --coverage
```

### Testing Best Practices

1. **Test user behavior, not implementation**
   ```tsx
   // ❌ Bad: Testing internal state
   expect(component.state.isAdding).toBe(true);

   // ✅ Good: Testing what user sees
   expect(screen.getByRole("button")).toBeDisabled();
   ```

2. **Use semantic queries**
   ```tsx
   // ❌ Bad: Query by className
   fireEvent.click(screen.getByClassName("btn-primary"));

   // ✅ Good: Query by role
   await user.click(screen.getByRole("button", { name: /add/i }));
   ```

3. **Test Redux integration separately**
   ```tsx
   // components/Product/ProductCard.integration.test.tsx
   // Full Redux store integration tests
   ```

4. **Test accessibility**
   ```tsx
   // Use jest-axe for automated accessibility testing
   import { axe, toHaveNoViolations } from "jest-axe";

   it("has no accessibility violations", async () => {
     const { container } = renderWithRedux(<ProductCard product={mockProduct} />);
     const results = await axe(container);
     expect(results).toHaveNoViolations();
   });
   ```

5. **Mock API calls, not components**
   ```tsx
   // ✅ Mock the API service
   jest.mock("@/services/api");

   // ❌ Don't mock Redux or internal components
   ```

## References

See `reference/` directory for detailed guides on:
- Component patterns (product card, cart, checkout, wishlist)
- Performance optimization (image loading, code splitting)
- Conversion techniques (urgency, social proof, trust signals)
- Redux patterns (async thunks, selectors, normalized state)
- Mobile responsiveness (breakpoints, touch targets)
