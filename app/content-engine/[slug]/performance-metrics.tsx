"use client";

import { useEffect, useState } from "react";

export function PerformanceMetrics() {
    const [metrics, setMetrics] = useState({ ttfb: 0, load: 0 });

    useEffect(() => {
        // Basic Navigation Timing API
        const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;

        if (navEntry) {
            setMetrics({
                ttfb: Math.round(navEntry.responseStart - navEntry.requestStart),
                load: Math.round(navEntry.loadEventEnd - navEntry.startTime),
            });
        }
    }, []);

    const isCacheHit = metrics.ttfb < 100;
    const cacheStatus = isCacheHit ? "Cache HIT" : "Cold Start";

    return (
        <div className="flex gap-4 text-sm font-mono font-bold">
            <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isCacheHit ? "bg-green-500" : "bg-orange-500"}`}></span>
                <span>{cacheStatus}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>TTFB: <span className={metrics.ttfb < 100 ? "text-green-500" : "text-red-500"}>{metrics.ttfb}ms</span></span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                <span>Total Load: {metrics.load}ms</span>
            </div>
        </div>
    );
}
