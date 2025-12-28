import { db } from '../_lib/db'

export async function DashboardStats() {
    const data = await db.getDashboardData()

    return (
        <div className="grid grid-cols-3 gap-8">
            <StatItem label="Total Views" value={data.totalViews.toLocaleString()} />
            <StatItem label="Active Users" value={data.activeUsers.toString()} />
            <StatItem
                label="Status"
                value={data.serverStatus.toUpperCase()}
                color={
                    data.serverStatus === 'healthy' ? 'text-green-600 dark:text-green-500' :
                        data.serverStatus === 'degraded' ? 'text-yellow-600 dark:text-yellow-500' :
                            'text-red-600 dark:text-red-500'
                }
            />
        </div>
    )
}

function StatItem({ label, value, color }: { label: string; value: string; color?: string }) {
    return (
        <div>
            <h3 className="text-xs opacity-50 mb-1 pointer-events-none select-none">{label}</h3>
            <p className={`text-2xl font-bold ${color || ''}`}>{value}</p>
        </div>
    )
}
