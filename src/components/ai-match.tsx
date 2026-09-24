import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { matchStudent } from "@/lib/ai.functions";
import { fieldById, useDB } from "@/lib/fieldlink";

/** Friendly AI helper: student types their course, AI picks the field and best openings. */
export function AiMatch() {
  const db = useDB();
  const run = useServerFn(matchStudent);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Awaited<ReturnType<typeof matchStudent>> | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (text.trim().length < 3) return;
    setLoading(true);
    setError("");
    try {
      const r = await run({
        data: {
          description: text,
          postings: db.postings.map((p) => ({
            id: p.id,
            title: p.title,
            field: p.field,
            region: p.region,
            description: p.description,
          })),
        },
      });
      setResult(r);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const picks = result ? db.postings.filter((p) => result.postingIds.includes(p.id)) : [];

  return (
    <div className="rounded-3xl border border-line bg-glass p-6 shadow-[0_20px_60px_-30px_rgba(1,50,55,0.35)] sm:p-8">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-full bg-mint text-lg">✦</span>
        <div>
          <p className="font-display text-xl font-semibold">AI placement helper</p>
          <p className="text-sm text-ink-soft">
            Tell us your course in your own words — English or Kiswahili.
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={600}
          placeholder="e.g. Nasoma Diploma ya Uuguzi, mwaka wa pili, napenda Dodoma"
          className="flex-1 rounded-full border border-line bg-paper px-5 py-3 text-sm outline-none focus:border-brand"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition-colors hover:bg-navy disabled:opacity-60"
        >
          {loading ? "Finding matches…" : "Find my match"}
        </button>
      </form>

      {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}

      {result ? (
        <div className="mt-6 space-y-4">
          <div className="rounded-2xl bg-brand-soft p-4">
            <p className="text-xs font-semibold text-brand">
              Your field: {fieldById(result.field).name}
            </p>
            <p className="mt-1 text-sm text-ink">{result.message}</p>
          </div>
          {picks.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-3">
              {picks.map((p) => (
                <Link
                  key={p.id}
                  to="/listings"
                  search={{ field: p.field, region: "all" }}
                  className="rounded-2xl border border-line bg-paper p-4 transition-colors hover:border-brand"
                >
                  <p className="text-xs text-accent-strong">{p.region}</p>
                  <p className="mt-1 font-semibold">{p.title}</p>
                  <p className="text-xs text-ink-soft">{p.companyName}</p>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
