import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const ThemesSection = () => {
	const themes = [
		{
			name: "At the Seaside",
			icon: "🌊",
			description: "Dive into an ocean of fun! Explore textures like sand and water, sounds of waves and seagulls, and the gentle movements of sea creatures. Perfect for developing tactile awareness and imagination."
		},
		{
			name: "Outer Space",
			icon: "🚀",
			description: "Blast off into a world of wonder! Twinkling lights, floating movements, and space-themed sensory play. Little ones explore concepts of light and movement while developing their visual tracking skills."
		},
		{
			name: "On The Farm",
			icon: "🐄",
			description: "Life down on the farm! Through animal sounds, textured materials, and farm-themed activities, children develop auditory processing skills and learn about different animals and their environments."
		},
		{
			name: "The Circus",
			icon: "🎪",
			description: "Step right up to the greatest show! With colorful props, playful movements, and circus-themed activities, children enhance their gross motor skills and coordination while having tons of fun."
		},
		{
			name: "Super Heroes",
			icon: "🦸",
			description: "Discover the hero within! Through cape-swooshing, obstacle courses, and power-pose activities, children build confidence and develop their physical abilities while learning about helping others."
		},
		{
			name: "At The Zoo",
			icon: "🦁",
			description: "Journey through the animal kingdom! With animal movements, sounds, and textures, children enhance their sensory awareness while learning about different creatures and their characteristics."
		}
	];

	const [selectedTheme, setSelectedTheme] = useState(null);
	const [isThemeDescriptionVisible, setIsThemeDescriptionVisible] = useState(false);

	// Handle clicks outside of description components
	React.useEffect(() => {
		const handleClickOutside = (event) => {
			if (event.target.parentNode.id != "themeTiles" && event.target.parentNode.parentNode.id != "themeTiles")
				setIsThemeDescriptionVisible(false);
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<section id="themes" className="py-20 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
			<div className="container mx-auto">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
					className="text-center mb-16"
				>
					<h2 className="text-4xl font-bold text-gray-800 mb-4">Weekly Themes</h2>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto">
						Each week our classes will be based on a different theme to keep learning fun and engaging, some examples of the themes we use are...
					</p>
				</motion.div>

				<div className="space-y-8">
					<div id="themeTiles" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
						{themes.map((theme, index) => (
							<motion.div
								key={index}
								className={`bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer
                  ${isThemeDescriptionVisible && selectedTheme === index ? 'ring-2 ring-brand-pink' : ''}`}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.1 }}
								viewport={{ once: true }}
								whileHover={{ y: -5 }}
								onClick={() => {
									if (selectedTheme === index && isThemeDescriptionVisible) {
										setIsThemeDescriptionVisible(false);
									} else {
										setSelectedTheme(index);
										setIsThemeDescriptionVisible(true);
									}
								}}
							>
								<div className="text-4xl mb-4">{theme.icon}</div>
								<h3 className="text-lg font-semibold text-gray-800">{theme.name}</h3>
							</motion.div>
						))}
					</div>

					<AnimatePresence initial={false}>
						{isThemeDescriptionVisible && (
							<motion.div
								initial={{ height: 0, opacity: 0 }}
								animate={{ height: 'auto', opacity: 1 }}
								exit={{ height: 0, opacity: 0 }}
								transition={{ duration: 0.2, ease: "easeInOut" }}
								className="overflow-hidden"
							>
								<div className="relative h-full bg-white rounded-2xl p-8 shadow-lg max-w-3xl mx-auto my-8">
									<div className="flex items-center gap-4 mb-4">
										<span className="text-4xl">{themes[selectedTheme].icon}</span>
										<h4 className="text-xl font-semibold text-gray-800">
											{themes[selectedTheme].name}
										</h4>
									</div>
									<p className="text-gray-600 leading-relaxed">
										{themes[selectedTheme].description}
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

export default ThemesSection;