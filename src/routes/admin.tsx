import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell, PageHeading, fieldStyles } from "@/components/site-shell";
import {
  FIELDS,
  FINAL_STAGE,
  JOURNEY_STAGES,
  fieldById,
  formatDeadline,
  removeCompany,
  removePosting,
  removeStudent,
  setApplicationStage,
  setStudentVerified,
  useDB,
} from "@/lib/fieldlink";

/**
 * Admin dashboard. The data behind it is the shared FieldLink store, so the
 * management actions here move with the same backend swap as the rest of the
 * app. The passcode gate is a placeholder for real admin auth.
 */

const ADMIN_PASSCODE = "fieldlink-admin";
const UNLOCK_KEY = "fieldlink-admin-unlocked";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin dashboard — FieldLink TZ" },
      {
        name: "description",
        content:
          "Operate FieldLink TZ: review companies and students, manage placement postings and move applications through the journey pipeline.",
      },
      { property: "og:title", content: "Admin dashboard — FieldLink TZ" },
      {
        property: "og:description",
        content: "Manage postings, verify students and track every application pipeline.",
      },
    ],
  }),
  component: Admin,
});

type Tab = "overview" | "postings" | "students" | "companies" | "applications";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "postings", label: "Postings" },
  { id: "students", label: "Students" },
  { id: "companies", label: "Companies" },
  { id: "applications", label: "Applications" },
];

function Admin() {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem(UNLOCK_KEY) === "1",
  );
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);

  function unlock(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (passcode.trim() === ADMIN_PASSCODE) {
      sessionStorage.setItem(UNLOCK_KEY, "1");
      setUnlocked(true);
      setError(null);
    } else {
      setError("Wrong passcode. Try again.");
    }
  }

  if (!unlocked) {
    return (
      <SiteShell>
        <PageHeading
          eyebrow="Admin"
          title="Admin sign-in"
          intro="Enter the admin passcode to open the dashboard."
        />
        <section className="py-10">
          <form onSubmit={unlock} className={`${fieldStyles.panel} max-w-sm`}>
            <label className="block">
              <span className={fieldStyles.label}>Passcode</span>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                autoFocus
                className={fieldStyles.input}
              />
            </label>
            {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}
            <button type="submit" className={`${fieldStyles.submit} mt-5`}>
              Unlock dashboard
            </button>
          </form>
        </section>
      </SiteShell>
    );
  }

  return <Dashboard />;
}

