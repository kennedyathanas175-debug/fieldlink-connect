import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { SiteShell, PageHeading, fieldStyles } from "@/components/site-shell";
import { FIELDS, REGIONS, YEARS, addStudent, type FieldId } from "@/lib/fieldlink";

export const Route = createFileRoute("/register-student")({
  head: () => ({
    meta: [
      { title: "Register as a student — FieldLink TZ" },
      {
        name: "description",
        content:
          "Register once with your institution, field of study and region to apply for internships and field placements anywhere in Tanzania.",
      },
      { property: "og:title", content: "Student registration — FieldLink TZ" },
      {
        property: "og:description",
        content: "Any college or university. Register with your field of study and a student ID photo.",
      },
    ],
  }),
  component: RegisterStudent,
});

const schema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(100),
  institution: z.string().trim().min(2, "Enter your college or university").max(120),
  field: z.string().min(1, "Choose your field of study"),
  year: z.string().min(1, "Choose your year of study"),
  region: z.string().min(1, "Choose your preferred region"),
  phone: z
    .string()
    .trim()
    .min(9, "Enter a valid phone number")
    .max(20)
    .regex(/^[0-9+\s-]+$/, "Phone number can only contain digits, spaces, + and -"),
});

function RegisterStudent() {
  const navigate = useNavigate();
  const [idPhoto, setIdPhoto] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const parsed = schema.safeParse(data);
    const next: Record<string, string> = {};
    if (!parsed.success) {
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
    }
    if (!idPhoto) next.idPhoto = "A student ID photo is required.";
    setErrors(next);
    if (Object.keys(next).length > 0 || !parsed.success || !idPhoto) return;

    addStudent({
      fullName: parsed.data.fullName,
      institution: parsed.data.institution,
      field: parsed.data.field as FieldId,
      year: parsed.data.year,
      region: parsed.data.region,
      phone: parsed.data.phone,
      idPhotoName: idPhoto.name,
    });
    navigate({ to: "/listings", search: { field: "all", region: "all" } });
  }

  return (
    <SiteShell>
      <PageHeading
        eyebrow="Student registration"
        title="One form. Any institution."
        intro="Type your college's name — matching is done by field of study, not by school. All fields below are required."
      />

      <section className="grid gap-8 py-8 lg:grid-cols-[minmax(0,300px)_1fr]">
        <div>
          <div className="rounded-xl border border-line bg-glass/60 p-4 backdrop-blur-md">
            <p className={fieldStyles.label}>Privacy note</p>
            <p className="mt-2 text-xs leading-relaxed text-ink-soft text-pretty">
              Your student ID photo is used only to verify that you are a real student. It is never
              shown to companies, offices or other students.
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} noValidate className={fieldStyles.panel}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className={fieldStyles.label}>Full name</span>
              <input name="fullName" placeholder="e.g. Amani Joseph" className={fieldStyles.input} />
              <FieldError message={errors["fullName"]} />
            </label>

            <label className="block">
              <span className={fieldStyles.label}>College / institution</span>
              <input
                name="institution"
                placeholder="e.g. Sokoine University of Agriculture"
                className={fieldStyles.input}
              />
              <FieldError message={errors["institution"]} />
            </label>

            <label className="block">
              <span className={fieldStyles.label}>Field of study</span>
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
              <span className={fieldStyles.label}>Year of study</span>
              <select name="year" defaultValue="" className={fieldStyles.input}>
                <option value="" disabled>
                  Select a year
                </option>
                {YEARS.map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
              <FieldError message={errors["year"]} />
            </label>

            <label className="block">
              <span className={fieldStyles.label}>Preferred region</span>
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
              <span className={fieldStyles.label}>Phone number</span>
              <input
                name="phone"
                type="tel"
                placeholder="+255 7XX XXX XXX"
                className={fieldStyles.input}
              />
              <FieldError message={errors["phone"]} />
            </label>

            <div className="sm:col-span-2">
              <span className={fieldStyles.label}>Student ID photo — required</span>
              <div className="mt-1.5 rounded-lg border border-dashed border-line bg-paper/60 p-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setIdPhoto(e.target.files?.[0] ?? null)}
                  className="block w-full text-sm text-ink-soft file:mr-3 file:rounded-md file:border-0 file:bg-ink file:px-3 file:py-2 file:text-sm file:font-semibold file:text-paper"
                />
                <p className="mt-2 text-[11px] text-ink-soft">
                  {idPhoto ? `Selected: ${idPhoto.name}` : "Used only for verification. Not shown to companies."}
                </p>
              </div>
              <FieldError message={errors["idPhoto"]} />
            </div>
          </div>

          <div className="mt-6">
            <button type="submit" className={fieldStyles.submit}>
              Create student profile
            </button>
          </div>
        </form>
      </section>
    </SiteShell>
  );
}

function FieldError({ message }: { message: string | undefined }) {
  if (!message) return null;
  return <p className="mt-1.5 font-mono text-[11px] text-destructive">{message}</p>;
}
