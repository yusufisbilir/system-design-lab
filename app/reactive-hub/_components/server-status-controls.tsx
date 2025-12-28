'use client';

import { useOptimistic, startTransition } from 'react';
import { updateServerStatusAction } from '../actions';

type Status = 'healthy' | 'degraded' | 'down';

export function ServerStatusControls({
    currentStatus,
    onStatusChange
}: {
    currentStatus: Status;
    onStatusChange: (newStatus: Status) => void;
}) {
    const [optimisticStatus, setOptimisticStatus] = useOptimistic<Status, Status>(
        currentStatus,
        (_, newStatus) => newStatus
    );

    const handleStatusChange = (newStatus: Status) => {
        startTransition(() => {
            setOptimisticStatus(newStatus);
            onStatusChange(newStatus);
            const formData = new FormData();
            formData.append('status', newStatus);
            updateServerStatusAction(formData);
        });
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-4">
                <StatusButton
                    status="healthy"
                    label="Healthy"
                    isActive={optimisticStatus === 'healthy'}
                    onClick={() => handleStatusChange('healthy')}
                    color="text-green-600 dark:text-green-500"
                />
                <StatusButton
                    status="degraded"
                    label="Degraded"
                    isActive={optimisticStatus === 'degraded'}
                    onClick={() => handleStatusChange('degraded')}
                    color="text-yellow-600 dark:text-yellow-500"
                />
                <StatusButton
                    status="down"
                    label="Down"
                    isActive={optimisticStatus === 'down'}
                    onClick={() => handleStatusChange('down')}
                    color="text-red-600 dark:text-red-500"
                />
            </div>
        </div>
    );
}

function StatusButton({
    status,
    label,
    color,
    isActive,
    onClick
}: {
    status: string;
    label: string;
    color: string;
    isActive: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`px-3 py-1 text-sm border transition-all rounded-sm ${isActive
                ? `bg-current/10 border-current font-bold opacity-100 ${color}`
                : `border-transparent opacity-50 hover:opacity-80 hover:border-gray-300 dark:hover:border-gray-700`
                }`}
        >
            [{label}]
        </button>
    );
}
