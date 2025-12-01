
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { CookieConsent } from "./components/CookieConsent";
import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import Services from "./pages/Services";
import Legal from "./pages/Legal";
import ContactPage from "./pages/ContactPage";
import Auth from "./pages/Auth";
import SneakerReport from "./pages/SneakerReport";
import AiresData from "./pages/AiresData";
import PrivateEquityFunds from "./pages/PrivateEquityFunds";
import GPCapitalAdvisory from "./pages/GPCapitalAdvisory";
import GPFundraisingEconomics from "./pages/GPFundraisingEconomics";
import FundraisingReadiness from "./pages/FundraisingReadiness";
import StructuredProducts from "./pages/StructuredProducts";
import ForLimitedPartners from "./pages/ForLimitedPartners";
import NotFound from "./pages/NotFound";
import FAQ from "./pages/FAQ";
import Blog from "./pages/Blog";
import BlogArchive from "./pages/BlogArchive";
import Press from "./pages/Press";
import Admin from "./pages/Admin";
import NewsletterComposer from "./pages/NewsletterComposer";
import DistributionDashboard from "./pages/DistributionDashboard";
import ProposalLinkGenerator from "./pages/ProposalLinkGenerator";
import GPEquityNextFrontier from "./pages/blog/GPEquityNextFrontier";
import SuccessionPlanningStrategicImperative from "./pages/blog/SuccessionPlanningStrategicImperative";
import ValuingManagementCompanies from "./pages/blog/ValuingManagementCompanies";
import DigitalInfrastructureAI from "./pages/blog/DigitalInfrastructureAI";
import CrossBorderFundStructuring from "./pages/blog/CrossBorderFundStructuring";
import AIRESTransformingInvestorTargeting from "./pages/blog/AIRESTransformingInvestorTargeting";
import AIDrivenDueDiligence from "./pages/blog/AIDrivenDueDiligence";
import ItalyStructuredProductsRecord from "./pages/blog/ItalyStructuredProductsRecord";
import StructuredProductsDigitalRevolution from "./pages/blog/StructuredProductsDigitalRevolution";
import VentureCapitalValueProposition from "./pages/blog/VentureCapitalValueProposition";
import PrivateEquityFundraisingTrends2026 from "./pages/blog/PrivateEquityFundraisingTrends2026";
import InvestmentCertificates2025 from "./pages/blog/InvestmentCertificates2025";
import MazalInnovation from "./pages/MazalInnovation";
import WhyChooseAries from "./pages/WhyChooseAries";
import LeadershipTeam from "./pages/LeadershipTeam";
import VettaFiProposal from "./pages/VettaFiProposal";
import VettaFiAccess from "./pages/VettaFiAccess";
import AlkemiaPraesidiumProposal from "./pages/AlkemiaPraesidiumProposal";
import AlkemiaPraesidiumAccess from "./pages/AlkemiaPraesidiumAccess";
import AssetGUProposal from "./pages/AssetGUProposal";
import AssetGUAccess from "./pages/AssetGUAccess";
import ABCCompanyProposal from "./pages/ABCCompanyProposal";
import ABCCompanyAccess from "./pages/ABCCompanyAccess";
import ABCCompanyConsole from "./pages/ABCCompanyConsole";
import GPLPMatching from "./pages/GPLPMatching";
import GPPortal from "./pages/GPPortal";
import LPPortal from "./pages/LPPortal";
import GPLPDashboard from "./pages/GPLPDashboard";
import GPRegistrationPage from "./pages/GPRegistrationPage";
import LPRegistrationPage from "./pages/LPRegistrationPage";
import FinancialAdvisersPortal from "./pages/FinancialAdvisersPortal";
import FamilyOfficeAdvisory from "./pages/FamilyOfficeAdvisory";
import Partners from "./pages/Partners";
import StrategicPartnerships from "./pages/StrategicPartnerships";
import StructuredProductsGU from "./pages/StructuredProductsGU";
import Bitcoin2026Report from "./pages/Bitcoin2026Report";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/about/why-choose-aries76" element={<WhyChooseAries />} />
          <Route path="/leadership-team" element={<LeadershipTeam />} />
          <Route path="/services" element={<Services />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/aires-data" element={<AiresData />} />
          <Route path="/private-equity-funds" element={<PrivateEquityFunds />} />
          <Route path="/gp-capital-advisory" element={<GPCapitalAdvisory />} />
          <Route path="/gp-fundraising-economics" element={<GPFundraisingEconomics />} />
          <Route path="/fundraising-readiness" element={<FundraisingReadiness />} />
          <Route path="/family-office-advisory" element={<FamilyOfficeAdvisory />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/strategic-partnerships" element={<StrategicPartnerships />} />
          <Route path="/structured-products-gu" element={<StructuredProductsGU />} />
          <Route path="/structured-products" element={<StructuredProducts />} />
          <Route path="/for-limited-partners" element={<ForLimitedPartners />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/proposal-links" element={<ProposalLinkGenerator />} />
          <Route path="/admin/newsletter" element={<NewsletterComposer />} />
          <Route path="/admin/distribution" element={<DistributionDashboard />} />
          <Route path="/admin/gp-lp-matching" element={<GPLPMatching />} />
          <Route path="/admin/gp-lp-dashboard" element={<GPLPDashboard />} />
          <Route path="/gp-portal" element={<GPPortal />} />
          <Route path="/lp-portal" element={<LPPortal />} />
          <Route path="/financial-advisers" element={<FinancialAdvisersPortal />} />
          <Route path="/gp-registration" element={<GPRegistrationPage />} />
          <Route path="/lp-registration" element={<LPRegistrationPage />} />
          <Route path="/sneaker-report" element={<SneakerReport />} />
          <Route path="/vettafi-access" element={<VettaFiAccess />} />
          <Route path="/vettafi-proposal" element={<VettaFiProposal />} />
          <Route path="/alkemia-praesidium-access" element={<AlkemiaPraesidiumAccess />} />
          <Route path="/alkemia-praesidium-proposal" element={<AlkemiaPraesidiumProposal />} />
          <Route path="/asset-gu-access" element={<AssetGUAccess />} />
          <Route path="/asset-gu-proposal" element={<AssetGUProposal />} />
          <Route path="/abc-company-access" element={<ABCCompanyAccess />} />
          <Route path="/abc-company-proposal" element={<ABCCompanyProposal />} />
          <Route path="/abc-company-console" element={<ABCCompanyConsole />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/archive" element={<BlogArchive />} />
          <Route path="/blog/gp-equity-next-frontier" element={<GPEquityNextFrontier />} />
          <Route path="/blog/succession-planning-strategic-imperative" element={<SuccessionPlanningStrategicImperative />} />
          <Route path="/blog/valuing-management-companies" element={<ValuingManagementCompanies />} />
          <Route path="/blog/digital-infrastructure-ai-core-allocation" element={<DigitalInfrastructureAI />} />
          <Route path="/blog/cross-border-fund-structuring" element={<CrossBorderFundStructuring />} />
          <Route path="/blog/aires-ai-transforming-investor-targeting" element={<AIRESTransformingInvestorTargeting />} />
          <Route path="/blog/ai-driven-due-diligence-private-markets" element={<AIDrivenDueDiligence />} />
          <Route path="/blog/italy-structured-products-record-q3-2025" element={<ItalyStructuredProductsRecord />} />
          <Route path="/blog/structured-products-digital-revolution-2025" element={<StructuredProductsDigitalRevolution />} />
          <Route path="/blog/venture-capital-value-proposition-2025" element={<VentureCapitalValueProposition />} />
          <Route path="/blog/private-equity-fundraising-trends-2026" element={<PrivateEquityFundraisingTrends2026 />} />
          <Route path="/blog/investment-certificates-2025-new-era" element={<InvestmentCertificates2025 />} />
          <Route path="/bitcoin-2026-report" element={<Bitcoin2026Report />} />
          
          <Route path="/mazal-innovation" element={<MazalInnovation />} />
          <Route path="/press" element={<Press />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <CookieConsent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
