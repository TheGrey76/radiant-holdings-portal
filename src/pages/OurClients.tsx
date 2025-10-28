import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Link } from 'react-router-dom';

interface Client {
  id: string;
  name: string;
  logo: string;
  shortDescription: string;
  longDescription: string;
  website: string;
  highlights?: string[];
}

const clients: Client[] = [
  {
    id: 'faro',
    name: 'Faro Alternative Investments',
    logo: 'https://www.faroalternativeinvestments.com/wp-content/uploads/2024/03/faro-logo.png',
    shortDescription: 'Faro Alternative Investments is a Luxembourg-based multi-compartment SICAV-RAIF platform managing specialized sub-funds in private equity and venture capital.',
    longDescription: `Faro Alternative Investments SCSp SICAV-RAIF is a Luxembourg alternative investment umbrella fund operating globally across private equity and venture strategies. It combines industrial know-how with a scalable platform model designed to attract specialized advisory companies.

Through sub-funds such as Faro Real Economy, the platform invests in European SMEs with strong growth potential across sectors including manufacturing, food & beverage, aerospace, digital, and healthcare.

Faro integrates ESG principles (Article 8 SFDR) into its investment process and targets institutional and professional investors seeking exposure to real-economy opportunities.`,
    website: 'https://www.faroalternativeinvestments.com/',
    highlights: [
      'Multi-compartment structure (SICAV-RAIF, Luxembourg)',
      'Focus on SMEs, real economy, and industrial growth',
      'ESG Article 8 compliant',
      'Advisory Company: Orienta Capital Partners',
      'Target Fund Size: €250M',
      'Expected Net IRR: 20–25%'
    ]
  }
];

const ClientCard = ({ client }: { client: Client }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="group cursor-pointer transition-all duration-300 hover:shadow-smooth-lg border-border/50 hover:border-accent/30 bg-card">
          <CardHeader className="pb-4">
            <div className="h-32 flex items-center justify-center p-6 bg-muted/30 rounded-lg mb-4 group-hover:bg-muted/50 transition-colors">
              <img 
                src={client.logo} 
                alt={`${client.name} logo`} 
                className="max-h-20 max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x100?text=' + encodeURIComponent(client.name);
                }}
              />
            </div>
            <CardTitle className="text-lg font-light text-foreground group-hover:text-accent transition-colors">
              {client.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm text-muted-foreground font-light leading-relaxed line-clamp-3">
              {client.shortDescription}
            </CardDescription>
            <div className="mt-4 text-xs text-accent font-light uppercase tracking-wider flex items-center gap-2 group-hover:gap-3 transition-all">
              View Details
              <ExternalLink className="w-3 h-3" />
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="mb-4 p-6 bg-muted/30 rounded-lg flex items-center justify-center">
            <img 
              src={client.logo} 
              alt={`${client.name} logo`} 
              className="max-h-24 max-w-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x150?text=' + encodeURIComponent(client.name);
              }}
            />
          </div>
          <DialogTitle className="text-2xl font-light text-foreground">{client.name}</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground font-light leading-relaxed whitespace-pre-line mt-4">
            {client.longDescription}
          </DialogDescription>
        </DialogHeader>
        
        {client.highlights && client.highlights.length > 0 && (
          <div className="mt-6 space-y-3">
            <h4 className="text-sm font-medium text-foreground uppercase tracking-wider">Key Highlights</h4>
            <ul className="space-y-2">
              {client.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground font-light">
                  <span className="text-accent mt-1">•</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="mt-6">
          <Button asChild variant="default" className="w-full">
            <a href={client.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
              Visit Website
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const OurClients = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 md:px-10 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-light text-foreground mb-6 tracking-tight">
              Our Clients & Partners
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed mb-8">
              We are proud to collaborate with leading funds, platforms, and investment managers across alternative markets.
            </p>
            <div className="w-20 h-1 bg-accent mx-auto mb-12"></div>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 px-6 md:px-10 bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-lg text-foreground/80 font-light leading-relaxed text-center"
          >
            Aries76 partners with distinguished investment firms and platforms globally, 
            supporting capital raising, strategic growth, and fund placement initiatives 
            across private equity, venture capital, and real economy sectors.
          </motion.p>
        </div>
      </section>

      {/* Clients Grid */}
      <section className="py-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {clients.map((client, index) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ClientCard client={client} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-10 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-light text-foreground mb-6 tracking-tight">
              Build Value & Long-Term Partnerships
            </h2>
            <p className="text-lg text-muted-foreground font-light leading-relaxed mb-8">
              We work alongside leading investment platforms and managers to build value 
              and long-term partnerships. Discover how Aries76 can support your capital 
              formation objectives.
            </p>
            <Button asChild size="lg" className="font-light uppercase tracking-wider">
              <Link to="/contact">
                Get in Touch
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default OurClients;
