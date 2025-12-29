import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import ReportChart from './ReportChart';
import ReportTable from './ReportTable';
import ReportCallout from './ReportCallout';

export interface SectionData {
  id: string;
  section_type: 'hero' | 'text' | 'chart' | 'table' | 'callout' | 'image' | 'quote' | 'divider' | 'live_data';
  title?: string;
  subtitle?: string;
  content_md?: string;
  chart_config?: Record<string, unknown>;
  table_data?: Record<string, unknown>;
  image_url?: string;
  css_classes?: string;
  is_preview?: boolean;
  metadata?: Record<string, unknown>;
}

interface ReportSectionProps {
  section: SectionData;
  index: number;
  isBlurred?: boolean;
}

const ReportSection = ({ section, index, isBlurred = false }: ReportSectionProps) => {
  const renderContent = () => {
    switch (section.section_type) {
      case 'text':
        return (
          <div className="prose prose-invert prose-zinc max-w-none">
            {section.title && (
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{section.title}</h2>
            )}
            {section.subtitle && (
              <p className="text-lg text-zinc-400 mb-6">{section.subtitle}</p>
            )}
            {section.content_md && (
              <div 
                className="text-zinc-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: section.content_md }}
              />
            )}
          </div>
        );

      case 'chart':
        return (
          <div>
            {section.title && (
              <h3 className="text-xl font-semibold text-white mb-4">{section.title}</h3>
            )}
            <ReportChart config={section.chart_config} />
          </div>
        );

      case 'table':
        return (
          <div>
            {section.title && (
              <h3 className="text-xl font-semibold text-white mb-4">{section.title}</h3>
            )}
            <ReportTable data={section.table_data} />
          </div>
        );

      case 'callout':
        return (
          <ReportCallout
            title={section.title}
            content={section.content_md}
            variant={(section.metadata?.variant as 'info' | 'warning' | 'success') || 'info'}
          />
        );

      case 'image':
        return (
          <figure className="my-8">
            {section.image_url && (
              <img 
                src={section.image_url} 
                alt={section.title || 'Report image'}
                className="w-full rounded-lg border border-zinc-800"
              />
            )}
            {section.title && (
              <figcaption className="text-sm text-zinc-500 mt-2 text-center">
                {section.title}
              </figcaption>
            )}
          </figure>
        );

      case 'quote':
        return (
          <blockquote className="border-l-4 border-accent pl-6 py-4 my-8 bg-zinc-900/50 rounded-r-lg">
            <p className="text-lg text-zinc-300 italic mb-2">{section.content_md}</p>
            {section.title && (
              <cite className="text-sm text-zinc-500">— {section.title}</cite>
            )}
          </blockquote>
        );

      case 'divider':
        return (
          <div className="flex items-center justify-center my-12">
            <div className="w-16 h-px bg-zinc-700" />
            <div className="w-2 h-2 bg-accent rounded-full mx-4" />
            <div className="w-16 h-px bg-zinc-700" />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={cn(
        'relative',
        section.css_classes,
        isBlurred && 'select-none'
      )}
    >
      {isBlurred && (
        <div className="absolute inset-0 backdrop-blur-md bg-zinc-900/50 z-10 flex items-center justify-center rounded-lg">
          <div className="text-center p-8">
            <p className="text-zinc-400 text-lg mb-2">🔒 Premium Content</p>
            <p className="text-zinc-500 text-sm">Purchase the report to unlock this section</p>
          </div>
        </div>
      )}
      {renderContent()}
    </motion.div>
  );
};

export default ReportSection;
