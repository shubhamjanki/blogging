import ScrollReveal from "@/components/ScrollReveal";
import SectionHeader from "@/components/SectionHeader";
import PostCard from "@/components/PostCard";
import thumb1 from "@/assets/article-thumb-1.jpg";
import thumb2 from "@/assets/article-thumb-2.jpg";
import thumb3 from "@/assets/article-thumb-3.jpg";
import thumb4 from "@/assets/article-thumb-4.jpg";

const tutorials = [
  {
    title: "Building a REST API with Node.js and Express in 2026",
    image: thumb1,
    category: "Programming",
    timeAgo: "2 days ago",
    tags: ["#NodeJS", "#Backend"],
  },
  {
    title: "Complete Guide to React Server Components",
    image: thumb2,
    category: "Tutorials",
    timeAgo: "3 days ago",
    tags: ["#React", "#Frontend"],
  },
  {
    title: "How to Land Your First Tech Internship",
    image: thumb3,
    category: "Career Guides",
    timeAgo: "5 days ago",
    tags: ["#Career", "#Tips"],
  },
  {
    title: "Mastering TypeScript Generics: A Visual Guide",
    image: thumb4,
    category: "Programming",
    timeAgo: "1 week ago",
    tags: ["#TypeScript", "#Advanced"],
  },
];

const TutorialsSection = () => (
  <section className="mt-16">
    <ScrollReveal direction="up">
      <div className="lux-divider w-20 mb-8" />
    </ScrollReveal>
    <SectionHeader label="Popular Tutorials" viewMoreLink="/category/tutorials" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {tutorials.map((t, i) => (
        <PostCard
          key={i}
          title={t.title}
          image={t.image}
          category={t.category}
          timeAgo={t.timeAgo}
          tags={t.tags}
          delay={0.1 + i * 0.08}
        />
      ))}
    </div>
  </section>
);

export default TutorialsSection;
