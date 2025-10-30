
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
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
import NotFound from "./pages/NotFound";
import FAQ from "./pages/FAQ";
import Blog from "./pages/Blog";
import Press from "./pages/Press";
import GPEquityNextFrontier from "./pages/blog/GPEquityNextFrontier";
import SuccessionPlanningStrategicImperative from "./pages/blog/SuccessionPlanningStrategicImperative";

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
          <Route path="/services" element={<Services />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/aires-data" element={<AiresData />} />
          <Route path="/private-equity-funds" element={<PrivateEquityFunds />} />
          <Route path="/gp-capital-advisory" element={<GPCapitalAdvisory />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/sneaker-report" element={<SneakerReport />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/gp-equity-next-frontier" element={<GPEquityNextFrontier />} />
          <Route path="/blog/succession-planning-strategic-imperative" element={<SuccessionPlanningStrategicImperative />} />
          <Route path="/press" element={<Press />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
