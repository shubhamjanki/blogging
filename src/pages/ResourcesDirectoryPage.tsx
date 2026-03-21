import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Search, ChevronRight, ExternalLink, Star, Filter, Grid3X3, List, Tag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

const subcategories = [
  { label: "All Resources", slug: "resources" },
  { label: "Free Courses", slug: "free-courses" },
  { label: "Free Tools", slug: "free-tools" },
  { label: "Certifications", slug: "certifications" },
  { label: "AI Tools", slug: "ai-tools" },
  { label: "Dev Tools", slug: "dev-tools" },
];

const pricingFilters = ["All", "Free", "Freemium", "Paid"];
const sortOptions = ["Most Popular", "Highest Rated", "Newest", "A–Z"];

const resources = [
  { id: "1", name: "ChatGPT", description: "AI assistant for coding, writing, research, and brainstorming. Supports code generation, debugging, and learning.", icon: "🤖", category: "AI Tools", rating: 4.8, reviews: 1240, pricing: "Freemium", tags: ["AI", "Coding", "Writing"], url: "#", featured: true },
  { id: "2", name: "GitHub Copilot", description: "AI pair programmer that suggests code completions and entire functions in your editor.", icon: "🧑‍💻", category: "AI Tools", rating: 4.7, reviews: 890, pricing: "Paid", tags: ["AI", "IDE", "Coding"], url: "#", featured: true },
  { id: "3", name: "freeCodeCamp", description: "Free full-stack web development curriculum with interactive lessons and certifications.", icon: "🔥", category: "Free Courses", rating: 4.9, reviews: 2100, pricing: "Free", tags: ["Learning", "Web Dev", "Certification"], url: "#", featured: true },
  { id: "4", name: "Figma", description: "Collaborative design tool for creating UI/UX designs, prototypes, and design systems.", icon: "🎨", category: "Dev Tools", rating: 4.8, reviews: 1560, pricing: "Freemium", tags: ["Design", "UI/UX", "Collaboration"], url: "#", featured: false },
  { id: "5", name: "Vercel", description: "Deploy frontend applications with zero configuration. Supports Next.js and more.", icon: "▲", category: "Dev Tools", rating: 4.7, reviews: 780, pricing: "Freemium", tags: ["Hosting", "Deployment", "Frontend"], url: "#", featured: false },
  { id: "6", name: "Notion", description: "All-in-one workspace for notes, documentation, project management, and wikis.", icon: "📝", category: "Free Tools", rating: 4.6, reviews: 1890, pricing: "Freemium", tags: ["Productivity", "Notes", "Docs"], url: "#", featured: false },
  { id: "7", name: "AWS Cloud Practitioner", description: "Foundation-level AWS certification covering cloud concepts and services.", icon: "☁️", category: "Certifications", rating: 4.5, reviews: 650, pricing: "Paid", tags: ["Cloud", "AWS", "Certification"], url: "#", featured: false },
  { id: "8", name: "The Odin Project", description: "Free, open-source curriculum for learning full-stack web development.", icon: "⚔️", category: "Free Courses", rating: 4.8, reviews: 1340, pricing: "Free", tags: ["Learning", "Full Stack", "Open Source"], url: "#", featured: false },
  { id: "9", name: "Cursor", description: "AI-first code editor built on VS Code with deep AI integration for code generation.", icon: "✦", category: "AI Tools", rating: 4.6, reviews: 420, pricing: "Freemium", tags: ["AI", "Editor", "Coding"], url: "#", featured: false },
  { id: "10", name: "Linear", description: "Project management tool built for speed. Track issues and plan projects efficiently.", icon: "🔲", category: "Dev Tools", rating: 4.7, reviews: 560, pricing: "Freemium", tags: ["Project Management", "Issues", "Teams"], url: "#", featured: false },
  { id: "11", name: "Google UX Design Certificate", description: "Professional certificate program by Google covering UX design fundamentals.", icon: "🎓", category: "Certifications", rating: 4.6, reviews: 980, pricing: "Paid", tags: ["UX", "Design", "Google"], url: "#", featured: false },
  { id: "12", name: "Excalidraw", description: "Virtual whiteboard for sketching diagrams and visualizing ideas collaboratively.", icon: "✏️", category: "Free Tools", rating: 4.5, reviews: 720, pricing: "Free", tags: ["Whiteboard", "Diagrams", "Collaboration"], url: "#", featured: false },
];

