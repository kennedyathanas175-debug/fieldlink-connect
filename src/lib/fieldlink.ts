import { useSyncExternalStore } from "react";

/**
 * Demo data layer. Everything lives in memory in three separate collections
 * (students, companies, postings) so a real backend can be swapped in later
 * by replacing the mutation functions below.
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
  FIELDS.find((f) => f.id === id) ?? FIELDS[0];

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
  fullName: string;
  institution: string;
  field: FieldId;
  year: string;
  region: string;
  phone: string;
  /** Object URL of the uploaded ID photo. Never shown to companies. */
  idPhotoName: string;
  createdAt: number;
}

export interface Company {
  id: string;
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

interface DB {
  students: Student[];
  companies: Company[];
  postings: Posting[];
  applications: Application[];
}

const uid = () => Math.random().toString(36).slice(2, 10);

const seedCompanies: Company[] = [
  {
    id: "c1",
    name: "Kilimanjaro Telecom Ltd",
    sector: "Private company",
    region: "Dar es Salaam",
    contact: "placements@kilitelecom.co.tz",
    createdAt: Date.now(),
  },
  {
    id: "c2",
    name: "Ngorongoro Credit Union",
    sector: "Bank / Financial institution",
    region: "Arusha",
    contact: "+255 754 112 330",
    createdAt: Date.now(),
  },
  {
    id: "c3",
    name: "Dodoma District Hospital",
    sector: "Hospital / Health facility",
    region: "Dodoma",
    contact: "training@ddh.go.tz",
    createdAt: Date.now(),
  },
  {
    id: "c4",
    name: "Kilimanjaro Coffee Company",
    sector: "Private company",
    region: "Kilimanjaro",
    contact: "hr@kilicoffee.co.tz",
    createdAt: Date.now(),
  },
  {
    id: "c5",
    name: "Mwanza Regional Council",
    sector: "Government office",
    region: "Mwanza",
    contact: "internships@mwanzarc.go.tz",
    createdAt: Date.now(),
  },
];

const seedPostings: Posting[] = [
  {
    id: "p1",
    companyId: "c1",
    companyName: "Kilimanjaro Telecom Ltd",
    title: "Embedded Systems Intern",
    field: "engineering",
    slots: 3,
    duration: "3 months",
    deadline: "2026-06-18",
    region: "Dar es Salaam",
    description:
      "Work with the transmission team on device firmware and site testing across the regional network.",
    createdAt: Date.now(),
  },
  {
    id: "p2",
    companyId: "c2",
    companyName: "Ngorongoro Credit Union",
    title: "Audit & Reporting Intern",
    field: "business",
    slots: 2,
    duration: "4 months",
    deadline: "2026-07-02",
    region: "Arusha",
    description:
      "Support quarterly reconciliations, member account reviews and branch reporting.",
    createdAt: Date.now(),
  },
  {
    id: "p3",
    companyId: "c4",
    companyName: "Kilimanjaro Coffee Company",
    title: "Agronomy Field Placement",
    field: "agriculture",
    slots: 5,
    duration: "6 months",
    deadline: "2026-06-25",
    region: "Kilimanjaro",
    description:
      "Rotate through nursery management, soil sampling and smallholder farmer extension visits.",
    createdAt: Date.now(),
  },
  {
    id: "p4",
    companyId: "c3",
    companyName: "Dodoma District Hospital",
    title: "Clinical Nursing Placement",
    field: "health",
    slots: 8,
    duration: "10 weeks",
    deadline: "2026-06-30",
    region: "Dodoma",
    description:
      "Supervised rotation across the ward, laboratory and pharmacy units.",
    createdAt: Date.now(),
  },
  {
    id: "p5",
    companyId: "c5",
    companyName: "Mwanza Regional Council",
    title: "Public Administration Attachment",
    field: "law",
    slots: 4,
    duration: "3 months",
    deadline: "2026-07-15",
    region: "Mwanza",
    description:
      "Assist the legal and records unit with by-law drafting support and public filing.",
    createdAt: Date.now(),
  },
];

const seedStudents: Student[] = Array.from({ length: 42 }, (_, i) => ({
  id: `s${i}`,
  fullName: `Student ${i + 1}`,
  institution: "Registered institution",
  field: FIELDS[i % FIELDS.length].id,
  year: YEARS[i % YEARS.length],
  region: REGIONS[i % REGIONS.length],
  phone: "+255 7XX XXX XXX",
  idPhotoName: "verified.jpg",
  createdAt: Date.now(),
}));

let db: DB = {
  students: seedStudents,
  companies: seedCompanies,
  postings: seedPostings,
  applications: [],
};

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const getSnapshot = () => db;

export function useDB(): DB {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/** The student registered in this browser session, if any. */
let currentStudentId: string | null = null;
let currentCompanyId: string | null = null;

export const getCurrentStudentId = () => currentStudentId;
export const getCurrentCompanyId = () => currentCompanyId;

export function addStudent(input: Omit<Student, "id" | "createdAt">) {
  const student: Student = { ...input, id: uid(), createdAt: Date.now() };
  db = { ...db, students: [...db.students, student] };
  currentStudentId = student.id;
  emit();
  return student;
}

export function addCompany(input: Omit<Company, "id" | "createdAt">) {
  const company: Company = { ...input, id: uid(), createdAt: Date.now() };
  db = { ...db, companies: [...db.companies, company] };
  currentCompanyId = company.id;
  emit();
  return company;
}

export function addPosting(input: Omit<Posting, "id" | "createdAt">) {
  const posting: Posting = { ...input, id: uid(), createdAt: Date.now() };
  db = { ...db, postings: [...db.postings, posting] };
  emit();
  return posting;
}

export function countStudentsInField(field: FieldId) {
  return db.students.filter((s) => s.field === field).length;
}

export function addApplication(posting: Posting, studentId: string) {
  if (db.applications.some((a) => a.postingId === posting.id && a.studentId === studentId)) {
    return db.applications.find((a) => a.postingId === posting.id && a.studentId === studentId)!;
  }
  const application: Application = {
    id: uid(),
    postingId: posting.id,
    postingTitle: posting.title,
    companyName: posting.companyName,
    studentId,
    stage: 2, // profile created + matched + applied
    createdAt: Date.now(),
  };
  db = { ...db, applications: [...db.applications, application] };
  emit();
  return application;
}

export function advanceApplication(id: string) {
  db = {
    ...db,
    applications: db.applications.map((a) =>
      a.id === id ? { ...a, stage: Math.min(a.stage + 1, FINAL_STAGE) } : a,
    ),
  };
  emit();
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
