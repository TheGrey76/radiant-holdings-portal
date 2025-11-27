// Shared styling components for Bitcoin 2026 Report
export const reportStyles = {
  // Typography
  h2: "text-4xl font-bold text-foreground mb-6 leading-tight scroll-mt-20",
  h3: "text-2xl font-bold text-foreground mt-12 mb-6 flex items-center gap-3",
  h4: "text-xl font-semibold text-foreground mt-8 mb-4",
  paragraph: "text-base leading-relaxed text-foreground/80 mb-8",
  firstParagraph: "text-lg leading-relaxed text-foreground/90 mb-8 first-letter:text-5xl first-letter:font-bold first-letter:text-primary first-letter:mr-2 first-letter:float-left",
  
  // Layout
  section: "mb-24 scroll-mt-24",
  chapterHeader: "mb-10",
  badge: "inline-block px-3 py-1 bg-primary/10 rounded-md mb-4",
  badgeText: "text-xs font-semibold text-primary uppercase tracking-wider",
  divider: "h-1 w-24 bg-gradient-to-r from-primary to-accent rounded-full",
  
  // Components
  figure: "my-12 max-w-3xl mx-auto",
  figureCard: "bg-muted/30 p-6 rounded-xl border-2 border-border/50 shadow-smooth hover:shadow-smooth-lg transition-shadow duration-300",
  figureImage: "w-full h-auto rounded-lg",
  figcaption: "text-sm text-muted-foreground mt-4 text-center font-medium",
  
  // Tables
  table: "w-full text-sm",
  tableHead: "border-b-2 border-primary/20",
  tableHeadCell: "px-6 py-4 text-left font-semibold text-foreground",
  tableBody: "text-foreground/80",
  tableRow: "border-b border-border hover:bg-muted/30 transition-colors",
  tableCell: "px-6 py-4",
  tableCellBold: "px-6 py-4 font-medium text-foreground",
  
  // Special components
  keyTakeaways: "bg-gradient-to-br from-primary/5 to-accent/5 border-l-4 border-primary rounded-r-xl p-8 my-10 shadow-smooth",
  codeBlock: "my-8 bg-muted/30 border-2 border-border/50 rounded-xl p-6",
  codeText: "text-xs font-mono text-foreground/70 overflow-x-auto",
  
  // Lists
  ul: "list-disc list-inside text-base leading-relaxed text-foreground/80 mb-8 space-y-3",
  ulCompact: "space-y-2 text-foreground/80",
  
  // Bullet point
  bullet: "text-primary font-bold mt-1"
};

export const ChapterBadge = ({ number }: { number: string }) => (
  <div className={reportStyles.badge}>
    <span className={reportStyles.badgeText}>Chapter {number}</span>
  </div>
);

export const SectionDivider = () => (
  <div className={reportStyles.divider}></div>
);

export const BulletPoint = () => (
  <span className={reportStyles.bullet}>•</span>
);
