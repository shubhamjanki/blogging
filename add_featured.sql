-- Run this in your Supabase SQL Editor to add the 'is_featured' column
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
