import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Search, MapPin, Briefcase, Calendar, DollarSign, GraduationCap, Trophy, Award, ChevronRight, Filter, ExternalLink, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

const typeFilters = ["All", "Internships", "Jobs", "Scholarships", "Competitions"];
const locationFilters = ["Anywhere", "Remote", "USA", "Europe", "Asia", "Africa"];
const experienceFilters = ["Any Level", "Beginner", "Intermediate", "Advanced"];

const typeIcons: Record<string, React.ReactNode> = {
  Internship: <Briefcase className="w-4 h-4" />,
  Job: <Briefcase className="w-4 h-4" />,
  Scholarship: <GraduationCap className="w-4 h-4" />,
  Competition: <Trophy className="w-4 h-4" />,
};

const typeColors: Record<string, string> = {
  Internship: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  Job: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  Scholarship: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  Competition: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
};

const opportunities = [
  {
    id: "1",
    title: "Software Engineering Intern – Summer 2026",
    company: "Google",
    logo: "🔵",
    type: "Internship",
    location: "Mountain View, CA (Hybrid)",
    salary: "$8,000/mo",
    deadline: "Mar 30, 2026",
    daysLeft: 13,
    tags: ["Python", "Distributed Systems", "ML"],
    featured: true,
    description: "Join Google's engineering team to work on large-scale distributed systems.",
  },
  {
    id: "2",
    title: "Junior Frontend Developer",
    company: "Stripe",
    logo: "🟣",
    type: "Job",
    location: "Remote (Worldwide)",
    salary: "$95K–$120K",
    deadline: "Apr 5, 2026",
    daysLeft: 19,
    tags: ["React", "TypeScript", "CSS"],
    featured: false,
    description: "Build beautiful, accessible payment experiences for millions of businesses.",
  },
  {
    id: "3",
    title: "Google STEP Scholarship 2026",
    company: "Google",
    logo: "🔵",
    type: "Scholarship",
    location: "Global",
    salary: "$10,000 Award",
    deadline: "Apr 15, 2026",
    daysLeft: 29,
    tags: ["CS Students", "Underrepresented"],
    featured: true,
    description: "Full scholarship for underrepresented CS students entering their sophomore year.",
  },
  {
    id: "4",
    title: "Global AI Hackathon 2026",
    company: "MLH",
    logo: "🟠",
    type: "Competition",
    location: "Online",
    salary: "$50K in Prizes",
    deadline: "May 1, 2026",
    daysLeft: 45,
    tags: ["AI/ML", "Hackathon", "Teams"],
    featured: false,
    description: "48-hour hackathon building AI solutions for real-world problems.",
  },
  {
    id: "5",
    title: "Backend Engineering Intern",
    company: "Shopify",
    logo: "🟢",
    type: "Internship",
    location: "Remote (North America)",
    salary: "$6,500/mo",
    deadline: "Apr 10, 2026",
    daysLeft: 24,
    tags: ["Ruby", "GraphQL", "Kubernetes"],
    featured: false,
    description: "Help build the commerce platform that powers millions of businesses.",
  },
  {
    id: "6",
    title: "AWS Cloud Practitioner Scholarship",
    company: "Amazon",
    logo: "🟠",
    type: "Scholarship",
    location: "Global",
    salary: "Free Certification + $5K",
    deadline: "Apr 20, 2026",
    daysLeft: 34,
    tags: ["Cloud", "AWS", "Certification"],
    featured: false,
    description: "Full sponsorship for AWS Cloud Practitioner certification plus stipend.",
  },
  {
    id: "7",
    title: "DevOps Engineer",
    company: "Vercel",
    logo: "▲",
    type: "Job",
    location: "Remote (Global)",
    salary: "$110K–$145K",
    deadline: "Apr 25, 2026",
    daysLeft: 39,
    tags: ["Kubernetes", "Terraform", "CI/CD"],
    featured: false,
    description: "Scale the infrastructure behind the world's leading frontend platform.",
  },
  {
    id: "8",
    title: "HackMIT 2026",
    company: "MIT",
    logo: "🔴",
    type: "Competition",
    location: "Cambridge, MA",
    salary: "$30K in Prizes",
    deadline: "May 15, 2026",
    daysLeft: 59,
    tags: ["Full Stack", "Innovation", "In-person"],
    featured: false,
    description: "MIT's flagship hackathon bringing together 1,000+ students from around the world.",
  },
];

