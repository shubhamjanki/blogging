-- Drop old policies to avoid conflicts
DROP POLICY IF EXISTS "Writers and admins can create articles" ON public.articles;
DROP POLICY IF EXISTS "Authors and admins can update articles" ON public.articles;
DROP POLICY IF EXISTS "Authors and admins can delete articles" ON public.articles;
DROP POLICY IF EXISTS "Public Read: Published Articles" ON public.articles;

-- 1. SELECT Policy: Everyone can see published, authors/admins can see all
CREATE POLICY "Articles Select Policy" ON public.articles FOR SELECT 
  USING (status = 'published' OR auth.uid() = author_id OR public.has_role(auth.uid(), 'admin'));

-- 2. INSERT Policy: Writers and Admins can create
CREATE POLICY "Articles Insert Policy" ON public.articles FOR INSERT 
  WITH CHECK (
    (public.has_role(auth.uid(), 'writer') OR public.has_role(auth.uid(), 'admin'))
    AND (auth.uid() = author_id)
  );

-- 3. UPDATE Policy: Authors can update own, Admins can update all
CREATE POLICY "Articles Update Policy" ON public.articles FOR UPDATE
  USING (auth.uid() = author_id OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (auth.uid() = author_id OR public.has_role(auth.uid(), 'admin'));

-- 4. DELETE Policy: Authors can delete own, Admins can delete all
CREATE POLICY "Articles Delete Policy" ON public.articles FOR DELETE
  USING (auth.uid() = author_id OR public.has_role(auth.uid(), 'admin'));

-- Also ensure the handle_new_user trigger correctly handles 'writer'
-- (This is just a double-check if trigger_update.sql was already run)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  assigned_role app_role;
BEGIN
  INSERT INTO public.profiles (user_id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );

  -- Use 'writer' if the metadata says writer, otherwise 'reader'
  IF NEW.raw_user_meta_data->>'role' = 'writer' THEN
    assigned_role := 'writer';
  ELSE
    assigned_role := 'reader';
  END IF;

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, assigned_role);
  RETURN NEW;
END;
$$;
