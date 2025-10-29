import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  coverPage: {
    backgroundColor: '#0f1729',
    padding: 60,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  coverTitle: {
    fontSize: 36,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Helvetica-Bold',
  },
  coverSubtitle: {
    fontSize: 20,
    color: '#fbbf24',
    textAlign: 'center',
    marginBottom: 40,
  },
  coverTagline: {
    fontSize: 14,
    color: '#d1d5db',
    textAlign: 'center',
    lineHeight: 1.6,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 15,
    color: '#0f1729',
    fontFamily: 'Helvetica-Bold',
  },
  sectionTitleAccent: {
    fontSize: 20,
    color: '#fbbf24',
    fontFamily: 'Helvetica-Bold',
  },
  paragraph: {
    fontSize: 11,
    lineHeight: 1.8,
    color: '#374151',
    marginBottom: 12,
  },
  subsection: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9fafb',
    borderRadius: 4,
  },
  subsectionTitle: {
    fontSize: 14,
    marginBottom: 8,
    color: '#0f1729',
    fontFamily: 'Helvetica-Bold',
  },
  subsectionText: {
    fontSize: 10,
    lineHeight: 1.6,
    color: '#4b5563',
  },
  bulletPoint: {
    fontSize: 10,
    lineHeight: 1.8,
    color: '#374151',
    marginBottom: 8,
    paddingLeft: 15,
  },
  table: {
    marginTop: 15,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e5e7eb',
    padding: 10,
    borderRadius: 4,
    marginBottom: 5,
  },
  tableHeaderCell: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#0f1729',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tableCell: {
    fontSize: 9,
    color: '#374151',
    lineHeight: 1.4,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    color: '#9ca3af',
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10,
  },
});

