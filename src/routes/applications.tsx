import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell, PageHeading } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { DataState, Empty } from "@/components/dashboard-ui";
import { getCurrentStudentId, JOURNEY_STAGES, useDB } from "@/lib/fieldlink";
import { applicationStatus, eastAfricaDate } from "@/lib/dashboard-rules";
export const Route = createFileRoute("/applications")({ head: () => ({ meta: [{ title:"My applications — FieldLink TZ" },{ name:"description",content:"Your submitted placement applications and their current journey stages." },{ property:"og:title",content:"My applications — FieldLink TZ" },{ property:"og:description",content:"Track your actual placement applications." },{ property:"og:type",content:"website" },{ name:"twitter:card",content:"summary" }] }), component:Applications });
function Applications() {
 const db=useDB(); const id=getCurrentStudentId(); const apps=db.applications.filter(a=>a.studentId===id).sort((a,b)=>b.createdAt-a.createdAt);
 return <SiteShell><PageHeading eyebrow="Student dashboard" title="My applications" /><div className="flex gap-3 py-5"><Button asChild variant="outline"><Link to="/dashboard">Dashboard</Link></Button><Button asChild><Link to="/listings" search={{field:"all",region:"all"}}>Browse opportunities</Link></Button></div>
 {!db.loaded || db.error ? <DataState /> : !db.userId ? <Empty><Link to="/auth" className="text-brand">Sign in to view your applications.</Link></Empty> : !apps.length ? <Empty>No applications yet.</Empty> : <div className="divide-y divide-line border border-line bg-glass">{apps.map(a=><article key={a.id} className="flex flex-wrap items-center justify-between gap-4 p-5"><div><h2 className="font-semibold">{a.postingTitle}</h2><p className="text-sm text-ink-soft">{a.companyName} · Submitted {eastAfricaDate(a.createdAt)}</p><p className="mt-2 text-sm text-brand">{applicationStatus(a.stage)} · {JOURNEY_STAGES[a.stage]}</p></div><div className="flex gap-2">{db.postings.some(p=>p.id===a.postingId)&&<Button asChild variant="outline"><Link to="/opportunities/$id" params={{id:a.postingId}}>View opportunity</Link></Button>}<Button asChild variant="outline"><Link to="/journey">Track progress</Link></Button></div></article>)}</div>}
 </SiteShell>;
}
