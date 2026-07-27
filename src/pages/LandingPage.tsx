import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar.js';
import { Footer } from '../components/layout/Footer.js';
import { HeroSection } from '../components/landing/HeroSection.js';
import { FeaturesSection } from '../components/landing/FeaturesSection.js';
import { LeadFormSection } from '../components/landing/LeadFormSection.js';

export const LandingPage: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state && (location.state as any).scrollTo) {
      const targetId = (location.state as any).scrollTo;
      const elem = document.getElementById(targetId);
      if (elem) {
        setTimeout(() => {
          elem.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  const handleGetStartedClick = () => {
    const elem = document.getElementById('lead-form');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <HeroSection onGetStartedClick={handleGetStartedClick} />
        <FeaturesSection />
        <LeadFormSection />
      </main>
      <Footer />
    </div>
  );
};
