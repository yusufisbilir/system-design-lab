import Link from 'next/link'
import { Suspense } from 'react'
import { db } from './_lib/db'
import { ReactiveDashboard } from './_components/reactive-dashboard'
import { DashboardStats } from './_components/dashboard-stats'

export default async function ReactiveHubPage() {
    const isDev = process.env.NODE_ENV === 'development'

    return (
        <div className="min-h-screen p-8 font-mono bg-white dark:bg-black text-black dark:text-white">
            <main className="max-w-4xl mx-auto">
                <header className="mb-12">
                    <Link
                        href="/"
                        className="hover:underline decoration-dotted offset-4 mb-4 block opacity-50 hover:opacity-100 transition-opacity"
                    >
                        &lt; cd ..
                    </Link>
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-xl font-bold mb-2">~/reactive-hub</h1>
                            <p className="text-sm opacity-70 max-w-lg">
                                &gt; High-frequency data mutations workspace.
                                <br />
                                &gt; Features: React 19 Server Actions & Optimistic Updates.
                                <br />
                                &gt; Goal: Zero-Flicker consistency in real-time.
                            </p>
                        </div>
                        <div className="text-right text-xs opacity-50">
                            <div className="mb-1">
                                Last Sync: <span className="text-blue-500">Live</span>
                            </div>
                            <div>Mode: {isDev ? 'Development' : 'Production'}</div>
                        </div>
                    </div>
                </header>

                <div className="space-y-12">
                    {/* Stats Section */}
                    <section>
                        <div className="flex justify-between items-center text-xs uppercase tracking-widest opacity-40 border-b border-gray-200 dark:border-gray-800 pb-2 mb-6">
                            <span>System Metrics</span>
                            <span>Real-time</span>
                        </div>
                        <Suspense fallback={<StatsSkeleton />}>
                            <DashboardStats />
                        </Suspense>
                    </section>

                    <ReactiveDashboard initialData={await db.getDashboardData()} />
                </div>


            </main >
        </div >
    )
}

function StatsSkeleton() {
    return (
        <div className="grid grid-cols-3 gap-8 animate-pulse">
            {[1, 2, 3].map((i) => (
                <div key={i}>
                    <div className="h-3 w-16 bg-gray-200 dark:bg-zinc-800 mb-2 rounded" />
                    <div className="h-8 w-24 bg-gray-200 dark:bg-zinc-800 rounded" />
                </div>
            ))}
        </div>
    )
}
