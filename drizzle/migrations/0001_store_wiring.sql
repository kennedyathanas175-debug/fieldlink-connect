ALTER TABLE public.students ADD COLUMN IF NOT EXISTS institution_name text NOT NULL DEFAULT '';
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS work_samples jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS id_photo_name text NOT NULL DEFAULT '';
ALTER TABLE public.postings ADD COLUMN IF NOT EXISTS organization_name text NOT NULL DEFAULT '';

CREATE OR REPLACE FUNCTION public.public_stats()
RETURNS json LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT json_build_object(
    'students', (SELECT count(*) FROM public.students),
    'postings', (SELECT count(*) FROM public.postings),
    'by_field', COALESCE((SELECT json_object_agg(field, n) FROM (SELECT field, count(*) n FROM public.students GROUP BY field) t), '{}'::json)
  )
$$;
GRANT EXECUTE ON FUNCTION public.public_stats() TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.org_sees_student(_user_id uuid, _student_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.applications a
    JOIN public.postings p ON p.id = a.posting_id
    JOIN public.organizations o ON o.id = p.organization_id
    WHERE a.student_id = _student_id AND o.owner_id = _user_id)
$$;
CREATE POLICY "org reads applicant students" ON public.students FOR SELECT TO authenticated
  USING (public.org_sees_student(auth.uid(), id));

CREATE POLICY "student uploads own id photo" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'id-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "student reads own id photo" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'id-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "super admin reads id photos" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'id-photos' AND public.has_role(auth.uid(), 'super_admin'));