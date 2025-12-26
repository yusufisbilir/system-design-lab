# 🧠 System Design Lab: Frontend Architecture

A collection of minimalist, high-impact projects focused on **System Design**, **Scalability**, and **Performance Engineering**. 

Unlike traditional portfolios that prioritize UI/UX polish, this lab is dedicated to solving complex architectural challenges using **Next.js**, **React**, and modern infrastructure patterns.

---

## 🎯 Engineering Philosophy

My approach to software development is guided by **Architectural Minimalism**:

* **Logic over Aesthetics:** High-quality, scalable systems don't need "fancy" CSS; they need robust data flows and resilient state management.
* **Zero-Runtime Optimization:** Leveraging the **React Compiler** and **Next.js 16** native features to eliminate manual memoization and reduce client-side overhead.
* **Strategic Trade-offs:** Every technical choice (e.g., SSR vs. ISR, Edge vs. Node) is evaluated through the lens of cost, latency, and maintainability.
* **Modern Primitives:** Mastering React 19’s new async primitives (`useActionState`, `useOptimistic`) to replace heavy third-party state libraries.
* **The AI Paradox:** With AI, writing code is efficient ("ask and it is done"), so the engineer's responsibility shifts to **System Design**: knowing *which* solutions to leverage and possessing the wisdom to make critical **trade-off decisions**.

## 📂 Lab Structure

This repository is engineered as a **monolithic Next.js application**. Instead of fragmented repositories, each project lives within its own route hierarchy. This design allows for shared primitives, consistent testing strategies, and side-by-side architectural comparisons.

*   `/app/content-engine/` → Global Content Engine
*   `/app/reactive-hub/` → Reactive Data Hub
*   `/app/micro-ui/` → Edge-First Micro-UI

---

## 🏗️ Active Projects

### 1. Global Content Engine (Scale & Performance)
* **Core Problem:** How to serve 100k+ dynamic pages with near-zero TTFB (Time to First Byte) and minimal server costs.
* **The Solution:** A multi-tier rendering strategy using **On-demand ISR** and **Edge Middleware**.
* **Design Focus:** Incremental Static Regeneration, Cache Invalidation at scale, and SEO-first architecture.

### 2. Reactive Data Hub (Consistency & Latency)
* **Core Problem:** Managing real-time data mutations without "UI flickers" or heavy WebSocket overhead.
* **The Solution:** Using **Next.js 16 Server Actions** paired with React 19's **Optimistic UI** patterns.
* **Design Focus:** Conflict resolution, "stale-while-revalidate" patterns, and transactional UI updates.

### 3. Edge-First Micro-UI (Modularity)
* **Core Problem:** Deploying feature-independent modules without bloating the main bundle.
* **The Solution:** Implementing a **Micro-Frontend** approach using Next.js 16 Module Federation and Edge-side routing.
* **Design Focus:** Dependency sharing, Error Boundaries, and Isolated Deployments.

---

## 🛠️ The Tech Stack (Next.js 16 Ecosystem)

| Layer | Technology | Rational |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16 (App Router)** | For Streaming, Server Components, and native React 19 support. |
| **Compiler** | **React Compiler** | Eliminating `useMemo`/`useCallback` for cleaner, faster code. |
| **Mutations** | **Server Actions** | To bridge the gap between Client and DB with type-safety. |
| **Styles** | **Tailwind CSS** | For utility-first, zero-runtime CSS footprint. |
| **Infrastructure** | **Vercel Edge Network** | To move computation closer to the user. |

---

## 📈 Technical Decision Log (ADR)

I document my architectural decisions using **Lightweight Architecture Decision Records**. For example:

> **ADR-001: Preferring ISR over SSR for Article Pages**
> * **Context:** Content updates every 1-2 hours.
> * **Decision:** Use ISR with a 3600s revalidation window.
> * **Consequence:** Reduced Lambda execution costs by 80% while maintaining 99% data freshness.