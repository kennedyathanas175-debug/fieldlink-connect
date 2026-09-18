import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { FIELDS, JOURNEY_STAGES, REGIONS, fieldById, useDB } from "@/lib/fieldlink";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FieldLink TZ — Internships and field placements by field of study" },
      {
        name: "description",
        content:
          "FieldLink TZ connects students from any college or university in Tanzania with internship and field-placement openings, matched by field of study, with a full journey from application to digital certificate.",
      },
      { property: "og:title", content: "FieldLink TZ — Field placements across Tanzania" },
      {
        property: "og:description",
        content:
          "Students from any institution register once and are matched to internship openings by field of study, not by school.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const db = useDB();
  const latest = [...db.postings].sort((a, b) => b.createdAt - a.createdAt).slice(0, 3);

  return (
    <SiteShell>
      {/* HERO — dark navy panel */}
      <section className="py-10">
        <div className="relative overflow-hidden bg-navy text-paper">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, white 0 1px, transparent 1px 80px), repeating-linear-gradient(0deg, white 0 1px, transparent 1px 80px)",
            }}
          />
          <div className="relative grid gap-10 p-8 sm:p-12 md:grid-cols-12">
            <div className="animate-rise md:col-span-7">
              <p className="mb-5 inline-flex items-center gap-2 border border-paper/20 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-paper/70">
                <span className="size-1.5 bg-accent-strong" /> Nationwide field-placement matching
              </p>
              <h1 className="max-w-[16ch] font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-balance sm:text-6xl">
                Matched by your <span className="text-accent-strong">field of study</span>, not your
                institution.
              </h1>
              <p className="mt-6 max-w-[48ch] text-base leading-relaxed text-paper/70 text-pretty">
                FieldLink TZ connects students from any college or university with internship and
                field-placement (mafunzo kwa vitendo) openings at companies and offices across
                Tanzania — then follows you all the way to a digital certificate.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/register-student"
                  className="inline-flex items-center bg-accent-strong px-6 py-3.5 font-mono text-[12px] font-semibold uppercase tracking-[0.12em] text-navy transition-colors hover:bg-accent-strong/90"
                >
                  Register as a Student
                </Link>
                <Link
                  to="/register-company"
                  className="inline-flex items-center border border-paper/30 px-6 py-3.5 font-mono text-[12px] font-semibold uppercase tracking-[0.12em] text-paper transition-colors hover:bg-paper hover:text-navy"
                >
                  Post an Opportunity
                </Link>
              </div>
              <div className="mt-10 grid max-w-md grid-cols-3 divide-x divide-paper/15 border border-paper/15">
                <div className="px-4 py-4">
                  <p className="font-mono text-2xl font-medium tabular-nums text-paper">
                    {db.students.length.toLocaleString()}
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-paper/60">
                    Students registered
                  </p>
                </div>
                <div className="px-4 py-4">
                  <p className="font-mono text-2xl font-medium tabular-nums text-paper">
                    {db.postings.length.toLocaleString()}
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-paper/60">
                    Postings published
                  </p>
                </div>
                <div className="px-4 py-4">
                  <p className="font-mono text-2xl font-medium tabular-nums text-paper">
                    {REGIONS.length}
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-paper/60">
                    Regions covered
                  </p>
                </div>
              </div>
            </div>

            <div className="animate-rise md:col-span-5">
              <div className="border border-paper/15 bg-paper/[0.04] p-4">
                <div className="flex items-center justify-between border-b border-paper/15 px-1 pb-3">
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-paper/60">
                    Now on the board
                  </p>
                  <span className="bg-accent-strong px-2 py-0.5 font-mono text-[10px] font-semibold text-navy">
                    LIVE
                  </span>
                </div>
                <div className="mt-3 space-y-2.5">
                  {latest.map((p) => (
                    <Link
                      key={p.id}
                      to="/listings"
                      search={{ field: "all", region: "all" }}
                      className="block border border-paper/10 bg-paper/[0.05] p-3 transition-colors hover:border-accent-strong/60"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="bg-paper/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-accent-strong">
                          {fieldById(p.field).short}
                        </span>
                        <span className="font-mono text-[10px] text-paper/50">{p.region}</span>
                      </div>
                      <p className="mt-2 text-sm font-semibold">{p.title}</p>
                      <p className="text-xs text-paper/60">
                        {p.companyName} · {p.slots} slots
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JOURNEY PIPELINE */}
      <section className="py-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand">
              (a) The full journey
            </p>
            <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-balance sm:text-3xl">
              From registration to a digital certificate
            </h2>
          </div>
          <p className="hidden max-w-xs text-sm text-ink-soft sm:block">
            Every placement is tracked step by step — approvals, logbook, evaluation and the final
            experience record.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3 lg:grid-cols-6">
          {JOURNEY_STAGES.map((stage, i) => (
            <div key={stage} className="bg-paper p-4">
              <span className="font-mono text-xs font-semibold text-accent-strong">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-2 font-display text-sm font-bold leading-tight">{stage}</p>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Link
            to="/journey"
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-brand hover:text-ink"
          >
            Track your journey →
          </Link>
        </div>
      </section>

      {/* FIELDS GRID */}
      <section className="py-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand">
              (b) Matching system
            </p>
            <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-balance sm:text-3xl">
              Eight standardized fields
            </h2>
          </div>
          <p className="hidden text-sm text-ink-soft sm:block">
            Course names differ by school. Fields do not.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-4">
          {FIELDS.map((f) => (
            <Link
              key={f.id}
              to="/listings"
              search={{ field: f.id, region: "all" }}
              className="group bg-paper p-5 transition-colors hover:bg-brand-soft"
            >
              <span className="font-mono text-xs font-semibold text-brand">{f.index}</span>
              <p className="mt-3 font-display text-sm font-bold leading-tight">{f.name}</p>
              <p className="mt-2 text-xs text-ink-soft">{f.examples}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* LISTINGS PREVIEW */}
      <section className="py-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand">
              (c) Listings preview
            </p>
            <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-balance sm:text-3xl">
              Browse opportunities
            </h2>
          </div>
          <Link
            to="/listings"
            search={{ field: "all", region: "all" }}
            className="font-mono text-xs text-ink-soft hover:text-ink"
          >
            {db.postings.length} results →
          </Link>
        </div>
        <div className="border border-line">
          <div className="divide-y divide-line bg-glass">
            {db.postings.slice(0, 3).map((p) => (
              <div key={p.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-brand-soft px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-brand">
                      {fieldById(p.field).short}
                    </span>
                    <span className="font-mono text-xs text-ink-soft">{p.region}</span>
                  </div>
                  <p className="mt-1.5 font-display text-base font-bold">{p.title}</p>
                  <p className="text-sm text-ink-soft">{p.companyName}</p>
                </div>
                <div className="flex items-center gap-5 font-mono text-xs text-ink-soft">
                  <div>
                    <span className="block text-[10px] uppercase tracking-[0.12em]">Slots</span>
                    {p.slots}
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-[0.12em]">Duration</span>
                    {p.duration}
                  </div>
                </div>
                <Link
                  to="/listings"
                  search={{ field: "all", region: "all" }}
                  className="border border-ink bg-ink px-4 py-2 text-center font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-paper transition-colors hover:bg-navy"
                >
                  Apply
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
