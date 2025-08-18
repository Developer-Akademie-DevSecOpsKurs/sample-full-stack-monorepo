import { apiFetch } from "./api";
import type { Ticket } from "@/types/ticket";

// Accepts array OR paginated {results: [...]}
function normalizeTicketList(data: any): Ticket[] {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.results)) return data.results;
  throw new Error("Unexpected ticket payload");
}

const COLLECTION = "/tickets/"; // trailing slash to avoid 301

export async function listTickets(): Promise<Ticket[]> {
  const raw = await apiFetch<any>(COLLECTION);
  return normalizeTicketList(raw);
}

export async function createTicket(data: Partial<Ticket>): Promise<Ticket> {
  return apiFetch<Ticket>(COLLECTION, {
    method: "POST",
    body: JSON.stringify(data),
  });
}