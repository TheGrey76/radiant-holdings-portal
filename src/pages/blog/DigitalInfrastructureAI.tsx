import { Link } from 'react-router-dom';
import BlogLayout from '@/components/BlogLayout';

const DigitalInfrastructureAI = () => {
  return (
    <BlogLayout
      title="Digital Infrastructure & AI: The New Core Allocation"
      description="Why institutional investors are increasingly viewing digital infrastructure and AI infrastructure as a strategic core allocation."
      category="Market Insights"
      date="September 5, 2025"
      dateISO="2025-09-05"
      readTime="7 min read"
      slug="digital-infrastructure-ai-core-allocation"
    >
      <p className="text-xl text-muted-foreground font-light leading-relaxed mb-8">
        Why institutional investors are increasingly viewing digital infrastructure and AI infrastructure as a strategic core allocation, and what this means for GP fundraising strategies.
      </p>

      <h2 className="text-3xl font-light text-foreground mt-12 mb-6">The Infrastructure Revolution</h2>
      <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6">
        For decades, infrastructure investing meant toll roads, airports, and utilities. Today, a new category is emerging: data centers, fiber networks, cell towers, and AI compute infrastructure exhibit stable, long-duration cash flows while powering the digital economy's explosive growth.
      </p>

      <h2 className="text-3xl font-light text-foreground mt-12 mb-6">The AI Infrastructure Opportunity</h2>
      <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6">
        Training large language models requires massive GPU clusters consuming hundreds of megawatts. Purpose-built AI facilities require higher power density, advanced cooling systems, and specialized networking.
      </p>

      <h2 className="text-3xl font-light text-foreground mt-12 mb-6">Why Institutional Investors Love Digital Infrastructure</h2>
      <ul className="list-disc pl-6 mb-6 space-y-3 text-lg text-muted-foreground font-light">
        <li><strong className="text-foreground">Predictable Cash Flows</strong>: Long-term contracts with investment-grade counterparties</li>
        <li><strong className="text-foreground">Inflation Protection</strong>: CPI-linked escalators in most contracts</li>
        <li><strong className="text-foreground">Structural Growth</strong>: 20%+ annual growth in data center capacity through 2030</li>
      </ul>

      <div className="mt-12 p-8 bg-accent/5 rounded-lg border border-accent/20">
        <h3 className="text-xl font-light text-foreground mb-4">Aries76 Digital Infrastructure Practice</h3>
        <p className="text-muted-foreground font-light leading-relaxed mb-4">
          We advise GPs developing digital infrastructure and AI infrastructure strategies on fund structuring, LP targeting, and market positioning.
        </p>
        <Link to="/contact" className="inline-block bg-accent hover:bg-accent/90 text-white font-light px-6 py-3 rounded-md uppercase tracking-wider transition-colors">
          Discuss Your Strategy
        </Link>
      </div>
    </BlogLayout>
  );
};

export default DigitalInfrastructureAI;
