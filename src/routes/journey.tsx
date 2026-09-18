import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell, PageHeading, fieldStyles } from "@/components/site-shell";
import {
  FINAL_STAGE,
  JOURNEY_STAGES,
  advanceApplication,
  getCurrentStudentId,
  useDB,
} from "@/lib/fieldlink";

export const Route = createFileRoute("/journey")({
  head: () => ({
    meta: [
      { title: "My journey — FieldLink TZ" },
      {
        name: "description",
        content:
          "Track every placement step by step: application, approvals, placement letter, logbook, supervisor evaluation and your digital certificate.",
      },
      { property: "og:title", content: "My journey — FieldLink TZ" },
      {
        property: "og:description",
        content: "Follow your placement from application to digital certificate.",
      },
    ],
  }),
  component: Journey,
});

function Journey() {
  const db = useDB();
  const student = db.students.find((s) => s.id === getCurrentStudentId());
  const mine = student ? db.applications.filter((a) => a.studentId === student.id) : [];

  if (!student) {
    return (
      <SiteShell>
        <PageHeading
          eyebrow="My journey"
          title="Create a profile to start your journey"
          intro="Your journey begins with a student profile. After that, every application moves through the same tracked pipeline."
        />
        <section className="py-8">
          <Link to="/register-student" className={fieldStyles.submit}>
            Register as a student
          </Link>
        </section>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <PageHeading
        eyebrow={`Journey — ${student.fullName}`}
        title="Your placements, step by step"
        intro="Each application moves through the pipeline below, from institution approval to your digital certificate."
      />

      <section className="py-8">
        {mine.length === 0 ? (
          <div className="border border-line bg-glass p-6">
            <p className="text-sm text-ink-soft">
              No applications yet. Browse open placements and apply to start the pipeline.
            </p>
            <Link
              to="/listings"
              search={{ field: "all", region: "all" }}
              className={`${fieldStyles.submit} mt-4`}
            >
              Browse opportunities
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {mine.map((a) => (
              <article key={a.id} className="border border-line bg-glass p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft">
                      {a.companyName}
                    </p>
                    <h2 className="mt-1 font-display text-xl font-extrabold tracking-tight">
                      {a.postingTitle}
                    </h2>
                  </div>
                  {a.stage === FINAL_STAGE ? (
                    <span className="bg-accent-strong px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-navy">
                      Digital certificate issued
                    </span>
                  ) : (
                    <span className="border border-line bg-brand-soft px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-brand">
                      Now: {JOURNEY_STAGES[a.stage]}
                    </span>
                  )}
                </div>

                <ol className="mt-6 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3 lg:grid-cols-6">
                  {JOURNEY_STAGES.map((stage, i) => {
                    const done = i < a.stage;
                    const current = i === a.stage;
                    return (
                      <li
                        key={stage}
                        className={
                          current
                            ? "bg-navy p-3 text-paper"
                            : done
                              ? "bg-accent-soft p-3"
                              : "bg-paper p-3"
                        }
                      >
                        <span
                          className={`font-mono text-[10px] font-semibold ${
                            current ? "text-accent-strong" : done ? "text-ink" : "text-ink-soft/60"
                          }`}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <p
                          className={`mt-1 text-xs font-semibold leading-tight ${
                            current ? "text-paper" : done ? "text-ink" : "text-ink-soft/60"
                          }`}
                        >
                          {stage}
                        </p>
                      </li>
                    );
                  })}
                </ol>

                {a.stage < FINAL_STAGE ? (
                  <button
                    onClick={() => advanceApplication(a.id)}
                    className="mt-5 border border-ink bg-ink px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-paper transition-colors hover:bg-navy"
                  >
                    Mark next step complete
                  </button>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>
    </SiteShell>
  );
}
