---
id: react-Coding-questions-001
slug: react-Coding-questions
title: Advanced React Coding Interview Problems with Solutions
categoryId: react
subcategory: React-Coding-Based
difficulty: Basic
tags:
  -  react
  -  Scenario-Based
  -  Coding-Based
  -  react Coding
summary:React Coding Interview Problems
updatedAt: 2026-09-17
status: published
thumbnail: ""
videos: []
resources: []
---
# Advanced React Coding Interview Problems with Solutions

This is a hands-on coding preparation set covering React hooks, asynchronous programming, performance, state management, reusable components, and enterprise application architecture.

Each problem includes:

- A real-world coding challenge.
- A working solution or reusable implementation.
- An explanation of the important concepts.
- A follow-up question an interviewer might ask.

Assumptions: Examples use modern React, JavaScript, functional components, and browser APIs. Code snippets are intended to be placed in a React project with the indicated imports.

Company-specific frequency data for these exact problems is not verified, so the order reflects preparation priority rather than a claimed most-asked ranking.

%%%
---
id: react-Coding-questions-002
slug: react-Coding-questions
title: Advanced React Hooks and API Programming
categoryId: react
subcategory: React-Coding-Based
difficulty: Basic
tags:
  - react
  - Scenario-Based
  - Coding-Based
  - react Coding
  - Advanced React Hooks
summary:Advanced React Hooks and API Programming
updatedAt: 2026-09-17
status: published
thumbnail: ""
videos: []
resources: []
---

# Part 1 — Advanced React Hooks and API Programming

## 1. Build a reusable useDebounce hook

Scenario: A product search sends an API request on every keystroke, overwhelming the backend.

Task: Implement a hook that updates the search value only after the user stops typing for 500 milliseconds.

```javascript
import { useEffect, useState } from "react";

function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export default function Search() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (!debouncedQuery.trim()) return;

    console.log("Search API:", debouncedQuery);
  }, [debouncedQuery]);

  return (
    <input
      value={query}
      onChange={e => setQuery(e.target.value)}
      placeholder="Search products"
    />
  );
}
```
**Explanation:** The timer resets whenever the input changes. The cleanup function cancels the previous timer, so only the latest value is emitted after the delay.

Follow-up: How is debouncing different from throttling?

Debouncing waits for inactivity. Throttling limits execution frequency during continuous activity.

## 2. Prevent API race conditions

Scenario: A user searches for "React" and immediately changes the query to "Angular". The React response arrives last and incorrectly overwrites the Angular results.

