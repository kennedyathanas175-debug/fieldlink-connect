import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const navLink =
  "font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft transition-colors hover:text-ink";
const navActive = "font-semibold text-ink";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-paper font-sans text-ink antialiased">
      <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center bg-navy font-display text-sm font-extrabold text-accent-strong">
              F
            </span>
            <span className="font-display text-lg font-extrabold tracking-tight">
              FieldLink <span className="text-brand">TZ</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              to="/"
              activeOptions={{ exact: true }}
              activeProps={{ className: navActive }}
              className={navLink}
            >
              Home
            </Link>
            <Link to="/listings" search={{ field: "all", region: "all" }} activeProps={{ className: navActive }} className={navLink}>
              Opportunities
            </Link>
            <Link to="/journey" activeProps={{ className: navActive }} className={navLink}>
              My journey
            </Link>
            <Link to="/post" activeProps={{ className: navActive }} className={navLink}>
              Post a placement
            </Link>
          </nav>
          <Link
            to="/register-student"
            className="bg-accent-strong px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-navy transition-colors hover:bg-accent-strong/90"
          >
            Register
          </Link>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-5">{children}</main>

      <footer className="mt-16 border-t border-line bg-navy text-paper">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <span className="grid size-7 place-items-center bg-accent-strong font-display text-xs font-extrabold text-navy">
              F
            </span>
            <span className="font-display text-sm font-extrabold tracking-tight">FieldLink TZ</span>
          </div>
          <p className="font-mono text-xs text-paper/60">
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
    <div className="border-b border-line py-10">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand">{eyebrow}</p>
      <h1 className="mt-2 max-w-[22ch] font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
        {title}
      </h1>
      {intro ? (
        <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-ink-soft text-pretty">
          {intro}
        </p>
      ) : null}
    </div>
  );
}

export const fieldStyles = {
  panel: "border border-line bg-glass p-6 shadow-sm",
  label: "font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft",
  input:
    "mt-1.5 w-full rounded-sm border border-line bg-paper px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-brand",
  submit:
    "inline-flex items-center bg-navy px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-paper transition-colors hover:bg-brand",
};
