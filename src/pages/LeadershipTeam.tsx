import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const LeadershipTeam = () => {
  const leaders = [
    {
      name: 'Edoardo Grigione',
      role: 'Founder & Strategic Advisor',
      email: 'edoardo.grigione@aries76.com',
      description: 'Edoardo Grigione is a capital-raising and strategic advisory specialist with over 25 years of experience across hedge funds, private equity, and venture capital. He has advised international fund managers and family-backed businesses on structuring, cross-border fundraising, and investor relations, raising commitments exceeding €200 million. Edoardo founded Aries76 Ltd to deliver an institutional-grade advisory model powered by data, AI, and deep market knowledge, bridging global investors with European opportunities.'
    },
    {
      name: 'Julio Elizondo',
      role: 'Partner & Head of AI & Market Intelligence',
      email: 'julio.elizondo@aries76.com',
      description: 'Julio Elizondo leads AI strategy and quantitative research at Aries76, bringing deep experience at the intersection of markets, data, and applied machine intelligence. He founded TradePhantom LLC, an AI-driven market intelligence firm, where he architected multi-agent systems for real-time macro, earnings, options-gamma and volatility-regime analysis used by professional traders and institutions. Earlier in his career he served in military counter-intelligence, a background that informs his rigorous approach to model governance, operational security, and transparent analytics. At Aries76, Julio drives the design of the AI Market Engine, oversees model validation and telemetry, and partners with clients to integrate institutional-grade analytics across portfolios and workflows. His focus is turning fragmented market data into clear, actionable intelligence for banks, family offices, and asset managers across Europe and the Middle East.'
    },
    {
      name: 'Quinley Martini',
      role: 'Head of Investor Relations',
      email: 'quinley.martini@aries76.com',
      description: 'Quinley Martini leads Investor Relations at Aries76, overseeing communication with institutional LPs, family offices, and strategic partners across Europe and the Middle East. Her background combines financial communications and client strategy with a data-driven approach to capital formation. At Aries76, she ensures transparency, consistency, and long-term trust in every investor interaction, supporting both fundraising execution and relationship management.'
    },
    {
      name: 'Alessandro Catullo',
      role: 'Head of Business Development',
      email: 'alessandro.catullo@aries76.com',
      description: 'Alessandro oversees Business Development and strategic partnerships at Aries76, focusing on expanding the firm\'s distribution network and origination capabilities across Europe, Switzerland, and the UK. With a solid background in financial events and business networking, he brings a relationship-driven approach to building alliances with private banks, family offices, and institutional investors. His mission is to translate Aries76\'s innovative capabilities into strategic growth opportunities for clients and partners worldwide.'
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Aries76 Ltd",
    "url": "https://www.aries76.com",
    "employee": leaders.map(leader => ({
      "@type": "Person",
      "name": leader.name,
      "jobTitle": leader.role,
      "description": leader.description,
      "worksFor": {
        "@type": "Organization",
        "name": "Aries76 Ltd"
      }
    }))
  };

  return (
    <>
      <Helmet>
        <title>Leadership Team | Aries76 Ltd</title>
        <meta 
          name="description" 
          content="Meet the leadership team of Aries76 Ltd, combining global capital-raising experience, investor-relations expertise, and strategic business development." 
        />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-6 py-32">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-24 text-center"
          >
            <h1 className="text-4xl md:text-6xl font-light text-foreground mb-6 uppercase tracking-tight">
              Leadership Team
            </h1>
            <div className="w-24 h-[1px] bg-accent mx-auto mb-8"></div>
            <p className="text-xl text-muted-foreground font-light leading-relaxed max-w-4xl mx-auto">
              Aries76 is led by experienced professionals combining global investment expertise with a forward-looking approach to fundraising, technology, and investor relations.
            </p>
          </motion.div>

          {/* Team Profiles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-3 gap-8 mb-32"
          >
            {leaders.map((leader, index) => (
              <motion.div
                key={leader.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              >
                <Card className="h-full border border-accent/30 hover:border-accent/60 transition-all duration-300 hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-normal text-foreground uppercase tracking-wide">
                      {leader.name}
                    </CardTitle>
                    <CardDescription className="text-accent font-light uppercase text-sm tracking-wider">
                      {leader.role}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground font-light leading-relaxed text-sm mb-4">
                      {leader.description}
                    </p>
                    <a 
                      href={`mailto:${leader.email}`}
                      className="text-accent hover:text-accent/80 transition-colors font-light text-sm"
                    >
                      {leader.email}
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Closing Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center"
          >
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-6 uppercase tracking-wider">
              A Leadership Aligned with Performance
            </h2>
            <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-3xl mx-auto mb-8">
              Our team combines strategic vision, technical expertise, and a shared commitment to execution excellence in alternative investments.
            </p>
            <Link to="/contact">
              <Button 
                variant="outline" 
                className="border-accent text-accent hover:bg-accent hover:text-white transition-all duration-300 uppercase tracking-wider font-light"
              >
                Get in Touch →
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LeadershipTeam;
