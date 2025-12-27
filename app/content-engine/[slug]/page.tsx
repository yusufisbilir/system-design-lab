import { db } from '@/lib/content-engine/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { cacheLife, cacheTag } from 'next/cache'
import { Suspense } from 'react'
import { PerformanceMetrics } from './performance-metrics'

// Enable ISR (Incremental Static Regeneration) with on-demand revalidation
// This allows updateTag() to work while keeping pages cached
export const revalidate = 3600 // 1 hour baseline revalidation
export const dynamicParams = true // Generate new pages on-demand for slugs not in generateStaticParams

// Modern cache implementation using 'use cache' directive
// This leverages Next.js 15+ caching with granular control
async function getCachedPost(slug: string) {
  'use cache'
  cacheLife('hours') // Use predefined cache profile for 1 hour revalidation
  cacheTag('posts', `post-${slug}`) // Granular tags for selective invalidation

  return await db.getPost(slug)
}

// With cacheComponents enabled, generateStaticParams must return at least one result
// for build-time validation. We'll generate params for a subset of popular posts.
export async function generateStaticParams() {
  // Generate static params for first 10 posts as examples
  // The rest will be generated on-demand with ISR
  return Array.from({ length: 10 }, (_, i) => ({
    slug: `post-${i + 1}`,
  }))
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const post = await getCachedPost(slug)
  if (!post) return { title: 'Not Found' }

  return {
    title: `${post.title} | Content Engine`,
    description: `Read ${post.title} on our high-performance edge platform.`,
  }
}

// PostContent component for Suspense boundary (PPR)
async function PostContent({ slug }: { slug: string }) {
  // With cacheComponents, we must access cached data before using Date
  const post = await getCachedPost(slug)

  if (!post) {
    return notFound()
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-6 mb-6 p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg border border-gray-100 dark:border-zinc-800">
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
          <span className="uppercase tracking-wider opacity-50">Cached</span>
          <div className="mt-1">use cache + cacheLife</div>
        </div>
        <div>
          <span className="uppercase tracking-wider opacity-50">Views</span>
          <div className="mt-1">{post.views.toLocaleString()}</div>
        </div>
      </div>

      <article className="prose dark:prose-invert max-w-none">
        <p className="text-lg leading-relaxed opacity-90">{post.content}</p>
        <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-sm">
          <p className="font-bold text-yellow-800 dark:text-yellow-500 mb-1">💡 Performance Concept</p>
          <p className="opacity-80">
            If this page loaded instantly, it was served from the <b>Edge Cache</b>. If it took ~2.5s, it was a{' '}
            <b>Cache Miss</b> (or stale regeneration) and went to the mock DB. Refresh multiple times to see ISR in
            action.
          </p>
        </div>
      </article>
    </>
  )
}

// Loading skeleton for Suspense fallback
function PostSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 dark:bg-zinc-800 rounded w-3/4 mb-4"></div>
      <div className="flex gap-6 mb-6">
        <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-24"></div>
        <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-24"></div>
        <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-24"></div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded"></div>
        <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-4/6"></div>
      </div>
    </div>
  )
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params

  return (
    <div className="min-h-screen p-8 font-mono bg-white dark:bg-black text-black dark:text-white">
      <main className="max-w-3xl mx-auto">
        {/* Static shell - rendered instantly with PPR */}
        <header className="mb-12 border-b border-gray-200 dark:border-gray-800 pb-8">
          <Link
            href="/content-engine"
            className="text-xs text-gray-500 hover:text-black dark:hover:text-white mb-6 block"
          >
            ← Back to Content Engine
          </Link>

          {/* Dynamic content - streamed via Suspense (PPR) */}
          <Suspense fallback={<PostSkeleton />}>
            <PostContent slug={slug} />
          </Suspense>
        </header>
      </main>
    </div>
  )
}
