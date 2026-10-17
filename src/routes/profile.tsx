import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Save, Plus, Linkedin, UserRound, ExternalLink } from "lucide-react";
import { SiteShell, PageHeading } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { DataState, Feedback, Field, Section, inputClass } from "@/components/dashboard-ui";
import { FIELDS, REGIONS, YEARS, addWorkSample, getCurrentStudentId, updateStudentProfile, useDB, type FieldId } from "@/lib/fieldlink";
import { completion } from "@/lib/dashboard-rules";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/profile")({ head: () => ({ meta: [
  { title: "My student profile — FieldLink TZ" }, { name: "description", content: "Manage your academic profile, LinkedIn, resume and practical work." },
  { property: "og:title", content: "Student profile — FieldLink TZ" }, { property: "og:description", content: "Your academic background and practical experience in one place." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
]}), component: Profile });

function Profile() {
  const db = useDB();
  const { user } = useAuth();
  const student = db.students.find(s => s.id === getCurrentStudentId());
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [photo, setPhoto] = useState<File>();
  const [cv, setCv] = useState<File>();
  if (!db.loaded || db.error) return <SiteShell><DataState /></SiteShell>;
  if (!student) return <SiteShell><PageHeading eyebrow="Student profile" title={user ? "Create your student profile" : "Sign in to your profile"} /><section className="py-8"><Button asChild><Link to={user ? "/register-student" : "/auth"}>{user ? "Create profile" : "Sign in"}</Link></Button></section></SiteShell>;
  const score = completion({ Name: student.fullName, Email: student.email || user?.email, Phone: student.phone, Institution: student.institution, Course: student.course, Year: student.year, Field: student.field, Region: student.region, Bio: student.bio, Skills: student.skills, Photo: student.photoUrl });
  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (!student) return;
    const data = new FormData(e.currentTarget);
    const str = (key: string) => String(data.get(key) ?? "").trim();
    setBusy(true); setMessage("");
    try {
      await updateStudentProfile(student.id, { fullName: str("fullName"), email: str("email"), phone: str("phone"), institution: str("institution"), course: str("course"), field: str("field") as FieldId, year: str("year"), region: str("region"), location: str("location"), bio: str("bio"), skills: str("skills").split(",").map(s => s.trim()).filter(Boolean), linkedinUrl: str("linkedinUrl") }, photo, cv);
      setPhoto(undefined); setCv(undefined); setError(false); setMessage("Profile saved.");
    } catch (err) { setError(true); setMessage(err instanceof Error ? err.message : "Could not save. Try again."); } finally { setBusy(false); }
  }
  async function work(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (!student) return;
    const form = e.currentTarget; const data = new FormData(form); setBusy(true);
    try { await addWorkSample(student.id, { title: String(data.get("title")), description: String(data.get("description")), link: String(data.get("link")) }); form.reset(); setError(false); setMessage("Work sample added."); }
    catch (err) { setError(true); setMessage(err instanceof Error ? err.message : "Could not save work."); } finally { setBusy(false); }
  }
  return <SiteShell>
    <PageHeading eyebrow="My profile" title={student.fullName} intro={`${student.institution} · ${student.region}`} />
    <div className="flex flex-wrap items-center gap-4 border-b border-line py-5">
      {student.photoUrl ? <img src={student.photoUrl} alt={student.fullName} className="size-16 rounded-md object-cover" /> : <UserRound className="size-12 text-ink-soft" />}
      <div className="min-w-0 flex-1"><p className="font-semibold">Profile completion · {score.percent}%</p><progress value={score.percent} max={100} className="mt-2 h-2 w-full max-w-sm accent-brand" /><p className="mt-1 text-xs text-ink-soft">{score.missing.length ? `Missing: ${score.missing.join(", ")}` : "Profile complete"}</p></div>
      <span className="bg-brand-soft px-3 py-1 text-sm text-brand">{student.verified ? "ID verified" : "ID verification pending"}</span>
      <Button asChild variant="outline"><Link to="/dashboard">My dashboard</Link></Button>
    </div>
    <Feedback message={message} error={error} />
    <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
      <Section title="Edit profile"><form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name"><input name="fullName" required minLength={2} maxLength={100} defaultValue={student.fullName} className={inputClass} /></Field>
        <Field label="Contact email"><input name="email" required type="email" defaultValue={student.email || user?.email || ""} className={inputClass} /></Field>
        <Field label="Phone"><input name="phone" required type="tel" minLength={9} defaultValue={student.phone} className={inputClass} /></Field>
        <Field label="College / university"><input name="institution" required defaultValue={student.institution} className={inputClass} /></Field>
        <Field label="Course / programme"><input name="course" required defaultValue={student.course} className={inputClass} /></Field>
        <Field label="Academic field"><select name="field" defaultValue={student.field} className={inputClass}>{FIELDS.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</select></Field>
        <Field label="Academic year"><select name="year" defaultValue={student.year} className={inputClass}>{YEARS.map(y => <option key={y}>{y}</option>)}</select></Field>
        <Field label="Region"><select name="region" defaultValue={student.region} className={inputClass}>{REGIONS.map(r => <option key={r}>{r}</option>)}</select></Field>
        <Field label="City / location"><input name="location" defaultValue={student.location} className={inputClass} /></Field>
        <Field label="Skills / interests (comma separated)"><input name="skills" defaultValue={student.skills?.join(", ")} className={inputClass} /></Field>
        <div className="sm:col-span-2"><Field label="Professional biography"><textarea name="bio" maxLength={2000} rows={4} defaultValue={student.bio} className={inputClass} /></Field></div>
        <div className="sm:col-span-2"><Field label="LinkedIn / portfolio URL"><input name="linkedinUrl" type="url" defaultValue={student.linkedinUrl} className={inputClass} /></Field></div>
        <Field label="Profile photo (JPG, PNG, WebP · 5 MB)"><input aria-label="Profile photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={e => setPhoto(e.target.files?.[0])} className={`${inputClass} overflow-hidden`} /></Field>
        <Field label="CV / resume (PDF · 5 MB)"><input aria-label="CV / resume" type="file" accept="application/pdf" onChange={e => setCv(e.target.files?.[0])} className={`${inputClass} overflow-hidden`} /></Field>
        {student.cvUrl && <a href={student.cvUrl} target="_blank" rel="noreferrer" className="text-sm text-accent-strong">Open saved CV <ExternalLink className="inline size-4" /></a>}
        <div className="sm:col-span-2"><Button disabled={busy} type="submit"><Save />{busy ? "Saving…" : "Save profile"}</Button></div>
      </form></Section>
      <div><Section title="Professional connections">{student.linkedinUrl ? <a href={student.linkedinUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-accent-strong"><Linkedin size={18} />Open professional profile</a> : <p className="text-sm text-ink-soft">No professional link added.</p>}</Section>
        <Section title="Field work & projects">{student.workSamples.map(s => <article key={s.id} className="border-b border-line py-4"><h3 className="font-semibold">{s.title}</h3><p className="mt-1 text-sm text-ink-soft">{s.description}</p>{s.link && <a href={s.link} target="_blank" rel="noreferrer" className="text-sm text-accent-strong">View work</a>}</article>)}
          <form onSubmit={work} className="mt-5 space-y-3"><Field label="Project title"><input name="title" required className={inputClass} /></Field><Field label="Description"><textarea name="description" rows={3} className={inputClass} /></Field><Field label="Work URL"><input name="link" type="url" className={inputClass} /></Field><Button disabled={busy} variant="outline"><Plus />Add work</Button></form>
        </Section></div>
    </div>
  </SiteShell>;
}
