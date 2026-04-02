# Testing Guide for ShopBazar Components

Every component must have a corresponding test file. This guide covers unit, integration, and E2E testing patterns.

## Project Setup

**Dependencies (should already be installed):**
```bash
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D @types/jest jest jest-environment-jsdom
npm install -D @vitest/ui vitest
npm install -D jest-axe @axe-core/react
```

## File Organization

```
src/
├── components/
│   ├── Product/
│   │   ├── ProductCard.tsx          # Component
│   │   ├── ProductCard.test.tsx     # Test file (same directory)
│   │   ├── ProductCard.types.ts     # Types (if needed)
│   │   └── index.ts                 # Barrel export
│   │
│   ├── Cart/
│   │   ├── CartItem.tsx
│   │   ├── CartItem.test.tsx        # ← Test file required
│   │   └── index.ts
│   │
│   └── Checkout/
│       ├── CheckoutForm.tsx
│       ├── CheckoutForm.test.tsx    # ← Test file required
│       └── index.ts
│
├── pages/
│   ├── HomePage.tsx
│   ├── HomePage.test.tsx            # ← Test file required
│   └── ...
│
└── __tests__/                       # Optional: shared test utilities
    ├── setup.ts
    ├── mocks.ts
    └── test-utils.tsx
```

## Basic Component Test Pattern

### 1. Simple Component (No Redux)

```tsx
// components/Badge/Badge.tsx
interface BadgeProps {
  text: string;
  color?: "primary" | "success" | "warning" | "error";
  icon?: React.ReactNode;
}

export default function Badge({ text, color = "primary", icon }: BadgeProps) {
  const colorClasses = {
    primary: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-amber-100 text-amber-800",
    error: "bg-red-100 text-red-800",
  };

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${colorClasses[color]}`}>
      {icon && <span>{icon}</span>}
      {text}
    </span>
  );
}

// components/Badge/Badge.test.tsx
import { render, screen } from "@testing-library/react";
import Badge from "./Badge";

describe("Badge", () => {
  it("renders with text", () => {
    render(<Badge text="New" />);
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("applies correct color class", () => {
    const { rerender } = render(<Badge text="Test" color="success" />);
    expect(screen.getByText("Test")).toHaveClass("bg-green-100");

    rerender(<Badge text="Test" color="error" />);
    expect(screen.getByText("Test")).toHaveClass("bg-red-100");
  });

  it("renders icon when provided", () => {
    render(<Badge text="Sale" icon="🏷️" />);
    expect(screen.getByText("🏷️")).toBeInTheDocument();
  });

  it("renders without icon when not provided", () => {
    const { container } = render(<Badge text="Sale" />);
    const badge = container.querySelector("span");
    expect(badge?.children.length).toBe(1); // Only text
  });
});
```

### 2. Component with User Interaction

```tsx
// components/QuantitySelector/QuantitySelectorInput.tsx
interface QuantitySelectorProps {
  quantity: number;
  min?: number;
  max?: number;
  onQuantityChange: (quantity: number) => void;
}

export default function QuantitySelector({
  quantity,
  min = 1,
  max = 999,
  onQuantityChange,
}: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleDecrement}
        disabled={quantity <= min}
        aria-label="Decrease quantity"
        className="px-2 py-1 border rounded disabled:opacity-50"
      >
        −
      </button>
      <span className="w-8 text-center font-semibold">{quantity}</span>
      <button
        onClick={handleIncrement}
        disabled={quantity >= max}
        aria-label="Increase quantity"
        className="px-2 py-1 border rounded disabled:opacity-50"
      >
        +
      </button>
    </div>
  );
}

// components/QuantitySelector/QuantitySelector.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import QuantitySelector from "./QuantitySelector";

