import { BuildAdapter } from '../../lib/adapter-interface';

// 1. Define Data Type
interface PricingData {
    plans: Array<{ name: string; price: string; features: string[] }>;
}

// 2. The Component (Pure presentation)
function PricingComponent({ data }: { data: PricingData }) {
    return (
        <div className="p-6 border rounded-sm border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-zinc-900/50">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-6 opacity-80">Pricing Plans (Micro-UI)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.plans.map((plan) => (
                    <div key={plan.name} className="p-4 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black rounded-sm active:scale-[0.98] transition-transform cursor-default hover:border-blue-500/50 dark:hover:border-blue-500/50">
                        <div className="flex justify-between items-baseline mb-3">
                            <h4 className="font-bold">{plan.name}</h4>
                            <span className="text-base font-bold text-blue-600 dark:text-blue-400">{plan.price}</span>
                        </div>
                        <ul className="text-xs opacity-70 space-y-2">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-center gap-2">
                                    <span className="text-blue-500">→</span> {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800 text-[10px] uppercase tracking-widest opacity-40 flex justify-between">
                <span>Rendered via Edge Proxy</span>
                <span>Isolated Bundle</span>
            </div>
        </div>
    );
}

// 3. The Adapter (Data fetching/transformation)
const adapter: BuildAdapter<PricingData> = {
    loader: async () => {
        // Simulate fetching from a pricing service or CMS
        await new Promise(resolve => setTimeout(resolve, 100)); // Slight delay
        return {
            plans: [
                { name: 'Starter', price: '$0', features: ['Public Repos', 'Community Support'] },
                { name: 'Pro', price: '$20', features: ['Private Repos', 'Priority Support', 'SSO'] },
            ],
        };
    },
    Component: PricingComponent,
};

export default adapter;
