"use client";

import { useEffect, useState } from "react";

type Metrics = {
    ttfb: number;
    fcp: number;
    lcp: number;
    cacheHit: boolean;
};

export function PerformanceMetrics() {
    const [metrics, setMetrics] = useState<Metrics>({ ttfb: 0, fcp: 0, lcp: 0, cacheHit: false });

    useEffect(() => {
        const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;

        if (!navEntry) return;

        // TTFB: Time to First Byte (correct calculation)
        const ttfb = Math.round(navEntry.responseStart - navEntry.fetchStart);

        // Cache detection will be done after LCP measurement
        // Our mock DB has 2.5s delay, so LCP < 500ms indicates cache hit

        // FCP: First Contentful Paint
        let fcp = 0;
        const fcpEntry = performance.getEntriesByName("first-contentful-paint")[0];
        if (fcpEntry) {
            fcp = Math.round(fcpEntry.startTime);
        }

        // LCP: Largest Contentful Paint (use PerformanceObserver for accuracy)
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1] as PerformanceEntry;
            const lcp = Math.round(lastEntry.startTime);

            // Cache detection based on LCP (LCP < 500ms = cache hit)
            const cacheHit = lcp < 500;

            setMetrics({ ttfb, fcp, lcp, cacheHit });
        });

        try {
            observer.observe({ type: "largest-contentful-paint", buffered: true });
        } catch {
            // LCP not supported, fallback to TTFB-based detection
            const cacheHit = ttfb < 200;
            setMetrics({ ttfb, fcp, lcp: fcp, cacheHit });
        }

        // Cleanup
        return () => observer.disconnect();
    }, []);

    const cacheStatus = metrics.cacheHit ? "Cache HIT ✓" : "Cache MISS (DB Query)";
    const ttfbColor = metrics.ttfb < 200 ? "text-green-500" : metrics.ttfb < 1000 ? "text-yellow-500" : "text-red-500";
    const lcpColor = metrics.lcp < 500 ? "text-green-500" : metrics.lcp < 2000 ? "text-yellow-500" : "text-red-500";

    return (
        <div className="flex flex-wrap gap-4 text-sm font-mono font-bold">
            <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${metrics.cacheHit ? "bg-green-500 animate-pulse" : "bg-orange-500"}`}></span>
                <span className={metrics.cacheHit ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400"}>
                    {cacheStatus}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>TTFB: <span className={ttfbColor}>{metrics.ttfb}ms</span></span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                <span>FCP: {metrics.fcp || 'N/A'}ms</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                <span>LCP: <span className={lcpColor}>{metrics.lcp}ms</span></span>
            </div>
        </div>
    );
}
