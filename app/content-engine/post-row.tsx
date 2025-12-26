"use client";

import { useTransition } from "react";
import { updatePostAction } from "./actions";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function PostRow({ post }: { post: any }) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleUpdate = () => {
        startTransition(async () => {
            await updatePostAction(post.slug);
            router.refresh(); // Visual refresh of the list
        });
    };

    return (
        <div className="group flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg border border-gray-100 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-600 transition-all">
            <div className="flex-1">
                <Link
                    href={`/content-engine/${post.slug}`}
                    className="font-bold hover:underline decoration-dotted underline-offset-4"
                >
                    {post.title}
                </Link>
                <div className="flex gap-4 mt-1 text-xs font-mono opacity-60">
                    <span>/{post.slug}</span>
                    <span>Last Mod: {new Date(post.lastModified).toLocaleTimeString()}</span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Link
                    href={`/content-engine/${post.slug}`}
                    className="text-xs px-3 py-2 bg-white dark:bg-black border border-gray-200 dark:border-zinc-700 rounded hover:bg-gray-100 dark:hover:bg-zinc-800"
                >
                    View
                </Link>
                <button
                    onClick={handleUpdate}
                    disabled={isPending}
                    className="text-xs px-3 py-2 bg-black dark:bg-white text-white dark:text-black rounded font-medium disabled:opacity-50 hover:opacity-80 transition-opacity min-w-[140px]"
                >
                    {isPending ? "Revalidating..." : "Update & Purge"}
                </button>
            </div>
        </div>
    );
}
