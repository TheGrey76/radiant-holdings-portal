import { motion } from "framer-motion";
import DOMPurify from "dompurify";
import { Tables } from "@/integrations/supabase/types";
import { ReportChart } from "./ReportChart";
import { ReportTable } from "./ReportTable";
import { ReportCallout } from "./ReportCallout";
import { Lock } from "lucide-react";

interface ReportSectionProps {
  section: Tables<"report_sections">;
  hasAccess?: boolean;
  index?: number;
}

export const ReportSection = ({ section, hasAccess = false, index = 0 }: ReportSectionProps) => {
  // If section is not preview and user doesn't have access, show locked state
  if (!section.is_preview && !hasAccess) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="py-8 border-b border-border/30 last:border-0"
      >
        <div className="relative overflow-hidden rounded-xl bg-muted/30 border border-border/50 p-8">
          <div className="absolute inset-0 backdrop-blur-sm bg-background/50 flex flex-col items-center justify-center z-10">
            <Lock className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-foreground">Premium Content</p>
            <p className="text-sm text-muted-foreground">Purchase to unlock this section</p>
          </div>
          
          {/* Blurred preview */}
          <div className="blur-sm select-none pointer-events-none">
            {section.title && (
              <h3 className="text-2xl font-semibold mb-4">{section.title}</h3>
            )}
            <p className="text-muted-foreground">
              This section contains exclusive analysis and insights available only to report purchasers.
            </p>
          </div>
        </div>
      </motion.section>
    );
  }

  const renderContent = () => {
    switch (section.section_type) {
      case 'text':
      case 'markdown':
        return (
          <div className="prose prose-invert max-w-none">
            {section.title && (
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
                {section.title}
              </h2>
            )}
            {section.subtitle && (
              <p className="text-lg text-muted-foreground mb-6">{section.subtitle}</p>
            )}
            {section.content_md && (
              <div 
                className="text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(section.content_md, {
                  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'span', 'blockquote', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
                  ALLOWED_ATTR: ['href', 'target', 'class', 'style']
                }) }}
              />
            )}
          </div>
        );
        
      case 'chart':
        return (
          <div>
            {section.title && (
              <h3 className="text-xl font-semibold text-foreground mb-4">{section.title}</h3>
            )}
            <ReportChart config={section.chart_config} />
          </div>
        );
        
      case 'table':
        return (
          <div>
            {section.title && (
              <h3 className="text-xl font-semibold text-foreground mb-4">{section.title}</h3>
            )}
            <ReportTable data={section.table_data} />
          </div>
        );
        
      case 'callout':
      case 'key_takeaway':
        return (
          <ReportCallout 
            title={section.title || undefined}
            content={section.content_md || ''}
            variant={section.section_type === 'key_takeaway' ? 'highlight' : 'default'}
          />
        );
        
      case 'image':
        return (
          <figure>
            {section.image_url && (
              <img 
                src={section.image_url} 
                alt={section.title || 'Report image'}
                className="w-full rounded-xl border border-border/50"
              />
            )}
            {section.title && (
              <figcaption className="text-center text-sm text-muted-foreground mt-3">
                {section.title}
              </figcaption>
            )}
          </figure>
        );
        
      case 'divider':
        return <hr className="border-border/50 my-8" />;
        
      default:
        return (
          <div className="p-6 bg-muted/30 rounded-xl border border-border/50">
            {section.title && (
              <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
            )}
            {section.content_md && (
              <p className="text-muted-foreground">{section.content_md}</p>
            )}
          </div>
        );
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`py-8 border-b border-border/30 last:border-0 ${section.css_classes || ''}`}
      id={`section-${section.id}`}
    >
      {renderContent()}
    </motion.section>
  );
};
