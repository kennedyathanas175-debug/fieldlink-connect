import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { SiteShell, PageHeading, fieldStyles } from "@/components/site-shell";
import { REGIONS, SECTORS, addCompany } from "@/lib/fieldlink";

export const Route = createFileRoute("/register-company")({
  head: () => ({
    meta: [
      { title: "Register your company or office — FieldLink TZ" },
      {
        name: "description",
        content:
          "Register your company, office or organisation to post internship and field-placement openings to students across Tanzania.",
      },
      { property: "og:title", content: "Company registration — FieldLink TZ" },
      {
        property: "og:description",
        content: "Register once, then post placements and see how many students match each field.",
      },
    ],
  }),
  component: RegisterCompany,
});

const schema = z.object({
  name: z.string().trim().min(2, "Enter the company or office name").max(120),
  sector: z.string().min(1, "Choose a sector"),
  region: z.string().min(1, "Choose a region"),
  contact: z.string().trim().min(6, "Enter an email or phone number").max(120),
});

function RegisterCompany() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    addCompany(parsed.data);
    navigate({ to: "/post" });
  }

  return (
    <SiteShell>
      <PageHeading
        eyebrow="For companies, offices and organisations"
        title="Register your organisation"
        intro="Register once, then publish placements. Students are matched to your posting by field of study."
      />

      <section className="max-w-2xl py-8">
        <form onSubmit={onSubmit} noValidate className={fieldStyles.panel}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className={fieldStyles.label}>Company / office name</span>
              <input
                name="name"
                placeholder="e.g. Mwanza Regional Council"
                className={fieldStyles.input}
              />
              <FieldError message={errors["name"]} />
            </label>

            <label className="block">
              <span className={fieldStyles.label}>Sector</span>
              <select name="sector" defaultValue="" className={fieldStyles.input}>
                <option value="" disabled>
                  Select a sector
                </option>
                {SECTORS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <FieldError message={errors["sector"]} />
            </label>

            <label className="block">
              <span className={fieldStyles.label}>Region</span>
              <select name="region" defaultValue="" className={fieldStyles.input}>
                <option value="" disabled>
                  Select a region
                </option>
                {REGIONS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
              <FieldError message={errors["region"]} />
            </label>

            <label className="block sm:col-span-2">
              <span className={fieldStyles.label}>Contact (email or phone)</span>
              <input
                name="contact"
                placeholder="placements@example.co.tz or +255 7XX XXX XXX"
                className={fieldStyles.input}
              />
              <FieldError message={errors["contact"]} />
            </label>
          </div>

          <div className="mt-6">
            <button type="submit" className={fieldStyles.submit}>
              Register and continue to posting
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
