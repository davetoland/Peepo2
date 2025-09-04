import React from "react";
import { motion } from 'framer-motion';

const AboutSection = () => {

	return (
		<section id="about" className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
			<div className="container mx-auto">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
					className="text-center mb-16"
				>
					<h2 className="text-4xl font-bold text-gray-800 mb-4">About Us</h2>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto">
						Passionate about supporting early childhood development through sensory play and community connection.
					</p>
				</motion.div>

				<div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-lg">
					<p className="text-gray-700 text-lg leading-relaxed mb-6">
						Peepo Sensory was founded by Jennie Toland to support new parents in her local area. Having moved to a new
						community during the 2021 lock-down and had her first child, there was a realisation that new families needed
						more opportunities to connect. As a parent and former teacher, it made sense to link this to activities which
						would also support development and learning for the babies.
					</p>
					<p className="text-gray-700 text-lg leading-relaxed mb-6">
						Using her own experiences as a new parent and a background in SEN teaching, Jennie developed and grew Peepo Sensory.
						Fun, but with a strong focus on development, these baby classes aim to connect parents and carers socially, in a
						supportive and encouraging environment.
					</p>
					<p className="text-gray-700 text-lg leading-relaxed">
						We're committed to providing high-quality classes that not only benefit your little ones but also
						give you, as parents and carers, practical tools and confidence to continue supporting their
						development at home.
					</p>
				</div>
			</div>
		</section>
	);
};

export default AboutSection;