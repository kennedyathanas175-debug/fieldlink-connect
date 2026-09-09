import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { FIELDS, REGIONS, fieldById, useDB } from "@/lib/fieldlink";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FieldLink TZ — Internships and field placements by field of study" },
      {
        name: "description",
        content:
          "FieldLink TZ connects students from any college or university in Tanzania with internship and field-placement openings, matched by field of study.",
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
  const latest = [...db.postings].sort((a, b) => b.createdAt - a.createdAt).slice(0, 2);

  return (
    <SiteShell>
      <section className="grid items-center gap-10 py-12 md:grid-cols-12 md:py-16">
        <div className="animate-rise md:col-span-7">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-glass/60 px-3 py-1 font-mono text-xs text-ink-soft backdrop-blur">
            <span className="size-1.5 rounded-full bg-accent-strong" /> Nationwide field-placement
            matching
          </p>
          <h1 className="max-w-[16ch] font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-balance sm:text-5xl">
            Matched by your <span className="text-brand">field of study</span>, not your
            institution.
          </h1>
          <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-ink-soft text-pretty">
            FieldLink TZ connects students from any college or university with internship and
            field-placement (mafunzo kwa vitendo) openings at companies and offices across Tanzania.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/register-student"
              className="inline-flex items-center rounded-md bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground shadow-sm ring-1 ring-black/5 transition-colors hover:bg-brand/90"
            >
              Register as a Student
            </Link>
            <Link
              to="/register-company"
              className="inline-flex items-center rounded-md border border-line bg-glass/70 px-5 py-3 text-sm font-semibold text-ink backdrop-blur transition-colors hover:bg-glass"
            >
              Post an Opportunity (Company)
            </Link>
          </div>
          <div className="mt-9 grid max-w-md grid-cols-3 divide-x divide-line overflow-hidden rounded-xl border border-line bg-glass/70 backdrop-blur-xl">
            <div className="px-4 py-3">
              <p className="font-mono text-2xl font-medium tabular-nums text-ink">
                {db.students.length.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-ink-soft">Students registered</p>
            </div>
            <div className="px-4 py-3">
              <p className="font-mono text-2xl font-medium tabular-nums text-ink">
                {db.postings.length.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-ink-soft">Postings published</p>
            </div>
            <div className="px-4 py-3">
              <p className="font-mono text-2xl font-medium tabular-nums text-ink">
                {REGIONS.length}
              </p>
              <p className="mt-1 text-xs text-ink-soft">Regions covered</p>
            </div>
          </div>
        </div>

        <div className="animate-rise md:col-span-5">
          <div className="rounded-2xl border border-line bg-glass/70 p-4 shadow-sm ring-1 ring-black/5 backdrop-blur-xl">
            <div className="flex items-center justify-between px-1 pb-3">
              <p className="font-mono text-xs uppercase tracking-wider text-ink-soft">
                Now on the board
              </p>
              <span className="rounded-full bg-accent-soft px-2 py-0.5 font-mono text-[10px] text-accent-strong">
                LIVE
              </span>
            </div>
            <div className="space-y-2.5">
              {latest.map((p) => (
                <div key={p.id} className="rounded-lg border border-line bg-paper/60 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded bg-brand-soft/50 px-2 py-0.5 font-mono text-[10px] text-brand">
                      {fieldById(p.field).short}
                    </span>
                    <span className="font-mono text-[10px] text-ink-soft">{p.region}</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold">{p.title}</p>
                  <p className="text-xs text-ink-soft">
                    {p.companyName} · {p.slots} slots
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-ink-soft">
              (a) Matching system
            </p>
            <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-balance">
              Eight standardized fields
            </h2>
          </div>
          <p className="hidden text-sm text-ink-soft sm:block">
            Course names differ by school. Fields do not.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {FIELDS.map((f) => (
            <Link
              key={f.id}
              to="/listings"
              search={{ field: f.id, region: "all" }}
              className="rounded-xl border border-line bg-glass/60 p-4 backdrop-blur-md transition-colors hover:border-brand/40"
            >
              <span className="font-mono text-xs text-brand">{f.index}</span>
              <p className="mt-3 font-display text-sm font-bold leading-tight">{f.name}</p>
              <p className="mt-2 text-xs text-ink-soft">{f.examples}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-8">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-ink-soft">
              (b) Listings preview
            </p>
            <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-balance">
              Browse opportunities
            </h2>
          </div>
          <Link to="/listings" className="font-mono text-xs text-ink-soft hover:text-ink">
            {db.postings.length} results
          </Link>
        </div>
        <div className="overflow-hidden rounded-2xl border border-line shadow-sm ring-1 ring-black/5">
          <div className="divide-y divide-line bg-glass/40 backdrop-blur-md">
            {db.postings.slice(0, 3).map((p) => (
              <div key={p.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-brand-soft/50 px-2 py-0.5 font-mono text-[10px] text-brand">
                      {fieldById(p.field).short}
                    </span>
                    <span className="font-mono text-xs text-ink-soft">{p.region}</span>
                  </div>
                  <p className="mt-1.5 font-display text-base font-bold">{p.title}</p>
                  <p className="text-sm text-ink-soft">{p.companyName}</p>
                </div>
                <div className="flex items-center gap-5 font-mono text-xs text-ink-soft">
                  <div>
                    <span className="block text-[10px] uppercase tracking-wide">Slots</span>
                    {p.slots}
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-wide">Duration</span>
                    {p.duration}
                  </div>
                </div>
                <Link
                  to="/listings"
                  className="rounded-md border border-line bg-paper/70 px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-brand/40"
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
