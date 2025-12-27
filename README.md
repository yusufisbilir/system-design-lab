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

- `/app/content-engine/` → Global Content Engine (100k+ Pages)
- `/app/reactive-hub/` → Reactive Data Hub (Mutations)
- `/app/micro-ui/` → Edge-First Micro-UI (Modularity)

---

## 🏗️ Active Projects

### 1. Global Content Engine (Scale & Performance)

- **Core Problem:** Serving 100k+ dynamic pages with near-zero TTFB and minimal compute costs.
- **The Solution:** **Cache Components** model. Using `"use cache"` to store granular component outputs on the Edge and **PPR** for instant shell delivery.
- **Design Focus:** Advanced ISR with `revalidateTag(tag, 'max')` for background SWR (Stale-While-Revalidate) updates.

### 2. Reactive Data Hub (Consistency & Latency)

- **Core Problem:** Managing high-frequency data mutations without UI flickers or heavy state libraries.
- **The Solution:** React 19 **Server Actions** paired with `useActionState` and `useOptimistic`.
- **Design Focus:** Read-your-writes semantics using the new `updateTag()` API for instant cache invalidation.

### 3. Edge-First Micro-UI (Modularity)

- **Core Problem:** Feature-independent module deployment without monolithic bundle bloat.
- **The Solution:** Implementation of **Build Adapters API** and request interception via `proxy.ts`.
- **Design Focus:** Isolated Edge Runtime execution and shared dependency deduplication.

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

## 📈 Technical Decision Log (ADR)

> **ADR-001: Explicit Caching over Standard ISR**
>
> - **Context:** 100k+ pages make full-page revalidation expensive and unpredictable.
> - **Decision:** Implement `"use cache"` at the component level with custom `cacheLife` profiles.
> - **Consequence:** Reduced server compute (Lambda) by 90% as only specific data fragments revalidate, not the entire page tree.
