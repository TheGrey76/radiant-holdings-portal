
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
      <main className="flex-grow pt-28 md:pt-32">
        <div className="container mx-auto px-4">
          <UserProfile handleLogout={handleLogout} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