const OpportunitiesCategoryPage = () => {
  const { slug } = useParams();
  const [activeType, setActiveType] = useState("All");
  const [activeLocation, setActiveLocation] = useState("Anywhere");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const categoryTitle = slug
    ? slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    : "Opportunities";

  // Pre-filter by slug
  const preFilterType = slug === "internships" ? "Internships" : slug === "jobs" ? "Jobs" : slug === "scholarships" ? "Scholarships" : slug === "competitions" ? "Competitions" : null;
  const effectiveType = preFilterType || (activeType === "All" ? null : activeType);

  const filtered = opportunities.filter((opp) => {
    if (effectiveType && opp.type + "s" !== effectiveType && opp.type !== effectiveType.slice(0, -1)) {
      // Simple match: type "Internship" vs filter "Internships"
      const typeMatch = effectiveType.toLowerCase().startsWith(opp.type.toLowerCase());
      if (!typeMatch) return false;
    }
    if (searchQuery && !opp.title.toLowerCase().includes(searchQuery.toLowerCase()) && !opp.company.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const featuredOpps = filtered.filter((o) => o.featured);
  const regularOpps = filtered.filter((o) => !o.featured);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-[1320px] mx-auto px-6 py-8">
        {/* Breadcrumbs */}
        <ScrollReveal direction="up">
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link to="/" className="text-category hover:underline">Home</Link>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
            <Link to="/category/opportunities" className="text-category hover:underline">Opportunities</Link>
            {slug && slug !== "opportunities" && (
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
              <p className="text-muted-foreground text-sm">{filtered.length} opportunities available · Updated daily</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-muted/50 rounded-xl px-4 py-2 border border-border/30 min-w-[240px]">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  placeholder="Search by role, company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-sm bg-transparent outline-none flex-1 text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                  showFilters ? "bg-foreground text-background border-foreground" : "border-border/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                <Filter className="w-4 h-4" /> Filters
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Filter Bar */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="flex items-center gap-2 flex-wrap mb-4">
            {!preFilterType && typeFilters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveType(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeType === f
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {showFilters && (
            <div className="glass-panel rounded-xl p-4 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Location</label>
                <div className="flex flex-wrap gap-1.5">
                  {locationFilters.map((l) => (
                    <button
                      key={l}
                      onClick={() => setActiveLocation(l)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        activeLocation === l ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Experience</label>
                <div className="flex flex-wrap gap-1.5">
                  {experienceFilters.map((e) => (
                    <button key={e} className="px-3 py-1 rounded-full text-xs font-medium bg-muted/60 text-muted-foreground hover:text-foreground transition-colors">
                      {e}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Sort By</label>
                <select className="bg-muted/60 border border-border/30 rounded-lg px-3 py-1.5 text-sm text-foreground outline-none w-full">
                  <option>Deadline (soonest)</option>
                  <option>Newest first</option>
                  <option>Salary (highest)</option>
                </select>
              </div>
            </div>
          )}
        </ScrollReveal>

        {/* Featured Opportunities */}
        {featuredOpps.length > 0 && (
          <div className="mb-8">
            <ScrollReveal direction="up">
              <h2 className="font-display font-semibold text-base text-foreground mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" /> Featured
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {featuredOpps.map((opp, i) => (
                <ScrollReveal key={opp.id} direction="up" delay={0.1 + i * 0.08}>
                  <div className="glass-panel rounded-xl p-5 card-hover-glass group relative overflow-hidden border border-primary/20">
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg">
                      Featured
                    </div>
                    <div className="flex items-start gap-4">
                      <span className="text-3xl">{opp.logo}</span>
                      <div className="flex-1 min-w-0">
                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border mb-2 ${typeColors[opp.type]}`}>
                          {typeIcons[opp.type]} {opp.type}
                        </div>
                        <h3 className="font-display font-semibold text-base text-foreground group-hover:text-primary transition-colors mb-1">
                          {opp.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">{opp.company}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{opp.description}</p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {opp.location}</span>
                          <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {opp.salary}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-destructive" />
                            <span className={`text-xs font-medium ${opp.daysLeft <= 14 ? "text-destructive" : "text-muted-foreground"}`}>
                              {opp.daysLeft} days left
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {opp.tags.slice(0, 2).map((tag) => (
                              <span key={tag} className="px-2 py-0.5 rounded-full bg-tag text-tag-foreground text-[10px] font-medium">{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-border/30 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Deadline: {opp.deadline}</span>
                      <button className="lux-button flex items-center gap-1.5 bg-foreground text-background px-4 py-2 rounded-lg text-xs font-semibold">
                        Apply Now <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}

        {/* Regular Listing */}
        <div className="space-y-3">
          {regularOpps.map((opp, i) => (
            <ScrollReveal key={opp.id} direction="up" delay={0.05 + i * 0.04}>
              <div className="glass-panel rounded-xl p-4 card-hover-glass group">
                <div className="flex items-center gap-4">
                  <span className="text-2xl flex-shrink-0">{opp.logo}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${typeColors[opp.type]}`}>
                        {typeIcons[opp.type]} {opp.type}
                      </span>
                      <h3 className="font-display font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                        {opp.title}
                      </h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span>{opp.company}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {opp.location}</span>
                      <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {opp.salary}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right hidden sm:block">
                    <div className="flex items-center gap-1 mb-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className={`text-xs font-medium ${opp.daysLeft <= 14 ? "text-destructive" : "text-muted-foreground"}`}>
                        {opp.daysLeft}d left
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {opp.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded-full bg-tag text-tag-foreground text-[10px] font-medium">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <button className="lux-button flex-shrink-0 bg-foreground text-background px-4 py-2 rounded-lg text-xs font-semibold hidden md:block">
                    Apply
                  </button>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Pagination */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="flex items-center justify-center gap-2 mt-10">
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                  p === 1 ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted/60"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </ScrollReveal>
      </main>
      <Footer />
    </div>
  );
};

export default OpportunitiesCategoryPage;
