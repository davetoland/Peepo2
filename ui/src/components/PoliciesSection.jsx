import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const PoliciesSection = () => {
  const policies = [
    {
      name: "Child Behaviour",
      desc: "This code of behaviour is there to make sure everyone who takes part in Peepo Sensory activities knows what is expected of them and feels safe, respected and valued.",
      link: "/src/assets/policies/Child_Behaviour_Policy.pdf"
    },
    {
      name: "Complaints Procedure",
      desc: "We are committed to providing a quality service and working in an open and accountable way that builds trust and respect, in particular by responding positively to complaints, and by putting mistakes right.",
      link: "/src/assets/policies/Complaints_Procedure.pdf"
    },
    {
      name: "Data Protection & Privacy",
      desc: "We at Peepo Sensory take your privacy seriously and this policy and notice has been drafted in accordance with the requirements of the General Data Protection Regulations (“GDPR”).",
      link: "/src/assets/policies/Data_Protection_Privacy_Policy.pdf"
    },
    {
      name: "Health & Safety",
      desc: "Peepo Sensory considers health and safety to be of utmost importance. We comply with The Health and Safety at Work Act 1974 and the Workplace (Health, Safety and Welfare) Regulations 1992 at all times.",
      link: "/src/assets/policies/Health_Safety_Policy.pdf"
    },
    {
      name: "Safeguarding",
      desc: "We acknowledge the duty of care to safeguard and promote the welfare of babies, infants and children involved in our classes, reflecting statutory responsibilities, government guidance and complies with best practice.",
      link: "/src/assets/policies/Safeguarding_Policy.pdf"
    },
    {
      name: "Photography & Video",
      desc: "Peepo Sensory works with children and families as part of its activities. The purpose of this policy statement is to protect who take part in these, specifically those where photographs and videos may be taken",
      link: "/src/assets/policies/Photography_Video Policy.pdf"
    },
    {
      name: "Terms & Conditions",
      desc: "The terms and conditions under which apply to all Peepo Sensory classes. By making a booking or using any of our services (e.g. attending a class or event) you agree to accept and abide by these terms.",
      link: "/src/assets/policies/Terms_Conditions.pdf"
    },
  ]
  return (
    <section id="policies" className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Policies</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Important information about our classes and procedures.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-4">
          {policies.map((policy, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h5 className="text-2xl font-bold text-gray-800 mb-2">{policy.name}</h5>
              <p className="text-gray-600 leading-relaxed">{policy.desc}</p>
              <a target="_blank" rel="noreferrer" href={policy.link}>
                <button className="flex ml-auto bg-pink-500 text-white mt-4 rounded-lg hover:bg-pink-600">
                  View Policy
                </button>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PoliciesSection;
