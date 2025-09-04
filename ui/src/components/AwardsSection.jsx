import React from "react";
import { motion } from 'framer-motion';
import goldKites from '../assets/icap-3-kite-mark-01.jpg';

const AwardsSection = () => {

    return (
        <section id="awards" className="py-20 px-4 bg-gradient-to-br from-yellow-50 to-amber-100">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">ICAP Three Gold Kites</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Proud recipient of the ICAP Three Gold Kites Award for excellence in the provision of activities that improve the lives of children across the UK.
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto space-y-12">
            {/* Award Image */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/20 to-amber-300/20 rounded-full blur-3xl transform scale-110" />
                <img 
                  src={goldKites} 
                  alt="ICAP Three Gold Kites Award" 
                  className="relative w-96 h-96 object-contain"
                />
              </div>
            </motion.div>

            {/* Information Cards */}
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg h-full"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-4">What are the Gold Kites?</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  The ICAP Gold Kites are prestigious awards that recognize excellence in children's 
                  activity provision. Achieving three Gold Kites demonstrates our commitment to:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">★</span>
                    <span className="text-gray-600">Outstanding Safety Standards</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">★</span>
                    <span className="text-gray-600">Excellence in Activity Development</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">★</span>
                    <span className="text-gray-600">Professional Staff Training</span>
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg h-full"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-4">What This Means For You</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  When you choose Peepo Sensory, you're choosing an activity provider that has been 
                  independently verified to meet the highest standards in:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">★</span>
                    <span className="text-gray-600">Child Safety and Wellbeing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">★</span>
                    <span className="text-gray-600">Quality of Activities and Resources</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">★</span>
                    <span className="text-gray-600">Professional Development and Training</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    );
}

export default AwardsSection;