'use client';

import { useActionState, useOptimistic, useRef } from 'react';
import { sendNotificationAction } from '../actions';
import { ServerStatusControls } from './server-status-controls';

type Notification = {
    id: string;
    message: string;
    timestamp: number;
    pending?: boolean;
};

type DashboardData = {
    serverStatus: 'healthy' | 'degraded' | 'down';
    notifications: Notification[];
};

export function ReactiveDashboard({
    initialData
}: {
    initialData: DashboardData;
}) {
    // Notifications Optimistic State
    const [optimisticNotifications, addOptimisticNotification] = useOptimistic(
        initialData.notifications,
        (currentNotifications, newMessage: string) => {
            const newNote = {
                id: Math.random().toString(),
                message: newMessage,
                timestamp: Date.now(),
                pending: true,
            };
            return [newNote, ...currentNotifications].slice(0, 10);
        }
    );

    const formRef = useRef<HTMLFormElement>(null);
    const [_, action, isPending] = useActionState(sendNotificationAction, null);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Control Center */}
            <section>
                <div className="flex justify-between items-center text-xs uppercase tracking-widest opacity-40 border-b border-gray-200 dark:border-gray-800 pb-2 mb-6">
                    <span>Control Center</span>
                    <span>/sys/admin</span>
                </div>

                <div className="space-y-8">
                    <div>
                        <h3 className="text-sm font-bold mb-3 opacity-80">&gt; Set Server Status</h3>
                        <ServerStatusControls
                            currentStatus={initialData.serverStatus}
                            onStatusChange={(newStatus) => addOptimisticNotification(`Server status updated to: ${newStatus.toUpperCase()}`)}
                        />
                    </div>

                    <div>
                        <h3 className="text-sm font-bold mb-3 opacity-80">&gt; Broadcast Message</h3>
                        <form
                            ref={formRef}
                            action={async (formData) => {
                                const message = formData.get('message') as string;
                                if (!message) return;
                                addOptimisticNotification(message);
                                formRef.current?.reset();
                                await action(formData);
                            }}
                            className="flex flex-col gap-3"
                        >
                            <input
                                type="text"
                                name="message"
                                placeholder="Enter system announcement..."
                                className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-black dark:focus:border-white transition-colors placeholder:opacity-30"
                            />
                            <button
                                type="submit"
                                disabled={isPending}
                                className="self-start px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-sm hover:opacity-80 transition-opacity rounded-sm disabled:opacity-50"
                            >
                                {isPending ? 'Broadcasting...' : 'Execute Broadcast'}
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Live Feed */}
            <section>
                <div className="flex justify-between items-center text-xs uppercase tracking-widest opacity-40 border-b border-gray-200 dark:border-gray-800 pb-2 mb-6">
                    <span>Event Log</span>
                    <span>tail -f</span>
                </div>
                <div className="space-y-4 font-mono text-sm">
                    {optimisticNotifications.map((note) => (
                        <div
                            key={note.id}
                            className="flex gap-3 items-baseline group transition-all duration-500"
                        >
                            <span className="opacity-30 shrink-0 text-xs">
                                {new Date(note.timestamp).toLocaleTimeString([], { hour12: false })}
                            </span>
                            <div className="flex-1">
                                <span className={`mr-2 transition-opacity text-blue-600 dark:text-blue-400 opacity-50 group-hover:opacity-100`}>
                                    &gt;
                                </span>
                                <span className={`opacity-80 group-hover:opacity-100`}>
                                    {note.message}
                                </span>
                                {note.pending && (
                                    <span className="ml-2 text-[10px] uppercase tracking-wider text-yellow-600 border border-yellow-600/30 px-1 rounded">
                                        Optimistic
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                    {optimisticNotifications.length === 0 && (
                        <p className="opacity-30 italic">No events recorded.</p>
                    )}
                </div>
            </section>
        </div>
    );
}
