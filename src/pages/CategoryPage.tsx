import { useParams } from "react-router-dom";
import NewsCategoryPage from "@/pages/NewsCategoryPage";
import OpportunitiesCategoryPage from "@/pages/OpportunitiesCategoryPage";
import LearnCategoryPage from "@/pages/LearnCategoryPage";
import BlogCategoryPage from "@/pages/BlogCategoryPage";
import ResourcesDirectoryPage from "@/pages/ResourcesDirectoryPage";

const newsSlugs = ["news", "tech-news", "student-news"];
const oppSlugs = ["opportunities", "internships", "jobs", "scholarships", "competitions"];
const learnSlugs = ["learn", "programming", "tutorials", "career-guides"];
const blogSlugs = ["tech-blog", "tech-articles", "industry-insights", "tool-reviews", "startup-stories"];
const resourceSlugs = ["resources", "free-courses", "free-tools", "certifications", "ai-tools", "dev-tools"];

const CategoryPage = () => {
  const { slug } = useParams();
  const s = slug || "";

  if (newsSlugs.includes(s)) return <NewsCategoryPage />;
  if (oppSlugs.includes(s)) return <OpportunitiesCategoryPage />;
  if (learnSlugs.includes(s)) return <LearnCategoryPage />;
  if (blogSlugs.includes(s)) return <BlogCategoryPage />;
  if (resourceSlugs.includes(s)) return <ResourcesDirectoryPage />;

  // Fallback to news-style
  return <NewsCategoryPage />;
};

export default CategoryPage;
