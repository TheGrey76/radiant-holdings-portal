import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Network as NetworkIcon, User, Briefcase, Mail, MessageSquare, Globe, LinkIcon } from 'lucide-react';

// Sample data for investors and startups
const investors = [
  { 
    id: 1, 
    name: "Alex Johnson", 
    company: "Venture Capital Partners", 
    sector: "AI & Machine Learning", 
    location: "London, UK", 
    investmentRange: "$1M - $5M", 
    avatar: "/placeholder.svg", 
    email: "alex@vcpartners.com",
    linkedin: "#"
  },
  { 
    id: 2, 
    name: "Sarah Williams", 
    company: "Future Funds", 
    sector: "Fintech", 
    location: "New York, USA", 
    investmentRange: "$500K - $2M", 
    avatar: "/placeholder.svg", 
    email: "sarah@futurefunds.com",
    linkedin: "#"
  },
  { 
    id: 3, 
    name: "Michael Chen", 
    company: "Tech Ventures", 
    sector: "SaaS", 
    location: "San Francisco, USA", 
    investmentRange: "$2M - $10M", 
    avatar: "/placeholder.svg", 
    email: "michael@techventures.com",
    linkedin: "#"
  },
];

const startups = [
  { 
    id: 1, 
    name: "DataMinds", 
    sector: "AI & Data Analytics", 
    stage: "Seed", 
    location: "Berlin, Germany", 
    seeking: "$750K", 
    logo: "/placeholder.svg", 
    description: "AI platform for data-driven decision making across industries",
    contact: "contact@dataminds.ai",
    website: "#"
  },
  { 
    id: 2, 
    name: "SecurePay", 
    sector: "Fintech", 
    stage: "Series A", 
    location: "London, UK", 
    seeking: "$3M", 
    logo: "/placeholder.svg", 
    description: "Next-generation payment processing solution with enhanced security features",
    contact: "info@securepay.tech",
    website: "#"
  },
  { 
    id: 3, 
    name: "GreenEnergy", 
    sector: "CleanTech", 
    stage: "Series B", 
    location: "Stockholm, Sweden", 
    seeking: "$8M", 
    logo: "/placeholder.svg", 
    description: "Renewable energy solutions for residential and commercial applications",
    contact: "partnerships@greenenergy.co",
    website: "#"
  },
];

const NetworkDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState("All");
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px 0px" });
  
  // Sectors for filtering
  const sectors = ["All", "AI & Machine Learning", "Fintech", "SaaS", "CleanTech", "Health Tech"];
  
  // Filter investors based on search term and selected sector
  const filteredInvestors = investors.filter(investor => 
    (investor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     investor.company.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedSector === "All" || investor.sector === selectedSector)
  );
  
  // Filter startups based on search term and selected sector
  const filteredStartups = startups.filter(startup => 
    (startup.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     startup.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedSector === "All" || startup.sector === selectedSector)
  );
  
  return (
    <>
      <Navbar />
      <div className="pt-48 pb-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12" ref={sectionRef}>
            <motion.span 
              className="inline-block px-3 py-1 bg-aries-gray text-aries-navy rounded-full text-sm font-medium mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              Aries76 Network
            </motion.span>
            <motion.h2 
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Connect with Investors & Startups
            </motion.h2>
            <motion.p 
              className="section-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Browse our curated directory of innovative startups seeking capital and forward-thinking investors looking for their next opportunity.
            </motion.p>
          </div>
          
          <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-1/2">
              <Input
                placeholder="Search by name, company or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
              {sectors.map((sector) => (
                <Button
                  key={sector}
                  variant={selectedSector === sector ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSector(sector)}
                  className="whitespace-nowrap"
                >
                  {sector}
                </Button>
              ))}
            </div>
          </div>
          
          <Tabs defaultValue="investors" className="w-full">
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="investors">Investors</TabsTrigger>
              <TabsTrigger value="startups">Startups</TabsTrigger>
            </TabsList>
            
            <TabsContent value="investors" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInvestors.map((investor) => (
                  <motion.div
                    key={investor.id}
                    className="bg-white rounded-xl shadow-smooth p-6 relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <div className="flex items-center mb-4">
                      <Avatar className="h-12 w-12 mr-4">
                        <AvatarImage src={investor.avatar} alt={investor.name} />
                        <AvatarFallback>{investor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold text-aries-navy">{investor.name}</h3>
                        <p className="text-gray-600 text-sm">{investor.company}</p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <Briefcase className="w-4 h-4 mr-2 text-aries-navy" />
                        <span>{investor.sector}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Globe className="w-4 h-4 mr-2 text-aries-navy" />
                        <span>{investor.location}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <User className="w-4 h-4 mr-2 text-aries-navy" />
                        <span>Invests: {investor.investmentRange}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button variant="outline" size="sm" className="flex items-center">
                        <Mail className="mr-1 h-4 w-4" />
                        <span>Email</span>
                      </Button>
                      <Button size="sm" className="flex items-center">
                        <MessageSquare className="mr-1 h-4 w-4" />
                        <span>Connect</span>
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {filteredInvestors.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No investors found matching your criteria.</p>
                  <Button 
                    variant="outline" 
                    onClick={() => {setSearchTerm(""); setSelectedSector("All");}} 
                    className="mt-4"
                  >
                    Reset filters
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="startups" className="space-y-8">
              <div className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Sector</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Seeking</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStartups.map((startup) => (
                      <TableRow key={startup.id}>
                        <TableCell>
                          <HoverCard>
                            <HoverCardTrigger>
                              <div className="flex items-center">
                                <Avatar className="h-8 w-8 mr-3">
                                  <AvatarImage src={startup.logo} alt={startup.name} />
                                  <AvatarFallback>{startup.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-aries-navy hover:underline cursor-pointer">{startup.name}</span>
                              </div>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80">
                              <div className="flex justify-between space-x-4">
                                <Avatar className="h-12 w-12">
                                  <AvatarImage src={startup.logo} alt={startup.name} />
                                  <AvatarFallback>{startup.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                  <h4 className="text-sm font-semibold">{startup.name}</h4>
                                  <p className="text-xs text-muted-foreground">{startup.description}</p>
                                  <div className="flex items-center pt-2">
                                    <Mail className="h-3.5 w-3.5 mr-1 opacity-70" />
                                    <span className="text-xs text-muted-foreground">{startup.contact}</span>
                                  </div>
                                </div>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        </TableCell>
                        <TableCell>{startup.sector}</TableCell>
                        <TableCell>{startup.stage}</TableCell>
                        <TableCell>{startup.location}</TableCell>
                        <TableCell>{startup.seeking}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="flex items-center h-8">
                              <LinkIcon className="h-3.5 w-3.5 mr-1" />
                              <span className="text-xs">Website</span>
                            </Button>
                            <Button size="sm" className="flex items-center h-8">
                              <MessageSquare className="h-3.5 w-3.5 mr-1" />
                              <span className="text-xs">Contact</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {filteredStartups.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No startups found matching your criteria.</p>
                    <Button 
                      variant="outline" 
                      onClick={() => {setSearchTerm(""); setSelectedSector("All");}} 
                      className="mt-4"
                    >
                      Reset filters
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-16 text-center">
            <motion.h3 
              className="text-2xl font-semibold mb-4 text-aries-navy"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Ready to join our network?
            </motion.h3>
            <motion.p 
              className="text-gray-600 mb-6 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Submit your profile to be featured in our directory and connect with potential investors or exciting startups.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Button size="lg" className="px-8">
                Register as Investor
              </Button>
              <Button size="lg" variant="outline" className="px-8">
                Submit Your Startup
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NetworkDirectory;
