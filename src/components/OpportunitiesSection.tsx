import { Briefcase, GraduationCap, Trophy, Award } from "lucide-react";
import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeader from "@/components/SectionHeader";

const opportunities = [
  {
    icon: <Briefcase className="w-5 h-5" />,
    title: "Software Engineering Intern",
    company: "Google",
    type: "Internship",
    deadline: "Mar 30, 2026",
    path: "/category/internships",
    color: "text-blue-500",
  },
  {
    icon: <Briefcase className="w-5 h-5" />,
    title: "Junior Frontend Developer",
    company: "Stripe",
    type: "Job",
    deadline: "Apr 5, 2026",
    path: "/category/jobs",
    color: "text-emerald-500",
  },
  {
    icon: <GraduationCap className="w-5 h-5" />,
    title: "Google STEP Scholarship 2026",
    company: "Google",
    type: "Scholarship",
    deadline: "Apr 15, 2026",
    path: "/category/scholarships",
    color: "text-amber-500",
  },
  {
    icon: <Trophy className="w-5 h-5" />,
    title: "Global AI Hackathon",
    company: "MLH",
    type: "Competition",
    deadline: "May 1, 2026",
    path: "/category/competitions",
    color: "text-purple-500",
  },
];

const OpportunitiesSection = () => (
  <section className="mt-16">
    <ScrollReveal direction="up">
      <div className="lux-divider w-20 mb-8" />
    </ScrollReveal>
    <SectionHeader label="Latest Opportunities" viewMoreLink="/category/opportunities" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {opportunities.map((opp, i) => (
        <ScrollReveal key={i} direction="up" delay={0.1 + i * 0.08}>
          <Link to={opp.path} className="glass-panel rounded-xl p-4 card-hover-glass block group">
            <div className={`${opp.color} mb-3`}>{opp.icon}</div>
            <span className="text-xs font-medium text-category">{opp.type}</span>
            <h4 className="font-display font-semibold text-sm text-foreground mt-1 mb-1 group-hover:text-primary transition-colors line-clamp-2">
              {opp.title}
            </h4>
            <p className="text-xs text-muted-foreground">{opp.company}</p>
            <div className="flex items-center gap-1 mt-3">
              <Award className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Deadline: {opp.deadline}</span>
            </div>
          </Link>
        </ScrollReveal>
      ))}
    </div>
  </section>
);

export default OpportunitiesSection;
