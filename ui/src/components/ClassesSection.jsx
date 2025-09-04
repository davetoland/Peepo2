import React from 'react';
import { Heart, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const babyClasses = [
  {
    title: "Babies (0-12 months)",
    description: "Fun and sociable classes for babies up to 12 months. Each class incorporates a range of activities which will help to support your baby's development.",
    features: [
      "Song and Makaton signing",
      "Tactile activities",
      "Visual aids",
      "Gentle physical activities based on baby yoga",
      "Gentle massage techniques"
    ]
  }
];

const toddlerClasses = [
  {
    title: "Toddlers (1-3 years)",
    description: "Classes for up to 3 years old. These classes use movement, song, sensory activities and play to explore our weekly themes and aid age appropriate development.",
    features: [
      "Supportive and sociable environment",
      "Movement and song",
      "Sensory activities and play",
      "Weekly themed sessions",
      "Take-home tools and ideas"
    ]
  }
];

const ClassesSection = () => {
  return (
    <section id="classes" className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-brand-navy mb-4">Our Classes</h2>
          <p className="text-xl text-brand-navy/70 max-w-3xl mx-auto">
            Designed to give parents and carers a range of tools and ideas to take away 
            and play with their babies and toddlers at home.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {babyClasses.map((classItem, index) => (
            <motion.div
              key={index}
              className="bg-gradient-to-br from-brand-periwinkle/10 to-brand-purple/10 rounded-2xl p-8 shadow-lg"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-6">
                <Heart className="text-pink-500 mr-3" size={32} />
                <h3 className="text-2xl font-bold text-brand-navy">{classItem.title}</h3>
              </div>
              <p className="text-brand-navy/70 mb-6 text-lg">{classItem.description}</p>
              <ul className="space-y-3">
                {classItem.features.map((feature, fi) => (
                  <li key={fi} className="flex items-center">
                    <Heart className="text-brand-pink mr-3" size={16} />
                    <span className="text-brand-navy/80">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {toddlerClasses.map((classItem, index) => (
            <motion.div
              key={`t${index}`}
              className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 shadow-lg"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-6">
                <Star className="text-blue-500 mr-3" size={32} />
                <h3 className="text-2xl font-bold text-gray-800">{classItem.title}</h3>
              </div>
              <p className="text-gray-600 mb-6 text-lg">{classItem.description}</p>
              <ul className="space-y-3">
                {classItem.features.map((feature, fi) => (
                  <li key={fi} className="flex items-center">
                    <Star className="text-blue-400 mr-3" size={16} />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClassesSection;