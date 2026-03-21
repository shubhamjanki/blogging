import { ExternalLink, Star } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

interface ResourceCardProps {
  name: string;
  description: string;
  category: string;
  rating: number;
  url?: string;
  icon?: string;
  delay?: number;
}

const ResourceCard = ({
  name,
  description,
  category,
  rating,
  url = "#",
  icon = "🔧",
  delay = 0,
}: ResourceCardProps) => (
  <ScrollReveal direction="up" delay={delay}>
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="glass-panel rounded-xl p-4 card-hover-glass block group"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-display font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
              {name}
            </h4>
            <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-xs text-category font-medium">{category}</span>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{description}</p>
          <div className="flex items-center gap-0.5 mt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${i < rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </a>
  </ScrollReveal>
);

export default ResourceCard;
