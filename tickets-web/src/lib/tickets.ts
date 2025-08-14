import { apiFetch } from "./api";
import { Ticket } from "@/types/ticket";

export function listTickets(): Promise<Ticket[]> {
  return apiFetch<Ticket[]>("/tickets/");
}

export function createTicket(data: Partial<Ticket>): Promise<Ticket> {
  return apiFetch<Ticket>("/tickets/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}