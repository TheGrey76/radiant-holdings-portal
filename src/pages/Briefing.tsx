
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const Briefing = () => {
  const [briefing, setBriefing] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateBriefing = () => {
    setIsGenerating(true);
    
    // Simulate briefing generation
    setTimeout(() => {
      const sampleBriefing = `# Central Bank Digital Currencies Accelerate Amid Banking Sector Volatility

## Signal
Central banks across G7 nations are fast-tracking CBDC development timelines following recent regional banking stress. The European Central Bank announced pilot programs will expand by Q2 2024, while the Federal Reserve quietly increased its digital dollar research budget by 40%.

## Context
The acceleration comes as traditional banking faces mounting pressure from both regulatory scrutiny and competitive threats from fintech. Regional bank deposits have declined 8% since March, while digital payment volumes surge 23% year-over-year. Central banks are viewing CBDCs not just as monetary innovation, but as essential infrastructure for maintaining sovereign control over money flows. The timing coincides with increased geopolitical tensions around cross-border payments, particularly affecting SWIFT alternatives. China's digital yuan pilot has already processed over $14 billion in transactions, creating pressure on Western economies to avoid falling behind in the digital currency race. This shift represents the most significant monetary system change since the end of the gold standard.

## Implication
**Sovereign Monetary Control**: Central banks will gain unprecedented visibility into money flows, fundamentally altering privacy expectations and enabling real-time economic intervention capabilities.

**Banking Sector Disruption**: Traditional banks face existential pressure as governments can potentially offer direct digital accounts, eliminating intermediary roles in basic banking services.

**Capital Flight Mechanisms**: CBDCs will create new vectors for both government control and citizen evasion, with implications for authoritarian regimes and democratic oversight alike.

## Minted Indicators

| Metric | Value | Notes |
|--------|-------|-------|
| **Capital Sensitivity Index** | 4/5 | High institutional repositioning expected |
| **GeoSignal Strength** | High | Multi-sovereign coordination accelerating |
| **Sovereign Shift Factor** | Monetary sovereignty consolidation | Central banks reclaiming digital payment rails |
| **Monetization Vector** | Long fintech infrastructure, short regional banks | Position for the CBDC transition |
| **Trend Momentum** | ↑ | Accelerating across all major economies |

---

*Premium members get full data dashboards, audio brief, and capital allocation snapshots.*`;

      setBriefing(sampleBriefing);
      setIsGenerating(false);
    }, 2000);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case '↑': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case '↓': return <TrendingDown className="w-4 h-4 text-red-600" />;
      case '→': return <Minus className="w-4 h-4 text-gray-600" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow pt-28 md:pt-32 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-aries-navy mb-4">
              Minted Editorial Assistant - Test Page
            </h1>
            <p className="text-gray-600 mb-6">
              Generate daily financial-geopolitical briefings in Ghost-compatible markdown format.
            </p>
            
            <Button 
              onClick={generateBriefing}
              disabled={isGenerating}
              className="bg-aries-navy hover:bg-aries-blue"
            >
              {isGenerating ? 'Generating Briefing...' : 'Generate Sample Briefing'}
            </Button>
          </div>

          {briefing && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Generated Briefing
                  <Badge variant="secondary">Ghost Markdown</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                  <h3 className="font-semibold mb-2">Raw Markdown Output:</h3>
                  <pre className="text-sm overflow-x-auto whitespace-pre-wrap font-mono">
                    {briefing}
                  </pre>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-4">Rendered Preview:</h3>
                  <div className="prose prose-sm max-w-none">
                    <div dangerouslySetInnerHTML={{ 
                      __html: briefing
                        .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-aries-navy mb-4">$1</h1>')
                        .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold text-aries-blue mb-3 mt-6">$1</h2>')
                        .replace(/^\*\*(.*?)\*\*/gm, '<strong>$1</strong>')
                        .replace(/^\*(.*?)\*/gm, '<em>$1</em>')
                        .replace(/\n\n/g, '</p><p class="mb-4">')
                        .replace(/^\|(.*)$/gm, (match, content) => {
                          const cells = content.split('|').map(cell => cell.trim()).filter(cell => cell);
                          return `<tr>${cells.map(cell => `<td class="border px-3 py-2">${cell}</td>`).join('')}</tr>`;
                        })
                        .replace(/(<tr>.*<\/tr>)/s, '<table class="w-full border-collapse border border-gray-300 mt-4 mb-4">$1</table>')
                    }} 
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Briefing Structure Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold">Title</h4>
                <p className="text-sm text-gray-600">Strong and clear headline</p>
              </div>
              
              <div>
                <h4 className="font-semibold">Signal</h4>
                <p className="text-sm text-gray-600">2 sentences maximum - what's happening now</p>
              </div>
              
              <div>
                <h4 className="font-semibold">Context</h4>
                <p className="text-sm text-gray-600">4-6 sentences explaining background</p>
              </div>
              
              <div>
                <h4 className="font-semibold">Implication</h4>
                <p className="text-sm text-gray-600">3 clear forward-looking takeaways</p>
              </div>
              
              <div>
                <h4 className="font-semibold">Minted Indicators</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• Capital Sensitivity Index (1–5)</p>
                  <p>• GeoSignal Strength (Low / Medium / High)</p>
                  <p>• Sovereign Shift Factor (brief explanation)</p>
                  <p>• Monetization Vector (suggested exposure)</p>
                  <p>• Trend Momentum (↑ / → / ↓)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Briefing;
