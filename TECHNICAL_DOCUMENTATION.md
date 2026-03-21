# Technical Documentation: Role-Based Blogging Platform

---

## 📁 1. Project Overview

**Product Name:** My Kind of Copy (Blogging Platform)  
**Tagline:** A modern, role-based technical blogging platform powered by React and Supabase.  
**Purpose:** To empower creators, administrators, and readers with a seamless content ecosystem featuring strict publishing workflows, deep social interactions, and a beautiful, high-performance UI.

**Problem it Solves:** Traditional CMS platforms are often bloated, requiring complex server setups and plugin ecosystems. This platform provides an immediate, zero-configuration React SPA that ties directly into a secure PostgreSQL database, offering robust Role-Based Access Control (RBAC) out of the box. 

**Target Users:**
1. **Admins:** Site owners who manage user roles, moderate comments, and approve/reject pending article submissions.
2. **Authors (Writers):** Content creators who draft, edit, and submit articles for review.
3. **Readers:** Consumers who read published posts, follow authors, leave comments, and bookmark articles.

**High-Level Architecture Summary:**
A Single Page Application (SPA) built with Vite and React, authenticating directly against Supabase (providing PostgreSQL, Auth, and Storage). State is managed via React Context (moving towards React Query), and data access is tightly controlled by PostgreSQL Row Level Security (RLS) policies. 

---

## 🏗️ 2. System Architecture

```mermaid
graph TD
    Client[React SPA Client]
    Vite[Vite Dev Server / Static Hosting]
    SupabaseAuth[Supabase Auth (JWT)]
    SupabaseDB[(Supabase PostgreSQL)]
    SupabaseStorage[Supabase Storage]

    Client -->|Serves Static Assets| Vite
    Client <-->|Authenticates/Fetches JWT| SupabaseAuth
    Client <-->|CRUD via PostgREST API| SupabaseDB
    Client <-->|Uploads/Downloads Media| SupabaseStorage
```

**Data Flow:**
1. **Authentication:** User logs in via Email/Password. Supabase returns a JWT session.
2. **Role Assignment:** A database trigger (`handle_new_user`) intercepts the signup and assigns `writer` or `reader` roles into the `user_roles` table based on user metadata.
3. **Content Delivery:** The client requests articles from the PostgREST API. Supabase intercepts the request and applies RLS. If the user is an Admin, all posts are returned. If the user is a Reader, only `status='published'` posts are returned.
4. **Content Creation:** Writers draft articles in the CMS (`CmsPostEditor.tsx`). Upon saving, the `status` defaults to `pending`. Admins review the `pending` queue and update the status to `published`.

**Hosting & Infrastructure:**
- **Frontend:** Vercel, Netlify, or AWS Amplify (Static Site Hosting / CDN).
- **Backend/Database:** Supabase Cloud (AWS infrastructure).

---

## 🧰 3. Tech Stack

| Technology | Version | Purpose | Why Chosen? |
| :--- | :--- | :--- | :--- |
| **React** | 18.x | Core UI Framework | Massive ecosystem, component reusability. |
| **Vite** | 5.x | Build Tool & Bundler | Lightning-fast HMR and optimized production builds. |
| **react-router-dom** | 6.x | Client-side Routing | Standard routing for React SPAs. |
| **Tailwind CSS** | 3.x | Styling | Utility-first styling for rapid UI development without massive CSS files. |
| **Supabase JS** | 2.x | Backend Client | Seamless integration with PostgreSQL, Auth, and RLS. |
| **lucide-react** | ~0.3 | Iconography | Clean, consistent SVG icons. |
| **@tanstack/react-query** | 5.x | Server State Caching | Handles pagination, caching, and background data synchronization. |

---

## 📦 4. Project Structure

