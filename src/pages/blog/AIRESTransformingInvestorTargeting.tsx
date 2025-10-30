import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { useEffect } from 'react';

const AIRESTransformingInvestorTargeting = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "AIRES: How AI is Transforming Investor Targeting",
      "description": "Our proprietary AIRES platform uses machine learning to identify optimal LP matches and optimize fundraising strategies.",
      "author": {
        "@type": "Organization",
        "name": "Aries76 Ltd"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Aries76 Ltd",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.aries76.com/aries76-og-logo.png"
        }
      },
      "datePublished": "2025-08-10",
      "dateModified": "2025-08-10"
    });
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <article className="px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/blog"
            className="inline-flex items-center text-accent hover:text-accent/80 transition-colors mb-8 font-light"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Insights
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6">
              <span className="text-sm text-accent uppercase tracking-wider font-light">Technology</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-light text-foreground mb-6 tracking-tight">
              AIRES: How AI is Transforming Investor Targeting
            </h1>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-12">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>August 10, 2025</span>
              </div>
              <span>•</span>
              <span>5 min read</span>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-muted-foreground font-light leading-relaxed mb-8">
                Our proprietary AIRES platform uses machine learning to identify optimal LP matches and optimize fundraising strategies. A look inside the technology powering modern capital formation.
              </p>

              <h2 className="text-3xl font-light text-foreground mt-12 mb-6">The Fundraising Challenge</h2>
              <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6">
                Private equity fundraising has traditionally been relationship-driven, opaque, and inefficient. GPs spend months identifying potential LPs, cold-calling institutions, and pitching to investors who may not be a strategic fit. Even experienced GPs waste significant time pursuing investors unlikely to commit.
              </p>
              <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6">
                The challenge is information asymmetry. GPs don\'t know which institutions are actively allocating to their strategy, what investment criteria matter most to each LP, or how to optimize their positioning. LPs, meanwhile, are bombarded with pitches from hundreds of GPs, making it difficult to identify differentiated opportunities.
              </p>

              <h2 className="text-3xl font-light text-foreground mt-12 mb-6">Enter AIRES: Aries Intelligence & Research Engine System</h2>
              <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6">
                AIRES is our proprietary AI-powered platform that transforms fundraising from art to science. By analyzing vast datasets on LP investment behavior, fund performance, and market trends, AIRES identifies optimal investor matches and recommends precise positioning strategies.
              </p>

              <h2 className="text-3xl font-light text-foreground mt-12 mb-6">How AIRES Works</h2>

              <h3 className="text-2xl font-light text-foreground mt-8 mb-4">1. LP Database and Behavioral Analysis</h3>
              <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6">
                AIRES maintains profiles on 5,000+ institutional investors globally, including:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-3 text-lg text-muted-foreground font-light">
                <li><strong className="text-foreground">Investment mandates</strong>: Asset class allocations, geographic focus, sector preferences</li>
                <li><strong className="text-foreground">Historical commitments</strong>: Size, timing, and type of previous PE investments</li>
                <li><strong className="text-foreground">Portfolio construction</strong>: Existing GP relationships, fund vintage diversification</li>
                <li><strong className="text-foreground">Decision-making processes</strong>: Investment committee structures, approval timelines</li>
              </ul>

              <h3 className="text-2xl font-light text-foreground mt-8 mb-4">2. Machine Learning Matching Algorithm</h3>
              <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6">
                AIRES uses machine learning to analyze which LPs are most likely to invest in a given fund based on:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-3 text-lg text-muted-foreground font-light">
                <li><strong className="text-foreground">Strategy alignment</strong>: How well the GP\'s approach matches LP investment criteria</li>
                <li><strong className="text-foreground">Track record fit</strong>: Whether the GP\'s performance profile appeals to the LP\'s risk-return preferences</li>
                <li><strong className="text-foreground">Portfolio gaps</strong>: Where the fund would fit in the LP\'s existing allocation</li>
                <li><strong className="text-foreground">Timing optimization</strong>: When the LP is likely to be actively deploying capital</li>
              </ul>

              <h3 className="text-2xl font-light text-foreground mt-8 mb-4">3. Natural Language Processing</h3>
              <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6">
                AIRES analyzes thousands of LP annual reports, investment policy statements, and public disclosures using NLP to identify:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-3 text-lg text-muted-foreground font-light">
                <li>Emerging allocation priorities (e.g., climate tech, digital infrastructure)</li>
                <li>Changing risk appetites and return requirements</li>
                <li>Governance and ESG requirements becoming stricter</li>
                <li>Geographic expansion plans</li>
              </ul>

              <h3 className="text-2xl font-light text-foreground mt-8 mb-4">4. Engagement Optimization</h3>
              <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6">
                Once AIRES identifies high-probability LP matches, the platform recommends:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-3 text-lg text-muted-foreground font-light">
                <li><strong className="text-foreground">Messaging strategy</strong>: Which elements of the fund story to emphasize for each LP</li>
                <li><strong className="text-foreground">Introduction pathways</strong>: Warm introductions through existing relationships vs. direct outreach</li>
                <li><strong className="text-foreground">Timing</strong>: Optimal contact timing based on LP investment cycles</li>
                <li><strong className="text-foreground">Follow-up cadence</strong>: When and how to follow up based on engagement signals</li>
              </ul>

              <h2 className="text-3xl font-light text-foreground mt-12 mb-6">Real-World Impact</h2>

              <h3 className="text-2xl font-light text-foreground mt-8 mb-4">Case Study: European Mid-Market Buyout Fund</h3>
              <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6">
                A €500m European mid-market buyout fund engaged Aries76 for fundraising advisory. Traditional GP approach would involve:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-3 text-lg text-muted-foreground font-light">
                <li>Identifying 200-300 potential LPs from databases</li>
                <li>Generic outreach to all prospects</li>
                <li>12-18 month fundraising timeline</li>
                <li>15-20% conversion rate (30-40 commitments from 200 meetings)</li>
              </ul>

              <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6 mt-6">
                Using AIRES, we:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-3 text-lg text-muted-foreground font-light">
                <li>Identified 75 high-probability LPs based on allocation patterns and portfolio gaps</li>
                <li>Customized positioning for each LP segment (family offices, pensions, insurance)</li>
                <li>Prioritized warm introductions through existing relationships</li>
                <li>Achieved 35% conversion rate (26 commitments from 75 targeted meetings)</li>
                <li>Reached final close in 9 months vs. 18-month industry average</li>
              </ul>

              <h2 className="text-3xl font-light text-foreground mt-12 mb-6">Beyond Fundraising: Portfolio Monitoring</h2>
              <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6">
                AIRES also tracks GP-LP relationship health post-fundraise:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-3 text-lg text-muted-foreground font-light">
                <li><strong className="text-foreground">Re-up likelihood prediction</strong>: Which LPs are most/least likely to commit to the next fund</li>
                <li><strong className="text-foreground">Relationship risk alerts</strong>: Early warning when LP satisfaction metrics decline</li>
                <li><strong className="text-foreground">Benchmarking</strong>: How GP performance and service quality compare to LP peer sets</li>
              </ul>

              <h2 className="text-3xl font-light text-foreground mt-12 mb-6">The Competitive Advantage</h2>
              <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6">
                GPs using AIRES-powered advisory gain multiple advantages:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-3 text-lg text-muted-foreground font-light">
                <li><strong className="text-foreground">Time efficiency</strong>: Focus efforts on highest-probability prospects</li>
                <li><strong className="text-foreground">Conversion optimization</strong>: Customized positioning dramatically improves win rates</li>
                <li><strong className="text-foreground">Relationship intelligence</strong>: Understand what matters most to each LP</li>
                <li><strong className="text-foreground">First-mover advantage</strong>: Identify allocation windows before competitors</li>
              </ul>

              <h2 className="text-3xl font-light text-foreground mt-12 mb-6">The Future of Capital Formation</h2>
              <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6">
                As institutional investors become increasingly selective and competition for capital intensifies, data-driven fundraising will separate winners from losers. GPs that embrace AI-powered investor intelligence will raise larger funds, faster, with stronger LP relationships.
              </p>
              <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6">
                AIRES represents our vision for the future of private markets capital formation: precise, efficient, and driven by data rather than guesswork.
              </p>

              <div className="mt-12 p-8 bg-accent/5 rounded-lg border border-accent/20">
                <h3 className="text-xl font-light text-foreground mb-4">Experience AIRES-Powered Advisory</h3>
                <p className="text-muted-foreground font-light leading-relaxed mb-4">
                  Aries76 clients gain access to AIRES analytics and recommendations throughout their fundraising campaigns. Whether you\'re launching your first fund or raising Fund V, our AI-powered approach delivers measurably better outcomes.
                </p>
                <Link
                  to="/contact"
                  className="inline-block bg-accent hover:bg-accent/90 text-white font-light px-6 py-3 rounded-md uppercase tracking-wider transition-colors"
                >
                  Schedule an AIRES Demo
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </article>
    </div>
  );
};

export default AIRESTransformingInvestorTargeting;