Task: Implement cancellation so obsolete requests cannot update the UI.
```javascript
import { useEffect, useState } from "react";

export default function SearchUsers({ query }) {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setUsers([]);
        setError(null);

        const response = await fetch(
          `/api/users?q=${encodeURIComponent(query)}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Request failed");
        }

        const data = await response.json();

        if (!controller.signal.aborted) {
          setUsers(data);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message);
        }
      }
    }

    if (query.trim()) load();
    else setUsers([]);

    return () => controller.abort();
  }, [query]);

  if (error) return <p>{error}</p>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```
**Explanation:** When query changes, React runs the cleanup function and aborts the previous request. The aborted request cannot update the component.

Follow-up: Does AbortController guarantee that a server has stopped processing the request?

No. It cancels the client-side request; server-side processing may continue.

## 3. Build a reusable useFetch hook

Scenario: Multiple components repeat the same loading, error-handling, and data-fetching logic.

Task: Create a custom hook that supports loading, errors, cancellation, and manual refresh.

```javascript
import { useEffect, useState } from "react";

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!url) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);
      setData(null);

      try {
        const response = await fetch(url, {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();

        if (!controller.signal.aborted) {
          setData(result);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => controller.abort();
  }, [url, version]);

  return {
    data,
    loading,
    error,
    refetch: () => setVersion(v => v + 1)
  };
}

export default function Users() {
  const { data, loading, error, refetch } =
    useFetch("/api/users");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <>
      <button onClick={refetch}>Refresh</button>
      {data?.map(user => (
        <p key={user.id}>{user.name}</p>
      ))}
    </>
  );
}
```
**Explanation:** The hook encapsulates request state and cancels outdated requests. Incrementing version triggers a fresh request.

Follow-up: Would you build this yourself in a large enterprise application?

For complex server-state requirements, consider TanStack Query or a framework-integrated data-loading solution for caching, retries, deduplication, and invalidation.

## 4. Implement an infinite scrolling list

Scenario: An e-commerce application must display thousands of products without loading every page immediately.

Task: Load the next page automatically when the user reaches the bottom.

```javascript
import { useEffect, useRef, useState } from "react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const sentinel = useRef(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/products?page=${page}`,
          { signal: controller.signal }
        );

        if (!response.ok) throw new Error("Load failed");

        // Expected API: { items: [], hasMore: boolean }
        const result = await response.json();

        if (controller.signal.aborted) return;

        setProducts(prev => [...prev, ...result.items]);
        setHasMore(result.hasMore);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => controller.abort();
  }, [page]);

  useEffect(() => {
    const node = sentinel.current;
    if (!node || loading || !hasMore || error) return;

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(p => p + 1);
      }
    });

    observer.observe(node);

    return () => observer.disconnect();
  }, [loading, hasMore, error]);

  return (
    <>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}

      {loading && <p>Loading...</p>}

      {error && (
        <button onClick={() => setPage(p => p)}>
          {error} — retry requires a refresh trigger
        </button>
      )}

      <div ref={sentinel} />
    </>
  );
}
```

**Important correction for production:** The retry button above needs a separate retry counter because setting the same page number does not trigger a render. Add const [retry, setRetry] = useState(0), include retry in the fetch effect dependencies, and use onClick={() => setRetry(n => n + 1)}.

**Explanation:** IntersectionObserver detects when the sentinel enters the viewport. Each successful intersection advances pagination. Cancellation prevents obsolete fetches from appending data.

**Follow-up:** How would you handle changing filters?

Reset the product list and pagination together, preferably by separating the paginated list into a component keyed by the active filters.

%%%
---
id: react-Coding-questions-003
slug: react-Coding-questions
title: State Management and Reusable Components
categoryId: react
subcategory: React-Coding-Based
difficulty: Basic
tags:
  - react
  - Scenario-Based
  - Coding-Based
  - react Coding
  - Advanced React Hooks
  - State Management
summary:State Management and Reusable Components
updatedAt: 2026-09-17
status: published
thumbnail: ""
videos: []
resources: []
---

# Part 2 — State Management and Reusable Components

## 5. Implement a shopping cart using useReducer

Scenario: Multiple actions must update a cart consistently: add, remove, change quantity, and clear.

```javascript
import { useReducer } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const existing = state.find(
        x => x.id === action.product.id
      );

      if (existing) {
        return state.map(x =>
          x.id === action.product.id
            ? { ...x, quantity: x.quantity + 1 }
            : x
        );
      }

      return [
        ...state,
        { ...action.product, quantity: 1 }
      ];
    }

    case "REMOVE":
      return state.filter(x => x.id !== action.id);

    case "QUANTITY":
      return state.map(x =>
        x.id === action.id
          ? { ...x, quantity: Math.max(1, action.quantity) }
          : x
      );

    case "CLEAR":
      return [];

    default:
      return state;
  }
}

export default function Cart() {
  const [cart, dispatch] = useReducer(reducer, []);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <>
      <button
        onClick={() => dispatch({
          type: "ADD",
          product: { id: 1, name: "Laptop", price: 1000 }
        })}
      >
        Add Laptop
      </button>

      {cart.map(item => (
        <div key={item.id}>
          {item.name}: {item.quantity}
          <button onClick={() => dispatch({
            type: "REMOVE",
            id: item.id
          })}>
            Remove
          </button>
        </div>
      ))}

      <p>Total: ${total}</p>
    </>
  );
}
```
**Explanation:** A reducer centralizes state transitions and produces immutable state updates. This makes related actions easier to test and reason about.

**Interview follow-up:** How would you share the cart across components?

Wrap the reducer in Context or use an application-level state store. Persist authoritative cart data on the backend when required.

## 6. Create a global theme using Context API

Scenario: Users must switch between light and dark themes from anywhere in the application.

```javascript
import {
  createContext,
  useContext,
  useState
} from "react";

const ThemeContext = createContext(null);

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  function toggleTheme() {
    setTheme(t => t === "light" ? "dark" : "light");
  }

  return (
    <ThemeContext.Provider value={{
      theme,
      toggleTheme
    }}>
      <div data-theme={theme}>{children}</div>
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("ThemeProvider missing");
  }

  return context;
}

function Toolbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Toolbar />
    </ThemeProvider>
  );
}
```

**Explanation:** Context distributes the theme without prop drilling. CSS can target [data-theme="dark"] to apply the selected theme.

Follow-up: Why might a large Context cause unnecessary re-renders?

Consumers update when the provider's context value changes. Split unrelated contexts and memoize provider values when useful.

## 7. Build a reusable modal using React Portal

Scenario: A modal appears behind other components because of stacking contexts and layout restrictions.

```javascript
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

function Modal({ open, onClose, children }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const previous = document.activeElement;

    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    closeRef.current?.focus();

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
      previous?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="modal-backdrop">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Confirmation"
        className="modal"
      >
        <button ref={closeRef} onClick={onClose}>
          Close
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}

export default Modal;
```

**Explanation:** createPortal renders the modal into document.body while retaining its logical position in the React component tree.

**Production considerations:** Add focus trapping, background inertness, scroll locking, and appropriate CSS. A mature accessible dialog library can handle these requirements.

**Follow-up:** Do events from portals bubble through the DOM tree or React tree?

React events bubble through the React component tree.

## 8. Implement undo and redo functionality

Scenario: A form editor must allow users to undo and redo changes.
```javascript
import { useState } from "react";

function useHistory(initialValue) {
  const [history, setHistory] = useState({
    past: [],
    present: initialValue,
    future: []
  });

  function set(value) {
    setHistory(h => {
      const next = typeof value === "function"
        ? value(h.present)
        : value;

      if (Object.is(next, h.present)) return h;

      return {
        past: [...h.past, h.present],
        present: next,
        future: []
      };
    });
  }

  function undo() {
    setHistory(h => {
      if (!h.past.length) return h;

      return {
        past: h.past.slice(0, -1),
        present: h.past[h.past.length - 1],
        future: [h.present, ...h.future]
      };
    });
  }

  function redo() {
    setHistory(h => {
      if (!h.future.length) return h;

      return {
        past: [...h.past, h.present],
        present: h.future[0],
        future: h.future.slice(1)
      };
    });
  }

  return {
    value: history.present,
    set,
    undo,
    redo,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0
  };
}

export default function Editor() {
  const h = useHistory("");

  return (
    <>
      <textarea
        value={h.value}
        onChange={e => h.set(e.target.value)}
      />

      <button disabled={!h.canUndo} onClick={h.undo}>
        Undo
      </button>

      <button disabled={!h.canRedo} onClick={h.redo}>
        Redo
      </button>
    </>
  );
}
```

**Explanation:** Maintain three collections: past states, the present state, and future states. Editing after undo clears the redo history.

**Follow-up:** How would you avoid excessive memory consumption?

Limit history length, group typing operations, or store reversible operations instead of entire snapshots.

%%%
---
id: react-Coding-questions-004
slug: react-Coding-questions
title: Performance Optimization
categoryId: react
subcategory: React-Coding-Based
difficulty: Basic
tags:
  - react
  - Scenario-Based
  - Coding-Based
  - react Coding
  - Advanced React Hooks
  - State Management
  - Performance Optimization
summary: Performance Optimization
updatedAt: 2026-09-17
status: published
thumbnail: ""
videos: []
resources: []
---

# Part 3 — Performance Optimization

## 9. Optimize an expensive product filtering operation

Scenario: A dashboard filters thousands of products whenever the component renders.

Task: Prevent unnecessary recalculation and child rendering.
```javascript
import {
  memo,
  useMemo,
  useState
} from "react";

