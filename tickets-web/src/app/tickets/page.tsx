import { listTickets } from "@/lib/tickets";

export const dynamic = "force-dynamic";

export default async function TicketsPage() {
  const tickets = await listTickets().catch(() => []);
  return (
    <main>
      <h1>Tickets</h1>
      <a href="/tickets/new">New Ticket</a>
      <ul>
        {tickets.map(t => (
          <li key={t.id}>
            <strong>{t.title}</strong> ({t.status}) priority {t.priority}
          </li>
        ))}
      </ul>
    </main>
  );
}