import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { useEffect } from 'react';
import ShareButtons from '@/components/ShareButtons';

const DigitalInfrastructureAI = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Digital Infrastructure & AI: The New Core Allocation",
      "description": "Why institutional investors are increasingly viewing digital infrastructure and AI infrastructure as a strategic core allocation.",
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
      "datePublished": "2025-09-05",
      "dateModified": "2025-09-05"
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
              <span className="text-sm text-accent uppercase tracking-wider font-light">Market Insights</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-light text-foreground mb-6 tracking-tight">
              Digital Infrastructure & AI: The New Core Allocation
            </h1>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-12">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>September 5, 2025</span>
              </div>
              <span>•</span>
              <span>7 min read</span>
            </div>

            <ShareButtons 
              title="Digital Infrastructure & AI: The New Core Allocation"
              url={window.location.href}
            />

            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-muted-foreground font-light leading-relaxed mb-8">
                Why institutional investors are increasingly viewing digital infrastructure and AI infrastructure as a strategic core allocation, and what this means for GP fundraising strategies.
              </p>

              <h2 className="text-3xl font-light text-foreground mt-12 mb-6">The Infrastructure Revolution</h2>
              <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6">
                For decades, infrastructure investing meant toll roads, airports, and utilities—physical assets with stable cash flows, inflation linkage, and low correlation to equity markets. These characteristics made infrastructure a staple allocation for pension funds, insurance companies, and sovereign wealth funds.
              </p>
              <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6">
                Today, a new category is emerging with similar characteristics but exponentially higher growth potential: digital infrastructure. Data centers, fiber networks, cell towers, and increasingly, AI compute infrastructure exhibit the stable, long-duration cash flows that define core infrastructure—while powering the digital economy\'s explosive growth.
              </p>

              <h2 className="text-3xl font-light text-foreground mt-12 mb-6">What Qualifies as Digital Infrastructure?</h2>
              
              <h3 className="text-2xl font-light text-foreground mt-8 mb-4">Data Centers</h3>
              <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6">
                The backbone of cloud computing, data centers house the servers and networking equipment that power everything from Netflix streaming to enterprise applications. Hyperscale facilities (100MW+) serve mega tech companies, while edge data centers bring computing closer to end users for latency-sensitive applications.
              </p>

              <h3 className="text-2xl font-light text-foreground mt-8 mb-4">Fiber Networks</h3>
              <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6">
                Long-haul fiber connecting major metropolitan areas and last-mile fiber delivering broadband to homes and businesses. These networks generate steady revenue through long-term contracts with telecom operators and enterprises.
              </p>

              <h3 className="text-2xl font-light text-foreground mt-8 mb-4">Cell Towers and Small Cells</h3>
              <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6">
                Physical infrastructure enabling mobile connectivity. Tower companies lease space to multiple carriers, generating recurring revenue with built-in escalators and minimal capital expenditure requirements once built.
              </p>

              <h3 className="text-2xl font-light text-foreground mt-8 mb-4">Subsea Cables</h3>
              <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6">
                The global internet\'s physical foundation. These cables carry 99% of intercontinental data traffic and generate revenue through long-term capacity agreements with tech companies and carriers.
              </p>

              <h2 className="text-3xl font-light text-foreground mt-12 mb-6">The AI Infrastructure Opportunity</h2>
              <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6">
                Artificial Intelligence has created unprecedented demand for specialized computing infrastructure. Training large language models requires massive GPU clusters consuming hundreds of megawatts. Inference (running AI models at scale) demands low-latency, geographically distributed compute.
              </p>

              <h3 className="text-2xl font-light text-foreground mt-8 mb-4">GPU-Optimized Data Centers</h3>
              <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6">
                Traditional data centers weren\'t designed for AI workloads. Modern AI facilities require higher power density (50-100kW per rack vs. 5-10kW traditional), advanced cooling systems, and specialized networking. Purpose-built AI data centers command premium pricing from customers desperate for GPU capacity.
              </p>

              <h3 className="text-2xl font-light text-foreground mt-8 mb-4">Edge AI Infrastructure</h3>
              <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6">
                As AI applications proliferate, inference must happen closer to end users. Autonomous vehicles, augmented reality, and real-time translation require sub-10ms latency, driving demand for edge compute infrastructure in every major metro.
              </p>

              <h3 className="text-2xl font-light text-foreground mt-8 mb-4">Power Infrastructure for AI</h3>
              <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6">
                AI data centers consume staggering amounts of electricity. A single GPU-based training cluster can draw 100MW—equivalent to a small city. This has created opportunities in power generation, substations, and energy storage specifically designed for AI compute.
              </p>

              <h2 className="text-3xl font-light text-foreground mt-12 mb-6">Why Institutional Investors Love Digital Infrastructure</h2>

              <h3 className="text-2xl font-light text-foreground mt-8 mb-4">Predictable Cash Flows</h3>
              <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6">
                Long-term contracts (typically 5-15 years) with investment-grade counterparties generate stable, predictable revenue. Customer concentration risk is mitigated through multi-tenant facilities and diverse customer bases.
              </p>

              <h3 className="text-2xl font-light text-foreground mt-8 mb-4">Inflation Protection</h3>
              <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6">
                Most contracts include CPI-linked escalators or power pass-through provisions, providing natural inflation hedging—critical for pension funds managing long-term liabilities.
              </p>

              <h3 className="text-2xl font-light text-foreground mt-8 mb-4">Structural Growth</h3>
              <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6">
                Unlike mature infrastructure sectors with GDP-level growth, digital infrastructure benefits from exponential data growth, 5G rollout, and AI adoption. Industry analysts project 20%+ annual growth in data center capacity through 2030.
              </p>

              <h3 className="text-2xl font-light text-foreground mt-8 mb-4">Defensive Characteristics</h3>
              <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6">
                Economic downturns don\'t stop data consumption or cloud computing demand. Digital infrastructure has proven remarkably resilient through market cycles.
              </p>

              <h2 className="text-3xl font-light text-foreground mt-12 mb-6">Investment Structures and Returns</h2>
              <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6">
                Digital infrastructure investments span the risk-return spectrum:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-3 text-lg text-muted-foreground font-light">
                <li><strong className="text-foreground">Core/Core+</strong>: Stabilized, fully-leased assets with investment-grade tenants. Target returns: 8-12% net IRR</li>
                <li><strong className="text-foreground">Value-Add</strong>: Assets requiring lease-up, expansion, or repositioning. Target returns: 12-16% net IRR</li>
                <li><strong className="text-foreground">Development</strong>: Ground-up construction of new facilities. Target returns: 15-20%+ net IRR</li>
              </ul>

              <h2 className="text-3xl font-light text-foreground mt-12 mb-6">European Market Dynamics</h2>
              <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6">
                Europe\'s digital infrastructure market presents unique opportunities:
              </p>

              <h3 className="text-2xl font-light text-foreground mt-8 mb-4">Data Sovereignty Requirements</h3>
              <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6">
                GDPR and national security concerns drive demand for European-domiciled data centers. This creates barriers to entry and pricing power for established operators.
              </p>

              <h3 className="text-2xl font-light text-foreground mt-8 mb-4">Fragmented Markets</h3>
              <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6">
                Unlike the US where a few operators dominate, European markets remain fragmented with regional players and consolidation opportunities.
              </p>

              <h3 className="text-2xl font-light text-foreground mt-8 mb-4">Energy Transition Alignment</h3>
              <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6">
                European focus on renewable energy creates opportunities for sustainable data center development powered by wind and solar.
              </p>

              <h2 className="text-3xl font-light text-foreground mt-12 mb-6">Implications for GP Fundraising</h2>
              <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6">
                GPs with digital infrastructure or AI infrastructure strategies are seeing unprecedented LP demand. Institutional allocators view these strategies as:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-3 text-lg text-muted-foreground font-light">
                <li>Core infrastructure alternatives offering higher growth</li>
                <li>Technology exposure with infrastructure-like risk profiles</li>
                <li>Inflation hedges with structural tailwinds</li>
                <li>ESG-friendly when powered by renewables</li>
              </ul>
              <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6">
                For GPs, this translates to larger fund sizes, faster fundraising cycles, and premium fee structures compared to traditional infrastructure strategies.
              </p>

              <div className="mt-12 p-8 bg-accent/5 rounded-lg border border-accent/20">
                <h3 className="text-xl font-light text-foreground mb-4">Aries76 Digital Infrastructure Practice</h3>
                <p className="text-muted-foreground font-light leading-relaxed mb-4">
                  We advise GPs developing digital infrastructure and AI infrastructure strategies on fund structuring, LP targeting, and market positioning. Our network includes institutional allocators actively deploying capital into this sector.
                </p>
                <Link
                  to="/contact"
                  className="inline-block bg-accent hover:bg-accent/90 text-white font-light px-6 py-3 rounded-md uppercase tracking-wider transition-colors"
                >
                  Discuss Your Digital Infrastructure Strategy
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </article>
    </div>
  );
};

export default DigitalInfrastructureAI;