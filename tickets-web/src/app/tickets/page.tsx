"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { listTickets } from "@/lib/tickets";
import type { Ticket } from "@/types/ticket";

// Modern client-side ticket list using hooks & local state (no silent failures).

export default function TicketsPage() {
  const { tickets, loading, error, refresh, refreshing, lastUpdated } = useTickets();
  console.log(tickets)
  return (
    <main className="mx-auto max-w-5xl px-6 py-10 space-y-10">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Tickets</h1>
          <p className="text-sm text-gray-500 mt-1">
            {error
              ? "Error loading tickets"
              : loading
              ? "Loading..."
              : tickets.length
              ? `${tickets.length} ticket${
                  tickets.length !== 1 ? "s" : ""
                } loaded`
              : "No tickets yet"}
          </p>
          {lastUpdated && !loading && !error && (
            <p className="text-xs text-gray-400 mt-1">
              Updated {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Home
          </Link>
          <button
            onClick={() => refresh()}
            disabled={loading || refreshing}
            className="inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
          <Link
            href="/tickets/new"
            className="inline-flex items-center rounded-md bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 text-sm font-semibold shadow-sm transition-colors"
          >
            New Ticket
          </Link>
        </div>
      </header>

      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 dark:bg-red-900/30 px-4 py-3 text-sm text-red-700 dark:text-red-200">
          {error}
        </div>
      )}

      {!error && !loading && tickets.length === 0 && <EmptyState />}

      {!error && tickets.length > 0 && <TicketsTable tickets={tickets} />}
    </main>
  );
}

/* Hook encapsulating ticket fetching logic */
function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchTickets = useCallback(async (isRefresh = false) => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const data = await listTickets(); // Assumes normalization inside listTickets
      setTickets(data);
      setLastUpdated(new Date());
    } catch (e: any) {
      if (e.name !== "AbortError") {
        setError(e.message || "Failed to load tickets");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    (async () => await fetchTickets())()
    return () => abortRef.current?.abort();
  }, [fetchTickets]);

  return {
    tickets,
    loading,
    error,
    lastUpdated,
    refreshing,
    refresh: () => fetchTickets(true),
  };
}

function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-12 text-center">
      <h2 className="text-lg font-medium mb-2">No tickets created</h2>
      <p className="text-sm text-gray-500 mb-6">
        Get started by creating your first ticket.
      </p>
      <Link
        href="/tickets/new"
        className="inline-flex items-center rounded-md bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 text-sm font-semibold shadow-sm transition-colors"
      >
        Create Ticket
      </Link>
    </div>
  );
}

function TicketsTable({ tickets }: { tickets: Ticket[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-gray-50/80 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300">
          <tr className="text-left">
            <th className="px-5 py-3 font-medium">ID</th>
            <th className="px-5 py-3 font-medium">Title</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 font-medium">Priority</th>
            <th className="px-5 py-3 font-medium w-40">Created</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t, idx) => (
            <tr
              key={t.id}
              className={`border-t border-gray-100 dark:border-gray-800 ${
                idx % 2 ? "bg-gray-50/40 dark:bg-gray-800/30" : ""
              } hover:bg-blue-50/50 dark:hover:bg-gray-800 transition-colors`}
            >
              <td className="px-5 py-3 font-mono text-xs text-gray-500">
                {t.id}
              </td>
              <td className="px-5 py-3">
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {t.title}
                  </span>
                  {t.description && (
                    <span className="text-xs text-gray-500 truncate max-w-sm">
                      {t.description}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-5 py-3">
                <StatusBadge status={t.status} />
              </td>
              <td className="px-5 py-3">
                <PriorityIndicator value={t.priority} />
              </td>
              <td className="px-5 py-3 text-xs text-gray-500">
                {new Date(t.created_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    open: {
      label: "Open",
      cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    },
    in_progress: {
      label: "In Progress",
      cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    },
    resolved: {
      label: "Resolved",
      cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    },
    closed: {
      label: "Closed",
      cls: "bg-gray-200 text-gray-700 dark:bg-gray-700/60 dark:text-gray-300",
    },
  };
  const item =
    map[status] || {
      label: status,
      cls: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
    };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${item.cls}`}
    >
      {item.label}
    </span>
  );
}

function PriorityIndicator({ value }: { value: number }) {
  const color =
    value <= 2
      ? "text-red-600 dark:text-red-400"
      : value === 3
      ? "text-amber-600 dark:text-amber-400"
      : "text-gray-600 dark:text-gray-300";
  return (
    <span className={`inline-flex items-center gap-1 font-medium ${color}`}>
      <span className="inline-block h-2 w-2 rounded-full bg-current" />
      {value}
    </span>
  );
}