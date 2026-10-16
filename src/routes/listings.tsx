import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteShell, PageHeading } from "@/components/site-shell";
import {
  FIELDS,
  REGIONS,
  addApplication,
  fieldById,
  formatDeadline,
  getCurrentStudentId,
  useDB,
  type FieldId,
} from "@/lib/fieldlink";

type Search = { field: FieldId | "all"; region: string };

export const Route = createFileRoute("/listings")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    field: (search["field"] as Search["field"]) ?? "all",
    region: (search["region"] as string) ?? "all",
  }),
  head: () => ({
    meta: [
      { title: "Open internships and field placements — FieldLink TZ" },
      {
        name: "description",
        content:
          "Browse internship and field-placement openings across Tanzania. Filter by field of study and by region, then apply before the deadline.",
      },
      { property: "og:title", content: "Open placements — FieldLink TZ" },
      {
        property: "og:description",
        content: "Filter internship openings by field of study and region across all Tanzanian regions.",
      },
    ],
  }),
  component: Listings,
});

function Listings() {
  const { field, region } = Route.useSearch();
  const navigate = useNavigate({ from: "/listings" });
  const db = useDB();

  const results = db.postings.filter(
    (p) => (field === "all" || p.field === field) && (region === "all" || p.region === region),
  );

  const studentId = getCurrentStudentId();
  const appliedIds = new Set(
    db.applications.filter((a) => a.studentId === studentId).map((a) => a.postingId),
  );

  function apply(postingId: string) {
    const current = getCurrentStudentId();
    if (!current) {
      navigate({ to: db.userId ? "/register-student" : "/auth" });
      return;
    }
    const posting = db.postings.find((p) => p.id === postingId);
    if (posting) addApplication(posting, current).catch((err) => alert(err instanceof Error ? err.message : "Could not apply."));
  }

  return (
    <SiteShell>
      <PageHeading
        eyebrow="Opportunities"
        title="Open internships and field placements"
        intro="Filter by field of study and region. You need a student profile before you can apply."
      />

      <section className="py-8">
        <div className="border border-line">
          <div className="flex flex-wrap items-center gap-2 border-b border-line bg-paper px-4 py-3">
            <label className="flex items-center gap-2 border border-line bg-glass px-3 py-2">
              <span className="text-sm text-ink-soft">
                Field
              </span>
              <select
                value={field}
                onChange={(e) =>
                  navigate({ search: (s) => ({ ...s, field: e.target.value as Search["field"] }) })
                }
                className="bg-transparent text-sm font-medium text-ink outline-none"
              >
                <option value="all">All fields</option>
                {FIELDS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 border border-line bg-glass px-3 py-2">
              <span className="text-sm text-ink-soft">
                Region
              </span>
              <select
                value={region}
                onChange={(e) => navigate({ search: (s) => ({ ...s, region: e.target.value }) })}
                className="bg-transparent text-sm font-medium text-ink outline-none"
              >
                <option value="all">All regions</option>
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>
            <span className="ml-auto text-xs text-ink-soft">
              {results.length} of {db.postings.length} shown
            </span>
          </div>

          <div className="divide-y divide-line bg-glass">
            {results.length === 0 ? (
              <p className="p-6 text-sm text-ink-soft">
                No postings match these filters yet. Try another field or region.
              </p>
            ) : (
              results.map((p) => {
                const applied = appliedIds.has(p.id);
                return (
                  <div key={p.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-brand-soft px-2 py-0.5 text-sm text-brand">
                          {fieldById(p.field).short}
                        </span>
                        <span className="text-xs text-ink-soft">{p.region}</span>
                      </div>
                      <p className="mt-1.5 font-display text-base font-bold">{p.title}</p>
                      <p className="text-sm text-ink-soft">{p.companyName}</p>
                      {p.description ? (
                        <p className="mt-1.5 max-w-[70ch] text-sm text-ink-soft text-pretty">
                          {p.description}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-5 text-xs text-ink-soft">
                      <div>
                        <span className="block text-[10px]">Slots</span>
                        {p.slots}
                      </div>
                      <div>
                        <span className="block text-[10px]">
                          Duration
                        </span>
                        {p.duration}
                      </div>
                      <div>
                        <span className="block text-[10px]">
                          Deadline
                        </span>
                        {formatDeadline(p.deadline)}
                      </div>
                    </div>
                    {applied ? (
                      <Link
                        to="/journey"
                        className="border border-line bg-accent-soft px-4 py-2 text-center text-sm font-semibold text-ink"
                      >
                        Applied · Track
                      </Link>
                    ) : (
                      <button
                        onClick={() => apply(p.id)}
                        className="border border-ink bg-ink px-4 py-2 text-sm font-semibold text-paper transition-colors hover:bg-navy"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
