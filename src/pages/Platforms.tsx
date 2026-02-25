import { motion } from "framer-motion";
import { ExternalLink, BarChart3, Rocket } from "lucide-react";

const platforms = [
  {
    name: "Raise Platform",
    url: "https://www.raiseplatform.eu",
    icon: BarChart3,
    tagline: "Capital Raising Intelligence",
    description:
      "A dedicated digital environment for fund managers and corporates to manage investor pipelines, track fundraising progress, and streamline LP engagement — powered by data-driven workflows and institutional-grade tooling.",
    features: ["Investor Pipeline Management", "LP Engagement Tracking", "Fundraising Analytics", "Secure Data Rooms"],
  },
  {
    name: "Alpha Flow",
    url: "https://www.alphaflow.network",
    icon: Rocket,
    tagline: "Systematic Trading & Research",
    description:
      "A research-driven platform delivering systematic trading signals, portfolio analytics, and quantitative insights for professional investors seeking alpha generation through disciplined, data-backed strategies.",
    features: ["Swing Trading Signals", "Portfolio Analytics", "Quantitative Research", "Risk Management"],
  },
];

const Platforms = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-32 md:py-40 border-b border-border/40">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-5xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light mb-8 text-foreground tracking-tight">
              Our Platforms
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground/80 leading-relaxed font-light max-w-4xl mx-auto">
              Purpose-built digital products developed by Aries76 to serve the
              evolving needs of fund managers, institutional investors, and
              sophisticated market participants.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Platform Cards */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-14">
            {platforms.map((platform, index) => {
              const Icon = platform.icon;
              return (
                <motion.a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="group relative flex flex-col h-full p-10 md:p-12 bg-card border border-border/30 hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5"
                >
                  {/* Icon + Name */}
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300 tracking-tight">
                        {platform.name}
                      </h2>
                      <p className="text-sm text-muted-foreground/60 font-light tracking-wide">
                        {platform.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-base text-muted-foreground/80 leading-relaxed font-light mt-6 mb-8 flex-1">
                    {platform.description}
                  </p>

                  {/* Features */}
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-2 mb-8">
                    {platform.features.map((f) => (
                      <li
                        key={f}
                        className="text-sm text-muted-foreground/70 font-light flex items-center gap-2"
                      >
                        <span className="w-1 h-1 rounded-full bg-primary/50" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className="flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all duration-300">
                    Visit {platform.name}
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </motion.a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="py-20 md:py-28 border-t border-border/30 bg-muted/20">
        <div className="container mx-auto px-6 md:px-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto text-center text-xl md:text-2xl text-muted-foreground/70 leading-relaxed font-light tracking-wide"
          >
            Each platform reflects Aries76's commitment to combining deep market
            expertise with advanced technology — creating tools that empower
            professionals to make better, faster decisions.
          </motion.p>
        </div>
      </section>
    </div>
  );
};

export default Platforms;
