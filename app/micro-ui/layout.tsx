import { ReactNode } from 'react';



export default function MicroUILayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen p-8 font-mono bg-white dark:bg-black text-black dark:text-white">
            <main className="max-w-4xl mx-auto">
                {children}
            </main>
        </div>
    );
}
