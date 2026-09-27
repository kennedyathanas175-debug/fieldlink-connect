import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const navLink =
  "text-sm text-ink-soft transition-colors hover:text-ink";
const navActive = "font-semibold text-ink";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-paper font-sans text-ink antialiased">
      <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-full bg-brand font-display text-sm font-extrabold text-brand-foreground">
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
            <Link to="/profile" activeProps={{ className: navActive }} className={navLink}>
              My profile
            </Link>
            <Link to="/post" activeProps={{ className: navActive }} className={navLink}>
              Post a placement
            </Link>
          </nav>
          <Link
            to="/register-student"
            className="rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground transition-colors hover:bg-navy"
          >
            Register
          </Link>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-5">{children}</main>

      <footer className="mt-16 border-t border-line bg-navy text-paper">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/admin"
              className="text-xs text-paper/60 transition-colors hover:text-paper"
            >
              Admin
            </Link>
            <div className="flex items-center gap-2.5">
              <span className="grid size-7 place-items-center rounded-full bg-brand font-display text-xs font-extrabold text-brand-foreground">
                F
              </span>
              <span className="font-display text-sm font-extrabold tracking-tight">
                FieldLink TZ
              </span>
            </div>
          </div>
          <p className="text-xs text-paper/60">
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
      <p className="text-sm text-brand">{eyebrow}</p>
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
  panel: "rounded-2xl border border-line bg-glass p-6 shadow-sm",
  label: "text-sm text-ink-soft",
  input:
    "mt-1.5 w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-brand",
  submit:
    "inline-flex items-center rounded-full bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground transition-colors hover:bg-navy",
};
