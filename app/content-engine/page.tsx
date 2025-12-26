import Link from "next/link";

export default function ContentEnginePage() {
    return (
        <div className="min-h-screen p-8 font-mono bg-white dark:bg-black text-black dark:text-white">
            <main className="max-w-4xl mx-auto">
                <header className="mb-12">
                    <Link href="/" className="hover:underline decoration-dotted offset-4 mb-4 block opacity-50 hover:opacity-100 transition-opacity">
                        &lt; cd ..
                    </Link>
                    <h1 className="text-xl font-bold mb-4">~/content-engine</h1>
                    <p className="text-sm opacity-70">
                        &gt; High-performance dynamic page serving.
                    </p>
                </header>

                <section>
                </section>
            </main>
        </div>
    );
}
