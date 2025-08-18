import { useState, useEffect, useCallback, useRef } from "react";
import { listTickets, createTicket } from "@/lib/tickets";
import type { Ticket } from "@/types/ticket";

export function useTicketList() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchTickets = useCallback(async (isRefresh = false) => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const data = await listTickets();
      setTickets(data);
      setLastUpdated(new Date());
    } catch (e: any) {
      if (e.name !== "AbortError") setError(e.message || "Failed to load tickets");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
    return () => abortRef.current?.abort();
  }, [fetchTickets]);

  return {
    tickets,
    loading,
    error,
    lastUpdated,
    refreshing,
    refresh: () => fetchTickets(true),
    setTickets, // exposed for optimistic updates if needed
  };
}

interface UseCreateTicketOptions {
  onSuccess?: (ticket: Ticket) => void;
  onError?: (err: Error) => void;
}

export function useCreateTicket(opts: UseCreateTicketOptions = {}) {
  const { onSuccess, onError } = opts;
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (data: Omit<Ticket, "id" | "created_at" | "updated_at"> & Partial<Pick<Ticket, "id">>) => {
      setSubmitting(true);
      setError(null);
      try {
        const created = await createTicket(data as any);
        onSuccess?.(created);
        return created;
      } catch (e: any) {
        const err = new Error(e.message || "Failed to create ticket");
        setError(err.message);
        onError?.(err);
        throw err;
      } finally {
        setSubmitting(false);
      }
    },
    [onSuccess, onError]
  );

  return {
    create: submit,
    submitting,
    error,
    resetError: () => setError(null),
  };
}