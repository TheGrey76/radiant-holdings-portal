import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import GPCallRequestForm from "@/components/GPCallRequestForm";
import { CheckCircle } from "lucide-react";

const GPFundraisingEconomics = () => {
  const [showCallForm, setShowCallForm] = useState(false);

  // Show full page content directly
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90 pt-24 pb-16">
      <div className="container max-w-5xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            GP Fundraising Economics
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            A transparent, aligned and sustainable model for your next fundraise
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Aries76 adopts a fundraising model designed to align with the interests of the General Partner, 
            the investors introduced, and Aries76 itself. This page provides an overview of how the economics 
            of a fundraising mandate are structured, how mandate complexity is evaluated, and how recurring fees 
            can support a long-term partnership.
          </p>
        </motion.div>

        {/* Section 1 - Fee Structure */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-6">1. Fee structure for GP fundraising</h2>
          
          <p className="text-lg text-muted-foreground mb-4">
            Instead of relying on heavy retainers, Aries76 focuses on a model where compensation is directly 
            linked to capital effectively raised and maintained with the fund or vehicle.
          </p>
          
          <p className="text-lg text-muted-foreground mb-8">
            Fees are composed of two main components: a recurring fee on AUM raised from investors introduced 
            by Aries76, and a one-off success fee on committed capital.
          </p>

          <div className="space-y-6">
            <Card className="p-6 bg-card/50">
              <h3 className="text-xl font-semibold mb-3">Recurring fee on AUM</h3>
              <p className="text-muted-foreground leading-relaxed">
                An annual fee in the range of <strong>10–20 basis points</strong> applied to the <strong>AUM 
                effectively raised</strong> from investors introduced by Aries76 and still invested in the fund 
                or vehicle. This fee is independent from the management fee charged by the GP and reflects the 
                long-term value of the investor relationship.
              </p>
            </Card>

            <Card className="p-6 bg-card/50">
              <h3 className="text-xl font-semibold mb-3">Success fee on committed capital</h3>
              <p className="text-muted-foreground leading-relaxed">
                A <strong>one-off success fee</strong> typically between <strong>1% and 2%</strong> of the 
                capital commitments made by investors introduced by Aries76. The exact percentage is determined 
                by the complexity and profile of the mandate, based on a set of objective criteria.
              </p>
            </Card>

            <Card className="p-6 bg-card/50">
              <h3 className="text-xl font-semibold mb-3">Scope and calculation base</h3>
              <p className="text-muted-foreground leading-relaxed">
                Fees apply exclusively to <strong>"Introduced Investors"</strong>, clearly defined in the 
                mandate (by name or by agreed investor clusters) as investors for which Aries76 is the effective 
                cause of the subscription.
              </p>
            </Card>

            <Card className="p-6 bg-card/50">
              <h3 className="text-xl font-semibold mb-3">Duration and tail period</h3>
              <p className="text-muted-foreground leading-relaxed">
                The recurring fee applies for the <strong>life of the fund/vehicle</strong> (plus any extension 
                period) or, for evergreen structures, for a contractually defined period. A <strong>tail 
                period</strong> ensures that the GP continues to recognise fees on new commitments from 
                Introduced Investors for a defined number of years, even if the mandate formally terminates.
              </p>
            </Card>
          </div>
        </motion.section>

        {/* Section 2 - Mandate Complexity */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-6">2. Mandate complexity assessment model</h2>
          
          <p className="text-lg text-muted-foreground mb-8">
            To define fee levels in a transparent and defensible way, Aries76 uses a structured scorecard 
            that assigns a 'complexity grade' to each fundraising mandate.
          </p>

          <p className="text-lg font-semibold mb-4">Key assessment dimensions include:</p>

          <div className="space-y-4">
            <div className="flex gap-3">
              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold mb-1">GP track record and standing</p>
                <p className="text-muted-foreground">
                  Number of prior funds, robustness and stability of performance, and recognition of the 
                  GP's brand among LPs.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold mb-1">Strategy attractiveness for LP demand</p>
                <p className="text-muted-foreground">
                  Alignment of the investment strategy with current allocation trends (for example, high-demand 
                  segments such as digital infrastructure, AI, energy transition, or other thematic focuses).
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold mb-1">Target fund size vs accessible LP base</p>
                <p className="text-muted-foreground">
                  Proportionality between the fundraising target, desired ticket sizes, and the depth and 
                  quality of the LP base that Aries76 can realistically activate.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold mb-1">Organisational readiness of the GP</p>
                <p className="text-muted-foreground">
                  Quality and completeness of marketing and due diligence materials, speed of response, 
                  existence of an internal IR function or clearly designated contacts.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold mb-1">Exclusivity and overlap with other agents</p>
                <p className="text-muted-foreground">
                  Scope of Aries76's exclusivity across geographies and investor clusters, and potential 
                  conflicts or overlaps with other placement arrangements.
                </p>
              </div>
            </div>
          </div>

          <p className="text-lg text-muted-foreground mt-6">
            Each dimension is scored on an internal scale. The aggregate score determines whether the mandate 
            is classified as standard, intermediate or complex, which in turn informs the fee range proposed.
          </p>
        </motion.section>

        {/* Section 3 - Pricing Tiers */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-6">3. Pricing tiers linked to mandate profile</h2>
          
          <p className="text-lg text-muted-foreground mb-8">
            The outcome of the complexity assessment is mapped to three indicative pricing tiers. These tiers 
            are a starting point for discussion and can be tailored to the specific characteristics of the fund 
            or vehicle.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 bg-card/50">
              <h3 className="text-xl font-bold mb-4 text-primary">Tier 1 – Standard Mandate</h3>
              <p className="text-muted-foreground mb-6 min-h-[100px]">
                GP with a solid track record, strategy broadly aligned with LP demand, and a fundraising 
                target consistent with the accessible LP base.
              </p>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold">Recurring fee:</p>
                  <p className="text-2xl font-bold text-primary">10 bps</p>
                  <p className="text-sm text-muted-foreground">on AUM from Introduced Investors</p>
                </div>
                <div>
                  <p className="font-semibold">Success fee:</p>
                  <p className="text-2xl font-bold text-primary">1%</p>
                  <p className="text-sm text-muted-foreground">on committed capital</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/50 border-primary/50">
              <h3 className="text-xl font-bold mb-4 text-primary">Tier 2 – Intermediate Mandate</h3>
              <p className="text-muted-foreground mb-6 min-h-[100px]">
                Situations where one or more factors (strategy, target size, internal readiness) require a 
                higher fundraising effort and more active support.
              </p>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold">Recurring fee:</p>
                  <p className="text-2xl font-bold text-primary">15 bps</p>
                  <p className="text-sm text-muted-foreground">on AUM from Introduced Investors</p>
                </div>
                <div>
                  <p className="font-semibold">Success fee:</p>
                  <p className="text-2xl font-bold text-primary">1.5%</p>
                  <p className="text-sm text-muted-foreground">on committed capital</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/50">
              <h3 className="text-xl font-bold mb-4 text-primary">Tier 3 – Complex Mandate</h3>
              <p className="text-muted-foreground mb-6 min-h-[100px]">
                Mandates involving less established GPs, more challenging or niche strategies, ambitious 
                fundraising targets and/or significant work to build the internal 'fundraising machine'.
              </p>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold">Recurring fee:</p>
                  <p className="text-2xl font-bold text-primary">20 bps</p>
                  <p className="text-sm text-muted-foreground">on AUM from Introduced Investors</p>
                </div>
                <div>
                  <p className="font-semibold">Success fee:</p>
                  <p className="text-2xl font-bold text-primary">2%</p>
                  <p className="text-sm text-muted-foreground">on committed capital</p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6 bg-primary/5 border-primary/20">
            <p className="text-muted-foreground">
              <strong>Note:</strong> These ranges are indicative. The final structure is agreed with the GP 
              after a focused review of the fund, strategy and target investor universe.
            </p>
          </Card>
        </motion.section>

        {/* Section 4 - Value Creation */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-6">4. Why this model creates value for GPs</h2>
          
          <div className="space-y-4 mb-8">
            <p className="text-lg text-muted-foreground">
              For the GP, the cost of fundraising becomes a direct function of success. Heavy retainers are 
              avoided or minimised, and compensation is linked to capital actually raised and retained over time.
            </p>
            
            <p className="text-lg text-muted-foreground">
              For Introduced Investors, the relationship is not transactional. Aries76 has a clear incentive 
              to maintain transparent, long-term dialogue, rather than focusing only on the initial subscription.
            </p>
            
            <p className="text-lg text-muted-foreground">
              For Aries76, a recurring AUM-linked revenue stream justifies ongoing investment in technology, 
              data and investor relationships, ultimately benefitting the GPs that choose to partner on a 
              multi-year basis.
            </p>
          </div>

          <Card className="p-8 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <p className="text-lg mb-6">
              Once registered, you can request a short introductory call with Aries76 to discuss how this 
              model would apply to your specific fund or vehicle and to receive an indicative mandate proposal.
            </p>
            <Button 
              size="lg" 
              onClick={() => setShowCallForm(true)}
              className="w-full sm:w-auto"
            >
              Request an introductory call
            </Button>
          </Card>
        </motion.section>

        {/* Call Request Form Modal */}
        {showCallForm && (
          <GPCallRequestForm onClose={() => setShowCallForm(false)} />
        )}
      </div>
    </div>
  );
};

export default GPFundraisingEconomics;