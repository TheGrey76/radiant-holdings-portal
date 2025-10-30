import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "What is GP Capital Advisory?",
      answer: "GP Capital Advisory is a specialized advisory service focused on management companies of General Partners (GPs) in private markets. We help GPs with equity investments, M&A transactions, financing solutions, minority stakes, succession planning, and valuation services. Unlike traditional fund advisory, we focus on the GP entity itself—helping management companies grow, attract capital, and optimize their structure."
    },
    {
      question: "Who are Aries76's typical clients?",
      answer: "We primarily work with second and later-generation GPs managing €1–5 billion in assets under management (AUM). Our clients are typically based in Luxembourg, London, Paris, and the Nordic countries, operating in sectors such as digital infrastructure & AI, healthcare & life sciences, sustainability & energy transition, industrial technology, and selective consumer & luxury markets."
    },
    {
      question: "What services does Aries76 provide?",
      answer: "Aries76 provides comprehensive GP Capital Advisory services including: GP equity investments (minority and majority stakes), GP M&A transactions, GP financing solutions (debt, preferred equity, hybrid instruments), minority stakes and liquidity options, succession planning and partner alignment, and independent valuation and forecasting for management companies. We also offer strategic fund advisory and investor relations support."
    },
    {
      question: "How does GP equity investment work?",
      answer: "GP equity investment involves external investors acquiring minority or majority stakes in the management company itself (not just the fund). This provides GPs with growth capital for geographic expansion, product development, technology infrastructure, or team expansion—while allowing founding partners to achieve partial liquidity. We help structure these transactions, identify suitable investors, and negotiate optimal terms."
    },
    {
      question: "What is the typical GP Capital Advisory process?",
      answer: "Our process follows six key stages: (1) Diagnostics & Current State Assessment, (2) Strategy Memo & Options Analysis, (3) Market Soundings & Investor Engagement, (4) Deal Structuring & Term Sheet, (5) Execution & Negotiations, and (6) Closing & Transition Plan. The entire process is tailored to each client's specific needs and typically takes 3-6 months depending on complexity."
    },
    {
      question: "How does Aries76 value management companies?",
      answer: "We use a comprehensive, data-driven approach to valuation that considers multiple factors: fee income quality and recurring revenue, carry economics and realization profile, product pipeline and fund launch trajectory, team retention and succession readiness, operating leverage and margin efficiency, and governance & compliance infrastructure. Our AIRES AI-powered analytics platform enhances this process with market intelligence and benchmarking data."
    },
    {
      question: "What makes Aries76 different from other advisors?",
      answer: "Aries76 combines four unique strengths: (1) Global Network Access—direct reach to LPs, family offices, and allocators across UK, Europe, and MENA; (2) Cross-Border Expertise—proven execution in London, Zurich, Luxembourg, and Budapest; (3) Integrated Advisory Model—unified strategy, capital formation, and investor relations; and (4) AI-Powered Intelligence (AIRES)—advanced analytics for investor targeting and market intelligence."
    },
    {
      question: "What is AIRES?",
      answer: "AIRES (Aries Intelligence & Research Engine System) is our proprietary AI-powered analytics platform that provides advanced investor targeting, engagement optimization, and market intelligence. AIRES helps identify optimal investor matches, analyze market trends, and optimize fundraising strategies using machine learning and data analytics. This technology gives our clients a competitive advantage in capital formation and investor relations."
    },
    {
      question: "What geographies does Aries76 cover?",
      answer: "We operate across Europe, the UK, and select global regions with particular expertise in Luxembourg, London, Paris, and the Nordic countries. Our network extends to Switzerland (Zurich) and Central Europe (Budapest). We also have strong connections with institutional investors and family offices in the MENA region."
    },
    {
      question: "What sectors does Aries76 focus on?",
      answer: "We specialize in five key sectors: Digital Infrastructure & AI Infrastructure (data centers, cloud infrastructure, AI compute), Healthcare & Life Sciences (medtech, biotech, healthcare services), Sustainability & Energy Transition (renewable energy, clean tech, ESG-focused investments), Industrial Technology (automation, manufacturing tech, Industry 4.0), and selective Consumer & Luxury opportunities where we see exceptional value creation potential."
    },
    {
      question: "How can GPs benefit from succession planning services?",
      answer: "Our succession planning services help GPs navigate leadership transitions smoothly while maintaining firm stability and performance. We structure succession programs that include next-generation partner identification and development, incentive restructuring and economic realignment, governance framework updates, knowledge transfer protocols, and partial liquidity options for retiring partners. This ensures continuity and strengthens the management company for long-term success."
    },
    {
      question: "What is the fee structure for Aries76 services?",
      answer: "Our fee structure is customized based on engagement scope, complexity, and expected outcomes. We typically work on a combination of advisory fees and success-based compensation aligned with transaction completion. We provide transparent fee proposals during initial consultations and ensure our interests are fully aligned with client success. Contact us for a confidential discussion about your specific needs."
    },
    {
      question: "How long does a typical GP Capital Advisory engagement take?",
      answer: "Engagement duration varies based on transaction complexity and market conditions. A typical GP equity raise or M&A transaction takes 3-6 months from initial diagnostics to closing. Valuation and strategic advisory projects may be completed in 6-12 weeks, while ongoing investor relations and capital formation support can be structured as multi-year partnerships."
    },
    {
      question: "Can Aries76 help with fund formation as well as GP advisory?",
      answer: "Yes, we provide comprehensive support for both fund formation and GP-level advisory. Our Private Equity Funds service line helps GPs structure and launch new funds, access investors, and optimize fund terms. Our GP Capital Advisory focuses on the management company itself. Many clients engage us for both services to create a holistic capital strategy covering both fund vehicles and the GP entity."
    },
    {
      question: "How do I get started with Aries76?",
      answer: "Getting started is simple: schedule a confidential introductory call with our team by contacting quinley.martini@aries76.com. During this initial 15-30 minute conversation, we'll discuss your current situation, strategic objectives, and how Aries76 can support your goals. There's no obligation, and all discussions are conducted under strict confidentiality. We look forward to exploring how we can support your growth ambitions."
    }
  ];

  // Inject FAQ Schema on mount
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    });
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      {/* Hero */}
      <section className="px-6 md:px-10 py-16 bg-gradient-to-br from-[#0f1729] via-[#1a2744] to-[#0d1424] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-light tracking-tight mb-6"
          >
            Frequently Asked <span className="text-accent">Questions</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl font-light text-white/80"
          >
            Everything you need to know about Aries76 and our GP Capital Advisory services
          </motion.p>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="px-6 md:px-10 py-20">
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <AccordionItem value={`item-${index}`} className="border border-border/50 rounded-lg px-6 bg-card">
                  <AccordionTrigger className="text-left hover:no-underline py-6">
                    <span className="text-lg font-light text-foreground pr-4">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground font-light leading-relaxed pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-10 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-light text-foreground mb-6">
              Still have questions?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Contact us for a confidential conversation about your specific needs
            </p>
            <a
              href="mailto:quinley.martini@aries76.com"
              className="inline-block bg-accent hover:bg-accent/90 text-white font-light px-8 py-3 rounded-md uppercase tracking-wider transition-colors"
            >
              Get in Touch
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;