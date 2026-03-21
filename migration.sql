-- 1. Update Articles Table: Add 'status' and remove 'published' (Requires dropping dependencies first)

-- Let's first add the new 'status' column
ALTER TABLE public.articles ADD COLUMN status TEXT DEFAULT 'pending';

-- Map the existing 'published' boolean to the new 'status' column
UPDATE public.articles SET status = 'published' WHERE published = true;
UPDATE public.articles SET status = 'pending' WHERE published = false;

-- Drop the old RLS policies that rely on the 'published' column
DROP POLICY IF EXISTS "Public Read: Published Articles" ON public.articles;
DROP POLICY IF EXISTS "everyone_view_published_articles" ON public.articles;
DROP POLICY IF EXISTS "Published articles are viewable by everyone" ON public.articles;

-- Safely drop the 'published' column now
ALTER TABLE public.articles DROP COLUMN published;

-- Create the new RLS policy for reading articles based on status
CREATE POLICY "Public Read: Published Articles" ON public.articles FOR SELECT 
  USING (status = 'published' OR auth.uid() = author_id OR public.has_role(auth.uid(), 'admin'));

-- 2. Update Profiles Table: Add expertise and interests
ALTER TABLE public.profiles ADD COLUMN expertise TEXT;
ALTER TABLE public.profiles ADD COLUMN interests TEXT;

-- 3. Create Bookmarks Table
CREATE TABLE public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, article_id)
);

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own bookmarks" ON public.bookmarks 
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 4. Create Followers Table
CREATE TABLE public.followers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (follower_id, author_id)
);

ALTER TABLE public.followers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Followers are viewable by everyone" ON public.followers FOR SELECT USING (true);
CREATE POLICY "Users can follow/unfollow" ON public.followers 
  FOR ALL USING (auth.uid() = follower_id) WITH CHECK (auth.uid() = follower_id);
