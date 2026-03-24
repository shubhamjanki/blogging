-- ============================================================
-- Migration: Add status column, is_featured, bookmarks,
--            followers, comment status, article-images bucket
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Add status column to articles
ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'scheduled', 'archived', 'pending', 'rejected'));

-- Migrate existing published boolean → status string
UPDATE public.articles
  SET status = CASE WHEN published = true THEN 'published' ELSE 'draft' END
  WHERE status = 'draft';

-- 2. Add is_featured column to articles
ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false;

-- 3. Update articles RLS to use the new status column
DROP POLICY IF EXISTS "Published articles are viewable by everyone" ON public.articles;
CREATE POLICY "Published articles are viewable by everyone"
  ON public.articles FOR SELECT
  USING (status = 'published' OR auth.uid() = author_id OR public.has_role(auth.uid(), 'admin'));

-- 4. Add status column to comments for moderation
ALTER TABLE public.comments
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'approved'
    CHECK (status IN ('pending', 'approved', 'spam'));

-- Update comments visibility policy to filter by status
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON public.comments;
CREATE POLICY "Comments are viewable by everyone"
  ON public.comments FOR SELECT
  USING (status = 'approved' OR auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- 5. Create bookmarks table
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (article_id, user_id)
);

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookmarks"
  ON public.bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can bookmark articles"
  ON public.bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove their bookmarks"
  ON public.bookmarks FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_article ON public.bookmarks(article_id);

-- 6. Create followers table
CREATE TABLE IF NOT EXISTS public.followers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (author_id, follower_id)
);

ALTER TABLE public.followers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Followers are viewable by everyone"
  ON public.followers FOR SELECT USING (true);
CREATE POLICY "Users can follow authors"
  ON public.followers FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can unfollow authors"
  ON public.followers FOR DELETE USING (auth.uid() = follower_id);

CREATE INDEX IF NOT EXISTS idx_followers_author ON public.followers(author_id);
CREATE INDEX IF NOT EXISTS idx_followers_follower ON public.followers(follower_id);

-- 7. Create article-images storage bucket
INSERT INTO storage.buckets (id, name, public)
  VALUES ('article-images', 'article-images', true)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY IF NOT EXISTS "Users can upload article images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'article-images' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY IF NOT EXISTS "Article images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'article-images');

CREATE POLICY IF NOT EXISTS "Users can delete their own article images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'article-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- 8. Add full-text search index for articles
CREATE INDEX IF NOT EXISTS idx_articles_fts
  ON public.articles USING gin(to_tsvector('english', title || ' ' || coalesce(excerpt, '') || ' ' || coalesce(category, '')));
