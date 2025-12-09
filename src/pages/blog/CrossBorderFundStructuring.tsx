import { Link } from 'react-router-dom';
import BlogLayout from '@/components/BlogLayout';

const CrossBorderFundStructuring = () => {
  return (
    <BlogLayout
      title="Cross-Border Fund Structuring: Luxembourg vs. Ireland vs. UK"
      description="A comparative analysis of fund domicile options for European GPs raising global capital."
      category="Fund Structuring"
      date="August 25, 2025"
      dateISO="2025-08-25"
      readTime="9 min read"
      slug="cross-border-fund-structuring"
    >
      <p className="text-xl text-muted-foreground font-light leading-relaxed mb-8">
        A comparative analysis of fund domicile options for European GPs raising global capital. Tax considerations, regulatory frameworks, and investor preferences examined.
      </p>

      <h2 className="text-3xl font-light text-foreground mt-12 mb-6">The Domicile Decision</h2>
      <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6">
        Selecting the right fund domicile is one of the most consequential decisions GPs make. The choice impacts tax efficiency, regulatory burden, LP perception, and operational complexity.
      </p>

      <h2 className="text-3xl font-light text-foreground mt-12 mb-6">Luxembourg: The European Standard</h2>
      <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6">
        Luxembourg hosts over €5 trillion in fund assets. Its tax treaty network (80+ countries), well-defined substance requirements, and sophisticated regulatory regime make it the default choice for most European PE funds.
      </p>

      <h2 className="text-3xl font-light text-foreground mt-12 mb-6">Ireland: The Anglo-Saxon Alternative</h2>
      <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6">
        Ireland operates under common law, making it familiar to UK and US investors. Setup costs are 20-30% lower than Luxembourg, making it attractive for smaller funds.
      </p>

      <h2 className="text-3xl font-light text-foreground mt-12 mb-6">United Kingdom: The Post-Brexit Landscape</h2>
      <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6">
        Brexit altered the UK's position as a fund domicile. Loss of AIFMD passporting means UK funds cannot automatically market to EU institutional investors. UK domicile remains viable for UK-focused funds or non-EU LP bases.
      </p>

      <div className="mt-12 p-8 bg-accent/5 rounded-lg border border-accent/20">
        <h3 className="text-xl font-light text-foreground mb-4">Aries76 Fund Structuring Advisory</h3>
        <p className="text-muted-foreground font-light leading-relaxed mb-4">
          We help GPs select optimal fund domiciles and design tax-efficient structures for cross-border fundraising.
        </p>
        <Link to="/contact" className="inline-block bg-accent hover:bg-accent/90 text-white font-light px-6 py-3 rounded-md uppercase tracking-wider transition-colors">
          Discuss Your Fund Structure
        </Link>
      </div>
    </BlogLayout>
  );
};

export default CrossBorderFundStructuring;
