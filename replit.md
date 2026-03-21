# Project Overview

A modern blog/content platform with a CMS, built with React, Vite, TypeScript, Tailwind CSS, and Supabase.

## Architecture

- **Frontend**: Vite + React 18 + TypeScript, single-page app
- **UI**: Tailwind CSS + shadcn/ui component library
- **Auth & Database**: Supabase (external) — auth, Postgres, RLS policies, storage
- **State**: TanStack React Query + React Context (AuthContext, CmsContext)
- **Routing**: React Router v6

## Key Features

- Blog/article platform with categories, tags, comments, likes
- CMS dashboard (posts, media, categories, tags, comments, settings)
- Auth (email/password + Google OAuth via Supabase)
- Role-based access (admin, writer, reader)
- Dark/light theme toggle

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/public key |

## Dev Server

- Runs on port **5000** via `npm run dev`
- Workflow: "Start application"

## Supabase Schema

See `supabase/migrations/` for full schema. Tables: `profiles`, `user_roles`, `articles`, `comments`, `likes`, `comment_likes`. Storage bucket: `avatars`.

## Migration Notes (Lovable → Replit)

- Removed `@lovable.dev/cloud-auth-js` and `lovable-tagger` packages
- Removed `src/integrations/lovable/` — replaced with Supabase native OAuth
- Updated Vite config: port 5000, `host: "0.0.0.0"`, `allowedHosts: true`
- Supabase env vars stored as Replit shared env vars
