import { motion } from "framer-motion";
import { FileText, Download, Building2, Users, Briefcase, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const materials = [
  {
    id: "overview",
    title: "Aries76 Overview",
    description: "Company introduction and value proposition for PE/VC funds and institutional investors",
    icon: Building2,
    file: "/marketing/Aries76_Overview.pdf",
    pages: 2,
    category: "Company"
  },
  {
    id: "gp-services",
    title: "Services for Fund Managers",
    description: "AI-powered solutions for PE/VC funds: deal sourcing, portfolio value creation, and market intelligence",
    icon: Briefcase,
    file: "/marketing/Aries76_GP_Services.pdf",
    pages: 2,
    category: "GP Services"
  },
  {
    id: "lp-services",
    title: "Services for Limited Partners",
    description: "Institutional-grade advisory: fund selection, due diligence, portfolio management, and strategic advisory",
    icon: Users,
    file: "/marketing/Aries76_LP_Services.pdf",
    pages: 2,
    category: "LP Services"
  },
  {
    id: "service-catalog",
    title: "Service Catalog 2026",
    description: "Complete pricing and service breakdown for GPs and LPs with quick-win packages",
    icon: BookOpen,
    file: "/marketing/Aries76_Service_Catalog.pdf",
    pages: 4,
    category: "Pricing"
  }
];

const MarketingMaterials = () => {
  const handleDownload = (file: string, title: string) => {
    const link = document.createElement("a");
    link.href = file;
    link.download = title.replace(/\s+/g, "_") + ".pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    materials.forEach((material, index) => {
      setTimeout(() => {
        handleDownload(material.file, material.title);
      }, index * 500);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/50 to-slate-950">
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
              <FileText className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 text-sm font-medium">Marketing Materials</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Aries76 <span className="text-amber-400">Collateral</span>
            </h1>
            
            <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
              Professional marketing materials for fund managers and institutional investors. 
              Download individual documents or the complete package.
            </p>

            <Button 
              onClick={handleDownloadAll}
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold"
            >
              <Download className="w-5 h-5 mr-2" />
              Download All Materials
            </Button>
          </motion.div>

          {/* Materials Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {materials.map((material, index) => (
              <motion.div
                key={material.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-slate-900/50 border-slate-700/50 hover:border-amber-500/30 transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-amber-500/10">
                          <material.icon className="w-6 h-6 text-amber-400" />
                        </div>
                        <div>
                          <span className="text-xs text-amber-400 font-medium uppercase tracking-wider">
                            {material.category}
                          </span>
                          <CardTitle className="text-white text-lg mt-1">
                            {material.title}
                          </CardTitle>
                        </div>
                      </div>
                      <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
                        {material.pages} pages
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-400 mb-6">
                      {material.description}
                    </CardDescription>
                    
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-slate-600 hover:border-amber-500/50 hover:bg-amber-500/10"
                        onClick={() => window.open(material.file, '_blank')}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        View PDF
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-900"
                        onClick={() => handleDownload(material.file, material.title)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { label: "Years Experience", value: "26+" },
              { label: "Companies Monitored", value: "500+" },
              { label: "Capital Markets Track Record", value: "€3B+" },
              { label: "Offices", value: "London • Milan" }
            ].map((stat, index) => (
              <div key={index} className="text-center p-6 rounded-xl bg-slate-900/30 border border-slate-700/30">
                <div className="text-2xl md:text-3xl font-bold text-amber-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 text-center p-8 rounded-2xl bg-gradient-to-r from-amber-500/10 to-blue-500/10 border border-amber-500/20"
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Explore Partnership Opportunities?
            </h3>
            <p className="text-slate-300 mb-6 max-w-xl mx-auto">
              Schedule a discovery call to discuss how Aries76 can support your capital formation and investment goals.
            </p>
            <Button
              size="lg"
              variant="outline"
              className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
              onClick={() => window.location.href = '/contact'}
            >
              Schedule a Call
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default MarketingMaterials;
