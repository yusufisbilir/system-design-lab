import { BuildAdapter } from '../../lib/adapter-interface';

// 1. Define Data Type
interface NewsletterData {
    subscriberCount: number;
}

// 2. The Component (Pure presentation)
function NewsletterComponent({ data }: { data: NewsletterData }) {
    return (
        <div className="p-6 border rounded-sm border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-zinc-900/50 h-full flex flex-col justify-center">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-2 opacity-80">Subscribe</h3>
            <p className="text-xs opacity-60 mb-6">
                Join <span className="text-green-600 dark:text-green-400 font-bold">{data.subscriberCount.toLocaleString()}</span> developers shipping faster.
            </p>
            <form className="flex gap-2">
                <input
                    type="email"
                    placeholder="email@example.com"
                    className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 text-xs rounded-sm px-3 py-2 flex-1 focus:outline-none focus:border-green-500 transition-colors"
                />
                <button className="bg-black dark:bg-white text-white dark:text-black hover:opacity-80 text-xs font-bold px-4 py-2 rounded-sm transition-opacity">
                    Join
                </button>
            </form>
            <div className="mt-auto pt-6 text-[10px] uppercase tracking-widest opacity-40 flex justify-between">
                <span>Proxy</span>
                <span>Isolated</span>
            </div>
        </div>
    );
}

// 3. The Adapter
const adapter: BuildAdapter<NewsletterData> = {
    loader: async () => {
        // Simulate fetching live stats
        return {
            subscriberCount: 12450,
        };
    },
    Component: NewsletterComponent,
};

export default adapter;
