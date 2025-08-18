"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createTicket } from "@/lib/tickets";

export default function NewTicketPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(3);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await createTicket({
        title,
        description,
        status: "open",
        priority,
      });
      router.push("/tickets");
    } catch (err: any) {
      setError(err.message || "Failed to create ticket");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Create Ticket</h1>
        <p className="text-sm text-gray-500 mt-1">
          Provide details about the issue. You can update status later.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/70 shadow-sm p-8"
      >
        {error && (
          <div className="rounded-md border border-red-300 bg-red-50 dark:bg-red-900/30 px-4 py-3 text-sm text-red-700 dark:text-red-200">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Short, descriptive summary"
            required
            maxLength={200}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Description</label>
          <textarea
            className="w-full h-32 resize-y rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Steps to reproduce, expected vs actual, screenshots, etc."
          />
          <p className="text-xs text-gray-500">
            Optional. Markdown not yet supported.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Priority</label>
            <select
              value={priority}
              onChange={e => setPriority(Number(e.target.value))}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>1 – Critical</option>
              <option value={2}>2 – High</option>
              <option value={3}>3 – Medium</option>
              <option value={4}>4 – Low</option>
              <option value={5}>5 – Trivial</option>
            </select>
            <p className="text-xs text-gray-500">
              Lower number means higher urgency.
            </p>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Status</label>
            <input
              disabled
              value="open"
              className="w-full rounded-md border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500">New tickets start as Open.</p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4">
          <Link
            href="/tickets"
            className="inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 px-5 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center rounded-md bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-2 text-sm font-semibold shadow-sm transition-colors"
          >
            {submitting ? "Creating..." : "Create Ticket"}
          </button>
        </div>
      </form>
    </main>
  );
}