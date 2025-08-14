import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-16 px-6 py-12">
      <section className="max-w-3xl text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Ticket System Demo
        </h1>
        <p className="text-lg text-muted-foreground">
          Simple support ticket backend (Django REST) with a Next.js frontend.
          Create and track tickets in seconds.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/tickets/new"
            className="inline-flex items-center justify-center rounded-md bg-blue-600 hover:bg-blue-500 text-white font-medium px-8 py-3 transition-colors"
          >
            Create New Ticket
          </Link>
          <Link
            href="/tickets"
            className="inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 px-8 py-3 font-medium transition-colors"
          >
            View Tickets
          </Link>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-3 w-full max-w-5xl">
        <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/40 backdrop-blur">
          <h2 className="font-semibold mb-2">Fast</h2>
          <p className="text-sm text-muted-foreground">
            Lightweight API + minimal UI for quick ticket entry.
          </p>
        </div>
        <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/40 backdrop-blur">
          <h2 className="font-semibold mb-2">Searchable</h2>
            <p className="text-sm text-muted-foreground">
              Filter, sort and review recent issues easily.
            </p>
        </div>
        <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/40 backdrop-blur">
          <h2 className="font-semibold mb-2">Extensible</h2>
          <p className="text-sm text-muted-foreground">
            Built to evolve: add auth, tagging or SLA tracking later.
          </p>
        </div>
      </section>

      <footer className="text-xs text-gray-500 dark:text-gray-400">
        Demo Ticket System &middot; <Link href="/tickets" className="underline">Tickets</Link>
      </footer>
    </main>
  );
}