```text
/
├── .env                    # Environment variables (Supabase URL/Key)
├── migration.sql           # Initial database schema setup
├── fix_rls.sql             # Row Level Security policy definitions
├── trigger_update.sql      # PostgreSQL triggers for Auth -> Profiles syncing
├── add_featured.sql        # Schema additions (e.g., is_featured column)
├── src/
│   ├── assets/             # Static images and icons
│   ├── components/         # Reusable UI components
│   │   ├── cms/            # CMS-specific layouts and sidebars
│   │   ├── PostCard.tsx    # Standardized article card
│   │   ├── Navbar.tsx      # Global navigation and integrated search
│   │   └── ScrollToTop.tsx # SPA route transition scroll resetter
│   ├── contexts/           # Global State Management
│   │   ├── AuthContext.tsx # User session, profiles, and RBAC helpers
│   │   └── CmsContext.tsx  # Article, Category, and Tag management
│   ├── integrations/
│   │   └── supabase/       # Supabase client instantiation and generated TS types
│   ├── pages/              # Rendered Route views
│   │   ├── cms/            # Admin/Writer restricted dashboard views
│   │   ├── ArticlePage.tsx # Dynamic article reader (comments, likes, saves)
│   │   ├── AdminPage.tsx   # Legacy dashboard (CMS routing wrapper)
│   │   └── ProfilePage.tsx # User profiles and authored posts
│   ├── App.tsx             # Root component and Router configuration
│   └── index.css           # Global Tailwind directives and custom variables
```

---

## ⚙️ 5. Setup & Installation

**Prerequisites:**
- Node.js (v18 or higher)
- NPM (v9 or higher)
- A Supabase Account

**Step-by-Step Local Setup:**
1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Create a Supabase Project and fetch your keys.
3. Set up your environment variables by creating a `.env` file in the root:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Run the SQL files in your Supabase SQL Editor in this order:
   - `migration.sql` (Creates tables)
   - `trigger_update.sql` (Creates user syncer)
   - `fix_rls.sql` (Applies security rules)
   - `add_featured.sql` (Adds featured attribute)
5. Start the development server:
   ```bash
   npm run dev
   ```

**Common Setup Errors:**
- `Missing JWT Secret`: Ensure your Supabase project is active and keys are pasted without trailing spaces.
- `Could not find a relationship between 'articles' and 'profiles'`: This means the custom fetch logic in `CmsContext.tsx` was reverted. The frontend intentionally fetches logic separately to avoid strictly defined database foreign keys in the public schema.

---

## 🚀 6. Deployment

**CI/CD Pipeline (GitHub Actions -> Vercel):**
1. Push to `main` branch.
2. Vercel picks up the commit, runs `npm run build`.
3. If TypeScript compilation (`tsc -b`) and Vite build succeed, the static bundle is deployed to Vercel's CDN.

**Environment Configs:**
- **Dev:** Connects to a local/staging Supabase project.
- **Prod:** Connects to production Supabase project via injected Vercel environment variables.

---

## 🔌 7. API Reference

Since this is a Supabase project, there is no traditional Node/Express backend. The API is automatically generated via **PostgREST**.

> ⚠️ Note: Every endpoint requires an `apikey` header and an `Authorization: Bearer <JWT>` header. The JWT determines the caller's identity for RLS.

**Endpoint: Fetch Articles**
- **Method:** `GET`
- **URL:** `/rest/v1/articles?status=eq.published&select=*`
- **Response:** Array of Article objects.
- **Security:** RLS restricts `draft`, `pending`, and `rejected` posts to their origin authors and Admins only.

**Endpoint: Search Articles**
- **Method:** `GET`
- **URL:** `/rest/v1/articles?or=(title.ilike."%query%",excerpt.ilike."%query%",category.ilike."%query%")`
- **Response:** Matched Array of Article objects.

**Endpoint: Create Article**
- **Method:** `POST`
- **Body:** `{ "title": "New Post", "content": "...", "status": "pending", "author_id": "<uuid>" }`
- **Security:** Requires a JWT representing a user with the `writer` or `admin` role.

---

## 🗄️ 8. Database Schema

| Table | High-Level Purpose | RLS Policy |
| :--- | :--- | :--- |
| **profiles** | Extended user metadata (bio, avatars, expertise). | Public Read. Self Update. |
| **user_roles** | Role definitions (`admin`, `writer`, `reader`). | Admin Full Access. Read Self. |
| **articles** | Core blog content, statuses, and rich text. | Public Read (if published). Authors edit own. Admins full access. |
| **comments** | Interactions on specific articles. | Public Read. Owners/Admins delete. |
| **bookmarks** | Saved articles mapping table. | Owners Full Access. |
| **followers** | Reader-to-Writer subscriptions. | Public Read. Owners manage. |

