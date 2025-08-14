export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";

export interface Ticket {
  id: number;
  title: string;
  description?: string | null;
  status: TicketStatus;
  priority: number;
  created_at: string;
  updated_at: string;
}