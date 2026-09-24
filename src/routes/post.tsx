import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { SiteShell, PageHeading, fieldStyles } from "@/components/site-shell";
import {
  FIELDS,
  REGIONS,
  addPosting,
  countStudentsInField,
  getCurrentCompanyId,
  useDB,
  type FieldId,
} from "@/lib/fieldlink";

export const Route = createFileRoute("/post")({
  head: () => ({
    meta: [
      { title: "Post an internship or placement — FieldLink TZ" },
      {
        name: "description",
        content:
          "Publish an internship or field-placement opening. See instantly how many registered students match the field you need.",
      },
      { property: "og:title", content: "Post a placement — FieldLink TZ" },
      {
        property: "og:description",
        content: "Publish an opening and see how many students match the field immediately.",
      },
    ],
  }),
  component: PostPlacement,
});

const schema = z.object({
  title: z.string().trim().min(3, "Enter a posting title").max(120),
  field: z.string().min(1, "Choose the required field"),
  slots: z.coerce.number().int().min(1, "At least 1 slot").max(500),
  duration: z.string().trim().min(2, "Enter a duration, e.g. 3 months").max(60),
  deadline: z.string().min(1, "Choose an application deadline"),
  region: z.string().min(1, "Choose a region"),
  description: z.string().trim().max(1000).optional(),
});

function PostPlacement() {
  const navigate = useNavigate();
  const db = useDB();
  const company = db.companies.find((c) => c.id === getCurrentCompanyId());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [matchCount, setMatchCount] = useState<number | null>(null);
  const [postedTitle, setPostedTitle] = useState("");

  if (!company) {
    return (
      <SiteShell>
        <PageHeading
          eyebrow="Post a placement"
          title="Register your organisation first"
          intro="Postings are attached to a registered company, office or organisation so students know who they are applying to."
        />
        <section className="py-8">
          <Link
            to="/register-company"
            className="inline-flex items-center bg-navy px-6 py-3.5 text-[12px] font-semibold text-paper transition-colors hover:bg-brand"
          >
            Register as a company / office
          </Link>
        </section>
      </SiteShell>
    );
  }

  if (matchCount !== null) {
    return (
      <SiteShell>
        <PageHeading
          eyebrow="Posting published"
          title="Your placement is now on the board"
        />
        <section className="py-8">
          <div className="max-w-xl border border-line bg-glass p-6 shadow-sm">
            <p className="text-sm text-ink-soft">
              Match result
            </p>
            <p className="mt-3 font-display text-5xl font-extrabold tracking-tight text-brand">
              {matchCount}
            </p>
            <p className="mt-2 text-sm text-ink-soft">
              registered students currently match the field required for
              <span className="font-semibold text-ink"> “{postedTitle}”</span>. Matching students
              will see it in their field feed right away.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/listings"
                search={{ field: "all", region: "all" }}
                className={fieldStyles.submit}
              >
                View on the board
              </Link>
              <button
                onClick={() => setMatchCount(null)}
                className="border border-line px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-brand"
              >
                Post another
              </button>
            </div>
          </div>
        </section>
      </SiteShell>
    );
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    const fieldId = parsed.data.field as FieldId;
    addPosting({
      companyId: company!.id,
      companyName: company!.name,
      title: parsed.data.title,
      field: fieldId,
      slots: parsed.data.slots,
      duration: parsed.data.duration,
      deadline: parsed.data.deadline,
      region: parsed.data.region,
      description: parsed.data.description ?? "",
    });
    setPostedTitle(parsed.data.title);
    setMatchCount(countStudentsInField(fieldId));
    void navigate;
  }

  return (
    <SiteShell>
      <PageHeading
        eyebrow={`Posting as ${company.name}`}
        title="Publish a placement"
        intro="Fill in the details below. On submit you will see how many registered students match the required field."
      />

      <section className="max-w-2xl py-8">
        <form onSubmit={onSubmit} noValidate className={fieldStyles.panel}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className={fieldStyles.label}>Posting title</span>
              <input
                name="title"
                placeholder="e.g. Civil Engineering Intern"
                className={fieldStyles.input}
              />
              <FieldError message={errors["title"]} />
            </label>

            <label className="block">
              <span className={fieldStyles.label}>Field required</span>
              <select name="field" defaultValue="" className={fieldStyles.input}>
                <option value="" disabled>
                  Select a field
                </option>
                {FIELDS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
              <FieldError message={errors["field"]} />
            </label>

            <label className="block">
              <span className={fieldStyles.label}>Number of slots</span>
              <input name="slots" type="number" min={1} placeholder="e.g. 3" className={fieldStyles.input} />
              <FieldError message={errors["slots"]} />
            </label>

            <label className="block">
              <span className={fieldStyles.label}>Duration</span>
              <input name="duration" placeholder="e.g. 3 months" className={fieldStyles.input} />
              <FieldError message={errors["duration"]} />
            </label>

            <label className="block">
              <span className={fieldStyles.label}>Application deadline</span>
              <input name="deadline" type="date" className={fieldStyles.input} />
              <FieldError message={errors["deadline"]} />
            </label>

            <label className="block sm:col-span-2">
              <span className={fieldStyles.label}>Region</span>
              <select name="region" defaultValue={company.region} className={fieldStyles.input}>
                {REGIONS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
              <FieldError message={errors["region"]} />
            </label>

            <label className="block sm:col-span-2">
              <span className={fieldStyles.label}>Short description (optional)</span>
              <textarea
                name="description"
                rows={4}
                placeholder="What will the student do? Any requirements?"
                className={fieldStyles.input}
              />
              <FieldError message={errors["description"]} />
            </label>
          </div>

          <div className="mt-6">
            <button type="submit" className={fieldStyles.submit}>
              Publish posting
            </button>
          </div>
        </form>
      </section>
    </SiteShell>
  );
}

function FieldError({ message }: { message: string | undefined }) {
  if (!message) return null;
  return <p className="mt-1.5 text-sm text-destructive">{message}</p>;
}
