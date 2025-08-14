"use client";
import { useState } from "react";
import { createTicket } from "@/lib/tickets";
import { useRouter } from "next/navigation";

export default function NewTicketPage() {
  const [title, setTitle] = useState("");
  const router = useRouter();

  return (
    <main>
      <h1>New Ticket</h1>
      <form
        onSubmit={async e => {
          e.preventDefault();
          await createTicket({
            title,
            description: "",
            status: "open",
            priority: 3,
          });
            router.push("/tickets");
        }}
      >
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <button type="submit">Create</button>
      </form>
    </main>
  );
}