function Dashboard() {
  const db = useDB();
  const [tab, setTab] = useState<Tab>("overview");
  const [confirmedId, setConfirmedId] = useState<string | null>(null);

  function askRemove(id: string) {
    setConfirmedId(id);
  }
  function cancelRemove() {
    setConfirmedId(null);
  }

  const stats = {
    students: db.students.length,
    companies: db.companies.length,
    postings: db.postings.length,
    applications: db.applications.length,
    verified: db.students.filter((s) => s.verified).length,
  };

  const today = new Date().toISOString().slice(0, 10);
  const closingSoon = db.postings
    .filter((p) => p.deadline >= today)
    .sort((a, b) => a.deadline.localeCompare(b.deadline))
    .slice(0, 5);

  const postingsByField = FIELDS.map((f) => ({
    field: f,
    postings: db.postings.filter((p) => p.field === f.id).length,
    students: db.students.filter((s) => s.field === f.id).length,
  }));
  const emptyFields = postingsByField.filter((f) => f.postings === 0);

  const applicationsByStage = JOURNEY_STAGES.map((stage, i) => ({
    stage,
    count: db.applications.filter((a) => a.stage === i).length,
  }));

  const maxStudents = Math.max(1, ...postingsByField.map((f) => f.students));

  return (
    <SiteShell>
      <PageHeading
        eyebrow="Admin"
        title="Operations dashboard"
        intro="Manage postings, verify students, review companies and move applications through the pipeline."
      />

      <nav className="flex flex-wrap gap-2 py-6" aria-label="Admin sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={
              tab === t.id
                ? "rounded-full bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground"
                : "rounded-full border border-line bg-glass px-4 py-2 text-sm font-semibold text-ink-soft transition-colors hover:text-ink"
            }
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "overview" ? (
        <section className="space-y-8 pb-12">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <StatCard label="Students" value={stats.students} />
            <StatCard label="Companies" value={stats.companies} />
            <StatCard label="Postings" value={stats.postings} />
            <StatCard label="Applications" value={stats.applications} />
            <StatCard
              label="ID-verified students"
              value={`${stats.verified}/${stats.students}`}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className={fieldStyles.panel}>
              <h2 className="font-display text-lg font-extrabold">
                Students by field of study
              </h2>
              <ul className="mt-4 space-y-3">
                {postingsByField.map(({ field, students, postings }) => (
                  <li key={field.id}>
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="font-semibold">{field.short}</span>
                      <span className="text-ink-soft">
                        {students} students · {postings} postings
                      </span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-brand-soft">
                      <div
                        className="h-2 rounded-full bg-brand"
                        style={{ width: `${(students / maxStudents) * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
              {emptyFields.length > 0 ? (
                <p className="mt-4 rounded-lg bg-accent-soft p-3 text-xs leading-relaxed text-ink">
                  No openings yet in{" "}
                  {emptyFields.map((f) => f.field.short).join(", ")} — reach out to
                  employers in those fields.
                </p>
              ) : null}
            </div>

            <div className={fieldStyles.panel}>
              <h2 className="font-display text-lg font-extrabold">
                Applications by journey stage
              </h2>
              <ul className="mt-4 space-y-2">
                {applicationsByStage.map(({ stage, count }) => (
                  <li
                    key={stage}
                    className="flex items-center justify-between border-b border-line pb-2 text-sm last:border-0"
                  >
                    <span>{stage}</span>
                    <span className="font-semibold text-brand">{count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={fieldStyles.panel}>
            <h2 className="font-display text-lg font-extrabold">Deadlines closing soon</h2>
            {closingSoon.length === 0 ? (
              <p className="mt-3 text-sm text-ink-soft">No open postings right now.</p>
            ) : (
              <ul className="mt-4 space-y-2">
                {closingSoon.map((p) => (
                  <li key={p.id} className="flex flex-wrap justify-between gap-2 text-sm">
                    <span className="font-semibold">{p.title}</span>
                    <span className="text-ink-soft">
                      {p.companyName} · {p.region} · closes {formatDeadline(p.deadline)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      ) : null}

      {tab === "postings" ? (
        <section className="space-y-3 pb-12">
          <p className="text-sm text-ink-soft">
            Remove a posting if it is fake, filled or out of date. Its applications stay
            in the pipeline for the students involved.
          </p>
          <div className="divide-y divide-line rounded-2xl border border-line bg-glass">
            {db.postings.map((p) => {
              const apps = db.applications.filter((a) => a.postingId === p.id).length;
              return (
                <div key={p.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                  <div className="flex-1">
                    <p className="font-display font-bold">{p.title}</p>
                    <p className="text-sm text-ink-soft">
                      {p.companyName} · {fieldById(p.field).short} · {p.region} ·{" "}
                      {p.slots} slots · closes {formatDeadline(p.deadline)}
                    </p>
                  </div>
                  <span className="text-sm text-ink-soft">{apps} applications</span>
                  {confirmedId === p.id ? (
                    <span className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          removePosting(p.id);
                          cancelRemove();
                        }}
                        className="rounded-full bg-destructive px-3 py-1.5 text-sm font-semibold text-destructive-foreground"
                      >
                        Yes, remove
                      </button>
                      <button
                        onClick={cancelRemove}
                        className="rounded-full border border-line px-3 py-1.5 text-sm"
                      >
                        Cancel
                      </button>
                    </span>
                  ) : (
                    <button
                      onClick={() => askRemove(p.id)}
                      className="rounded-full border border-line px-3 py-1.5 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10"
                    >
                      Remove
                    </button>
                  )}
                </div>
              );
            })}
            {db.postings.length === 0 ? (
              <p className="p-6 text-sm text-ink-soft">No postings on the platform.</p>
            ) : null}
          </div>
        </section>
      ) : null}

      {tab === "students" ? (
        <section className="space-y-3 pb-12">
          <p className="text-sm text-ink-soft">
            Verify students against their uploaded ID photo. Unverified students are
            flagged until you check them.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-line bg-glass">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-paper text-left text-xs text-ink-soft">
                <tr>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Institution</th>
                  <th className="px-4 py-3 font-semibold">Field</th>
                  <th className="px-4 py-3 font-semibold">Year</th>
                  <th className="px-4 py-3 font-semibold">Region</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {db.students.map((s) => (
                  <tr key={s.id}>
                    <td className="px-4 py-3 font-semibold">{s.fullName}</td>
                    <td className="px-4 py-3 text-ink-soft">{s.institution}</td>
                    <td className="px-4 py-3">{fieldById(s.field).short}</td>
                    <td className="px-4 py-3 text-ink-soft">{s.year}</td>
                    <td className="px-4 py-3 text-ink-soft">{s.region}</td>
                    <td className="px-4 py-3">
                      {s.verified ? (
                        <span className="rounded-full bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand">
                          Verified
                        </span>
                      ) : (
                        <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-semibold text-ink">
                          Needs check
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setStudentVerified(s.id, !s.verified)}
                          className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold"
                        >
                          {s.verified ? "Un-verify" : "Verify"}
                        </button>
                        {confirmedId === s.id ? (
                          <>
                            <button
                              onClick={() => {
                                removeStudent(s.id);
                                cancelRemove();
                              }}
                              className="rounded-full bg-destructive px-3 py-1.5 text-xs font-semibold text-destructive-foreground"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={cancelRemove}
                              className="rounded-full border border-line px-3 py-1.5 text-xs"
                            >
                              No
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => askRemove(s.id)}
                            className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-destructive"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {tab === "companies" ? (
        <section className="space-y-3 pb-12">
          <p className="text-sm text-ink-soft">
            Removing a company also removes its postings from the board.
          </p>
          <div className="divide-y divide-line rounded-2xl border border-line bg-glass">
            {db.companies.map((c) => {
              const posts = db.postings.filter((p) => p.companyId === c.id).length;
              return (
                <div key={c.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                  <div className="flex-1">
                    <p className="font-display font-bold">{c.name}</p>
                    <p className="text-sm text-ink-soft">
                      {c.sector} · {c.region} · {c.contact}
                    </p>
                  </div>
                  <span className="text-sm text-ink-soft">{posts} postings</span>
                  {confirmedId === c.id ? (
                    <span className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          removeCompany(c.id);
                          cancelRemove();
                        }}
                        className="rounded-full bg-destructive px-3 py-1.5 text-sm font-semibold text-destructive-foreground"
                      >
                        Yes, remove
                      </button>
                      <button
                        onClick={cancelRemove}
                        className="rounded-full border border-line px-3 py-1.5 text-sm"
                      >
                        Cancel
                      </button>
                    </span>
                  ) : (
                    <button
                      onClick={() => askRemove(c.id)}
                      className="rounded-full border border-line px-3 py-1.5 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10"
                    >
                      Remove
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {tab === "applications" ? (
        <section className="space-y-3 pb-12">
          <p className="text-sm text-ink-soft">
            Move each application forward or back through the 12-step journey as
            approvals and reviews come in.
          </p>
          <div className="divide-y divide-line rounded-2xl border border-line bg-glass">
            {db.applications.map((a) => {
              const student = db.students.find((s) => s.id === a.studentId);
              return (
                <div key={a.id} className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
                  <div className="flex-1">
                    <p className="font-display font-bold">{a.postingTitle}</p>
                    <p className="text-sm text-ink-soft">
                      {student?.fullName ?? "Removed student"} · {a.companyName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setApplicationStage(a.id, a.stage - 1)}
                      disabled={a.stage === 0}
                      className="rounded-full border border-line px-3 py-1.5 text-sm font-semibold disabled:opacity-40"
                      aria-label="Previous stage"
                    >
                      ←
                    </button>
                    <select
                      value={a.stage}
                      onChange={(e) => setApplicationStage(a.id, Number(e.target.value))}
                      className="rounded-full border border-line bg-paper px-3 py-1.5 text-sm font-semibold text-ink outline-none"
                      aria-label="Journey stage"
                    >
                      {JOURNEY_STAGES.map((stage, i) => (
                        <option key={stage} value={i}>
                          {i + 1}. {stage}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => setApplicationStage(a.id, a.stage + 1)}
                      disabled={a.stage === FINAL_STAGE}
                      className="rounded-full border border-line px-3 py-1.5 text-sm font-semibold disabled:opacity-40"
                      aria-label="Next stage"
                    >
                      →
                    </button>
                  </div>
                </div>
              );
            })}
            {db.applications.length === 0 ? (
              <p className="p-6 text-sm text-ink-soft">
                No applications yet. They appear here the moment students apply.
              </p>
            ) : null}
          </div>
        </section>
      ) : null}

      <p className="pb-10 text-xs text-ink-soft">
        Signed in as admin.{" "}
        <Link to="/" className="underline">
          Back to home
        </Link>
      </p>
    </SiteShell>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-line bg-glass p-4 shadow-sm">
      <p className="text-xs text-ink-soft">{label}</p>
      <p className="mt-1 font-display text-2xl font-extrabold text-brand">{value}</p>
    </div>
  );
}
