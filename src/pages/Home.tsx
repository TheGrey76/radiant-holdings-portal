import BitcoinReportBanner from '@/components/BitcoinReportBanner';
import HeroNetwork from '@/components/HeroNetwork';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Bitcoin Report Banner */}
      <BitcoinReportBanner />
      
      {/* New Network Hero Section */}
      <HeroNetwork />
    </div>
  );
};

export default Home;
