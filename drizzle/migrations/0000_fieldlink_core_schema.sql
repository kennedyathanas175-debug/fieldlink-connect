CREATE TYPE public.app_role AS ENUM ('student','institution_admin','organization','super_admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "own roles readable" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'super_admin'));
CREATE POLICY "super admin manages roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'super_admin')) WITH CHECK (public.has_role(auth.uid(),'super_admin'));

CREATE TABLE public.institutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  region text,
  logo_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX institutions_name_unique ON public.institutions (lower(trim(name)));
GRANT SELECT ON public.institutions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.institutions TO authenticated;
GRANT ALL ON public.institutions TO service_role;
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "institutions public read" ON public.institutions FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "super admin manages institutions" ON public.institutions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'super_admin')) WITH CHECK (public.has_role(auth.uid(),'super_admin'));

CREATE TABLE public.institution_admins (
  user_id uuid NOT NULL,
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, institution_id)
);
GRANT SELECT ON public.institution_admins TO authenticated;
GRANT ALL ON public.institution_admins TO service_role;
ALTER TABLE public.institution_admins ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_institution_admin(_user_id uuid, _institution_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.institution_admins WHERE user_id = _user_id AND institution_id = _institution_id)
$$;

CREATE POLICY "own institution admin rows" ON public.institution_admins FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'super_admin'));
CREATE POLICY "super admin manages institution admins" ON public.institution_admins FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'super_admin')) WITH CHECK (public.has_role(auth.uid(),'super_admin'));

CREATE TABLE public.students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  institution_id uuid REFERENCES public.institutions(id),
  full_name text NOT NULL,
  course text NOT NULL DEFAULT '',
  department text NOT NULL DEFAULT '',
  skills text[] NOT NULL DEFAULT '{}',
  field text NOT NULL,
  year text NOT NULL,
  region text NOT NULL,
  phone text NOT NULL,
  id_photo_path text,
  linkedin_url text NOT NULL DEFAULT '',
  bio text NOT NULL DEFAULT '',
  visible_to_other_institutions boolean NOT NULL DEFAULT true,
  verified boolean NOT NULL DEFAULT false,
  placement_status text NOT NULL DEFAULT 'not_started',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.students TO authenticated;
GRANT ALL ON public.students TO service_role;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "student manages own row" ON public.students FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "super admin all students" ON public.students FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'super_admin')) WITH CHECK (public.has_role(auth.uid(),'super_admin'));
CREATE POLICY "institution admin reads own students" ON public.students FOR SELECT TO authenticated
  USING (institution_id IS NOT NULL AND public.is_institution_admin(auth.uid(), institution_id));
CREATE POLICY "institution admin updates own students" ON public.students FOR UPDATE TO authenticated
  USING (institution_id IS NOT NULL AND public.is_institution_admin(auth.uid(), institution_id))
  WITH CHECK (institution_id IS NOT NULL AND public.is_institution_admin(auth.uid(), institution_id));

CREATE TABLE public.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  name text NOT NULL,
  logo_url text,
  industry text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  region text NOT NULL,
  contact text NOT NULL,
  website text NOT NULL DEFAULT '',
  approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX organizations_name_unique ON public.organizations (lower(trim(name)));
GRANT SELECT ON public.organizations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.organizations TO authenticated;
GRANT ALL ON public.organizations TO service_role;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "approved organizations public" ON public.organizations FOR SELECT TO anon, authenticated USING (approved = true);
CREATE POLICY "owner reads own organization" ON public.organizations FOR SELECT TO authenticated USING (owner_id = auth.uid());
CREATE POLICY "owner creates organization" ON public.organizations FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid() AND approved = false);
CREATE POLICY "owner updates organization" ON public.organizations FOR UPDATE TO authenticated
  USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());
CREATE POLICY "super admin all organizations" ON public.organizations FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'super_admin')) WITH CHECK (public.has_role(auth.uid(),'super_admin'));

CREATE OR REPLACE FUNCTION public.prevent_self_approval()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.approved IS DISTINCT FROM OLD.approved AND NOT public.has_role(auth.uid(),'super_admin') THEN
    NEW.approved := OLD.approved;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER organizations_approval_guard BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.prevent_self_approval();

CREATE OR REPLACE FUNCTION public.owns_organization(_user_id uuid, _org_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.organizations WHERE id = _org_id AND owner_id = _user_id)
$$;

CREATE TABLE public.postings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title text NOT NULL,
  field text NOT NULL,
  slots integer NOT NULL DEFAULT 1,
  duration text NOT NULL,
  deadline date NOT NULL,
  region text NOT NULL,
  description text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.postings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.postings TO authenticated;
GRANT ALL ON public.postings TO service_role;
ALTER TABLE public.postings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "postings public read" ON public.postings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "org owner manages postings" ON public.postings FOR ALL TO authenticated
  USING (public.owns_organization(auth.uid(), organization_id))
  WITH CHECK (public.owns_organization(auth.uid(), organization_id));
CREATE POLICY "super admin all postings" ON public.postings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'super_admin')) WITH CHECK (public.has_role(auth.uid(),'super_admin'));

CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  posting_id uuid NOT NULL REFERENCES public.postings(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  stage integer NOT NULL DEFAULT 2,
  start_date date,
  end_date date,
  completion_approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (posting_id, student_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.applications TO authenticated;
GRANT ALL ON public.applications TO service_role;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_own_student(_user_id uuid, _student_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.students WHERE id = _student_id AND user_id = _user_id)
$$;
CREATE OR REPLACE FUNCTION public.can_see_application(_user_id uuid, _posting_id uuid, _student_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.postings p JOIN public.organizations o ON o.id = p.organization_id
                 WHERE p.id = _posting_id AND o.owner_id = _user_id)
      OR EXISTS (SELECT 1 FROM public.students s JOIN public.institution_admins ia ON ia.institution_id = s.institution_id
                 WHERE s.id = _student_id AND ia.user_id = _user_id)
$$;

CREATE POLICY "student reads own applications" ON public.applications FOR SELECT TO authenticated
  USING (public.is_own_student(auth.uid(), student_id));
CREATE POLICY "student applies" ON public.applications FOR INSERT TO authenticated
  WITH CHECK (public.is_own_student(auth.uid(), student_id) AND stage = 2 AND completion_approved = false);
CREATE POLICY "org and institution read applications" ON public.applications FOR SELECT TO authenticated
  USING (public.can_see_application(auth.uid(), posting_id, student_id));
CREATE POLICY "org and institution update applications" ON public.applications FOR UPDATE TO authenticated
  USING (public.can_see_application(auth.uid(), posting_id, student_id))
  WITH CHECK (public.can_see_application(auth.uid(), posting_id, student_id));
CREATE POLICY "super admin all applications" ON public.applications FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'super_admin')) WITH CHECK (public.has_role(auth.uid(),'super_admin'));

CREATE TABLE public.certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  application_id uuid NOT NULL UNIQUE REFERENCES public.applications(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  signatory_name text NOT NULL,
  signatory_title text NOT NULL,
  issued_at timestamptz NOT NULL DEFAULT now(),
  revoked boolean NOT NULL DEFAULT false
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.certificates TO authenticated;
GRANT ALL ON public.certificates TO service_role;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "student reads own certificates" ON public.certificates FOR SELECT TO authenticated
  USING (public.is_own_student(auth.uid(), student_id));
CREATE POLICY "super admin manages certificates" ON public.certificates FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'super_admin')) WITH CHECK (public.has_role(auth.uid(),'super_admin'));