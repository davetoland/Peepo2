import React from 'react';
import { MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const LocationsSection = () => {
  const locations = [
    {
      name: "Gill Nethercott Centre",
      address1: "Winchester St",
      address2: "Whitchurch",
      address3: "RG28 7HP",
      time: "Mondays & Wednesdays, 10:00 AM",
      mapLink: "https://www.google.co.uk/maps/place/Gill+Nethercott+Centre/@51.2279748,-1.3413818,17z/data=!3m1!4b1!4m6!3m5!1s0x487404c3b5f9b79d:0xb6f1685e270ff2c0!8m2!3d51.2279715!4d-1.3388069!16s%2Fg%2F1hhhp7vqb"
    },
    {
      name: "St Luke's Hall",
      address1: "49 Winchester St",
      address2: "Overton",
      address3: "RG25 3HT",
      time: "Tuesdays & Thursdays, 2:00 PM",
      mapLink: "https://www.google.com/maps/place/St+Luke's+Hall,+Overton/@51.2415923,-1.2631775,17z/data=!4m6!3m5!1s0x48741b9bb253a279:0xd7156b2dffa6d155!8m2!3d51.2424956!4d-1.2624652!16s%2Fg%2F11f5jmybpf"
    },
    {
      name: "Somewhere Else",
      address1: "Some Street",
      address2: "Some Village",
      address3: "SM1 WH3",
      time: "Fridays, 11:00 AM",
      mapLink: "",
      mapImg: ""
    }
  ];

  return (
    <section id="locations" className="py-20 px-4 bg-gradient-to-br from-pink-50 to-blue-50">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Locations</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Convenient locations across the local area.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {locations.map((location, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <a target="_blank" rel="noreferrer" href={location.mapLink || '#'}>
                <MapPin className="text-pink-500 mb-2" size={32} />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{location.name}</h3>
                <p className="text-gray-600">{location.address1}</p>
                <p className="text-gray-600">{location.address2}</p>
                <p className="text-gray-600 mb-4">{location.address3}</p>
                <div className="flex items-center text-gray-700">
                  <Clock className="mr-2" size={16} />
                  <span>{location.time}</span>
                </div>
                <div className="mt-4 w-full">
                  <motion.button
                    onClick={() => location.mapImg && open(location.mapLink)}
                    className="w-full bg-brand-pink text-white py-2 rounded-lg font-semibold text-lg hover:bg-brand-purple transition-colors duration-200"
                  >
                    Show Map
                  </motion.button>
                </div>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LocationsSection;