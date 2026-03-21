import ScrollReveal from "@/components/ScrollReveal";
import SectionHeader from "@/components/SectionHeader";
import ResourceCard from "@/components/ResourceCard";

const resources = [
  { name: "ChatGPT", description: "AI assistant for coding, writing, and research", category: "AI Tools", rating: 5, icon: "🤖" },
  { name: "GitHub Copilot", description: "AI pair programmer that helps you write code faster", category: "AI Tools", rating: 5, icon: "🧑‍💻" },
  { name: "Figma", description: "Collaborative design tool for teams", category: "Dev Tools", rating: 4, icon: "🎨" },
  { name: "Vercel", description: "Deploy web apps with zero configuration", category: "Dev Tools", rating: 5, icon: "▲" },
  { name: "freeCodeCamp", description: "Free coding bootcamp with certifications", category: "Free Courses", rating: 5, icon: "🔥" },
  { name: "Notion", description: "All-in-one workspace for notes, docs, and projects", category: "Free Tools", rating: 4, icon: "📝" },
];

const ResourcesHighlight = () => (
  <section className="mt-16">
    <ScrollReveal direction="up">
      <div className="lux-divider w-20 mb-8" />
    </ScrollReveal>
    <SectionHeader label="Resources & Tools" viewMoreLink="/category/resources" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {resources.map((r, i) => (
        <ResourceCard
          key={i}
          name={r.name}
          description={r.description}
          category={r.category}
          rating={r.rating}
          icon={r.icon}
          delay={0.1 + i * 0.06}
        />
      ))}
    </div>
  </section>
);

export default ResourcesHighlight;
