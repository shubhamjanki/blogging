import { ArrowRight, ArrowLeft } from "lucide-react";
import { useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import thumb4 from "@/assets/article-thumb-4.jpg";
import card1 from "@/assets/article-card-1.jpg";
import card2 from "@/assets/article-card-2.jpg";
import card3 from "@/assets/article-card-3.jpg";
import thumb1 from "@/assets/article-thumb-1.jpg";

const articles = [
  { title: "Over 65% of Crypto-Related Tweets and 84% of Conversations on Reddit Were…", image: thumb4 },
  { title: "Over 65% of Crypto-Related Tweets and 84% of Conversations on Reddit Were…", image: card2 },
  { title: "Over 65% of Crypto-Related Tweets and 84% of Conversations on Reddit Were…", image: card1 },
  { title: "Over 65% of Crypto-Related Tweets and 84% of Conversations on Reddit Were…", image: card3 },
  { title: "Over 65% of Crypto-Related Tweets and 84% of Conversations on Reddit Were…", image: thumb1 },
];

const BestOfMonth = () => {
  const [page, setPage] = useState(0);

  return (
    <section className="mt-16 pb-12">
      <ScrollReveal direction="up">
        <div className="lux-divider w-20 mb-8" />
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0.05}>
        <div className="flex items-center justify-between mb-8">
          <div className="inline-block bg-muted/60 backdrop-blur-sm px-3 py-1 rounded-md">
            <span className="text-xs font-semibold tracking-wider uppercase text-foreground border-l-2 border-primary pl-2">
              Best of the Month
            </span>
          </div>
          <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">
            View more <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {articles.map((article, i) => (
          <ScrollReveal key={i} delay={0.1 + i * 0.08} direction="up">
            <div className="cursor-pointer group card-hover-glass">
              <div className="lux-image h-[180px] mb-3 rounded-xl">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="flex items-center gap-2 text-xs mb-1.5">
                <span className="text-category font-medium">Blockchain News</span>
                <span className="text-muted-foreground">· 4 hours ago</span>
              </div>
              <p className="text-sm font-medium text-foreground leading-snug group-hover:text-primary transition-colors duration-300 line-clamp-3">
                {article.title}
              </p>
              <div className="flex gap-2 mt-1.5">
                <span className="text-xs text-muted-foreground">#Ethereum</span>
                <span className="text-xs text-muted-foreground">#Analytics</span>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal direction="up" delay={0.5}>
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            className="lux-button w-11 h-11 rounded-full border border-border/60 flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </button>
          <button
            onClick={() => setPage(page + 1)}
            className="lux-button w-11 h-11 rounded-full bg-foreground flex items-center justify-center"
          >
            <ArrowRight className="w-4 h-4 text-background" />
          </button>
        </div>
      </ScrollReveal>
    </section>
  );
};

export default BestOfMonth;
