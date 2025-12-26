import { db } from "@/lib/content-engine/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import { PerformanceMetrics } from "./performance-metrics";

// Cache the data fetcher!
// This puts our manual DB result into Next.js Data Cache.
const getCachedPost = unstable_cache(
    async (slug: string) => db.getPost(slug),
    ['posts'], // cache key
    { tags: ['posts'], revalidate: 3600 }
);

export async function generateStaticParams() {
    return [];
}

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const post = await getCachedPost(slug);
    if (!post) return { title: "Not Found" };

    return {
        title: `${post.title} | Content Engine`,
        description: `Read ${post.title} on our high-performance edge platform.`,
    };
}

export default async function PostPage({ params }: PageProps) {
    const { slug } = await params;

    // Start timing for server-side processing (Generation Time)
    const startTime = Date.now();
    const post = await getCachedPost(slug);
    const duration = Date.now() - startTime;

    if (!post) {
        return notFound();
    }

    return (
        <div className="min-h-screen p-8 font-mono bg-white dark:bg-black text-black dark:text-white">
            <main className="max-w-3xl mx-auto">
                <header className="mb-12 border-b border-gray-200 dark:border-gray-800 pb-8">
                    <Link
                        href="/content-engine"
                        className="text-xs text-gray-500 hover:text-black dark:hover:text-white mb-6 block"
                    >
                        ← Back to Content Engine
                    </Link>

                    <div className="flex flex-wrap items-center gap-6 mb-6 p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg border border-gray-100 dark:border-zinc-800">
                        <div>
                            <span className="block text-[10px] uppercase tracking-widest opacity-50 mb-1">Server Stat</span>
                            <div className="flex items-center gap-2 text-xs">
                                <span className={`w-2 h-2 rounded-full ${duration > 100 ? 'bg-orange-500' : 'bg-green-500'}`}></span>
                                <span>Gen Time: {duration}ms</span>
                            </div>
                        </div>
                        <div className="h-8 w-px bg-gray-200 dark:bg-zinc-800"></div>
                        <div>
                            <span className="block text-[10px] uppercase tracking-widest opacity-50 mb-1">Client Stat</span>
                            <PerformanceMetrics />
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold mb-4 tracking-tight">{post.title}</h1>

                    <div className="flex gap-6 text-xs text-gray-500 font-mono">
                        <div>
                            <span className="uppercase tracking-wider opacity-50">Last Modified</span>
                            <div className="mt-1">{new Date(post.lastModified).toLocaleString()}</div>
                        </div>
                        <div>
                            <span className="uppercase tracking-wider opacity-50">Generated At</span>
                            <div className="mt-1">{new Date().toLocaleString()}</div>
                        </div>
                        <div>
                            <span className="uppercase tracking-wider opacity-50">Views</span>
                            <div className="mt-1">{post.views.toLocaleString()}</div>
                        </div>
                    </div>
                </header>

                <article className="prose dark:prose-invert max-w-none">
                    <p className="text-lg leading-relaxed opacity-90">
                        {post.content}
                    </p>
                    <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-sm">
                        <p className="font-bold text-yellow-800 dark:text-yellow-500 mb-1">💡 Performance Concept</p>
                        <p className="opacity-80">
                            If this page loaded instantly, it was served from the <b>Edge Cache</b>.
                            If it took ~2.5s, it was a <b>Cache Miss</b> (or stale regeneration) and went to the mock DB.
                            Refresh multiple times to see ISR in action.
                        </p>
                    </div>
                </article>
            </main>
        </div>
    );
}
