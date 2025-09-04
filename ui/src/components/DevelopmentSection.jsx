import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const DevelopmentSection = () => {
	const developmentAreas = [
		{
			title: "Touch",
			shortDescription: "Feeling textures and sensations",
			description: "Our tactile activities help develop your child's sense of touch through exploration of different textures, temperatures, and materials. This sensory input is crucial for developing fine motor skills, object recognition, and emotional security.",
			icon: "👐"
		},
		{
			title: "Vision",
			shortDescription: "Exploring shapes and colours",
			description: "Visual development activities include tracking moving objects, recognizing patterns, and exploring colors. These exercises help develop depth perception, hand-eye coordination, and visual memory - all essential skills for learning and development.",
			icon: "👁️"
		},
		{
			title: "Hearing",
			shortDescription: "Listening to directional sounds",
			description: "Auditory activities help children develop sound localization, pattern recognition, and language development. Through music, rhythm, and varying sound experiences, we help enhance your child's auditory processing abilities.",
			icon: "👂"
		},
		{
			title: "Vestibular",
			shortDescription: "Developing a sense of balance",
			description: "The vestibular system is crucial for balance and spatial awareness. Our activities include gentle swinging, rocking, and movement exercises that help develop this essential sensory system, improving coordination and body awareness.",
			icon: "⚖️"
		},
		{
			title: "Proprioception",
			shortDescription: "Being self aware and coordinated",
			description: "Proprioception helps us understand where our body is in space. Through activities like crawling, pushing, and pulling, we help develop this sense, leading to better coordination, motor planning, and body awareness.",
			icon: "🧠"
		}
	];

	const [selectedArea, setSelectedArea] = useState(null);
	const [isAreaDescriptionVisible, setIsAreaDescriptionVisible] = useState(false);

	// Handle clicks outside of description components
	React.useEffect(() => {
		const handleClickOutside = (event) => {
			if (event.target.parentNode.id != "developmentTiles" && event.target.parentNode.parentNode.id != "developmentTiles")
				setIsAreaDescriptionVisible(false);
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<section id="development" className="py-20 px-4 bg-white">
			<div className="container mx-auto">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.1 }}
					viewport={{ once: true }}
					className="text-center mb-8 md:mb-16"
				>
					<h2 className="text-4xl font-bold text-gray-800 mb-4">Development Areas</h2>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto sm:mb-4">
						Each class contains a range of activities designed to engage and support
						your baby and toddler with their development.
					</p>
				</motion.div>

				<div className="space-y-8">
					<div id="developmentTiles" className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
						{developmentAreas.map((area, index) => (
							<motion.div
								key={index}
								className={`bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl md:p-6 sm:p-2 text-center shadow-lg cursor-pointer
                  ${isAreaDescriptionVisible && selectedArea === index ? 'ring-2 ring-brand-purple' : ''}`}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.1 }}
								viewport={{ once: true }}
								whileHover={{ y: -5 }}
								onClick={() => {
									if (selectedArea === index) {
										setIsAreaDescriptionVisible(!isAreaDescriptionVisible);
									} else {
										setSelectedArea(index);
										if (!isAreaDescriptionVisible) {
											setIsAreaDescriptionVisible(true);
										}
									}
								}}
							>
								<div className="text-4xl sm:mb-2">{area.icon}</div>
								<h3 className="text-xl font-bold text-gray-800 md:mb-2 sm:mb-0">{area.title}</h3>
								<p className="text-gray-600 mb-2">{area.shortDescription}</p>
							</motion.div>
						))}
					</div>

					<AnimatePresence initial={false}>
						{isAreaDescriptionVisible && (
							<motion.div
								initial={{ height: 0, opacity: 0 }}
								animate={{ height: 'auto', opacity: 1 }}
								exit={{ height: 0, opacity: 0 }}
								transition={{ duration: 0.2, ease: "easeInOut" }}
								className="overflow-hidden"
							>
								<div className="relative h-full bg-white rounded-xl p-4 md:p-8 shadow-lg md:max-w-3xl md:mr-auto md:ml-auto mr-2 ml-2 md:my-8 my-4">
									<div className="flex justify-items-center gap-4 mb-4">
										<span className="text-4xl">{developmentAreas[selectedArea].icon}</span>
										<h4 className="text-xl font-semibold text-gray-800">
											{developmentAreas[selectedArea].title}
										</h4>
									</div>
									<p className="text-gray-600 leading-relaxed">
										{developmentAreas[selectedArea].description}
									</p>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
		</section>
	);
};

export default DevelopmentSection;