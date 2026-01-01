import { Suspense } from 'react';
import Link from 'next/link';
import { MicroUIProxy } from './lib/proxy';



// Async component to fetch and render a Micro-UI
async function MicroModule({ name }: { name: string }) {
    const adapter = await MicroUIProxy.getModule(name);
    const data = await adapter.loader();
    const Component = adapter.Component;

    return <Component data={data} />;
}

function LoadingFallback({ title }: { title: string }) {
    return (
        <div className="p-6 border rounded-sm border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-zinc-900/50 border-dashed animate-pulse h-full flex flex-col justify-center">
            <div className="h-4 w-1/3 bg-gray-200 dark:bg-zinc-800 rounded mb-4" />
            <div className="h-16 w-full bg-gray-200 dark:bg-zinc-800 rounded" />
            <p className="mt-4 text-[10px] uppercase tracking-widest opacity-40">Loading {title}...</p>
        </div>
    )
}

export default function MicroUIPage() {
    const isDev = process.env.NODE_ENV === 'development';

    return (
        <div className="space-y-12">
            <header className="mb-12">
                <Link
                    href="/"
                    className="hover:underline decoration-dotted offset-4 mb-4 block opacity-50 hover:opacity-100 transition-opacity"
                >
                    &lt; cd ..
                </Link>
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-xl font-bold mb-2">~/micro-ui</h1>
                        <p className="text-sm opacity-70 max-w-lg">
                            &gt; Edge-First Micro-Frontend Architecture.
                            <br />
                            &gt; Features: Proxy Pattern, Isolated Ecosystems.
                            <br />
                            &gt; Goal: Runtime Composition with 0ms Client Overhead.
                        </p>
                    </div>
                    <div className="text-right text-xs opacity-50">
                        <div className="mb-1">
                            Host Runtime: <span className="text-blue-500">Edge</span>
                        </div>
                        <div>Mode: {isDev ? 'Development' : 'Production'}</div>
                    </div>
                </div>
            </header>

            <section>
                <div className="flex justify-between items-center text-xs uppercase tracking-widest opacity-40 border-b border-gray-200 dark:border-gray-800 pb-2 mb-6">
                    <span>Active Modules</span>
                    <span>Orchestrated via Proxy</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Suspense fallback={<LoadingFallback title="Pricing Module" />}>
                            <MicroModule name="pricing" />
                        </Suspense>
                    </div>
                    <div className="lg:col-span-1">
                        <Suspense fallback={<LoadingFallback title="Newsletter Component" />}>
                            <MicroModule name="newsletter" />
                        </Suspense>
                    </div>
                </div>
            </section>

            <section className="border-t border-neutral-800 pt-12">
                <h3 className="text-xl font-semibold mb-4 text-neutral-300">Architecture Properties</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                    <div className="p-4 rounded-lg bg-neutral-900/50 border border-neutral-800/50">
                        <h4 className="font-bold text-white mb-2">Build Adapters</h4>
                        <p className="text-neutral-400">Each module exports a standard interface (`loader`, `Component`), allowing the host to be implementation-agnostic.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-neutral-900/50 border border-neutral-800/50">
                        <h4 className="font-bold text-white mb-2">Suspense Streaming</h4>
                        <p className="text-neutral-400">Modules fetch data in parallel. Slow modules (simulated latency) do not block the critical rendering path.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-neutral-900/50 border border-neutral-800/50">
                        <h4 className="font-bold text-white mb-2">Edge Runtime</h4>
                        <p className="text-neutral-400">The entire composition happens on the Edge, ensuring minimal TTFB (&lt;10ms) for the shell.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
