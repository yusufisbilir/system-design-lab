
// Mock Database for Content Engine
// Simulates a slow CMS/Database connection

export type Post = {
    slug: string;
    title: string;
    content: string;
    lastModified: number;
    views: number;
};

// Generate 1000 static posts
const posts: Map<string, Post> = new Map();

// Initialize with deterministic data
for (let i = 1; i <= 1000; i++) {
    const slug = `post-${i}`;
    posts.set(slug, {
        slug,
        title: `High-Scale Content Architecture: Part ${i}`,
        content: `This is the body content for post ${i}. It simulates a content-heavy response from a headless CMS. \n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
        lastModified: Date.now(),
        views: Math.floor(Math.random() * 10000),
    });
}

const DB_DELAY = 2500; // 2.5s artificial delay to make cache misses obvious

export const db = {
    async getPost(slug: string): Promise<Post | null> {
        console.log(`[DB] Reading post: ${slug} (${DB_DELAY}ms latency)...`);
        await new Promise((resolve) => setTimeout(resolve, DB_DELAY));
        return posts.get(slug) || null;
    },

    async getRecentPosts(limit: number = 20): Promise<Post[]> {
        console.log(`[DB] Fetching recent posts list...`);
        await new Promise((resolve) => setTimeout(resolve, 500)); // Faster list view
        return Array.from(posts.values()).slice(0, limit);
    },

    // Simulates a CMS update webhook
    async updatePost(slug: string, newContent: Partial<Post>): Promise<Post | null> {
        console.log(`[DB] Updating post: ${slug}...`);
        await new Promise((resolve) => setTimeout(resolve, 300)); // Fast write

        const post = posts.get(slug);
        if (!post) return null;

        const updated = { ...post, ...newContent, lastModified: Date.now() };
        posts.set(slug, updated);
        return updated;
    }
};
