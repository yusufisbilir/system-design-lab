'use server';

import { updateTag } from 'next/cache';
import { db } from './_lib/db';

export async function updateServerStatusAction(formData: FormData) {
    const status = formData.get('status') as 'healthy' | 'degraded' | 'down';

    if (!status) return;

    await db.updateStatus(status);
    await db.addNotification(`Server status updated to: ${status.toUpperCase()}`);

    updateTag('dashboard-data');
}

export async function sendNotificationAction(currentState: any, formData: FormData) {
    const message = formData.get('message') as string;

    if (!message || message.trim() === '') {
        return { error: 'Message is required' };
    }

    await db.addNotification(message);
    updateTag('dashboard-data');

    return { success: true };
}
