# Project Overview

"My Kind of Copy" — a modern role-based technical blogging platform built with React 18 + Vite + TypeScript, Tailwind CSS, shadcn/ui, TanStack Query, and Supabase (auth, PostgreSQL, Storage).

## Architecture

- **Frontend**: Vite + React 18 + TypeScript, single-page app
- **UI**: Tailwind CSS + shadcn/ui component library
- **Auth & Database**: Supabase (external) — auth, Postgres, RLS policies, storage
- **State**: React Context (AuthContext, CmsContext)
- **Routing**: React Router v6
- **XSS Protection**: DOMPurify (installed) — all article HTML is sanitized before rendering

## Key Features

- Blog/article platform with categories, tags, comments, likes, bookmarks, follow authors
- CMS dashboard (posts, media library via Supabase Storage, categories/tags, comments, settings)
- Auth (email/password + Google OAuth via Supabase)
- Role-based access (admin, writer, reader)
- Dark/light theme toggle
- Search (uses `published=true` filter)

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/public key |

## Dev Server

- Runs on port **5000** via `npm run dev`
- Workflow: "Start application"

## Supabase Schema

See `supabase/migrations/` for full schema.

### Tables (current DB):
- `profiles` — user profiles
- `user_roles` — role assignments (admin/writer/reader)
- `articles` — blog articles (`published BOOLEAN`, fallback until migration)
- `comments` — article comments
- `likes` — article likes
- Storage bucket: `avatars` (also used for article-images under `{user_id}/article-images/`)

### Pending migration (`supabase/migrations/20260324_add_status_bookmarks_followers.sql`):
Run this in the Supabase SQL Editor to unlock full functionality:
- `status TEXT` column on articles (enum: draft/published/scheduled/archived/pending/rejected)
- `is_featured BOOLEAN` column on articles
- `bookmarks` table + RLS
- `followers` table + RLS
- `status TEXT` column on comments (for moderation: pending/approved/spam)
- `article-images` storage bucket with upload policies
- FTS index on articles

**Until migration runs:** The app falls back to the `published BOOLEAN` column. Articles must be saved/published via the CMS — the `published` boolean is always set correctly alongside the `status` string. Search and homepage filtering both work with `published=true`.

## Code Architecture Notes

### CmsContext
- Fetches all articles from Supabase on mount
- Status mapping: uses `status` column if present (post-migration), falls back to `published ? "published" : "draft"`
- No seed/fake data — all content comes from real DB
- Settings persisted to localStorage under key `cms_settings`

### ArticlePage
- Article HTML rendered via `DOMPurify.sanitize()` — XSS safe
- Comments use a single joined Supabase query (no N+1 loops)
- Comment likes removed (they caused N+1 and low value)
- Bookmarks/follow: graceful try/catch, shows error toast if migration hasn't run

### CMS Pages
- **CmsComments**: Fetches real comments from Supabase with profile + article joins
- **CmsMediaLibrary**: Real file upload to Supabase Storage (`avatars` bucket, `{uid}/article-images/` path). Lists and deletes real files.
- **CmsCategoriesTags**: Derived from real article data — no dedicated table needed
- **CmsSettings**: Persisted to localStorage, survives page refresh
- **CmsPostEditor**: `published` boolean always set; `status` also written for post-migration compat; form re-initializes correctly when editing post via direct URL

### Newsletter
- Shows a one-time success state after submission
- No backend connected — email stored only in component state until a real email service is integrated

## Migration Notes (Lovable → Replit)

- Removed `@lovable.dev/cloud-auth-js` and `lovable-tagger` packages
- Removed `src/integrations/lovable/` — replaced with Supabase native OAuth
- Updated Vite config: port 5000, `host: "0.0.0.0"`, `allowedHosts: true`
- Supabase env vars stored as Replit shared env vars
- Installed: `dompurify`, `@types/dompurify`
