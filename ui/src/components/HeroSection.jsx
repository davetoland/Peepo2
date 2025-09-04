import React from 'react';
import { motion } from 'framer-motion';
import logo_lg from '../assets/logo_lg.png';

const HeroSection = () => {
  return (
    <>
      <h1 className="text-3xl font-bold text-brand-navy text-center mt-8">Peepo Sensory</h1>
      <img src={logo_lg} alt="Peepo Sensory Logo" className="mt-4 w-36 h-36 mx-auto" />
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
              Sensory Classes for<br/>
              <span className="text-brand-pink">Babies</span>
              <span className="text-brand-purple"> & </span>
              <span className="text-brand-periwinkle">Toddlers</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Fun, sociable classes designed to support your little one's development through 
              sensory play, music, and gentle activities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="bg-brand-pink text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-brand-periwinkle transition-colors duration-200 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Book a Class
              </motion.button>
              <motion.button
                className="bg-brand-pink text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-brand-periwinkle transition-colors duration-200 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Schedule
              </motion.button>
            </div>
            
            <div className="max-w-2xl mx-auto bg-gradient-to-b from-blue-200 to-blue-50 rounded-2xl p-8 mt-8 shadow-lg">
              <form className="space-y-6">
                <div className="grid gap-6">
                  <div>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="Your Email"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    type="submit"
                    className="bg-brand-periwinkle text-white px-4 py-4 rounded-full font-semibold text-lg hover:bg-brand-periwinkle transition-colors duration-200 shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sign Up For Our Newsletter
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;