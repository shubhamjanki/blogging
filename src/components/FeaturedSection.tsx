import ScrollReveal from "@/components/ScrollReveal";
import featuredHero from "@/assets/featured-hero.jpg";

const sidebarArticles = [
  {
    title: "Top Analyst Unveils Ethereum Catalyst That Could Trigger Nearly 50…",
  },
  {
    title: "Over 65% of Crypto-Related Tweets and 84% of Conversations on Red…",
  },
  {
    title: "STX Price Prediction: After 126% Price Jump in December, What's in Sto…",
  },
];

const FeaturedSection = () => {
  return (
    <section className="mt-16 pb-8">
      <ScrollReveal direction="up">
        <div className="lux-divider w-20 mb-8" />
      </ScrollReveal>

      <ScrollReveal direction="scale" duration={1}>
        <div className="relative rounded-2xl overflow-hidden h-[520px] md:h-[580px]">
          {/* Background Image */}
          <img
            src={featuredHero}
            alt="Featured news"
            className="w-full h-full object-cover"
          />

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/30 via-transparent to-accent/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />

          {/* Bottom-left text card */}
          <ScrollReveal direction="up" delay={0.3} className="absolute bottom-0 left-0 z-10">
            <div className="glass-panel rounded-tr-2xl p-6 md:p-8 max-w-md">
              <div className="inline-block bg-muted/60 backdrop-blur-sm px-3 py-1 rounded-md mb-4">
                <span className="text-xs font-semibold tracking-wider uppercase text-foreground border-l-2 border-primary pl-2">
                  Featured News
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm mb-3">
                <span className="text-category font-medium">Blockchain News</span>
                <span className="text-muted-foreground">· 4 hours ago</span>
              </div>
              <h2 className="font-display text-xl md:text-2xl lg:text-3xl font-bold leading-tight text-foreground mb-3">
                Over 65% of Crypto-Related Tweets and 84% of Conversations on Reddit Were Positive in 2023
              </h2>
              <div className="flex gap-3">
                <span className="text-sm text-muted-foreground">#Ethereum</span>
                <span className="text-sm text-muted-foreground">#Analytics</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Right sidebar overlay */}
          <ScrollReveal direction="right" delay={0.4} className="absolute top-0 right-0 bottom-0 z-10 hidden md:block">
            <div className="h-full w-[280px] bg-foreground/70 backdrop-blur-xl p-5 flex flex-col justify-center gap-5">
              {sidebarArticles.map((article, i) => (
                <div key={i} className="cursor-pointer group">
                  {i > 0 && <div className="w-6 h-0.5 bg-primary-foreground/30 mb-4" />}
                  <div className="flex items-center gap-2 text-xs mb-1.5">
                    <span className="text-primary-foreground/70 font-medium">Blockchain News</span>
                    <span className="text-primary-foreground/40">· 4 hours ago</span>
                  </div>
                  <p className="text-sm font-medium text-primary-foreground/90 leading-snug group-hover:text-primary-foreground transition-colors duration-300">
                    {article.title}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </ScrollReveal>
    </section>
  );
};

export default FeaturedSection;
