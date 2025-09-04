import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

const BookSection = () => {
	const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

	return (
		<section id="book" className="py-20 px-4 bg-white">
			<div className="container mx-auto">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
					className="text-center mb-16"
				>
					<h2 className="text-4xl font-bold text-gray-800 mb-4">Book Your Class</h2>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto">
						Ready to start your sensory journey? Book your first class today!
					</p>
				</motion.div>

				<div className="max-w-2xl mx-auto bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8 shadow-lg">
					<motion.button
						onClick={() => setIsBookingModalOpen(true)}
						className="w-full bg-brand-pink text-white py-4 rounded-lg font-semibold text-lg hover:bg-brand-purple transition-colors duration-200"
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
					>
						Book Now
					</motion.button>
				</div>
			</div>

			{isBookingModalOpen && (
				<motion.div
					className="fixed inset-0 z-50 overflow-y-auto"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					<div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
						<motion.div
							className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-2xl sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
							initial={{ opacity: 0, y: 100, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: 100, scale: 0.95 }}
							transition={{ type: "spring", duration: 0.95 }}>
							<div className="h-[93vh] w-full relative">
								<div className="absolute top-2 right-4 z-10">
									<button
										onClick={() => setIsBookingModalOpen(false)}
										className="bg-white rounded-lg p-4 text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none shadow-sm border border-solid border-gray-300 transition-all duration-200"
									>
										<span className="sr-only">Close</span>
										<X className="h-6 w-8" />
									</button>
								</div>
								<iframe
									src="https://bookwhen.com/peeposensory/iframe?sifbst=z908l2irs4w7qdrnz9adjxnd6bzk"
									className="w-full h-full"
									allowFullScreen
								></iframe>
							</div>
						</motion.div>
					</div>
				</motion.div>
			)
		}
		</section>
	);
};

export default BookSection;