describe("QuantitySelector", () => {
  it("renders with initial quantity", () => {
    const onChange = jest.fn();
    render(<QuantitySelector quantity={3} onQuantityChange={onChange} />);

    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("increments quantity on + button click", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<QuantitySelector quantity={3} onQuantityChange={onChange} />);

    const incrementBtn = screen.getByLabelText("Increase quantity");
    await user.click(incrementBtn);

    expect(onChange).toHaveBeenCalledWith(4);
  });

  it("decrements quantity on - button click", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<QuantitySelector quantity={3} onQuantityChange={onChange} />);

    const decrementBtn = screen.getByLabelText("Decrease quantity");
    await user.click(decrementBtn);

    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("disables decrement button at minimum", () => {
    const onChange = jest.fn();
    render(<QuantitySelector quantity={1} min={1} onQuantityChange={onChange} />);

    const decrementBtn = screen.getByLabelText("Decrease quantity");
    expect(decrementBtn).toBeDisabled();
  });

  it("disables increment button at maximum", () => {
    const onChange = jest.fn();
    render(
      <QuantitySelector quantity={999} max={999} onQuantityChange={onChange} />
    );

    const incrementBtn = screen.getByLabelText("Increase quantity");
    expect(incrementBtn).toBeDisabled();
  });

  it("does not call onChange when trying to go below minimum", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<QuantitySelector quantity={1} min={1} onQuantityChange={onChange} />);

    const decrementBtn = screen.getByLabelText("Decrease quantity");
    await user.click(decrementBtn);

    expect(onChange).not.toHaveBeenCalled();
  });
});
```

## Redux-Connected Component Testing

```tsx
// components/AddToCartButton/AddToCartButton.tsx
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { addToCart } from "@/store/cartSlice";

interface AddToCartButtonProps {
  productId: string;
  quantity: number;
}

export default function AddToCartButton({
  productId,
  quantity,
}: AddToCartButtonProps) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.cart.isLoading);

  const handleAddToCart = async () => {
    try {
      await dispatch(addToCart({ productId, quantity })).unwrap();
      // Success toast handled by Redux middleware
    } catch {
      // Error handled by Redux middleware
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isLoading}
      className="btn btn-primary"
    >
      {isLoading ? "Adding..." : "Add to Cart"}
    </button>
  );
}

// components/AddToCartButton/AddToCartButton.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { configureStore, PreloadedState } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import cartSlice, { addToCart } from "@/store/cartSlice";
import AddToCartButton from "./AddToCartButton";

// Mock Redux Toolkit's async thunk
jest.mock("@/store/cartSlice");

interface RenderWithReduxOptions {
  preloadedState?: PreloadedState<any>;
  store?: any;
}

function renderWithRedux(
  component: React.ReactElement,
  { preloadedState, store = configureStore({ reducer: { cart: cartSlice } }) }: RenderWithReduxOptions = {}
) {
  return render(<Provider store={store}>{component}</Provider>);
}

