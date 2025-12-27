'use server'

import { updateTag } from 'next/cache'
import { db } from '@/lib/content-engine/db'

export type ActionState = {
  success: boolean
  message: string
  error?: string
} | null

// React 19 useActionState compatible signature
export async function updatePostAction(prevState: ActionState, formData: FormData | string): Promise<ActionState> {
  try {
    // Handle both FormData and string slug for flexibility
    const slug = typeof formData === 'string' ? formData : (formData.get('slug') as string) || ''

    if (!slug) {
      return {
        success: false,
        message: 'No slug provided',
        error: 'Missing slug parameter',
      }
    }

    // 1. Update the data in our Mock DB
    const randomUpdate = `Updated content at ${new Date().toLocaleTimeString()}. 
  Random ID: ${Math.floor(Math.random() * 9999)}`

    await db.updatePost(slug, {
      content: randomUpdate,
    })

    updateTag(`post-${slug}`)

    return {
      success: true,
      message: `Cache purged and post updated: ${slug}`,
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to update post',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
