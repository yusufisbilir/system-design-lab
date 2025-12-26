"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/content-engine/db";

export async function updatePostAction(slug: string) {
    // 1. Update the data in our Mock DB
    const randomUpdate = `Updated content at ${new Date().toLocaleTimeString()}. 
  Random ID: ${Math.floor(Math.random() * 9999)}`;

    await db.updatePost(slug, {
        content: randomUpdate
    });

    // 2. Purge the cache for this specific path
    // This is the magic line that gives us "On-Demand ISR"
    revalidatePath(`/content-engine/${slug}`);

    // Also revalidate the home page since it might show snippets/titles
    revalidatePath("/content-engine");

    return { success: true, message: `Purged cache for ${slug}` };
}
