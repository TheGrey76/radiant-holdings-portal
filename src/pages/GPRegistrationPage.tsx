import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GPRegistrationForm from "@/components/GPRegistrationForm";

const GPRegistrationPage = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/gp-portal");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1729] via-[#1a2744] to-[#0d1424]">
      <Navbar />
      
      <div className="container mx-auto px-6 pt-24 pb-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-light text-white mb-4">
            General Partner <span className="text-accent">Registration</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Register to access exclusive GP resources, fundraising economics insights, and connect with qualified Limited Partners
          </p>
        </div>

        <GPRegistrationForm onSuccess={handleSuccess} />
      </div>

      <Footer />
    </div>
  );
};

export default GPRegistrationPage;
