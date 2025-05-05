
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UserProfile from '@/components/UserProfile';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Clear the user data from localStorage
    localStorage.removeItem('networkUser');
    // Navigate back to the network page for registration
    navigate('/network');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 pt-28 md:pt-32">
        <div className="flex justify-end mb-4">
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="flex items-center gap-2 border-red-300 text-red-600 hover:bg-red-50"
          >
            <LogOut size={18} />
            Log Out
          </Button>
        </div>
      </div>
      <main className="flex-grow pt-0">
        <UserProfile />
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
