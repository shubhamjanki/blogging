import { createContext, useContext, useReducer, useCallback, useMemo, ReactNode, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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

const SETTINGS_KEY = "cms_settings";

const defaultSettings: CmsSettings = {
  blogTitle: "My Kind of Copy",
  tagline: "Where technology meets creativity",
  description: "A modern blog covering technology, design, and opportunities.",
  postsPerPage: 10,
  allowComments: true,
  moderateComments: false,
  defaultMetaTitle: "My Kind of Copy",
  defaultMetaDescription: "Explore the latest in tech, design, and opportunities.",
};

const loadSettings = (): CmsSettings => {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) return { ...defaultSettings, ...JSON.parse(saved) };
  } catch {}
  return defaultSettings;
};

const initialState: CmsState = {
  posts: [],
  media: [],
  categories: [],
  tags: [],
  comments: [],
  settings: loadSettings(),
  activity: [],
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
    const { data: articlesData, error: articlesError } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });

    if (articlesError || !articlesData) return;

    const authorIds = [...new Set(articlesData.map((a: any) => a.author_id).filter(Boolean))];
    let profileMap: Record<string, any> = {};

    if (authorIds.length > 0) {
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, display_name, username")
        .in("user_id", authorIds);

      if (profilesData) {
        profileMap = profilesData.reduce((acc: Record<string, any>, profile: any) => {
          acc[profile.user_id] = profile;
          return acc;
        }, {});
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
      // Use status column if it exists (after migration), fall back to published boolean
      status: (p.status as CmsPost["status"]) ?? (p.published ? "published" : "draft"),
      author: profileMap[p.author_id]?.display_name || profileMap[p.author_id]?.username || "Unknown",
      authorId: p.author_id,
      views: 0,
      publishDate: p.created_at,
      createdAt: p.created_at,
      metaTitle: p.title,
      metaDescription: p.excerpt || "",
      ogImage: p.cover_image || "",
      featured: p.is_featured ?? false,
    }));

    dispatch({ type: "SET_POSTS", payload: mappedPosts });
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const addActivity = useCallback((action: string, target: string) => {
    dispatch({
      type: "ADD_ACTIVITY",
      payload: { id: crypto.randomUUID(), action, target, time: "Just now" },
    });
  }, []);

  const value = useMemo(() => ({
    state,
    dispatch,
    addActivity,
    refreshPosts: fetchPosts,
  }), [state, addActivity, fetchPosts]);

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export function useCms() {
  const ctx = useContext(CmsContext);
  if (!ctx) throw new Error("useCms must be used within CmsProvider");
  return ctx;
}
