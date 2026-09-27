import { createFileRoute, Link } from "@tanstack/react-router";
import { BriefcaseBusiness, ExternalLink, Linkedin, MapPin, Plus } from "lucide-react";
import { useState } from "react";
import { SiteShell, PageHeading, fieldStyles } from "@/components/site-shell";
import {
  addWorkSample,
  fieldById,
  getCurrentStudentId,
  updateStudentProfile,
  useDB,
} from "@/lib/fieldlink";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My professional profile — FieldLink TZ" },
      { name: "description", content: "Connect your professional account and showcase field work, projects and practical experience." },
      { property: "og:title", content: "Student professional profile — FieldLink TZ" },
      { property: "og:description", content: "A student profile for connections, field work and practical experience." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Profile,
});

function Profile() {
  const db = useDB();
  const student = db.students.find((item) => item.id === getCurrentStudentId());
  const [saved, setSaved] = useState(false);

  if (!student) {
    return (
      <SiteShell>
        <PageHeading eyebrow="Professional profile" title="Create your student profile first" intro="Your professional profile brings your course, practical work and connections together." />
        <div className="py-8"><Link to="/register-student" className={fieldStyles.submit}>Create student profile</Link></div>
      </SiteShell>
    );
  }

  function saveProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const values = Object.fromEntries(new FormData(e.currentTarget));
    updateStudentProfile(student.id, {
      linkedinUrl: String(values["linkedinUrl"] ?? ""),
      bio: String(values["bio"] ?? ""),
    });
    setSaved(true);
  }

  function addWork(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    const title = String(values["title"] ?? "").trim();
    if (!title) return;
    addWorkSample(student.id, {
      title,
      description: String(values["description"] ?? "").trim(),
      link: String(values["link"] ?? "").trim(),
    });
    form.reset();
  }

  return (
    <SiteShell>
      <section className="border-b border-line py-10 sm:py-14">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex size-16 items-center justify-center rounded-full bg-mint font-display text-2xl font-semibold text-navy">{student.fullName.charAt(0)}</span>
            <h1 className="mt-4 font-display text-4xl font-semibold">{student.fullName}</h1>
            <p className="mt-2 flex flex-wrap gap-4 text-sm text-ink-soft"><span>{student.institution}</span><span className="flex items-center gap-1"><MapPin size={14} />{student.region}</span></p>
          </div>
          <span className="rounded-full bg-brand-soft px-4 py-2 text-sm font-semibold text-brand">{fieldById(student.field).name}</span>
        </div>
      </section>

      <section className="grid gap-12 py-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 className="font-display text-2xl font-semibold">Connect professionally</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">Add your LinkedIn profile so mentors, companies and other students can connect with you.</p>
          <form onSubmit={saveProfile} className="mt-6 space-y-4">
            <label className="block"><span className={fieldStyles.label}>LinkedIn profile</span><div className="relative"><Linkedin className="absolute left-3 top-5 text-accent-strong" size={18} /><input name="linkedinUrl" type="url" defaultValue={student.linkedinUrl} placeholder="https://linkedin.com/in/your-name" className={`${fieldStyles.input} pl-10`} /></div></label>
            <label className="block"><span className={fieldStyles.label}>About your goals</span><textarea name="bio" rows={4} defaultValue={student.bio} placeholder="What are you learning and what work do you want to do?" className={fieldStyles.input} /></label>
            <button className={fieldStyles.submit}>Save connections</button>
            {saved ? <p className="text-sm font-semibold text-brand">Profile saved.</p> : null}
          </form>
        </div>

        <div>
          <div className="flex items-end justify-between"><div><h2 className="font-display text-2xl font-semibold">Field work & projects</h2><p className="mt-2 text-sm text-ink-soft">Show practical work that proves what you can do.</p></div><BriefcaseBusiness className="text-brand" /></div>
          <div className="mt-6 space-y-4">
            {student.workSamples.map((sample) => <article key={sample.id} className="border-b border-line pb-5"><h3 className="font-display text-lg font-semibold">{sample.title}</h3><p className="mt-1 text-sm text-ink-soft">{sample.description}</p>{sample.link ? <a href={sample.link} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-accent-strong">View work <ExternalLink size={14} /></a> : null}</article>)}
          </div>
          <form onSubmit={addWork} className="mt-7 rounded-2xl bg-brand-soft p-5">
            <p className="flex items-center gap-2 font-semibold"><Plus size={18} /> Add field work</p>
            <div className="mt-4 space-y-3"><input name="title" required placeholder="Project or field activity title" className={fieldStyles.input} /><textarea name="description" rows={3} placeholder="What did you do or learn?" className={fieldStyles.input} /><input name="link" type="url" placeholder="Link to photos, document or project (optional)" className={fieldStyles.input} /></div>
            <button className="mt-4 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground">Add to profile</button>
          </form>
        </div>
      </section>
    </SiteShell>
  );
}