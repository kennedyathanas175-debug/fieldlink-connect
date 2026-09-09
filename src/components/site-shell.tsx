import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-paper font-sans text-ink antialiased selection:bg-brand-soft/60">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-48 size-[520px] rounded-full bg-warm/60 blur-3xl" />
        <div className="absolute -right-32 top-1/3 size-[480px] rounded-full bg-brand-soft/40 blur-3xl" />
        <div className="absolute bottom-[-12%] left-1/3 size-[420px] rounded-full bg-accent-soft/40 blur-3xl" />
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-glass/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-md bg-brand font-display text-sm font-extrabold text-brand-foreground">
              F
            </span>
            <span className="font-display text-lg font-extrabold tracking-tight">
              FieldLink <span className="text-brand">TZ</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-ink-soft md:flex">
            <Link
              to="/"
              activeOptions={{ exact: true }}
              activeProps={{ className: "font-semibold text-ink" }}
              className="transition-colors hover:text-ink"
            >
              Home
            </Link>
            <Link
              to="/listings"
              activeProps={{ className: "font-semibold text-ink" }}
              className="transition-colors hover:text-ink"
            >
              Opportunities
            </Link>
            <Link
              to="/post"
              activeProps={{ className: "font-semibold text-ink" }}
              className="transition-colors hover:text-ink"
            >
              Post a placement
            </Link>
            <Link
              to="/register-company"
              activeProps={{ className: "font-semibold text-ink" }}
              className="transition-colors hover:text-ink"
            >
              For offices
            </Link>
          </nav>
          <Link
            to="/register-student"
            className="rounded-md bg-ink px-3.5 py-2 text-sm font-semibold text-paper transition-colors hover:bg-ink/85"
          >
            Register
          </Link>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-5">{children}</main>

      <footer className="relative mt-12 border-t border-line bg-glass/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <span className="grid size-7 place-items-center rounded-md bg-brand font-display text-xs font-extrabold text-brand-foreground">
              F
            </span>
            <span className="font-display text-sm font-extrabold tracking-tight">FieldLink TZ</span>
          </div>
          <p className="font-mono text-xs text-ink-soft">
            A public utility for field-placement matching · Tanzania
          </p>
        </div>
      </footer>
    </div>
  );
}

export function PageHeading({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="pt-10">
      <p className="font-mono text-xs uppercase tracking-wider text-ink-soft">{eyebrow}</p>
      <h1 className="mt-1 max-w-[22ch] font-display text-3xl font-extrabold tracking-tight text-balance">
        {title}
      </h1>
      {intro ? (
        <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-ink-soft text-pretty">{intro}</p>
      ) : null}
    </div>
  );
}

export const fieldStyles = {
  panel:
    "rounded-2xl border border-line bg-glass/70 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur-xl",
  label: "font-mono text-[10px] uppercase tracking-wide text-ink-soft",
  input:
    "mt-1.5 w-full rounded-md border border-line bg-paper/70 px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-brand/50",
  submit:
    "inline-flex items-center rounded-md bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground shadow-sm ring-1 ring-black/5 transition-colors hover:bg-brand/90",
};
