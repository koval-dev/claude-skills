import { useState } from "react";

export function BookingForm({ onSubmit }: { onSubmit: (data: Record<string, string>) => Promise<void> }) {
  const [data, setData] = useState<Record<string, string>>({});
  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setData({ ...data, [key]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await onSubmit(data);
    } catch {
      alert("Something went wrong");
    }
  }

  return (
    <form onSubmit={submit} style={{ width: 420 }}>
      <input placeholder="Name" onChange={set("name")} />
      <input placeholder="Email" onChange={set("email")} />
      <input placeholder="Phone" onChange={set("phone")} />
      <input placeholder="Date (DD/MM/YYYY)" onChange={set("date")} />
      <input placeholder="Guests" onChange={set("guests")} />
      <div style={{ display: "flex", gap: 4 }}>
        <button type="button" style={{ height: 24, fontSize: 11 }}>Cancel</button>
        <button type="submit" style={{ height: 24, fontSize: 11 }}>Book</button>
      </div>
    </form>
  );
}
