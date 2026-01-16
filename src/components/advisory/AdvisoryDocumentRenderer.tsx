import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Lightbulb, AlertTriangle, Info, CheckCircle2 } from "lucide-react";

interface ContentSection {
  type: string;
  content?: string;
  level?: number;
  items?: string[];
  ordered?: boolean;
  rows?: string[][];
  headers?: string[];
  src?: string;
  alt?: string;
  caption?: string;
  variant?: 'info' | 'warning' | 'success' | 'insight';
}

interface AdvisoryDocumentRendererProps {
  content: ContentSection[];
}

const AdvisoryDocumentRenderer: React.FC<AdvisoryDocumentRendererProps> = ({ content }) => {
  const renderSection = (section: ContentSection, index: number) => {
    const sectionId = `section-${index}`;

    switch (section.type) {
      case 'heading':
        return renderHeading(section, sectionId, index);
      case 'paragraph':
        return renderParagraph(section, index);
      case 'list':
        return renderList(section, index);
      case 'table':
        return renderTable(section, index);
      case 'image':
        return renderImage(section, index);
      case 'callout':
        return renderCallout(section, index);
      case 'divider':
        return <hr key={index} className="my-8 border-border" />;
      case 'blockquote':
        return renderBlockquote(section, index);
      default:
        return null;
    }
  };

  const renderHeading = (section: ContentSection, id: string, index: number) => {
    const level = section.level || 1;
    const baseClasses = "font-bold text-foreground";
    
    const levelClasses: Record<number, string> = {
      1: "text-2xl md:text-3xl mt-12 mb-6 pb-3 border-b border-border",
      2: "text-xl md:text-2xl mt-10 mb-4",
      3: "text-lg md:text-xl mt-8 mb-3",
      4: "text-base md:text-lg mt-6 mb-2",
    };

    const HeadingTag = level === 1 ? 'h1' : level === 2 ? 'h2' : level === 3 ? 'h3' : 'h4';

    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.4 }}
      >
        <HeadingTag id={id} className={cn(baseClasses, levelClasses[level] || levelClasses[4])}>
          {section.content}
        </HeadingTag>
      </motion.div>
    );
  };

  const renderParagraph = (section: ContentSection, index: number) => {
    return (
      <motion.p
        key={index}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="text-foreground/90 leading-relaxed mb-4 text-base md:text-lg"
      >
        {section.content}
      </motion.p>
    );
  };

  const renderList = (section: ContentSection, index: number) => {
    const Tag = section.ordered ? 'ol' : 'ul';
    const listClass = section.ordered 
      ? "list-decimal list-inside space-y-2 mb-6 ml-4"
      : "list-disc list-inside space-y-2 mb-6 ml-4";

    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.4 }}
      >
        <Tag className={listClass}>
          {section.items?.map((item, i) => (
            <li key={i} className="text-foreground/90 text-base md:text-lg">
              {item}
            </li>
          ))}
        </Tag>
      </motion.div>
    );
  };

  const renderTable = (section: ContentSection, index: number) => {
    if (!section.rows || section.rows.length === 0) return null;

    const headers = section.headers || section.rows[0];
    const dataRows = section.headers ? section.rows : section.rows.slice(1);

    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.4 }}
        className="my-8 overflow-x-auto"
      >
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                {headers.map((header, i) => (
                  <TableHead key={i} className="font-semibold text-foreground">
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataRows.map((row, rowIndex) => (
                <TableRow key={rowIndex} className="hover:bg-muted/30">
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex} className="text-foreground/90">
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {section.caption && (
          <p className="text-sm text-muted-foreground mt-2 text-center italic">
            {section.caption}
          </p>
        )}
      </motion.div>
    );
  };

  const renderImage = (section: ContentSection, index: number) => {
    if (!section.src) return null;

    return (
      <motion.figure
        key={index}
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.4 }}
        className="my-8"
      >
        <div className="rounded-lg overflow-hidden border border-border">
          <img
            src={section.src}
            alt={section.alt || "Document image"}
            className="w-full h-auto"
          />
        </div>
        {section.caption && (
          <figcaption className="text-sm text-muted-foreground mt-2 text-center italic">
            {section.caption}
          </figcaption>
        )}
      </motion.figure>
    );
  };

  const renderCallout = (section: ContentSection, index: number) => {
    const variant = section.variant || 'info';
    
    const variantConfig = {
      info: {
        icon: Info,
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        iconColor: 'text-blue-500',
      },
      warning: {
        icon: AlertTriangle,
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        iconColor: 'text-amber-500',
      },
      success: {
        icon: CheckCircle2,
        bg: 'bg-green-500/10',
        border: 'border-green-500/30',
        iconColor: 'text-green-500',
      },
      insight: {
        icon: Lightbulb,
        bg: 'bg-primary/10',
        border: 'border-primary/30',
        iconColor: 'text-primary',
      },
    };

    const config = variantConfig[variant];
    const Icon = config.icon;

    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, x: 10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.4 }}
      >
        <Card className={cn(
          "my-6 p-4 border-l-4",
          config.bg,
          config.border
        )}>
          <div className="flex gap-3">
            <Icon className={cn("w-5 h-5 mt-0.5 shrink-0", config.iconColor)} />
            <p className="text-foreground/90 text-base">
              {section.content}
            </p>
          </div>
        </Card>
      </motion.div>
    );
  };

  const renderBlockquote = (section: ContentSection, index: number) => {
    return (
      <motion.blockquote
        key={index}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.4 }}
        className="my-6 pl-4 border-l-4 border-primary/50 italic text-foreground/80 text-lg"
      >
        {section.content}
      </motion.blockquote>
    );
  };

  if (!content || content.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Contenuto non disponibile</p>
      </div>
    );
  }

  return (
    <div className="advisory-document-content">
      {content.map((section, index) => renderSection(section, index))}
    </div>
  );
};

export default AdvisoryDocumentRenderer;