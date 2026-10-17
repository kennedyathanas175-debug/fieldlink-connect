import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell, PageHeading } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { DataState, Feedback, Metric } from "@/components/dashboard-ui";
import { addApplication, fieldById, formatDeadline, getCurrentStudentId, useDB } from "@/lib/fieldlink";
import { todayInTanzania } from "@/lib/dashboard-rules";
export const Route=createFileRoute("/opportunities/$id")({head:()=>({meta:[{title:"Opportunity details — FieldLink TZ"},{name:"description",content:"View a Tanzania field placement and apply using your student profile."},{property:"og:title",content:"Opportunity details — FieldLink TZ"},{property:"og:description",content:"Company, field, region and application deadline."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary"}]}),component:Details});
function Details(){
 const {id}=Route.useParams();const db=useDB();const p=db.postings.find(p=>p.id===id); const studentId=getCurrentStudentId();const [message,setMessage]=useState("");const [busy,setBusy]=useState(false);
 if(!db.loaded||db.error)return <SiteShell><DataState/></SiteShell>;
 if(!p)return <SiteShell><PageHeading eyebrow="Opportunity" title="Opportunity not found"/></SiteShell>;
 const applied=db.applications.some(a=>a.postingId===p.id&&a.studentId===studentId); const expired=p.deadline<todayInTanzania();
 return <SiteShell><PageHeading eyebrow={p.companyName} title={p.title} intro={`${fieldById(p.field).name} · ${p.region}`}/><div className="grid grid-cols-2 gap-4 py-6 sm:grid-cols-3"><Metric label="Slots" value={p.slots}/><Metric label="Duration" value={p.duration}/><Metric label="Deadline" value={formatDeadline(p.deadline)}/></div><p className="max-w-3xl whitespace-pre-wrap py-5 text-sm leading-relaxed text-ink-soft">{p.description||"No additional description provided."}</p><Feedback message={message} error/>{applied?<Button asChild><Link to="/applications">View my application</Link></Button>:expired?<p className="text-sm text-ink-soft">The application deadline has passed.</p>:!studentId?<Button asChild><Link to={db.userId?"/register-student":"/auth"}>{db.userId?"Create profile to apply":"Sign in to apply"}</Link></Button>:<Button disabled={busy} onClick={async()=>{setBusy(true);try{await addApplication(p,studentId);}catch(e){setMessage(e instanceof Error?e.message:"Could not apply.");}finally{setBusy(false);}}}>{busy?"Submitting…":"Apply"}</Button>}</SiteShell>;
}
