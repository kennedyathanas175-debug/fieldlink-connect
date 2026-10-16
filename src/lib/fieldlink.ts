import { useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Shared data layer. All collections are saved in the backend; access rules
 * decide which rows each signed-in user can read or change.
 */

export type FieldId =
  | "engineering"
  | "business"
  | "health"
  | "education"
  | "agriculture"
  | "arts"
  | "law"
  | "science";

export interface FieldCategory {
  id: FieldId;
  index: string;
  name: string;
  short: string;
  examples: string;
}

export const FIELDS: FieldCategory[] = [
  {
    id: "engineering",
    index: "01",
    name: "Engineering & Technology",
    short: "Engineering",
    examples: "Electronics/Telecom, Civil, Mechanical, IT/Computer Science",
  },
  {
    id: "business",
    index: "02",
    name: "Business & Finance",
    short: "Business",
    examples: "Accounting, Marketing, Banking",
  },
  {
    id: "health",
    index: "03",
    name: "Health Sciences",
    short: "Health",
    examples: "Nursing, Pharmacy, Lab Sciences",
  },
  {
    id: "education",
    index: "04",
    name: "Education",
    short: "Education",
    examples: "Teaching, Curriculum",
  },
  {
    id: "agriculture",
    index: "05",
    name: "Agriculture & Livestock",
    short: "Agriculture",
    examples: "Agronomy, Veterinary",
  },
  {
    id: "arts",
    index: "06",
    name: "Arts & Media",
    short: "Arts",
    examples: "Journalism, Design, Film",
  },
  {
    id: "law",
    index: "07",
    name: "Law & Public Administration",
    short: "Law",
    examples: "Law, Public Administration",
  },
  {
    id: "science",
    index: "08",
    name: "Natural Sciences",
    short: "Science",
    examples: "Chemistry, Biology, Environment",
  },
];

export const fieldById = (id: FieldId) =>
  FIELDS.find((f) => f.id === id) ?? FIELDS[0]!;

export const REGIONS = [
  "Arusha",
  "Dar es Salaam",
  "Dodoma",
  "Geita",
  "Iringa",
  "Kagera",
  "Katavi",
  "Kigoma",
  "Kilimanjaro",
  "Lindi",
  "Manyara",
  "Mara",
  "Mbeya",
  "Morogoro",
  "Mtwara",
  "Mwanza",
  "Njombe",
  "Pemba North",
  "Pemba South",
  "Pwani",
  "Rukwa",
  "Ruvuma",
  "Shinyanga",
  "Simiyu",
  "Singida",
  "Songwe",
  "Tabora",
  "Tanga",
  "Unguja North",
  "Unguja South",
];

export const YEARS = ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5"];

export const SECTORS = [
  "Private company",
  "Government office",
  "NGO / Non-profit",
  "Hospital / Health facility",
  "School / College",
  "Bank / Financial institution",
  "Media house",
  "Other",
];

export interface Student {
  id: string;
  userId?: string;
  fullName: string;
  institution: string;
  field: FieldId;
  year: string;
  region: string;
  phone: string;
  /** Object URL of the uploaded ID photo. Never shown to companies. */
  idPhotoName: string;
  /** Preview URL of the ID photo for admin review only. */
  idPhotoUrl?: string | undefined;
  linkedinUrl: string;
  bio: string;
  workSamples: WorkSample[];
  /** Admin-verified via the student ID photo check. */
  verified: boolean;
  createdAt: number;
}

export interface WorkSample {
  id: string;
  title: string;
  description: string;
  link: string;
}

export interface Company {
  id: string;
  ownerId?: string;
  approved?: boolean;
  name: string;
  sector: string;
  region: string;
  contact: string;
  createdAt: number;
}

export interface Posting {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  field: FieldId;
  slots: number;
  duration: string;
  deadline: string;
  region: string;
  description: string;
  createdAt: number;
}

export interface Application {
  id: string;
  postingId: string;
  postingTitle: string;
  companyName: string;
  studentId: string;
  /** Index into JOURNEY_STAGES. */
  stage: number;
  createdAt: number;
}

/** The full student lifecycle, end to end. */
export const JOURNEY_STAGES = [
  "Create Profile",
  "Search / Get Matched",
  "Apply",
  "Institution Approval",
  "Company Review",
  "Accepted",
  "Placement Letter",
  "Start Field / Internship",
  "Attendance / Logbook",
  "Supervisor Evaluation",
  "Completion",
  "Digital Certificate / Experience Record",
] as const;

export const FINAL_STAGE = JOURNEY_STAGES.length - 1;

export interface Stats {
  students: number;
  postings: number;
  byField: Partial<Record<FieldId, number>>;
}

interface DB {
  /** Rows the signed-in user is allowed to see (access rules decide the scope). */
  students: Student[];
  companies: Company[];
  postings: Posting[];
  applications: Application[];
  /** Platform-wide public counts. */
  stats: Stats;
  userId: string | null;
  loaded: boolean;
}

let db: DB = {
  students: [],
  companies: [],
  postings: [],
  applications: [],
  stats: { students: 0, postings: 0, byField: {} },
  userId: null,
  loaded: false,
};

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const getSnapshot = () => db;
const getServerSnapshot = () => db;

let started = false;
function start() {
  if (started || typeof window === "undefined") return;
  started = true;
  void refresh();
  supabase.auth.onAuthStateChange((event) => {
    if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") void refresh();
  });
}

export function useDB(): DB {
  start();
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

const ts = (v: string) => new Date(v).getTime();

/** Reload every collection from the backend. */
export async function refresh() {
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id ?? null;
  const [st, org, post, app, stats] = await Promise.all([
    supabase.from("students").select("*"),
    supabase.from("organizations").select("*"),
    supabase.from("postings").select("*").order("created_at", { ascending: false }),
    userId ? supabase.from("applications").select("*") : Promise.resolve({ data: [] as never[] }),
    supabase.rpc("public_stats"),
  ]);

  const studentRows = st.data ?? [];
  const paths = studentRows.map((r) => r.id_photo_path).filter((x): x is string => !!x);
  const urls = new Map<string, string>();
  if (userId && paths.length) {
    const { data } = await supabase.storage.from("id-photos").createSignedUrls(paths, 3600);
    data?.forEach((d) => d.signedUrl && d.path && urls.set(d.path, d.signedUrl));
  }

  const postings: Posting[] = (post.data ?? []).map((r) => ({
    id: r.id,
    companyId: r.organization_id,
    companyName: r.organization_name,
    title: r.title,
    field: r.field as FieldId,
    slots: r.slots,
    duration: r.duration,
    deadline: r.deadline,
    region: r.region,
    description: r.description,
    createdAt: ts(r.created_at),
  }));
  const pmap = new Map(postings.map((p) => [p.id, p]));
  const s = (stats.data ?? {}) as { students?: number; postings?: number; by_field?: Stats["byField"] };

  db = {
    userId,
    loaded: true,
    stats: { students: s.students ?? 0, postings: s.postings ?? 0, byField: s.by_field ?? {} },
    postings,
    students: studentRows.map((r) => ({
      id: r.id,
      userId: r.user_id,
      fullName: r.full_name,
      institution: r.institution_name,
      field: r.field as FieldId,
      year: r.year,
      region: r.region,
      phone: r.phone,
      idPhotoName: r.id_photo_name,
      idPhotoUrl: r.id_photo_path ? urls.get(r.id_photo_path) : undefined,
      linkedinUrl: r.linkedin_url,
      bio: r.bio,
      workSamples: (r.work_samples as unknown as WorkSample[]) ?? [],
      verified: r.verified,
      createdAt: ts(r.created_at),
    })),
    companies: (org.data ?? []).map((r) => ({
      id: r.id,
      ownerId: r.owner_id,
      name: r.name,
      sector: r.industry,
      region: r.region,
      contact: r.contact,
      approved: r.approved,
      createdAt: ts(r.created_at),
    })),
    applications: (app.data ?? []).map((r) => {
      const p = pmap.get(r.posting_id);
      return {
        id: r.id,
        postingId: r.posting_id,
        postingTitle: p?.title ?? "Removed posting",
        companyName: p?.companyName ?? "",
        studentId: r.student_id,
        stage: r.stage,
        createdAt: ts(r.created_at),
      };
    }),
  };
  emit();
}

function fail(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

/** The signed-in user's student record id, if any. */
export const getCurrentStudentId = () =>
  db.students.find((s) => s.userId && s.userId === db.userId)?.id ?? null;
export const getCurrentCompanyId = () =>
  db.companies.find((c) => c.ownerId && c.ownerId === db.userId)?.id ?? null;

export async function addStudent(
  input: Omit<Student, "id" | "createdAt" | "verified" | "idPhotoUrl" | "userId">,
  idPhoto: File,
) {
  if (!db.userId) throw new Error("Please sign in first.");
  const path = `${db.userId}/${Date.now()}-${idPhoto.name.replace(/[^\w.-]/g, "_")}`;
  const up = await supabase.storage.from("id-photos").upload(path, idPhoto);
  fail(up.error);
  const { error } = await supabase.from("students").insert({
    user_id: db.userId,
    full_name: input.fullName,
    institution_name: input.institution,
    field: input.field,
    year: input.year,
    region: input.region,
    phone: input.phone,
    id_photo_path: path,
    id_photo_name: input.idPhotoName,
    linkedin_url: input.linkedinUrl,
    bio: input.bio,
    work_samples: input.workSamples as never,
  });
  fail(error);
  await refresh();
}

export async function updateStudentProfile(studentId: string, input: Pick<Student, "linkedinUrl" | "bio">) {
  const { error } = await supabase
    .from("students")
    .update({ linkedin_url: input.linkedinUrl, bio: input.bio })
    .eq("id", studentId);
  fail(error);
  await refresh();
}

export async function addWorkSample(studentId: string, input: Omit<WorkSample, "id">) {
  const student = db.students.find((s) => s.id === studentId);
  if (!student) return;
  const samples = [...student.workSamples, { ...input, id: crypto.randomUUID() }];
  const { error } = await supabase.from("students").update({ work_samples: samples as never }).eq("id", studentId);
  fail(error);
  await refresh();
}

export async function addCompany(input: Pick<Company, "name" | "sector" | "region" | "contact">) {
  if (!db.userId) throw new Error("Please sign in first.");
  const { error } = await supabase.from("organizations").insert({
    owner_id: db.userId,
    name: input.name,
    industry: input.sector,
    region: input.region,
    contact: input.contact,
  });
  fail(error);
  await refresh();
}

export async function addPosting(input: Omit<Posting, "id" | "createdAt">) {
  const { error } = await supabase.from("postings").insert({
    organization_id: input.companyId,
    organization_name: input.companyName,
    title: input.title,
    field: input.field,
    slots: input.slots,
    duration: input.duration,
    deadline: input.deadline,
    region: input.region,
    description: input.description,
  });
  fail(error);
  await refresh();
}

export function countStudentsInField(field: FieldId) {
  return db.stats.byField[field] ?? 0;
}

export async function addApplication(posting: Posting, studentId: string) {
  if (db.applications.some((a) => a.postingId === posting.id && a.studentId === studentId)) return;
  const { error } = await supabase
    .from("applications")
    .insert({ posting_id: posting.id, student_id: studentId, stage: 2 });
  fail(error);
  await refresh();
}

export async function setApplicationStage(id: string, stage: number) {
  const { error } = await supabase
    .from("applications")
    .update({ stage: Math.max(0, Math.min(stage, FINAL_STAGE)) })
    .eq("id", id);
  fail(error);
  await refresh();
}

export async function advanceApplication(id: string) {
  const a = db.applications.find((x) => x.id === id);
  if (a) await setApplicationStage(id, a.stage + 1);
}

export async function setStudentVerified(studentId: string, verified: boolean) {
  const { error } = await supabase.from("students").update({ verified }).eq("id", studentId);
  fail(error);
  await refresh();
}

export async function setCompanyApproved(companyId: string, approved: boolean) {
  const { error } = await supabase.from("organizations").update({ approved }).eq("id", companyId);
  fail(error);
  await refresh();
}

export async function removeStudent(studentId: string) {
  await supabase.from("applications").delete().eq("student_id", studentId);
  const { error } = await supabase.from("students").delete().eq("id", studentId);
  fail(error);
  await refresh();
}

export async function removePosting(postingId: string) {
  await supabase.from("applications").delete().eq("posting_id", postingId);
  const { error } = await supabase.from("postings").delete().eq("id", postingId);
  fail(error);
  await refresh();
}

export async function removeCompany(companyId: string) {
  const ids = db.postings.filter((p) => p.companyId === companyId).map((p) => p.id);
  if (ids.length) {
    await supabase.from("applications").delete().in("posting_id", ids);
    await supabase.from("postings").delete().eq("organization_id", companyId);
  }
  const { error } = await supabase.from("organizations").delete().eq("id", companyId);
  fail(error);
  await refresh();
}

export function formatDeadline(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
