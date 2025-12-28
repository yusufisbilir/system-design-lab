import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';

// Mock Data Type
export type DashboardData = {
    activeUsers: number;
    totalViews: number;
    serverStatus: 'healthy' | 'degraded' | 'down';
    notifications: Array<{ id: string; message: string; timestamp: number }>;
};

// Singleton storage to persist across hot reloads in dev (mostly)
// In a real serverless env, this would be an external DB (Redis/Postgres)
const GLOBAL_STORE = (global as any)._reactiveHubStore || {
    activeUsers: 142,
    totalViews: 10500,
    serverStatus: 'healthy',
    notifications: [
        { id: '1', message: 'System initialization complete', timestamp: Date.now() - 100000 },
    ],
};

if (process.env.NODE_ENV !== 'production') {
    (global as any)._reactiveHubStore = GLOBAL_STORE;
}

// Simulate network latency (200-500ms)
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const db = {
    async getDashboardData(): Promise<DashboardData> {
        'use cache';
        cacheTag('dashboard-data');
        cacheLife('hours');

        await delay(300); // Read latency
        return { ...GLOBAL_STORE };
    },

    async updateStatus(status: DashboardData['serverStatus']) {
        await delay(150);
        GLOBAL_STORE.serverStatus = status;
        return GLOBAL_STORE.serverStatus;
    },

    async incrementViews() {
        await delay(50); // Fast write
        GLOBAL_STORE.totalViews += 1;
        return GLOBAL_STORE.totalViews;
    },

    async addNotification(message: string) {
        await delay(200);
        const notification = {
            id: Math.random().toString(36).substring(7),
            message,
            timestamp: Date.now(),
        };
        GLOBAL_STORE.notifications = [notification, ...GLOBAL_STORE.notifications].slice(0, 10);
        return notification;
    },
};
