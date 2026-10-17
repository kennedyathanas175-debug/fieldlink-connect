import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, BriefcaseBusiness, UserRound, Search } from "lucide-react";
import { SiteShell, PageHeading } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { DataState, Empty, Metric, Section } from "@/components/dashboard-ui";
import { fieldById, getCurrentStudentId, useDB } from "@/lib/fieldlink";
import { applicationStatus, completion, eastAfricaDate, todayInTanzania } from "@/lib/dashboard-rules";
export const Route = createFileRoute("/dashboard")({ head: () => ({ meta: [{ title: "Student dashboard — FieldLink TZ" }, { name: "description", content: "Your applications, profile and relevant field placements across Tanzania." }, { property: "og:title", content: "Student dashboard — FieldLink TZ" }, { property: "og:description", content: "Follow your placement applications and academic profile." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }), component: Dashboard });
function Dashboard() {
  const db = useDB(); const student = db.students.find(s => s.id === getCurrentStudentId());
  if (!db.loaded || db.error) return <SiteShell><DataState /></SiteShell>;
  if (!db.userId) return <SiteShell><PageHeading eyebrow="Student" title="Sign in to your dashboard" /><section className="py-8"><Button asChild><Link to="/auth">Sign in</Link></Button></section></SiteShell>;
  if (!student) return <SiteShell><PageHeading eyebrow="Student" title="Complete your student registration" /><section className="py-8"><Button asChild><Link to="/register-student">Create student profile</Link></Button><Button asChild variant="outline" className="ml-3"><Link to="/company">Company account</Link></Button></section></SiteShell>;
  const apps = db.applications.filter(a => a.studentId === student.id).sort((a,b) => b.createdAt-a.createdAt);
  const score = completion({ Name: student.fullName, Institution: student.institution, Course: student.course, Phone: student.phone, Bio: student.bio, Skills: student.skills });
  const applied = new Set(apps.map(a => a.postingId));
  const relevant = db.postings.filter(p => p.field === student.field && p.deadline >= todayInTanzania() && !applied.has(p.id)).sort((a,b) => Number(b.region===student.region)-Number(a.region===student.region)).slice(0,4);
  return <SiteShell><PageHeading eyebrow="Student dashboard" title={`Welcome, ${student.fullName.split(" ")[0]}`} intro={`${student.institution} · ${fieldById(student.field).name}`} />
    <nav className="flex flex-wrap gap-3 py-5"><Button asChild><Link to="/listings" search={{ field: student.field, region: "all" }}><Search />Browse opportunities</Link></Button><Button asChild variant="outline"><Link to="/profile"><UserRound />{score.percent<100 ? "Complete profile" : "Edit profile"}</Link></Button><Button asChild variant="outline"><Link to="/applications"><BriefcaseBusiness />My applications</Link></Button></nav>
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4"><Metric label="Applications submitted" value={apps.length} /><Metric label="Pending" value={apps.filter(a=>applicationStatus(a.stage)==="Pending").length} /><Metric label="Under review" value={apps.filter(a=>applicationStatus(a.stage)==="Under review").length} /><Metric label="Accepted" value={apps.filter(a=>applicationStatus(a.stage)==="Accepted").length} /></div>
    <Section title="Recent applications" action={<Button asChild variant="link"><Link to="/applications">View all <ArrowUpRight /></Link></Button>}>{apps.length ? <div className="divide-y divide-line border border-line bg-glass">{apps.slice(0,5).map(a=><div key={a.id} className="flex flex-wrap items-center justify-between gap-3 p-4"><div><p className="font-semibold">{a.postingTitle}</p><p className="text-sm text-ink-soft">{a.companyName} · {eastAfricaDate(a.createdAt)}</p></div><span className="bg-brand-soft px-3 py-1 text-sm text-brand">{applicationStatus(a.stage)}</span></div>)}</div> : <Empty>No applications submitted yet.</Empty>}</Section>
    <Section title="In your academic field">{relevant.length ? <div className="divide-y divide-line border border-line bg-glass">{relevant.map(p=><div key={p.id} className="flex flex-wrap items-center justify-between gap-3 p-4"><div><p className="font-semibold">{p.title}</p><p className="text-sm text-ink-soft">{p.companyName} · {p.region}</p></div><Button asChild variant="outline"><Link to="/opportunities/$id" params={{ id:p.id }}>View opportunity</Link></Button></div>)}</div> : <Empty>No other open opportunities in your academic field yet.</Empty>}</Section>
  </SiteShell>;
}