**Indexing Strategy:**
- Primary Keys (`id`) are automatically indexed by PostgreSQL.
- The `slug` column on the `articles` table has a `UNIQUE` constraint, automatically creating a B-Tree index for extremely fast route matching in `ArticlePage.tsx`.

---

## 🔐 9. Security

**Authentication & Authorization (RBAC):**
- Users authenticate via Email/Password directly to Supabase GoTrue.
- Authorization relies on the `app_role` ENUM inside the `user_roles` table.
- A custom database function `public.has_role(uuid, role)` is deeply integrated into PostgreSQL RLS policies to prevent API spoofing. If an attacker attempts to update an article they do not own, PostgreSQL actively rejects the `UPDATE` sequence at the database level.

**Input Validation & Sanitization:**
> ⚠️ **Critical Security Notice:** 
> The codebase allows rich text insertion via `contentEditable`. **DOMPurify** must be wrapped around `dangerouslySetInnerHTML` inside `ArticlePage.tsx` to prevent XSS (Cross-Site Scripting) attacks from rogue writers injecting malicious `<script>` tags into their articles.

---

## 🧪 10. Testing Strategy (Planned)

- **Unit Tests:** `vitest` (configured in `vitest.config.ts`) to test independent utility functions (like `timeAgo` and `generateSlug`).
- **Integration Tests:** `@testing-library/react` to mount `CmsContext` and ensure mock database payloads render the dashboard correctly.
- **E2E Testing:** Playwright is recommended to automate the Author post submission workflow (Logging in as author -> Creating post -> Asserting it appears as `pending` -> Logging in as admin -> Clicking publish).

---

## 📊 11. Monitoring & Logging

- **Database Metrics:** Supabase provides native CPU, RAM, and Disk IO tracking for the PostgreSQL instance.
- **API Analytics:** PostgREST logs are visible in the Supabase Dashboard "Logs" explorer.
- **Client-Side Errors:** Recommended integration with **Sentry** (`npm i @sentry/react`) to catch uncaught promise rejections (like failing database queries) and report them to developers automatically.

---

## ♿ 12. Accessibility & Performance

**Performance Optimizations Implemented:**
- **Scroll Restoration:** A custom `<ScrollToTop />` provider patches typical React Router SPA behaviors, ensuring users jump to the top of articles when navigating via search.
- **Optimistic State Updates:** (Planned) Moving from manual Context API syncing to React Query allows the UI to visually respond immediately when clicking "Like" or "Bookmark" while the Supabase network request happens silently in the background.

**Accessibility Targets:**
- Semantic HTML tags (`<nav>`, `<main>`, `<article>`, `<aside>`) are heavily utilized in layout structures.
- Focus outlines are customized via Tailwind classes to ensure keyboard navigation visibility.

---

## 🌍 13. Internationalization (i18n)

- **Current State:** English-only hardcoded strings.
- **Planned Approach:** Integration with `react-i18next`. Language selectors will swap translation JSON files mapped roughly to component keys.

---

## 🤝 14. Contributing Guide

**Branching Strategy (Trunk-Based Development):**
- All features branch off `main` as `feature/branch-name` or `fix/branch-name`.
- PRs require approval from code owners before merging into `main`.
- Vercel automatically creates preview deployments for PRs for visual QA.

**Code Style:**
- **ESLint** and **Prettier** strictly enforce rules (configured in `eslint.config.js`). Do not bypass lint errors regarding `any` types or unused variables without explicit `@ts-ignore` comments documenting the justification.
- Avoid large monolithic components. Break down files like `ArticlePage.tsx` into smaller chunks (e.g., `CommentSection.tsx`, `AuthorBio.tsx`) as complexity increases.

---

## 📋 15. Changelog & Versioning

- Semantic Versioning (SemVer) is utilized (`MAJOR.MINOR.PATCH`).
- A `CHANGELOG.md` file tracks all database migrations, feature rollouts, and deprecated legacy codebase integrations.

---

## 📜 16. License & Legal

This project architecture is proprietary for production use unless explicitly open-sourced under an MIT License. Assets utilized (such as Unsplash images for mock data) retain their respective open internet creative commons licenses.
