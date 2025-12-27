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

        // Cache detection: Check if response came from cache
        // transferSize === 0 means cached (no network transfer)
        const cacheHit = navEntry.transferSize === 0 || navEntry.transferSize < 1000;

        // FCP: First Contentful Paint
        let fcp = 0;
        const fcpEntry = performance.getEntriesByName("first-contentful-paint")[0];
        if (fcpEntry) {
            fcp = Math.round(fcpEntry.startTime);
        }

        // LCP: Largest Contentful Paint (use PerformanceObserver for accuracy)
        let lcp = 0;
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1] as PerformanceEntry;
            lcp = Math.round(lastEntry.startTime);
            setMetrics({ ttfb, fcp, lcp, cacheHit });
        });

        try {
            observer.observe({ type: "largest-contentful-paint", buffered: true });
        } catch {
            // LCP not supported, fallback to FCP
            setMetrics({ ttfb, fcp, lcp: fcp, cacheHit });
        }

        // Cleanup
        return () => observer.disconnect();
    }, []);

    const cacheStatus = metrics.cacheHit ? "Cache HIT" : "Cache MISS";
    const ttfbColor = metrics.ttfb < 200 ? "text-green-500" : metrics.ttfb < 1000 ? "text-yellow-500" : "text-red-500";

    return (
        <div className="flex gap-4 text-sm font-mono font-bold">
            <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${metrics.cacheHit ? "bg-green-500" : "bg-orange-500"}`}></span>
                <span>{cacheStatus}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>TTFB: <span className={ttfbColor}>{metrics.ttfb}ms</span></span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                <span>FCP: {metrics.fcp}ms</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                <span>LCP: {metrics.lcp}ms</span>
            </div>
        </div>
    );
}
