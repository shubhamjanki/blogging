import { createContext, useContext, useReducer, useCallback, useMemo, ReactNode, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Types
export interface CmsPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  coverImage: string;
  status: "published" | "draft" | "scheduled" | "archived" | "pending" | "rejected";
  author: string;
  authorId?: string;
  views: number;
  publishDate: string;
  createdAt: string;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  featured?: boolean;
}

export interface CmsMedia {
  id: string;
  name: string;
  url: string;
  size: string;
  date: string;
}

export interface CmsCategory {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

export interface CmsTag {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

export interface CmsComment {
  id: string;
  author: string;
  email: string;
  content: string;
  postTitle: string;
  postId: string;
  date: string;
  status: "pending" | "approved" | "spam";
}

export interface CmsSettings {
  blogTitle: string;
  tagline: string;
  description: string;
  postsPerPage: number;
  allowComments: boolean;
  moderateComments: boolean;
  defaultMetaTitle: string;
  defaultMetaDescription: string;
}

export interface ActivityItem {
  id: string;
  action: string;
  target: string;
  time: string;
}

interface CmsState {
  posts: CmsPost[];
  media: CmsMedia[];
  categories: CmsCategory[];
  tags: CmsTag[];
  comments: CmsComment[];
  settings: CmsSettings;
  activity: ActivityItem[];
}

type CmsAction =
  | { type: "ADD_POST"; payload: CmsPost }
  | { type: "UPDATE_POST"; payload: CmsPost }
  | { type: "DELETE_POST"; payload: string }
  | { type: "TOGGLE_FEATURED_POST"; payload: string }
  | { type: "BULK_UPDATE_POSTS"; payload: { ids: string[]; status: CmsPost["status"] } }
  | { type: "BULK_DELETE_POSTS"; payload: string[] }
  | { type: "ADD_MEDIA"; payload: CmsMedia }
  | { type: "DELETE_MEDIA"; payload: string }
  | { type: "ADD_CATEGORY"; payload: CmsCategory }
  | { type: "UPDATE_CATEGORY"; payload: CmsCategory }
  | { type: "DELETE_CATEGORY"; payload: string }
  | { type: "ADD_TAG"; payload: CmsTag }
  | { type: "UPDATE_TAG"; payload: CmsTag }
  | { type: "DELETE_TAG"; payload: string }
  | { type: "SET_POSTS"; payload: CmsPost[] }
  | { type: "UPDATE_COMMENT"; payload: { id: string; status: CmsComment["status"] } }
  | { type: "DELETE_COMMENT"; payload: string }
  | { type: "BULK_UPDATE_COMMENTS"; payload: { ids: string[]; status: CmsComment["status"] } }
  | { type: "BULK_DELETE_COMMENTS"; payload: string[] }
  | { type: "UPDATE_SETTINGS"; payload: Partial<CmsSettings> }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "ADD_ACTIVITY"; payload: ActivityItem };

const uid = () => crypto.randomUUID();

// Seed data
const seedPosts: CmsPost[] = [
  { id: uid(), title: "The Future of AI in Web Development", slug: "future-ai-web-dev", excerpt: "How artificial intelligence is reshaping the way we build websites.", content: "<p>Artificial intelligence is rapidly transforming web development...</p>", category: "Technology", tags: ["AI", "Web Dev"], coverImage: "https://picsum.photos/seed/1/800/400", status: "published", author: "Sarah Chen", views: 4521, publishDate: "2026-03-15", createdAt: "2026-03-14", metaTitle: "", metaDescription: "", ogImage: "", featured: true },
  { id: uid(), title: "Design Systems That Scale", slug: "design-systems-scale", excerpt: "Building design systems that grow with your organization.", content: "<p>Design systems are the backbone of consistent UI...</p>", category: "Design", tags: ["Design Systems", "UI/UX"], coverImage: "https://picsum.photos/seed/2/800/400", status: "published", author: "Marcus Johnson", views: 3102, publishDate: "2026-03-12", createdAt: "2026-03-11", metaTitle: "", metaDescription: "", ogImage: "" },
  { id: uid(), title: "Remote Work in Southeast Asia", slug: "remote-work-sea", excerpt: "Best cities for digital nomads in Southeast Asia.", content: "<p>Southeast Asia continues to attract remote workers...</p>", category: "Travel", tags: ["Digital Nomad", "Remote Work"], coverImage: "https://picsum.photos/seed/3/800/400", status: "published", author: "Lina Patel", views: 7893, publishDate: "2026-03-10", createdAt: "2026-03-09", metaTitle: "", metaDescription: "", ogImage: "" },
  { id: uid(), title: "Mindful Productivity Techniques", slug: "mindful-productivity", excerpt: "Techniques to boost productivity without burning out.", content: "<p>In an age of constant notifications...</p>", category: "Lifestyle", tags: ["Productivity", "Wellness"], coverImage: "https://picsum.photos/seed/4/800/400", status: "published", author: "Sarah Chen", views: 2456, publishDate: "2026-03-08", createdAt: "2026-03-07", metaTitle: "", metaDescription: "", ogImage: "" },
  { id: uid(), title: "TypeScript 6.0 Deep Dive", slug: "typescript-6-deep-dive", excerpt: "Everything new in TypeScript 6.0 and how to use it.", content: "<p>TypeScript 6.0 brings pattern matching...</p>", category: "Technology", tags: ["TypeScript", "Programming"], coverImage: "https://picsum.photos/seed/5/800/400", status: "draft", author: "Marcus Johnson", views: 0, publishDate: "", createdAt: "2026-03-18", metaTitle: "", metaDescription: "", ogImage: "" },
  { id: uid(), title: "Color Theory for Developers", slug: "color-theory-devs", excerpt: "Understanding color theory to create better interfaces.", content: "<p>Color theory isn't just for designers...</p>", category: "Design", tags: ["Color Theory", "CSS"], coverImage: "https://picsum.photos/seed/6/800/400", status: "draft", author: "Lina Patel", views: 0, publishDate: "", createdAt: "2026-03-17", metaTitle: "", metaDescription: "", ogImage: "" },
  { id: uid(), title: "Hidden Gems of Portugal", slug: "hidden-gems-portugal", excerpt: "Off-the-beaten-path destinations in Portugal.", content: "<p>Portugal has so much more than Lisbon...</p>", category: "Travel", tags: ["Portugal", "Europe"], coverImage: "https://picsum.photos/seed/7/800/400", status: "scheduled", author: "Sarah Chen", views: 0, publishDate: "2026-04-01", createdAt: "2026-03-16", metaTitle: "", metaDescription: "", ogImage: "" },
  { id: uid(), title: "Building Healthy Morning Routines", slug: "healthy-morning-routines", excerpt: "How to design a morning routine that energizes you.", content: "<p>Your morning sets the tone...</p>", category: "Lifestyle", tags: ["Morning Routine", "Health"], coverImage: "https://picsum.photos/seed/8/800/400", status: "published", author: "Marcus Johnson", views: 5678, publishDate: "2026-03-05", createdAt: "2026-03-04", metaTitle: "", metaDescription: "", ogImage: "" },
  { id: uid(), title: "React Server Components Explained", slug: "react-server-components", excerpt: "A practical guide to React Server Components.", content: "<p>React Server Components change the paradigm...</p>", category: "Technology", tags: ["React", "Web Dev"], coverImage: "https://picsum.photos/seed/9/800/400", status: "published", author: "Lina Patel", views: 9234, publishDate: "2026-03-03", createdAt: "2026-03-02", metaTitle: "", metaDescription: "", ogImage: "" },
  { id: uid(), title: "Minimalism in UI Design", slug: "minimalism-ui", excerpt: "Why less is more in modern interface design.", content: "<p>Minimalism is not about removing elements...</p>", category: "Design", tags: ["Minimalism", "UI/UX"], coverImage: "https://picsum.photos/seed/10/800/400", status: "archived", author: "Sarah Chen", views: 1234, publishDate: "2026-02-20", createdAt: "2026-02-19", metaTitle: "", metaDescription: "", ogImage: "" },
  { id: uid(), title: "Bali Beyond the Tourist Trail", slug: "bali-beyond-tourist", excerpt: "Discovering authentic Bali away from the crowds.", content: "<p>Bali's tourist hotspots are well known...</p>", category: "Travel", tags: ["Bali", "Indonesia"], coverImage: "https://picsum.photos/seed/11/800/400", status: "published", author: "Marcus Johnson", views: 6789, publishDate: "2026-02-28", createdAt: "2026-02-27", metaTitle: "", metaDescription: "", ogImage: "" },
  { id: uid(), title: "Digital Detox Guide", slug: "digital-detox-guide", excerpt: "A complete guide to reducing screen time.", content: "<p>In our hyper-connected world...</p>", category: "Lifestyle", tags: ["Digital Detox", "Wellness"], coverImage: "https://picsum.photos/seed/12/800/400", status: "draft", author: "Lina Patel", views: 0, publishDate: "", createdAt: "2026-03-19", metaTitle: "", metaDescription: "", ogImage: "" },
];

const seedMedia: CmsMedia[] = Array.from({ length: 8 }, (_, i) => ({
  id: uid(),
  name: `image-${i + 1}.jpg`,
  url: `https://picsum.photos/seed/${i + 20}/600/400`,
  size: `${(Math.random() * 3 + 0.5).toFixed(1)} MB`,
  date: `2026-03-${String(19 - i).padStart(2, "0")}`,
}));

const seedCategories: CmsCategory[] = [
  { id: uid(), name: "Technology", slug: "technology", postCount: 3 },
  { id: uid(), name: "Design", slug: "design", postCount: 3 },
  { id: uid(), name: "Travel", slug: "travel", postCount: 3 },
  { id: uid(), name: "Lifestyle", slug: "lifestyle", postCount: 3 },
  { id: uid(), name: "Business", slug: "business", postCount: 0 },
  { id: uid(), name: "Health", slug: "health", postCount: 0 },
];

const seedTags: CmsTag[] = [
  { id: uid(), name: "AI", slug: "ai", postCount: 1 },
  { id: uid(), name: "Web Dev", slug: "web-dev", postCount: 2 },
  { id: uid(), name: "Design Systems", slug: "design-systems", postCount: 1 },
  { id: uid(), name: "UI/UX", slug: "ui-ux", postCount: 2 },
  { id: uid(), name: "Digital Nomad", slug: "digital-nomad", postCount: 1 },
  { id: uid(), name: "Remote Work", slug: "remote-work", postCount: 1 },
  { id: uid(), name: "Productivity", slug: "productivity", postCount: 1 },
  { id: uid(), name: "TypeScript", slug: "typescript", postCount: 1 },
  { id: uid(), name: "React", slug: "react", postCount: 1 },
  { id: uid(), name: "Wellness", slug: "wellness", postCount: 2 },
];

const commentAuthors = ["Alex Rivera", "Jordan Kim", "Taylor Smith", "Casey Liu", "Morgan Brown", "Riley Wilson", "Jamie Park"];
const commentTexts = [
  "Great article! Really learned a lot from this.",
  "I disagree with some points but overall a solid read.",
  "Can you write a follow-up on this topic?",
  "This changed my perspective completely.",
  "Bookmarked this for later reference. Thanks!",
  "The code examples were super helpful.",
  "Not sure about the conclusion but interesting take.",
  "Please cover more advanced topics next time.",
  "Shared this with my team, they loved it!",
  "Is there a video version of this?",
  "Buy cheap supplements at spam-link.com!!!",
  "Visit my website for amazing deals!!!",
  "I've been waiting for an article like this.",
  "Well-researched and beautifully written.",
];

const seedComments: CmsComment[] = commentTexts.map((content, i) => ({
  id: uid(),
  author: commentAuthors[i % commentAuthors.length],
  email: `${commentAuthors[i % commentAuthors.length].toLowerCase().replace(" ", ".")}@example.com`,
  content,
  postTitle: seedPosts[i % seedPosts.length].title,
  postId: seedPosts[i % seedPosts.length].id,
  date: `2026-03-${String(19 - (i % 14)).padStart(2, "0")}`,
  status: i >= 10 && i <= 11 ? "spam" : i >= 6 && i <= 9 ? "pending" : "approved" as CmsComment["status"],
}));

const seedSettings: CmsSettings = {
  blogTitle: "TechVerse Blog",
  tagline: "Where technology meets creativity",
  description: "A modern blog covering technology, design, travel, and lifestyle.",
  postsPerPage: 10,
  allowComments: true,
  moderateComments: true,
  defaultMetaTitle: "TechVerse Blog",
  defaultMetaDescription: "Explore the latest in tech, design, and lifestyle.",
};

const seedActivity: ActivityItem[] = [
  { id: uid(), action: "Published", target: "The Future of AI in Web Development", time: "2 hours ago" },
  { id: uid(), action: "New comment on", target: "Design Systems That Scale", time: "4 hours ago" },
  { id: uid(), action: "Updated", target: "Remote Work in Southeast Asia", time: "Yesterday" },
  { id: uid(), action: "New draft", target: "TypeScript 6.0 Deep Dive", time: "Yesterday" },
  { id: uid(), action: "Deleted media", target: "old-banner.png", time: "2 days ago" },
];

const initialState: CmsState = {
  posts: [], // Start empty, fetch from Supabase
  media: seedMedia,
  categories: seedCategories,
  tags: seedTags,
  comments: seedComments,
  settings: seedSettings,
  activity: seedActivity,
};

function cmsReducer(state: CmsState, action: CmsAction): CmsState {
  switch (action.type) {
    case "SET_POSTS":
      return { ...state, posts: action.payload };
    case "ADD_POST":
      return { ...state, posts: [action.payload, ...state.posts] };
    case "UPDATE_POST":
      return { ...state, posts: state.posts.map(p => p.id === action.payload.id ? action.payload : p) };
    case "DELETE_POST":
      return { ...state, posts: state.posts.filter(p => p.id !== action.payload) };
    case "TOGGLE_FEATURED_POST":
      return { ...state, posts: state.posts.map(p => p.id === action.payload ? { ...p, featured: !p.featured } : p) };
    case "BULK_UPDATE_POSTS":
      return { ...state, posts: state.posts.map(p => action.payload.ids.includes(p.id) ? { ...p, status: action.payload.status } : p) };
    case "BULK_DELETE_POSTS":
      return { ...state, posts: state.posts.filter(p => !action.payload.includes(p.id)) };
    case "ADD_MEDIA":
      return { ...state, media: [action.payload, ...state.media] };
    case "DELETE_MEDIA":
      return { ...state, media: state.media.filter(m => m.id !== action.payload) };
    case "ADD_CATEGORY":
      return { ...state, categories: [...state.categories, action.payload] };
    case "UPDATE_CATEGORY":
      return { ...state, categories: state.categories.map(c => c.id === action.payload.id ? action.payload : c) };
    case "DELETE_CATEGORY":
      return { ...state, categories: state.categories.filter(c => c.id !== action.payload) };
    case "ADD_TAG":
      return { ...state, tags: [...state.tags, action.payload] };
    case "UPDATE_TAG":
      return { ...state, tags: state.tags.map(t => t.id === action.payload.id ? action.payload : t) };
    case "DELETE_TAG":
      return { ...state, tags: state.tags.filter(t => t.id !== action.payload) };
    case "UPDATE_COMMENT":
      return { ...state, comments: state.comments.map(c => c.id === action.payload.id ? { ...c, status: action.payload.status } : c) };
    case "DELETE_COMMENT":
      return { ...state, comments: state.comments.filter(c => c.id !== action.payload) };
    case "BULK_UPDATE_COMMENTS":
      return { ...state, comments: state.comments.map(c => action.payload.ids.includes(c.id) ? { ...c, status: action.payload.status } : c) };
    case "BULK_DELETE_COMMENTS":
      return { ...state, comments: state.comments.filter(c => !action.payload.includes(c.id)) };
    case "UPDATE_SETTINGS":
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case "ADD_ACTIVITY":
      return { ...state, activity: [action.payload, ...state.activity].slice(0, 10) };
    default:
      return state;
  }
}

interface CmsContextValue {
  state: CmsState;
  dispatch: React.Dispatch<CmsAction>;
  addActivity: (action: string, target: string) => void;
  refreshPosts: () => Promise<void>;
}

const CmsContext = createContext<CmsContextValue | null>(null);

export function CmsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cmsReducer, initialState);

  const fetchPosts = useCallback(async () => {
    // 1. Fetch articles
    const { data: articlesData, error: articlesError } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });

    if (articlesError) {
      console.error("Error fetching CMS posts:", articlesError);
      return;
    }

    if (!articlesData) return;

    // 2. Fetch authors
    const authorIds = [...new Set(articlesData.map(a => a.author_id).filter(Boolean))];
    let profileMap: Record<string, any> = {};
    
    if (authorIds.length > 0) {
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, display_name, username")
        .in("user_id", authorIds);
        
      if (profilesData) {
        profileMap = profilesData.reduce((acc, profile) => {
          acc[profile.user_id] = profile;
          return acc;
        }, {} as Record<string, any>);
      }
    }

    const mappedPosts: CmsPost[] = articlesData.map((p: any) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt || "",
      content: p.content,
      category: p.category,
      tags: p.tags || [],
      coverImage: p.cover_image || "",
      status: (p.status as any) || "draft",
      author: profileMap[p.author_id]?.display_name || profileMap[p.author_id]?.username || "Unknown",
      authorId: p.author_id,
      views: 0, // Views table not yet implemented
      publishDate: p.created_at,
      createdAt: p.created_at,
      metaTitle: p.title,
      metaDescription: p.excerpt || "",
      ogImage: p.cover_image || "",
      featured: p.is_featured || false
    }));

    dispatch({ type: "SET_POSTS", payload: mappedPosts });
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const addActivity = useCallback((action: string, target: string) => {
    dispatch({ type: "ADD_ACTIVITY", payload: { id: crypto.randomUUID(), action, target, time: "Just now" } });
  }, []);

  const value = useMemo(() => ({ 
    state, 
    dispatch, 
    addActivity, 
    refreshPosts: fetchPosts 
  }), [state, addActivity, fetchPosts]);

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export function useCms() {
  const ctx = useContext(CmsContext);
  if (!ctx) throw new Error("useCms must be used within CmsProvider");
  return ctx;
}
