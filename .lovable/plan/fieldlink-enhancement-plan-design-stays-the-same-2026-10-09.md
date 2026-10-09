# FieldLink – Enhancement Plan (design stays the same)

All new screens reuse the current colors, fonts, cards and layout. No existing page is redesigned.

The app keeps its data in temporary memory right now, so it is wiped on refresh. Most of this request needs real saved data, real accounts, and logo uploads. The work is split into 4 phases. Each phase is tested before the next one starts.

## Phase 1 – Real accounts and saved data (foundation)
- Sign in with email and Google.
- Four roles: Student, Institution Admin, Organization, Super Admin. Roles are checked on the server, not in the browser.
- Students, institutions, organizations, postings, applications and certificates are saved in the database.
- The current demo passcode for /admin is replaced by the Super Admin role.
- The current pages (home, listings, register, post, journey, profile, admin) keep working the same way, but read real saved data.

## Phase 2 – Institutions and student networking
- Searchable list of institutions during student registration. Duplicate institutions are blocked. A Super Admin adds and edits institutions and their logos.
- The student profile shows the institution's name and logo, plus course, department, skills and placement status.
- New "Students at Your Institution" page: search and filter by institution, course, department and placement status. Phone numbers and ID photos are never shown.
- A privacy switch lets each student choose whether students from other institutions can see them.

## Phase 3 – Organizations, partners and placement tracking
- Organization registration with logo, industry, description, location, contact and website. Profiles stay hidden until a Super Admin approves them.
- An "Our Partners" strip on the home page with approved logos. Each organization gets a public page with its open opportunities.
- Placement tracking: application status, approval, host organization, training period, progress and completion.
- Organizations see only applications sent to them. Institution Admins see only their own students.

## Phase 4 – Analytics and certificates
- Institution section in the admin dashboard: cards, charts, searchable tables, and CSV export. PDF export is limited to certificates.
- Institution Admins see a dashboard for their own institution only.
- Certificates are created only after completion is approved. Each one shows the student's name, both logos, course and department, training period, issue date, signatory, a unique ID and a QR code.
- Admins can preview, download and print the PDF. A public /verify page checks a certificate ID and shows when a certificate has been revoked.

## Technical details
- Lovable Cloud: tables for institutions, students, organizations, postings, applications, certificates, and user_roles (enum + has_role security-definer). RLS on every table.
- Storage buckets: public `logos`, private `id-photos` (readable only by super admins and the student's institution admin).
- `src/lib/fieldlink.ts` stays the single data layer and its functions move to Cloud calls, so the pages change very little.
- Certificates are made in the browser with jsPDF + qrcode, using data from a server function that checks permissions. Verification goes through a public read-only server function that returns only safe fields.
- Tests are added for the role rules and for when a certificate is allowed.