describe("AddToCartButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders button with initial text", () => {
    renderWithRedux(<AddToCartButton productId="123" quantity={1} />);
    expect(screen.getByRole("button", { name: /add to cart/i })).toBeInTheDocument();
  });

  it("dispatches addToCart action on click", async () => {
    const user = userEvent.setup();
    const mockAddToCart = jest.fn().mockResolvedValue({ payload: {} });
    (addToCart as jest.Mock).mockImplementation(() => ({
      unwrap: () => Promise.resolve({}),
      type: "cart/addToCart",
    }));

    renderWithRedux(<AddToCartButton productId="123" quantity={2} />);

    const button = screen.getByRole("button", { name: /add to cart/i });
    await user.click(button);

    await waitFor(() => {
      expect(addToCart).toHaveBeenCalledWith({ productId: "123", quantity: 2 });
    });
  });

  it("shows loading state while adding to cart", async () => {
    const user = userEvent.setup();
    renderWithRedux(<AddToCartButton productId="123" quantity={1} />);

    const button = screen.getByRole("button");
    await user.click(button);

    await waitFor(() => {
      expect(button).toHaveTextContent("Adding...");
      expect(button).toBeDisabled();
    });
  });

  it("disables button during loading", () => {
    const store = configureStore({
      reducer: { cart: cartSlice },
      preloadedState: { cart: { isLoading: true, items: [] } },
    });

    renderWithRedux(<AddToCartButton productId="123" quantity={1} />, { store });

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });
});
```

## Form Component Testing

```tsx
// components/LoginForm/LoginForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be 6+ characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
}

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email">Email</label>
        <input {...register("email")} id="email" type="email" />
        {errors.email && <p role="alert">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input {...register("password")} id="password" type="password" />
        {errors.password && <p role="alert">{errors.password.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Logging in..." : "Log In"}
      </button>
    </form>
  );
}

// components/LoginForm/LoginForm.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "./LoginForm";

describe("LoginForm", () => {
  it("renders form fields", () => {
    const onSubmit = jest.fn();
    render(<LoginForm onSubmit={onSubmit} />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("shows validation errors for invalid inputs", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(<LoginForm onSubmit={onSubmit} />);

    // Try to submit with empty fields
    await user.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText("Invalid email")).toBeInTheDocument();
      expect(screen.getByText("Password must be 6+ characters")).toBeInTheDocument();
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits form with valid data", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    render(<LoginForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("disables button while submitting", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn(() => new Promise((resolve) => setTimeout(resolve, 100)));
    render(<LoginForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");

    const button = screen.getByRole("button", { name: /log in/i });
    await user.click(button);

    expect(button).toBeDisabled();
    expect(button).toHaveTextContent("Logging in...");
  });
});
```

## Accessibility Testing

```tsx
// Install jest-axe
npm install -D jest-axe

// Example accessibility test
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import ProductCard from "./ProductCard";

expect.extend(toHaveNoViolations);

describe("ProductCard Accessibility", () => {
  it("has no accessibility violations", async () => {
    const mockProduct = {
      id: "1",
      name: "Test Product",
      price: 29.99,
      image: "/test.jpg",
      rating: 4,
      stock: 10,
    };

    const { container } = render(<ProductCard product={mockProduct} />);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });

  it("has semantic HTML structure", () => {
    const { container } = render(<ProductCard product={mockProduct} />);

    expect(container.querySelector("h3")).toBeInTheDocument();
    expect(container.querySelector("button")).toBeInTheDocument();
    expect(container.querySelector("img")).toHaveAttribute("alt");
  });

  it("supports keyboard navigation", async () => {
    const user = userEvent.setup();
    render(<ProductCard product={mockProduct} />);

    const button = screen.getByRole("button");
    button.focus();

    expect(button).toHaveFocus();

    await user.keyboard("{Enter}");
    // Button action triggered
  });
});
```

## Best Practices

1. **Test behavior, not implementation**
   ```tsx
   // ❌ Bad
   expect(component.state.isOpen).toBe(true);

   // ✅ Good
   expect(screen.getByText("Modal content")).toBeVisible();
   ```

2. **Use semantic queries**
   ```tsx
   // ❌ Bad
   screen.getByTestId("submit-btn");

   // ✅ Good
   screen.getByRole("button", { name: /submit/i });
   ```

3. **Test user interactions, not click events**
   ```tsx
   // ✅ Use userEvent, not fireEvent
   await user.click(button);
   await user.type(input, "text");
   ```

4. **Avoid implementation details**
   ```tsx
   // ❌ Bad: Testing internal function
   expect(component.instance.calculateTotal()).toBe(100);

   // ✅ Good: Testing visible output
   expect(screen.getByText("Total: $100")).toBeInTheDocument();
   ```

5. **Group related tests**
   ```tsx
   describe("ProductCard", () => {
     describe("rendering", () => {
       it("renders product name", () => { });
       it("renders product price", () => { });
     });

     describe("interactions", () => {
       it("adds to cart on button click", () => { });
     });
   });
   ```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test ProductCard

# Run tests matching pattern
npm test --testNamePattern="should render"

# Update snapshots (if using snapshot testing)
npm test -- -u
```

## Coverage Goals

- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

View coverage report: `npm test -- --coverage`

## Common Testing Patterns

See individual component patterns in the main reference guides for specific test examples for:
- Product Cards
- Forms (Checkout, Login, Profile)
- Redux-connected components
- Async operations
- Error states
