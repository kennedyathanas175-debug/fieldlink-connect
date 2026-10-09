# FieldLink Connect

# AI Build Prompt — FieldLink TZ

Copy the block below into any AI web-builder tool (v0, Lovable, Bolt, Claude, etc.). Color palette is intentionally left open — the tool/designer should choose it.

---

Build a web app called **FieldLink TZ** — a national platform that connects students from ANY college or university across Tanzania with internship and field-placement (mafunzo kwa vitendo) opportunities at companies, organizations, and offices, matched by field of study rather than by institution.

**Core users:**
1. Students — from any college/university, not tied to one institution
2. Companies/Organizations/Offices — post internship opportunities

**Standardized Field Categories** (used for matching across all institutions, since course names differ by school):
1. Engineering & Technology (Electronics/Telecom, Civil, Mechanical, IT/Computer Science)
2. Business & Finance (Accounting, Marketing, Banking)
3. Health Sciences (Nursing, Pharmacy, Lab Sciences)
4. Education (Teaching, Curriculum)
5. Agriculture & Livestock (Agronomy, Veterinary)
6. Arts & Media (Journalism, Design, Film)
7. Law & Public Administration
8. Natural Sciences (Chemistry, Biology, Environment)

**Student registration flow (required fields):**
- Full name
- College/Institution name (free text — any institution, not a fixed dropdown)
- Field of study (select from the 8 categories above)
- Year of study
- Preferred region
- Phone number
- **Student ID photo upload — mandatory**, cannot submit the form without it. Note in the UI that the ID is used only to verify the student is legitimate and is not shown publicly to companies.

**Company registration flow (required fields):**
- Company/Office name
- Sector
- Region
- Contact (email or phone)

**Posting an internship (after company is registered):**
- Posting title
- Field required (select from the 8 categories)
- Number of slots
- Duration
- Application deadline
- Short description (optional)
- On submit, show how many currently-registered students match that field

**Browse/listings page:**
- Filterable by field and by region
- Each listing shows: title, company name, region, deadline, field badge, slot count, duration, description
- "Apply" action per listing — if no student is registered yet, redirect to student registration first

**Home page:**
- Hero introducing the platform's purpose: fast, nationwide field/internship matching by field of study, not by institution
- Visual grid/preview of the field categories (this is legitimate content to show as a grid, since the categories are the core of the matching system)
- Live counters: students registered, postings published
- Two clear calls to action: "Register as a Student" and "Post an Opportunity (Company)"

**Tone/copy:** Plain, direct, active voice. This is a utility tool for students and organizations, not a marketing site — avoid hype language.

**Technical notes:**
- Single cohesive app, responsive down to mobile
- Data can be in-memory/local state for a demo version; structure it so it's easy to swap in a real backend (students, companies, postings as separate collections) later
- Do not hardcode a specific color palette — choose one deliberately based on the subject matter (trust, opportunity, growth), avoiding generic AI-design defaults (cream+terracotta, near-black+neon accent, generic SaaS card kit)

---

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4bf6e313-1790-4238-b9b6-235a43e46cc6).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