const ResourcesDirectoryPage = () => {
  const { slug } = useParams();
  const [activePricing, setActivePricing] = useState("All");
  const [activeSort, setActiveSort] = useState("Most Popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const categoryTitle = slug
    ? slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    : "Resources";

  const activeSubcat = slug && slug !== "resources" ? slug : null;

  const filtered = resources.filter((r) => {
    if (activeSubcat) {
      const catSlug = r.category.toLowerCase().replace(/\s+/g, "-");
      if (catSlug !== activeSubcat) return false;
    }
    if (activePricing !== "All" && r.pricing !== activePricing) return false;
    if (searchQuery && !r.name.toLowerCase().includes(searchQuery.toLowerCase()) && !r.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const featuredResources = filtered.filter((r) => r.featured);
  const regularResources = filtered.filter((r) => !r.featured);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-[1320px] mx-auto px-6 py-8">
        {/* Breadcrumbs */}
        <ScrollReveal direction="up">
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link to="/" className="text-category hover:underline">Home</Link>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
            <Link to="/category/resources" className="text-category hover:underline">Resources</Link>
            {slug && slug !== "resources" && (
              <>
                <ChevronRight className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground">{categoryTitle}</span>
              </>
            )}
          </div>
        </ScrollReveal>

        {/* Header */}
        <ScrollReveal direction="up" delay={0.05}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">{categoryTitle}</h1>
              <p className="text-muted-foreground text-sm">{filtered.length} tools & resources curated for developers and students</p>
            </div>
            <div className="flex items-center gap-2 bg-muted/50 rounded-xl px-4 py-2 border border-border/30 min-w-[240px]">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-sm bg-transparent outline-none flex-1 text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </ScrollReveal>

        {/* Subcategory Tabs */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
            {subcategories.map((s) => (
              <Link
                key={s.slug}
                to={`/category/${s.slug}`}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  slug === s.slug || (!slug && s.slug === "resources") || (slug === "resources" && s.slug === "resources")
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60 border border-border/30"
                }`}
              >
                {s.label}
              </Link>
            ))}
          </div>
        </ScrollReveal>

        {/* Filters Row */}
        <ScrollReveal direction="up" delay={0.15}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-3.5 h-3.5 text-muted-foreground" />
              {pricingFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActivePricing(f)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    activePricing === f ? "bg-foreground text-background" : "bg-muted/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <select
                value={activeSort}
                onChange={(e) => setActiveSort(e.target.value)}
                className="bg-muted/60 border border-border/30 rounded-lg px-3 py-1.5 text-xs text-foreground outline-none"
              >
                {sortOptions.map((s) => <option key={s}>{s}</option>)}
              </select>
              <div className="flex items-center border border-border/30 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 transition-colors ${viewMode === "grid" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 transition-colors ${viewMode === "list" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Featured Resources */}
        {featuredResources.length > 0 && (
          <div className="mb-8">
            <ScrollReveal direction="up">
              <h2 className="font-display font-semibold text-base text-foreground mb-4 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> Top Picks
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {featuredResources.map((r, i) => (
                <ScrollReveal key={r.id} direction="up" delay={0.1 + i * 0.08}>
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="glass-panel rounded-xl p-5 card-hover-glass group block relative overflow-hidden border border-primary/15">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-3xl">{r.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="font-display font-semibold text-base text-foreground group-hover:text-primary transition-colors">{r.name}</h3>
                          <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <span className="text-xs text-category font-medium">{r.category}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        r.pricing === "Free" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                        r.pricing === "Freemium" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" :
                        "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      }`}>
                        {r.pricing}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{r.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star key={j} className={`w-3 h-3 ${j < Math.round(r.rating) ? "text-amber-400 fill-amber-400" : "text-muted-foreground/20"}`} />
                        ))}
                        <span className="text-xs text-muted-foreground ml-1">{r.rating} ({r.reviews})</span>
                      </div>
                      <div className="flex gap-1">
                        {r.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="px-2 py-0.5 rounded-full bg-tag text-tag-foreground text-[10px]">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </a>
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}

        {/* Resource Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {regularResources.map((r, i) => (
              <ScrollReveal key={r.id} direction="up" delay={0.05 + i * 0.04}>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="glass-panel rounded-xl p-4 card-hover-glass group block">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{r.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-display font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{r.name}</h3>
                        <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-xs text-category font-medium">{r.category}</span>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{r.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <Star key={j} className={`w-3 h-3 ${j < Math.round(r.rating) ? "text-amber-400 fill-amber-400" : "text-muted-foreground/20"}`} />
                          ))}
                          <span className="text-[10px] text-muted-foreground ml-1">({r.reviews})</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          r.pricing === "Free" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                          r.pricing === "Freemium" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" :
                          "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        }`}>
                          {r.pricing}
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {regularResources.map((r, i) => (
              <ScrollReveal key={r.id} direction="up" delay={0.05 + i * 0.04}>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="glass-panel rounded-xl p-4 card-hover-glass group flex items-center gap-4">
                  <span className="text-2xl flex-shrink-0">{r.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{r.name}</h3>
                      <span className="text-xs text-category">{r.category}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">{r.description}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className={`w-3 h-3 ${j < Math.round(r.rating) ? "text-amber-400 fill-amber-400" : "text-muted-foreground/20"}`} />
                    ))}
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0 ${
                    r.pricing === "Free" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                    r.pricing === "Freemium" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" :
                    "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  }`}>
                    {r.pricing}
                  </span>
                  <div className="flex gap-1 flex-shrink-0">
                    {r.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-full bg-tag text-tag-foreground text-[10px]">{tag}</span>
                    ))}
                  </div>
                </a>
              </ScrollReveal>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ResourcesDirectoryPage;
