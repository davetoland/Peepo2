import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import logo_sm from './assets/logo_sm.png';
import HeroSection from './components/HeroSection.jsx';
import ThemesSection from './components/ThemesSection.jsx';
import DevelopmentSection from './components/DevelopmentSection.jsx';
import LocationsSection from './components/LocationsSection.jsx';
import ClassesSection from './components/ClassesSection.jsx';
import PoliciesSection from './components/PoliciesSection.jsx';
import BookSection from './components/BookSection.jsx';
import GallerySection from './components/GallerySection.jsx';
import ContactSection from './components/ContactSection.jsx';
import AwardsSection from './components/AwardsSection.jsx';
import AboutSection from './components/AboutSection.jsx';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems = ['Classes', 'Themes', 'Development', 'Locations', 'Book', 'About', 'Contact', 'Gallery', 'Awards', 'Policies'];
  const copyright = `${new Date().getFullYear()} Peepo Sensory. All rights reserved.`;
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-periwinkle/10 to-brand-purple/10">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50 py-2">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-brand-navy hover:text-brand-pink transition-colors duration-200 font-medium"
                >
                  {item}
                </a>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {isMenuOpen && (
            <motion.nav
              className="md:hidden mt-4 pb-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex flex-col space-y-3">
                {navItems.map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-gray-600 hover:text-pink-500 transition-colors duration-200 font-medium py-2"
                    onClick={() => { setIsMenuOpen(false); }}
                  >
                    {item}
                  </a>
                ))}
              </div>
            </motion.nav>
          )}
        </div>
      </header>

      <HeroSection />
      <ClassesSection />
      <ThemesSection />
      <DevelopmentSection />
      <LocationsSection />
      <BookSection />
      <AboutSection />
      <ContactSection />
      <GallerySection />
      <AwardsSection />
      <PoliciesSection />

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex justify-center items-center mb-6">
            <img src={logo_sm} alt="Peepo Sensory Logo" className="w-10 h-10 mr-3" />
            <h3 className="text-2xl font-bold">Peepo Sensory</h3>
          </div>
          <p className="text-gray-400 mb-6">
            Sensory classes for babies and toddlers. Supporting development through play.
          </p>
          <p className="text-gray-500">
             &copy; {copyright} 
          </p>
        </div>
      </footer>      
    </div>
  );
};

export default App;