# Yoru.js Core (@yoru-js/core) - Agent & Developer Skill Guide

This comprehensive guide is designed for AI agents and developers to understand, configure, and integrate the authentication and state management modules from `@yoru-js/core` into new Yoru.js-based projects consistently and reliably without bugs.

---

## 1. Architecture & Core Features

The `@yoru-js/core` package provides essential foundation modules for Yoru.js applications:
* **`AuthProvider`**: An SSR-safe (*Server-Side Rendering Safe*) React Context Provider that synchronizes sessions with `localStorage` and manages initialization state (`isLoading`).
* **`useAuth<TUser>()`**: A generic React hook providing access to `token`, `user`, `isAuthenticated`, and `isLoading`, as well as `login(token, user)` and `logout()` actions.
* **`ProtectedRoutes`**: A Route Guard component for React Router that secures private routes with customizable `redirectTo` and `fallback` loading states.
* **`triggerUnauthorized()`**: A non-React utility function that dispatches an `auth:unauthorized` custom event from HTTP interceptors (Axios/Fetch) when receiving HTTP `401 Unauthorized` responses.
* **`@tanstack/react-query`**: Directly re-exported so developers do not need to install or configure TanStack Query separately.

---

## 2. Step-by-Step Integration in New Projects

### Step 1: Package Installation
```bash
# Using Bun
bun add @yoru-js/core react-router-dom

# Using NPM
npm install @yoru-js/core react-router-dom
```

---

### Step 2: Setup Root Provider (`App.tsx` or `main.tsx`)
Wrap the application with `<AuthProvider>` at the outermost layer of your routing tree:

```tsx
import { AuthProvider, ProtectedRoutes } from "@yoru-js/core";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProductPage from "./pages/ProductPage";

export default function App() {
  return (
    <AuthProvider storageKey="yoru_token">
      <BrowserRouter>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/login" element={<LoginPage />} />

          {/* PROTECTED ROUTES */}
          <Route
            element={
              <ProtectedRoutes
                redirectTo="/login"
                fallback={<div className="loading-screen">Loading session...</div>}
              />
            }
          >
            <Route path="/" element={<DashboardPage />} />
            <Route path="/products" element={<ProductPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
```

---

### Step 3: Setup HTTP Client & Interceptor (`src/api/base.ts`)
Use `triggerUnauthorized()` to automatically log the user out when their session expires without violating React lifecycle rules:

```ts
import axios from "axios";
import { triggerUnauthorized } from "@yoru-js/core";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. Attach Bearer token from localStorage to outgoing requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("yoru_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. Intercept 401 Unauthorized errors and trigger auto-logout
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Automatically resets auth state in AuthProvider and purges localStorage
      triggerUnauthorized();
    }
    return Promise.reject(error);
  }
);
```

---

### Step 4: Login Form Implementation (`src/views/login/LoginForm.tsx`)
Call `login(token, user)` once the API returns successful authentication data:

```tsx
import { useState } from "react";
import { useAuth } from "@yoru-js/core";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/api/base";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

export function LoginForm() {
  const { login } = useAuth<UserProfile>();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await apiClient.post("/auth/login", { email, password });
      
      // Persist auth token and user profile
      login(res.data.token, res.data.user);

      // Redirect to protected dashboard
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
      alert("Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Login"}
      </button>
    </form>
  );
}
```

---

### Step 5: Consuming Auth State Across Components (`Navbar.tsx`, etc.)
Access the user profile and trigger logout with type safety:

```tsx
import { useAuth } from "@yoru-js/core";

interface UserProfile {
  name: string;
  role: string;
}

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth<UserProfile>();

  if (!isAuthenticated) return null;

  return (
    <header className="navbar">
      <span>Welcome, {user?.name} ({user?.role})</span>
      <button onClick={logout}>Sign Out</button>
    </header>
  );
}
```

---

## 3. Rules & Best Practices for AI Agents

When an AI Agent generates or refactors code in a Yoru.js project:
1. **Never Mutate `localStorage` Directly for Auth State**:  
   Always invoke `login()` and `logout()` from `useAuth()`. Avoid calling `localStorage.removeItem("token")` directly in components, as it will bypass React re-rendering.
2. **Always Use Generic Types with `useAuth`**:  
   Provide user typing (e.g., `useAuth<MyUser>()`) to guarantee IDE autocompletion and type safety.
3. **Always Provide a `fallback` to `ProtectedRoutes`**:  
   Supply a spinner or skeleton fallback to prevent layout shifts or white screens while checking session state from storage.
4. **Avoid Hard Redirects (`window.location.href = "/login"`) in Interceptors**:  
   Always use `triggerUnauthorized()`. Let React Router and `ProtectedRoutes` manage smooth client-side SPA navigation.

---

## 4. Build & Publish Workflow (`@yoru-js/core`)

When updating and publishing `@yoru-js/core` to the NPM registry:

1. **Build the bundle**:
   ```powershell
   bun run build
   ```
2. **Increment version in `package.json`**:
   Ensure the version is higher than what is currently published on npm (e.g., `1.0.2` -> `1.0.3`).
3. **Publish to NPM**:
   ```powershell
   npm.cmd publish --access public
   # or with Bun:
   bun publish --access public
   ```
