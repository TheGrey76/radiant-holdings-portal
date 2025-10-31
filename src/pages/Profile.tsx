
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UserProfile from '@/components/UserProfile';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate('/network');
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-28 md:pt-32">
        <div className="container mx-auto px-4">
          <div className="flex justify-end mb-6">
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="flex items-center gap-2 border-red-300 text-red-600 hover:bg-red-50"
            >
              <LogOut size={18} />
              Log Out
            </Button>
          </div>
          <UserProfile />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
