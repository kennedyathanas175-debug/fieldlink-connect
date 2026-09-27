import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, MapPin, Sparkles } from "lucide-react";
import heroStudents from "@/assets/hero-students.jpg";
import { AiMatch } from "@/components/ai-match";
import { SiteShell } from "@/components/site-shell";
import { FIELDS, JOURNEY_STAGES, REGIONS, fieldById, useDB } from "@/lib/fieldlink";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FieldLink TZ — Internships and field placements by field of study" },
      { name: "description", content: "Students from any Tanzanian institution find placements by field, build practical experience and connect professionally." },
      { property: "og:title", content: "FieldLink TZ — Field placements across Tanzania" },
      { property: "og:description", content: "Find the right field placement, follow every step and build a professional experience record." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const db = useDB();
  const latest = [...db.postings].sort((a, b) => b.createdAt - a.createdAt).slice(0, 3);

  return (
    <SiteShell>
      <section className="grid min-h-[650px] items-center gap-10 py-8 lg:grid-cols-[0.9fr_1.1fr] lg:py-14">
        <div className="animate-rise py-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-4 py-2 text-sm font-semibold text-brand">
            <Sparkles size={16} /> Nafasi za mafunzo Tanzania nzima
          </span>
          <h1 className="mt-6 max-w-[14ch] font-display text-5xl font-semibold leading-[1.04] text-balance sm:text-7xl">
            Your skills deserve the right place to grow.
          </h1>
          <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-ink-soft sm:text-lg">
            FieldLink TZ connects students from every college and university with practical training, mentors and organisations — based on what you study, not where you study.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register-student" className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-brand-foreground transition-colors hover:bg-navy">Create your profile <ArrowRight size={17} /></Link>
            <Link to="/listings" search={{ field: "all", region: "all" }} className="inline-flex items-center rounded-full border border-line px-6 py-3.5 text-sm font-semibold transition-colors hover:border-brand hover:text-brand">Explore opportunities</Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-ink-soft">
            <span><strong className="text-xl text-ink">{db.students.length}</strong> students</span>
            <span><strong className="text-xl text-ink">{db.postings.length}</strong> open placements</span>
            <span><strong className="text-xl text-ink">{REGIONS.length}</strong> regions</span>
          </div>
        </div>

        <div className="relative min-h-[540px] overflow-hidden rounded-[2rem]">
          <img src={heroStudents} alt="Tanzanian students learning with a field mentor" width={1280} height={1024} className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-x-5 bottom-5 rounded-2xl bg-glass/90 p-5 backdrop-blur-md sm:inset-x-auto sm:right-5 sm:max-w-xs">
            <p className="font-display text-lg font-semibold">One profile, a growing career.</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">Connect your LinkedIn, share field work and build an experience record employers can trust.</p>
            <Link to="/profile" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand">Build your profile <ArrowRight size={15} /></Link>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <AiMatch />
      </section>

      <section className="grid gap-10 py-14 lg:grid-cols-[0.75fr_1.25fr]">
        <div>
          <p className="text-sm font-semibold text-brand">Built around your field</p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-balance">Different course names. Eight clear pathways.</h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">Select the field closest to your course and see placements that match your knowledge.</p>
        </div>
        <div className="grid sm:grid-cols-2">
          {FIELDS.map((field) => (
            <Link key={field.id} to="/listings" search={{ field: field.id, region: "all" }} className="group flex gap-4 border-b border-line py-5 sm:px-5 sm:[&:nth-last-child(-n+2)]:border-b-0">
              <span className="text-sm font-semibold text-brand">{field.index}</span>
              <div><h3 className="font-display text-lg font-semibold group-hover:text-brand">{field.name}</h3><p className="mt-1 text-xs leading-relaxed text-ink-soft">{field.examples}</p></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="-mx-5 bg-brand-soft px-5 py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold text-brand">Your placement journey</p>
            <h2 className="mt-3 font-display text-4xl font-semibold text-balance">From first application to proof of experience.</h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">Know what comes next. Your institution, company and supervisor move through one clear process.</p>
            <Link to="/journey" className="mt-6 inline-flex items-center gap-2 rounded-full bg-navy px-5 py-3 text-sm font-semibold text-paper">Track my journey <ArrowRight size={16} /></Link>
          </div>
          <ol className="grid gap-x-8 sm:grid-cols-2">
            {JOURNEY_STAGES.map((stage, index) => (
              <li key={stage} className="flex items-center gap-3 border-b border-line py-3.5"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-glass text-xs font-semibold text-brand">{index + 1}</span><span className="text-sm font-medium">{stage}</span></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div><p className="text-sm font-semibold text-brand">Open now</p><h2 className="mt-2 font-display text-4xl font-semibold">Fresh opportunities</h2></div>
          <Link to="/listings" search={{ field: "all", region: "all" }} className="inline-flex items-center gap-2 text-sm font-semibold text-brand">See all opportunities <ArrowRight size={16} /></Link>
        </div>
        <div className="mt-8 divide-y divide-line border-y border-line">
          {latest.map((posting) => (
            <Link key={posting.id} to="/listings" search={{ field: posting.field, region: "all" }} className="group grid gap-3 py-6 sm:grid-cols-[1fr_0.7fr_auto] sm:items-center">
              <div><span className="text-xs font-semibold text-brand">{fieldById(posting.field).short}</span><h3 className="mt-1 font-display text-xl font-semibold group-hover:text-brand">{posting.title}</h3><p className="text-sm text-ink-soft">{posting.companyName}</p></div>
              <div className="flex gap-5 text-sm text-ink-soft"><span className="flex items-center gap-1"><MapPin size={14} />{posting.region}</span><span className="flex items-center gap-1"><Check size={14} />{posting.slots} slots</span></div>
              <ArrowRight className="text-brand" />
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-6 rounded-[2rem] bg-navy px-6 py-12 text-center text-paper sm:px-12 sm:py-16">
        <h2 className="font-display text-4xl font-semibold">Have a place where students can learn?</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-paper/70">Register your organisation, publish a placement and immediately see how many students match your field.</p>
        <Link to="/register-company" className="mt-7 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-brand-foreground">Post an opportunity <ArrowRight size={16} /></Link>
      </section>
    </SiteShell>
  );
}
