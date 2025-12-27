'use client'

import { useTransition, useOptimistic, useState } from 'react'
import { updatePostAction } from './actions'
import Link from 'next/link'
import type { Post } from '@/lib/content-engine/db'

export function PostRow({ post }: { post: Post }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  // React 19: useOptimistic for instant UI updates (zero-flicker mutations)
  const [optimisticPost, addOptimistic] = useOptimistic(post, (current: Post, update: Partial<Post>) => ({
    ...current,
    ...update,
  }))

  const handleUpdate = () => {
    // Clear any previous errors
    setError(null)

    // Use startTransition to prevent Suspense from re-triggering
    // addOptimistic must be called INSIDE the transition
    startTransition(async () => {
      // Show optimistic update immediately (before server responds)
      addOptimistic({
        lastModified: Date.now(),
        content: `Updating... (optimistic)`,
      })

      try {
        const result = await updatePostAction(null, post.slug)
        if (result?.error) {
          setError(result.error)
          // Revert optimistic update on error
          addOptimistic({
            lastModified: post.lastModified,
            content: post.content,
          })
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        // Revert optimistic update on error
        addOptimistic({
          lastModified: post.lastModified,
          content: post.content,
        })
      }
    })
  }

  return (
    <div className="group flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg border border-gray-100 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-600 transition-all">
      <div className="flex-1">
        <Link
          href={`/content-engine/${optimisticPost.slug}`}
          className="font-bold hover:underline decoration-dotted underline-offset-4"
        >
          {optimisticPost.title}
        </Link>
        <div className="flex gap-4 mt-1 text-xs font-mono opacity-60">
          <span>/{optimisticPost.slug}</span>
          <span className={isPending ? 'opacity-50' : ''}>
            Last Mod: {new Date(optimisticPost.lastModified).toLocaleTimeString()}
          </span>
          {!isPending && !error && optimisticPost.lastModified !== post.lastModified && (
            <span className="text-green-600 dark:text-green-400">✓ Updated</span>
          )}
          {error && <span className="text-red-600 dark:text-red-400">✗ {error}</span>}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href={`/content-engine/${optimisticPost.slug}`}
          target="_blank"
          className="text-xs px-3 py-2 bg-white dark:bg-black border border-gray-200 dark:border-zinc-700 rounded hover:bg-gray-100 dark:hover:bg-zinc-800"
        >
          View
        </Link>
        <button
          onClick={handleUpdate}
          disabled={isPending}
          className="text-xs px-3 py-2 bg-black dark:bg-white text-white dark:text-black rounded font-medium disabled:opacity-50 hover:opacity-80 transition-opacity min-w-[140px]"
        >
          {isPending ? 'Updating...' : 'Update & Purge'}
        </button>
      </div>
    </div>
  )
}
