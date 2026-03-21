import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroArticle from "@/components/HeroArticle";
import RecommendedSidebar from "@/components/RecommendedSidebar";
import ArticleGrid from "@/components/ArticleGrid";
import FeaturedSection from "@/components/FeaturedSection";
import OpportunitiesSection from "@/components/OpportunitiesSection";
import TutorialsSection from "@/components/TutorialsSection";
import TrendingBlogSection from "@/components/TrendingBlogSection";
import ResourcesHighlight from "@/components/ResourcesHighlight";
import NewsletterSection from "@/components/NewsletterSection";
import BestOfMonth from "@/components/BestOfMonth";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-[1320px] mx-auto px-6 py-8">
        {/* Hero + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
          <div>
            <HeroArticle />
            <ArticleGrid />
          </div>
          <aside>
            <RecommendedSidebar />
          </aside>
        </div>

        {/* Featured News */}
        <FeaturedSection />

        {/* Latest Opportunities */}
        <OpportunitiesSection />

        {/* Popular Tutorials */}
        <TutorialsSection />

        {/* Trending Tech Blog */}
        <TrendingBlogSection />

        {/* Resources & Tools */}
        <ResourcesHighlight />

        {/* Best of Month */}
        <BestOfMonth />

        {/* Newsletter */}
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