const PrivateEquityPDFDocument = () => (
  <Document>
    {/* Cover Page */}
    <Page size="A4" style={styles.coverPage}>
      <View>
        <Text style={styles.coverTitle}>Strategic Advisory for International</Text>
        <Text style={styles.coverTitle}>Private Equity Managers</Text>
        <Text style={styles.coverSubtitle}>Private Equity Funds Advisory</Text>
        <Text style={styles.coverTagline}>
          Supporting established GPs in cross-border capital formation and investor access
        </Text>
      </View>
      <View style={{ position: 'absolute', bottom: 40 }}>
        <Text style={{ fontSize: 12, color: '#d1d5db' }}>ARIES76 Ltd</Text>
      </View>
    </Page>

    {/* Introduction */}
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={styles.paragraph}>
          Aries76 Ltd partners with mid-to-large international Private Equity funds (AUM &gt; €1bn) seeking to expand their investor base across Europe, the UK, and select global regions. Operating at the intersection of private markets, structured solutions, and investor relations, we deliver an institutional approach with boutique precision — connecting established fund managers with the capital and strategic partners they need to scale.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Established Funds. <Text style={styles.sectionTitleAccent}>Global Ambitions.</Text>
        </Text>
        <Text style={styles.paragraph}>
          Aries76 collaborates with second or later-generation General Partners, typically managing between €1–5 billion, based globally. These managers operate in core sectors such as consumer & luxury, healthcare, digital infrastructure, industrial technology, and sustainability.
        </Text>
        <Text style={styles.paragraph}>
          We support them in accessing private wealth, family offices, and non-traditional Limited Partners across the UK, Central and Eastern Europe, and MENA — enabling strategic capital formation beyond traditional institutional channels.
        </Text>
      </View>

      <Text style={styles.footer}>ARIES76 Ltd | Strategic Advisory for Private Equity Managers</Text>
    </Page>

    {/* What We Deliver */}
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          From Strategy to <Text style={styles.sectionTitleAccent}>Investor Access</Text>
        </Text>
      </View>

      <View style={styles.subsection}>
        <Text style={styles.subsectionTitle}>Fund Positioning & Structuring</Text>
        <Text style={styles.subsectionText}>
          Refining fund materials, investment narrative, and LP-facing documentation.
        </Text>
      </View>

      <View style={styles.subsection}>
        <Text style={styles.subsectionTitle}>Capital Formation Advisory</Text>
        <Text style={styles.subsectionText}>
          Designing and executing investor engagement strategies for cross-border fundraising.
        </Text>
      </View>

      <View style={styles.subsection}>
        <Text style={styles.subsectionTitle}>Investor Relations & Structured Access</Text>
        <Text style={styles.subsectionText}>
          Managing LP communication and developing tailored investment solutions, including co-investment and continuation vehicles.
        </Text>
      </View>

      <Text style={styles.footer}>ARIES76 Ltd | Strategic Advisory for Private Equity Managers</Text>
    </Page>

    {/* Our Differentiation */}
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Institutional Insight. <Text style={styles.sectionTitleAccent}>Boutique Execution.</Text>
        </Text>
        <Text style={styles.paragraph}>
          Aries76 combines deep private markets expertise with a modern, data-driven approach powered by AI-driven intelligence (AIRES). We act as an external extension of a GP's capital formation team, offering bespoke access to qualified investors and strategic partners across Europe and beyond.
        </Text>
        <Text style={styles.paragraph}>
          Our model integrates fund positioning, investor targeting, and structured solutions — ensuring that established managers receive strategic support tailored to their specific fundraising objectives and geographic ambitions.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Why Choose <Text style={styles.sectionTitleAccent}>Aries76</Text>
        </Text>
      </View>

      <View style={styles.subsection}>
        <Text style={styles.subsectionTitle}>Global Network Access</Text>
        <Text style={styles.subsectionText}>
          Direct reach to LPs, family offices, and allocators across key financial hubs.
        </Text>
      </View>

      <View style={styles.subsection}>
        <Text style={styles.subsectionTitle}>Cross-Border Expertise</Text>
        <Text style={styles.subsectionText}>
          Proven experience across London, Zurich, Luxembourg, and Budapest.
        </Text>
      </View>

      <View style={styles.subsection}>
        <Text style={styles.subsectionTitle}>Integrated Advisory Model</Text>
        <Text style={styles.subsectionText}>
          Fund strategy, investor relations, and structured product design under one platform.
        </Text>
      </View>

      <View style={styles.subsection}>
        <Text style={styles.subsectionTitle}>AI-Powered Fundraising Intelligence</Text>
        <Text style={styles.subsectionText}>
          Leveraging data analytics to enhance targeting and LP engagement.
        </Text>
      </View>

      <Text style={styles.footer}>ARIES76 Ltd | Strategic Advisory for Private Equity Managers</Text>
    </Page>

    {/* 2026 Fundraising Sentiment */}
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          2026 Private Equity <Text style={styles.sectionTitleAccent}>Fundraising Sentiment</Text>
        </Text>
        <Text style={styles.paragraph}>
          The current fundraising cycle is increasingly defined by sectoral resilience and investor conviction. While capital concentration favors established GPs, sector specialization and cross-over strategies are driving differentiated performance.
        </Text>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { width: '25%' }]}>Sector</Text>
          <Text style={[styles.tableHeaderCell, { width: '15%', textAlign: 'center' }]}>Hype</Text>
          <Text style={[styles.tableHeaderCell, { width: '20%', textAlign: 'center' }]}>LP Demand</Text>
          <Text style={[styles.tableHeaderCell, { width: '40%' }]}>Strategic Insight</Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { width: '25%' }]}>Digital Infrastructure & AI Infrastructure</Text>
          <Text style={[styles.tableCell, { width: '15%', textAlign: 'center' }]}>🔥🔥🔥</Text>
          <Text style={[styles.tableCell, { width: '20%', textAlign: 'center' }]}>High Growth</Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>Top-performing segment, combining technology scalability with real-asset stability.</Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { width: '25%' }]}>Healthcare & Life Sciences</Text>
          <Text style={[styles.tableCell, { width: '15%', textAlign: 'center' }]}>🔥🔥</Text>
          <Text style={[styles.tableCell, { width: '20%', textAlign: 'center' }]}>Strong Growth</Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>Structural growth, defensive sector with high investor conviction.</Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { width: '25%' }]}>Sustainability & Energy Transition</Text>
          <Text style={[styles.tableCell, { width: '15%', textAlign: 'center' }]}>🔥🔥</Text>
          <Text style={[styles.tableCell, { width: '20%', textAlign: 'center' }]}>Strong Growth</Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>ESG-driven but increasingly quantitative; LPs focus on tangible climate metrics.</Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { width: '25%' }]}>Industrial Technology & Automation</Text>
          <Text style={[styles.tableCell, { width: '15%', textAlign: 'center' }]}>⚡</Text>
          <Text style={[styles.tableCell, { width: '20%', textAlign: 'center' }]}>Moderate Growth</Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>Re-emerging theme driven by nearshoring and AI-assisted manufacturing.</Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { width: '25%' }]}>Consumer & Luxury</Text>
          <Text style={[styles.tableCell, { width: '15%', textAlign: 'center' }]}>—</Text>
          <Text style={[styles.tableCell, { width: '20%', textAlign: 'center' }]}>Stable</Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>Selective rebound focused on scalable premium brands and digital distribution.</Text>
        </View>
      </View>

      <Text style={styles.footer}>ARIES76 Ltd | Strategic Advisory for Private Equity Managers</Text>
    </Page>

    {/* Contact */}
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Get in <Text style={styles.sectionTitleAccent}>Touch</Text>
        </Text>
        <Text style={styles.paragraph}>
          Aries76 Ltd works with a select number of mid-to-large international Private Equity managers each year. If you are seeking strategic advisory support for cross-border capital formation, we would be pleased to discuss how we can assist your fundraising objectives.
        </Text>
      </View>

      <View style={[styles.subsection, { marginTop: 40 }]}>
        <Text style={styles.subsectionTitle}>Contact Information</Text>
        <Text style={styles.subsectionText}>
          For more information or to request an introductory call, please reach out to our team.
        </Text>
      </View>

      <View style={{ marginTop: 100, alignItems: 'center' }}>
        <Text style={{ fontSize: 10, color: '#9ca3af', marginBottom: 5 }}>This presentation is confidential and intended solely for the addressee.</Text>
        <Text style={{ fontSize: 10, color: '#9ca3af' }}>© 2025 ARIES76 Ltd. All rights reserved.</Text>
      </View>

      <Text style={styles.footer}>ARIES76 Ltd | Strategic Advisory for Private Equity Managers</Text>
    </Page>
  </Document>
);

export const PrivateEquityPDFDownload = () => (
  <PDFDownloadLink 
    document={<PrivateEquityPDFDocument />} 
    fileName="ARIES76_Private_Equity_Funds_Presentation.pdf"
  >
    {({ loading }) => (
      <Button 
        size="lg"
        className="gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-light uppercase tracking-wider px-8"
        disabled={loading}
      >
        <Download className="w-4 h-4" />
        {loading ? 'Preparing PDF...' : 'Download PDF Presentation'}
      </Button>
    )}
  </PDFDownloadLink>
);
