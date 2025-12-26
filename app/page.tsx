import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen p-8 font-mono bg-white dark:bg-black text-black dark:text-white">
      <main className="max-w-2xl mx-auto">
        <header className="mb-12">
          <h1 className="text-xl font-bold mb-4">~/system-design-lab</h1>
          <p className="text-sm opacity-70">
            &gt; Architectural experiments. Logic over aesthetics.
          </p>
        </header>

        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-6 opacity-50">
            Active Processes
          </h2>
          <ul className="space-y-8">
            <li>
              <Link href="/content-engine" className="group flex items-baseline gap-4 hover:opacity-100 mb-2">
                <span className="opacity-50 group-hover:opacity-100 transition-opacity">[01]</span>
                <span className="underline decoration-1 underline-offset-4 decoration-dotted hover:decoration-solid">
                  Global Content Engine
                </span>
              </Link>
              <div className="pl-12 text-xs opacity-60 font-mono">
                &gt; Tech: On-demand ISR, Tag Validation, Edge Middleware<br />
                &gt; Goal: 0ms TTFB for 100k+ pages
              </div>
            </li>
            <li>
              <Link href="/reactive-hub" className="group flex items-baseline gap-4 hover:opacity-100 mb-2">
                <span className="opacity-50 group-hover:opacity-100 transition-opacity">[02]</span>
                <span className="underline decoration-1 underline-offset-4 decoration-dotted hover:decoration-solid">
                  Reactive Data Hub
                </span>
              </Link>
              <div className="pl-12 text-xs opacity-60 font-mono">
                &gt; Tech: Server Actions, Optimistic UI, useActionState<br />
                &gt; Goal: Mutation consistency & zero-flicker
              </div>
            </li>
            <li>
              <Link href="/micro-ui" className="group flex items-baseline gap-4 hover:opacity-100 mb-2">
                <span className="opacity-50 group-hover:opacity-100 transition-opacity">[03]</span>
                <span className="underline decoration-1 underline-offset-4 decoration-dotted hover:decoration-solid">
                  Edge-First Micro-UI
                </span>
              </Link>
              <div className="pl-12 text-xs opacity-60 font-mono">
                &gt; Tech: Module Federation, Edge Composition<br />
                &gt; Goal: Isolated deployments & team autonomy
              </div>
            </li>
          </ul>
        </section>

        <footer className="mt-24 pt-8 border-t border-dashed border-gray-800 opacity-30 text-xs">
          <p>Next.js 16.1.1 // React 19 // Turbopack</p>
        </footer>
      </main>
    </div>
  );
}
