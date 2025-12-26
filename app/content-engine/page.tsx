import Link from "next/link";
import { db } from "@/lib/content-engine/db";
import { PostRow } from "./post-row";

export const dynamic = 'force-dynamic'; // Ensure this admin dashboard is always fresh

export default async function ContentEnginePage() {
    // Determine the environment to show relevant info
    const isDev = process.env.NODE_ENV === 'development';

    // Fetch posts
    const posts = await db.getRecentPosts(10);

    return (
        <div className="min-h-screen p-8 font-mono bg-white dark:bg-black text-black dark:text-white">
            <main className="max-w-4xl mx-auto">
                <header className="mb-12">
                    <Link href="/" className="hover:underline decoration-dotted offset-4 mb-4 block opacity-50 hover:opacity-100 transition-opacity">
                        &lt; cd ..
                    </Link>
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-xl font-bold mb-2">~/content-engine</h1>
                            <p className="text-sm opacity-70 max-w-lg">
                                &gt; Simulates a High-Traffic News Site Architecture.<br />
                                &gt; Articles are cached at the Edge (ISR).<br />
                                &gt; "Update & Purge" simulates a CMS webhook triggering an instant cache flush.
                            </p>
                        </div>
                        <div className="text-right text-xs opacity-50">
                            <div className="mb-1">Active Backend: <span className="text-green-500">Mock DB (2.5s latency)</span></div>
                            <div>Mode: {isDev ? 'Development (No Real Caching)' : 'Production (ISR Active)'}</div>
                        </div>
                    </div>
                </header>

                <section className="space-y-4">
                    <div className="flex justify-between items-center text-xs uppercase tracking-widest opacity-40 border-b border-gray-200 dark:border-gray-800 pb-2 mb-4">
                        <span>Recent Articles</span>
                        <span>Actions</span>
                    </div>

                    {posts.map((post) => (
                        <PostRow key={post.slug} post={post} />
                    ))}
                </section>

                {isDev && (
                    <div className="mt-12 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm border border-red-100 dark:border-red-900 rounded">
                        <strong>⚠️ Note on Development Mode:</strong><br />
                        Next.js Dev Server behavior with caching is different from Production.
                        In Dev, pages might request fresh data more often or stick to aggressive caching depending on configuration.
                        <br /><br />
                        For the true <b>0ms TTFB</b> experience, run:
                        <code className="bg-black/10 dark:bg-white/10 px-2 py-1 mx-1 rounded">npm run build && npm start</code>
                    </div>
                )}
            </main>
        </div>
    );
}
