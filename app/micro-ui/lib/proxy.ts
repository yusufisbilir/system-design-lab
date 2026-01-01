import { BuildAdapter } from './adapter-interface';

/**
 * Simulates a "Gateway" or "Proxy" that fetches remote Micro-UI modules.
 * In a real-world scenario, this might fetch HTML fragments or federated modules.
 * Here, it lazily imports local modules to simulate isolation.
 */
export const MicroUIProxy = {
    /**
     * Fetches a specific module by name.
     * logic: Simulates network latency and "Edge" processing.
     */
    async getModule<T>(moduleName: string): Promise<BuildAdapter<T>> {
        // 1. Simulate Network Latency (Edge Gateway)
        await new Promise((resolve) => setTimeout(resolve, 500)); // Fixed 500ms for build stability

        // 2. Dynamic Import (Simulating "remote" resolution)
        let module: { default: BuildAdapter<T> };

        try {
            // In a Next.js Server Component context, dynamic imports work well for this pattern.
            // We are using a switch here because dynamic imports with variables can be tricky
            // in some bundlers, though Next.js / Webpack usually handles specific paths well.
            // For strict "isolation" demonstration, we map explicitly.
            switch (moduleName) {
                case 'pricing':
                    // @ts-ignore - Dynamic types are hard to perfect in this simulation
                    module = await import('../modules/pricing');
                    break;
                case 'newsletter':
                    // @ts-ignore
                    module = await import('../modules/newsletter');
                    break;
                default:
                    throw new Error(`Micro-UI module '${moduleName}' not found.`);
            }

            return module.default;

        } catch (error) {
            console.error(`Failed to load Micro-UI: ${moduleName}`, error);
            throw error;
        }
    },
};