const ProductList = memo(function ProductList({
  products
}) {
  return (
    <ul>
      {products.map(p => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
});

export default function Dashboard({ products }) {
  const [search, setSearch] = useState("");
  const [count, setCount] = useState(0);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();

    return products.filter(p =>
      p.name.toLowerCase().includes(term)
    );
  }, [products, search]);

  return (
    <>
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <button onClick={() => setCount(c => c + 1)}>
        Counter: {count}
      </button>

      <ProductList products={filtered} />
    </>
  );
}
```

**Explanation:** useMemo retains the filtered result when its dependencies remain unchanged. React.memo can skip rendering ProductList when its props are unchanged.

**Follow-up:** Should every component use memoization?

No. Profile first. Memoization adds complexity and has its own cost.

## 10. Implement list virtualization without a library

Scenario: Rendering 100,000 rows causes significant DOM overhead.

Task: Render only the visible rows and a small buffer.

```javascript
import { useState } from "react";

function VirtualList({
  items,
  height = 400,
  rowHeight = 40
}) {
  const [scrollTop, setScrollTop] = useState(0);
  const overscan = 5;

  const start = Math.max(
    0,
    Math.floor(scrollTop / rowHeight) - overscan
  );

  const visibleCount =
    Math.ceil(height / rowHeight) + overscan * 2;

  const end = Math.min(
    items.length,
    start + visibleCount
  );

  return (
    <div
      style={{ height, overflowY: "auto" }}
      onScroll={e =>
        setScrollTop(e.currentTarget.scrollTop)
      }
    >
      <div
        style={{
          height: items.length * rowHeight,
          position: "relative"
        }}
      >
        {items.slice(start, end).map((item, i) => (
          <div
            key={item.id}
            style={{
              position: "absolute",
              top: (start + i) * rowHeight,
              height: rowHeight,
              width: "100%"
            }}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const items = Array.from(
    { length: 100000 },
    (_, id) => ({ id, name: `Item ${id}` })
  );

  return <VirtualList items={items} />;
}
```

**Explanation:** The scroll container retains the total virtual height, but React renders only the rows near the viewport.

**Follow-up:** What if rows have different heights?

Use dynamic measurement and an appropriate virtualization algorithm or library. This implementation assumes fixed-height rows.

## 11. Build a reusable throttle hook

Scenario: A scroll event fires dozens of times per second, triggering expensive updates.


```javascript
import { useEffect, useRef } from "react";

function useThrottle(callback, delay) {
  const callbackRef = useRef(callback);
  const lastRun = useRef(0);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return (...args) => {
    const now = Date.now();

    if (now - lastRun.current >= delay) {
      lastRun.current = now;
      callbackRef.current(...args);
    }
  };
}

export default function ScrollTracker() {
  const throttled = useThrottle(() => {
    console.log("Scroll position:", window.scrollY);
  }, 200);

  useEffect(() => {
    window.addEventListener("scroll", throttled);

    return () => {
      window.removeEventListener("scroll", throttled);
    };
  }, [throttled]);

  return <div>Scroll the page</div>;
}
```

**Production improvement:** The returned function above is recreated on each render. Stabilize its identity using useCallback, and keep the callback ref current without relying on stale closures.

**Explanation:** Throttling limits how frequently the callback executes. This implementation uses leading-edge throttling without a trailing call.

**Follow-up:** When would requestAnimationFrame be preferable?

For visual updates that should be coordinated with browser rendering.

## 12. Implement lazy loading with an Error Boundary

Scenario: A reporting module is large and should load only when required.

```javascript
import React, { Suspense } from "react";

const Reports = React.lazy(
  () => import("./Reports")
);

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return <p>Unable to load reports.</p>;
    }

    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<p>Loading reports...</p>}>
        <Reports />
      </Suspense>
    </ErrorBoundary>
  );
}
```
**Explanation:** React.lazy loads component code dynamically. Suspense displays a fallback while loading. The Error Boundary catches rendering failures, including rejected lazy imports.

**Follow-up:** How do you retry a failed dynamic import?

Reset the error boundary and coordinate a fresh module-loading attempt; retry behavior depends on the bundler and module-loading cache.

%%%
---
id: react-Coding-questions-005
slug: react-Coding-questions
title: Complex Forms, Data Handling and Security
categoryId: react
subcategory: React-Coding-Based
difficulty: Basic
tags:
  - react
  - Scenario-Based
  - Coding-Based
  - react Coding
  - Advanced React Hooks
  - State Management
  - Performance Optimization
  - Data Handling and Security
summary: Complex Forms, Data Handling and Security
updatedAt: 2026-09-17
status: published
thumbnail: ""
videos: []
resources: []
---

# Part 4 — Complex Forms, Data Handling and Security

## 13. Create a dynamic form with validation

Scenario: A registration form has configurable fields and validation rules.

Task: Generate inputs dynamically and validate before submission.

```javascript
import { useState } from "react";

const fields = [
  { name: "name", label: "Name", required: true },
  { name: "email", label: "Email", required: true },
  { name: "age", label: "Age", required: false }
];

export default function DynamicForm() {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});

  function validate() {
    const next = {};

    for (const field of fields) {
      const value = String(
        values[field.name] ?? ""
      ).trim();

      if (field.required && !value) {
        next[field.name] = "Required";
      }

      if (
        field.name === "email" &&
        value &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ) {
        next.email = "Invalid email";
      }

      if (
        field.name === "age" &&
        value &&
        (!Number.isInteger(Number(value)) ||
          Number(value) < 0)
      ) {
        next.age = "Invalid age";
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function submit(e) {
    e.preventDefault();

    if (validate()) {
      console.log("Valid data:", values);
    }
  }

  return (
    <form onSubmit={submit} noValidate>
      {fields.map(field => (
        <div key={field.name}>
          <label htmlFor={field.name}>
            {field.label}
          </label>

          <input
            id={field.name}
            type={
              field.name === "email"
                ? "email"
                : field.name === "age"
                ? "number"
                : "text"
            }
            value={values[field.name] ?? ""}
            aria-invalid={!!errors[field.name]}
            onChange={e =>
              setValues(v => ({
                ...v,
                [field.name]: e.target.value
              }))
            }
          />

          {errors[field.name] && (
            <p role="alert">
              {errors[field.name]}
            </p>
          )}
        </div>
      ))}

      <button type="submit">Submit</button>
    </form>
  );
}
```
**Explanation:** Field metadata drives rendering and validation. The same pattern can support conditional fields, schema validation, and server-defined forms.

**Follow-up:** How would you handle hundreds of fields?

Consider React Hook Form, schema validation, field-level subscriptions, and splitting the form into sections.

## 14. Implement optimistic UI updates

Scenario: A user clicks Like, but the backend takes two seconds to respond.

Task: Update the UI immediately and roll back if the request fails.

```javascript
import { useState } from "react";

export default function LikeButton({
  postId,
  initialLikes
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function like() {
    if (pending) return;

    const previous = likes;

    setLikes(previous + 1);
    setPending(true);
    setError("");

    try {
      const response = await fetch(
        `/api/posts/${postId}/like`,
        { method: "POST" }
      );

      if (!response.ok) {
        throw new Error("Unable to save like");
      }

      const result = await response.json();
      setLikes(result.likes);
    } catch (err) {
      setLikes(previous);
      setError(err.message);
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <button disabled={pending} onClick={like}>
        Like ({likes})
      </button>

      {error && <p role="alert">{error}</p>}
    </>
  );
}
```

**Explanation:** The UI updates before the network response. If the request fails, the previous state is restored.

**Follow-up:** What if multiple users update the same record?

Treat the server as authoritative. Use versioning, conflict handling, or cache invalidation to reconcile concurrent updates.


## 15. Implement a protected route

Scenario: Only authenticated users should access the dashboard.

Task: Redirect unauthenticated users to login.

```javascript
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes
} from "react-router-dom";

function ProtectedRoute({
  user,
  loading,
  children
}) {
  if (loading) {
    return <p>Checking session...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function Dashboard() {
  return <h1>Dashboard</h1>;
}

function Login() {
  return <h1>Login</h1>;
}

export default function App() {
  // These values normally come from an auth provider.
  const user = { id: 1 };
  const loading = false;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              user={user}
              loading={loading}
            >
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
```
**Explanation:** The route checks authentication before rendering protected content. The loading state avoids redirecting while the session is being restored.

**Follow-up:** Is a protected React route sufficient for security?

No. ASP.NET Core or another backend must independently validate authentication and authorization for every protected API.

## 16. Implement automatic API retry with exponential backoff

Scenario: A service occasionally returns HTTP 503 due to temporary overload.

Task: Retry transient failures without overwhelming the backend.

```javascript
const sleep = ms =>
  new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetry(
  url,
  { retries = 3, signal } = {}
) {
  for (let attempt = 0; ; attempt++) {
    if (signal?.aborted) {
      throw signal.reason ??
        new DOMException("Aborted", "AbortError");
    }

    try {
      const response = await fetch(url, { signal });

      if (response.ok) return response;

      const retryable = [429, 502, 503, 504]
        .includes(response.status);

      if (!retryable || attempt >= retries) {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      if (
        signal?.aborted ||
        attempt >= retries ||
        (error instanceof Error &&
          error.message.startsWith("HTTP "))
      ) {
        throw error;
      }
    }

    const delay = Math.min(
      1000 * 2 ** attempt,
      8000
    );

    await sleep(delay);
  }
}

// Usage
fetchWithRetry("/api/products")
  .then(response => response.json())
  .then(console.log)
  .catch(console.error);
```

**Explanation:** Retry delays increase exponentially: approximately 1, 2, and 4 seconds for the three retries.

**Production considerations:** Add jitter, respect Retry-After, support abortable delays, and distinguish transient network failures from permanent failures. Retry non-idempotent operations only when the backend supports safe retries.

**Follow-up:** Why should HTTP 400 generally not be retried?

It normally indicates a request problem that retrying unchanged will not resolve.

%%%
---
id: react-Coding-questions-006
slug: react-Coding-questions
title: Enterprise-Level React Coding
categoryId: react
subcategory: React-Coding-Based
difficulty: Basic
tags:
  - react
  - Scenario-Based
  - Coding-Based
  - react Coding
  - Advanced React Hooks
  - State Management
  - Performance Optimization
  - Data Handling and Security
summary: Enterprise-Level React Coding
updatedAt: 2026-09-17
status: published
thumbnail: ""
videos: []
resources: []
---

# Part 5 — Enterprise-Level React Coding

## 17. Implement real-time notifications using WebSocket

Scenario: A hospital dashboard must display notifications when new appointments arrive.

Task: Establish a WebSocket connection, receive messages, and clean up correctly.

```javascript
import { useEffect, useState } from "react";

function useNotifications(url) {
  const [notifications, setNotifications] =
    useState([]);

  const [status, setStatus] =
    useState("connecting");

  useEffect(() => {
    const socket = new WebSocket(url);
    let active = true;

    socket.onopen = () => {
      if (active) setStatus("connected");
    };

    socket.onmessage = event => {
      if (!active) return;

      try {
        const message = JSON.parse(event.data);

        setNotifications(prev => [
          message,
          ...prev
        ].slice(0, 100));
      } catch {
        console.error("Invalid message");
      }
    };

    socket.onerror = () => {
      if (active) setStatus("error");
    };

    socket.onclose = () => {
      if (active) setStatus("disconnected");
    };

    return () => {
      active = false;
      socket.close();
    };
  }, [url]);

  return { notifications, status };
}

export default function Notifications() {
  const { notifications, status } =
    useNotifications("wss://example.com/events");

  return (
    <>
      <p>Connection: {status}</p>

      <ul>
        {notifications.map((n, i) => (
          <li key={n.id ?? i}>{n.message}</li>
        ))}
      </ul>
    </>
  );
}
```

**Explanation:** The hook manages the connection lifecycle. Incoming messages update React state, and cleanup closes the socket.

**Follow-up:** How would you implement this with ASP.NET Core?

**SignalR** is a suitable option. Its client library provides connection management and reconnect capabilities. For production, add authentication, reconnection, event IDs, and missed-message recovery.


## 18. Implement a reusable pagination component

Scenario: An API returns thousands of records, but the application should display only one page at a time.
```javascript
import { useState } from "react";

function Pagination({
  page,
  totalPages,
  onChange
}) {
  return (
    <nav aria-label="Pagination">
      <button
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        Previous
      </button>

      <span>
        Page {page} of {totalPages}
      </span>

      <button
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        Next
      </button>
    </nav>
  );
}

export default function ProductTable({
  products
}) {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const totalPages = Math.max(
    1,
    Math.ceil(products.length / pageSize)
  );

  const currentPage = Math.min(page, totalPages);

  const visible = products.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <>
      {visible.map(product => (
        <div key={product.id}>
          {product.name}
        </div>
      ))}

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        onChange={setPage}
      />
    </>
  );
}
```

**Explanation:** The component calculates page boundaries and displays only the selected slice.

**Follow-up:** How would you adapt this for 10 million records?

Move pagination to the backend. Request one page at a time and use the API's total count or cursor metadata.

## 19. Build an accessible autocomplete component

Scenario: A search field must display suggestions while the user types and support keyboard selection.

```javascript
import { useId, useState } from "react";

export default function Autocomplete({ items }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(-1);
  const [open, setOpen] = useState(false);
  const listId = useId();

  const results = items.filter(item =>
    item.toLowerCase().includes(
      query.toLowerCase()
    )
  );

  function select(item) {
    setQuery(item);
    setOpen(false);
    setActive(-1);
  }

  function handleKeyDown(e) {
    if (e.key === "Escape") {
      setOpen(false);
      setActive(-1);
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive(i =>
        Math.min(i + 1, results.length - 1)
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive(i => Math.max(i - 1, -1));
    }

    if (
      e.key === "Enter" &&
      open &&
      active >= 0
    ) {
      e.preventDefault();
      select(results[active]);
    }
  }

  return (
    <div>
      <input
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={
          open && active >= 0
            ? `${listId}-${active}`
            : undefined
        }
        value={query}
        onChange={e => {
          setQuery(e.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onKeyDown={handleKeyDown}
      />

      {open && results.length > 0 && (
        <ul id={listId} role="listbox">
          {results.map((item, index) => (
            <li
              id={`${listId}-${index}`}
              key={item}
              role="option"
              aria-selected={active === index}
              onMouseDown={e => e.preventDefault()}
              onClick={() => select(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

**Explanation:** The component filters suggestions, tracks the highlighted item, and supports Arrow Up, Arrow Down, Enter, and Escape.

**Follow-up:** What else is required for production accessibility?

Test with screen readers, handle focus and blur, announce result counts, support touch interactions, and ensure correct behavior for empty results and duplicate labels. An established accessible combobox library can simplify this.

## 20. Build a reusable data table with sorting, filtering, and pagination

Scenario: An enterprise application needs a reusable table for employees, products, and transactions.

Task: Implement client-side sorting, searching, and pagination.

```javascript
import { useMemo, useState } from "react";

function DataTable({ data, columns }) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({
    key: null,
    direction: "asc"
  });
  const [page, setPage] = useState(1);

  const pageSize = 10;

  const processed = useMemo(() => {
    const term = search.toLowerCase();

    const filtered = data.filter(row =>
      columns.some(col =>
        String(row[col.key] ?? "")
          .toLowerCase()
          .includes(term)
      )
    );

    if (!sort.key) return filtered;

    return [...filtered].sort((a, b) => {
      const result = String(
        a[sort.key] ?? ""
      ).localeCompare(
        String(b[sort.key] ?? ""),
        undefined,
        { numeric: true }
      );

      return sort.direction === "asc"
        ? result
        : -result;
    });
  }, [data, columns, search, sort]);

  const totalPages = Math.max(
    1,
    Math.ceil(processed.length / pageSize)
  );

  const currentPage = Math.min(page, totalPages);

  const visible = processed.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  function changeSort(key) {
    setSort(prev => ({
      key,
      direction:
        prev.key === key &&
        prev.direction === "asc"
          ? "desc"
          : "asc"
    }));

    setPage(1);
  }

  return (
    <>
      <input
        placeholder="Search..."
        value={search}
        onChange={e => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      <table>
        <thead>
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                aria-sort={
                  sort.key !== col.key
                    ? "none"
                    : sort.direction === "asc"
                    ? "ascending"
                    : "descending"
                }
              >
                <button
                  onClick={() =>
                    changeSort(col.key)
                  }
                >
                  {col.label}
                </button>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {visible.map(row => (
            <tr key={row.id}>
              {columns.map(col => (
                <td key={col.key}>
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <button
        disabled={currentPage === 1}
        onClick={() => setPage(p => p - 1)}
      >
        Previous
      </button>

      <span>
        {currentPage} / {totalPages}
      </span>

      <button
        disabled={currentPage === totalPages}
        onClick={() => setPage(p => p + 1)}
      >
        Next
      </button>
    </>
  );
}

export default function App() {
  const employees = [
    { id: 1, name: "John", salary: 50000 },
    { id: 2, name: "Alice", salary: 70000 },
    { id: 3, name: "Bob", salary: 60000 }
  ];

  const columns = [
    { key: "name", label: "Name" },
    { key: "salary", label: "Salary" }
  ];

  return (
    <DataTable
      data={employees}
      columns={columns}
    />
  );
}
```

**Explanation:** The table separates data configuration from rendering. useMemo avoids recalculating filtered and sorted results when unrelated state changes.

**Follow-up:** How would you extend this for enterprise-scale datasets?

Add server-side pagination, sorting and filtering, row selection, virtualization, column configuration, and typed column definitions.

For production, use appropriate data-type comparators rather than converting every value to a string.