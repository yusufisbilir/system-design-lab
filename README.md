# 🧠 System Design Lab: Frontend Architecture

A collection of minimalist, high-impact projects focused on **System Design**, **Scalability**, and **Performance Engineering**.

Unlike traditional portfolios that prioritize UI/UX polish, this lab is dedicated to solving complex architectural challenges using **Next.js 16**, **React 19**, and modern infrastructure patterns.

---

## 🎯 Engineering Philosophy

My approach to software development is guided by **Architectural Minimalism**:

- **Logic over Aesthetics:** High-quality, scalable systems don't need "fancy" CSS; they need robust data flows and resilient state management.
- **Explicit Caching Strategy:** Leveraging Next.js 16’s `"use cache"` directive to move away from implicit caching, ensuring predictable performance at scale.
- **Zero-Runtime Optimization:** Utilizing the **React Compiler** to eliminate manual memoization and reduce client-side overhead.
- **Edge-First Thinking:** Using **Partial Prerendering (PPR)** to deliver a static shell in <10ms, while streaming dynamic content via React 19 `Suspense`.
- **The AI Paradox:** As AI handles syntax, the engineer’s value shifts to **System Design**: choosing the right primitives and managing technical trade-offs.

## 📂 Lab Structure

This repository is a **monolithic Next.js 16 application**. Each project lives within its own route hierarchy to share architectural primitives and benchmarking tools.

- `/app/content-engine/` → Global Content Engine (1000+ Pages, scalable architecture)
- `/app/reactive-hub/` → Reactive Data Hub (Mutations)
- `/app/micro-ui/` → Edge-First Micro-UI (Modularity) [Active]

---

## 🏗️ Active Projects

### 1. Global Content Engine (Scale & Performance)

- **Core Problem:** Serving 1000+ dynamic pages with near-zero TTFB and minimal compute costs (scalable to 100k+).
- **The Solution:** **Cache Components** model. Using `"use cache"` to store granular component outputs on the Edge and **PPR** for instant shell delivery.
- **Design Focus:** Advanced ISR with `updateTag()` for selective cache invalidation and tag-based revalidation strategies.

### 2. Reactive Data Hub (Consistency & Latency)

- **Core Problem:** Managing high-frequency data mutations without UI flickers or heavy state libraries.
- **The Solution:** React 19 **Server Actions** paired with `useActionState` and `useOptimistic`.
- **Design Focus:** Read-your-writes semantics using the new `updateTag()` API for instant cache invalidation.

### 3. Edge-First Micro-UI (Modularity)

- **Core Problem:** Feature-independent module deployment without monolithic bundle bloat or complex client-side federation.
- **The Solution:** **Proxy Pattern Orchestration**. A central orchestrator intercepts requests and resolves isolated modules dynamically on the Edge.
- **Design Focus:** Standardized `BuildAdapter` interface and parallel `Suspense` streaming for multi-module composition with 0ms client overhead.

---

## 🛠️ The Tech Stack (Next.js 16 Ecosystem)

| Layer              | Technology                  | Rationale                                                     |
| :----------------- | :-------------------------- | :------------------------------------------------------------ |
| **Framework**      | **Next.js 16 (App Router)** | Stability with Turbopack and native PPR support.              |
| **Compiler**       | **React Compiler**          | Automatic memoization (no more `useMemo`/`useCallback`).      |
| **Caching**        | **Cache Components**        | Granular, explicit control with `"use cache"` directive.      |
| **Runtime**        | **React 19.2 (Canary)**     | Native `use` hook, View Transitions, and `useEffectEvent`.    |
| **Routing**        | **proxy.ts**                | Explicit network boundaries and Node.js runtime interception. |
| **Infrastructure** | **Edge Network**            | Global distribution to minimize latency and egress costs.     |

---

## ✅ Implementation Status

### Content Engine (Active)
- ✅ `"use cache"` directive with `cacheLife('hours')` profiles
- ✅ Granular `cacheTag()` for selective invalidation (`post-${slug}`)
- ✅ PPR (Partial Prerendering) with Suspense boundaries
- ✅ React 19 Server Actions with `useOptimistic` for zero-flicker mutations
- ✅ `updateTag()` for cache invalidation
- ✅ Mock DB with 1000 posts (2.5s latency simulation)
- ✅ Client-side performance metrics (TTFB, Cache HIT/MISS detection)
- ✅ `generateStaticParams` for first 10 posts (ISR for rest)

### Reactive Data Hub (Active)
- ✅ React 19 `useOptimistic` for zero-latency UI updates
- ✅ `useActionState` for managing form mutations
- ✅ Server Actions with `updateTag()` for instant cache invalidation
- ✅ Optimistic UI rollbacks on server error
- ✅ Hybrid state management (Server State + Client Optimistic State)

### Micro-UI (Active)
- ✅ Proxy-based module orchestration (`proxy.ts`)
- ✅ Standardized `BuildAdapter` interface (`loader` + `Component`)
- ✅ Parallel `Suspense` streaming for isolated features
- ✅ Edge Runtime execution support
- ✅ Simulated network latency per module for performance visualization
- ✅ Independent build-time transformation simulation

---

## 📈 Technical Decision Log (ADR)

> **ADR-001: Explicit Caching over Standard ISR**
>
> - **Context:** Large-scale content sites (1000+ pages, scalable to 100k+) make full-page revalidation expensive and unpredictable.
> - **Decision:** Implement `"use cache"` at the component level with `cacheLife('hours')` profile and granular `cacheTag()` for selective invalidation.
> - **Implementation:** `getCachedPost()` function uses `'use cache'` directive with `cacheTag('posts', \`post-\${slug}\`)` for tag-based invalidation via `updateTag()`.
> - **Consequence:** Enables on-demand cache invalidation without full-page rebuilds. Mock DB shows 2.5s cold start vs <100ms cache hits, demonstrating potential 90%+ compute reduction at scale.

> **ADR-002: Optimistic UI with Server-Driven State (React 19)**
>
> - **Context:** High-latency server operations (simulated 200-500ms) typically cause UI freezes or require complex client-side state management to maintain responsiveness.
> - **Decision:** Adopt React 19's native `useOptimistic` and `useActionState` to handle mutations, keeping the client state as a temporary projection of server state.
> - **Implementation:** `ServerStatusControls` uses `useOptimistic` to immediately reflect status changes, while Server Actions asynchronously update the DB and trigger `updateTag()` for event consistency.
> - **Consequence:** Eliminates the need for global client store (Redux/Zustand) for mutation state. Achieves zero-flicker user experience even with artificial network delays, maintaining strict server-side source of truth.

> **ADR-003: Edge-First Composition via Proxy Pattern**
>
> - **Context:** Modular UI development usually involves heavy client-side federation or iframe-based isolation, which hurts performance (TTFB) and increases bundle size.
> - **Decision:** Implement a server-side Proxy to coordinate independent modules during the Edge request lifecycle, using a shared adapter interface.
> - **Implementation:** `MicroUIProxy` lazily imports modules and enforces a common `BuildAdapter` contract, allowing the host to stream disparate UI parts via React 19 `Suspense`.
> - **Consequence:** Achieves micro-frontend benefits (feature isolation, independent loading) with 0ms client-side orchestration overhead. Ensures each module is treated as an independent execution unit on the Edge.
