import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { refresh, useDB } from "@/lib/fieldlink";

export const inputClass = "mt-1.5 w-full rounded-md border border-line bg-paper px-3 py-2.5 text-sm text-ink outline-none focus:border-brand";
export function Metric({ label, value }: { label: string; value: number | string }) {
  return <div className="rounded-md border border-line bg-glass p-5"><p className="text-xs text-ink-soft">{label}</p><p className="mt-2 font-display text-3xl font-bold text-ink">{value}</p></div>;
}
export function Section({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return <section className="py-6"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 className="font-display text-xl font-bold">{title}</h2>{action}</div>{children}</section>;
}
export function Empty({ children }: { children: ReactNode }) { return <div className="border border-dashed border-line p-6 text-sm text-ink-soft">{children}</div>; }
export function DataState() {
  const db = useDB();
  if (db.error) return <div role="alert" className="py-8 text-sm text-destructive">{db.error}<Button variant="outline" className="ml-3" onClick={() => void refresh()}>Try again</Button></div>;
  if (!db.loaded) return <p role="status" className="py-8 text-sm text-ink-soft">Loading your records…</p>;
  return null;
}
export function Feedback({ message, error }: { message: string; error?: boolean }) { return message ? <p role={error ? "alert" : "status"} className={`my-3 text-sm ${error ? "text-destructive" : "text-brand"}`}>{message}</p> : null; }
export function Field({ label, children }: { label: string; children: ReactNode }) { return <label className="block text-sm text-ink-soft">{label}{children}</label>; }