'use client'

import React from 'react';
import { motion } from 'framer-motion';
import Testimonials from '@/components/website/home/testimonial';
import { FaCarAlt, FaSatelliteDish, FaChartBar } from 'react-icons/fa';
import { MdAgriculture, MdConstruction, MdLocalShipping, MdPerson, MdLocalHospital, MdBusiness, MdSchool, MdLocationCity } from 'react-icons/md';
import { whyChooseUs } from './whyChooseUs';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 80, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 18
    }
  }
};

const platformFeatures = [
  {
    icon: <FaCarAlt className="text-blue-500 text-2xl" />,
    title: "Vehicle Tracking Software",
    desc: "Real-time tracking, trip history, driver behaviour, reports — sab kuch ek jagah."
  },
  {
    icon: <FaSatelliteDish className="text-green-500 text-2xl" />,
    title: "Cutting-Edge Hardware",
    desc: "High-performance GPS devices & sensors jo hamare software se seamlessly integrate hote hain."
  },
  {
    icon: <FaChartBar className="text-purple-500 text-2xl" />,
    title: "Actionable Insights",
    desc: "Raw data ko meaningful insights me convert karke productivity aur ROI badhao."
  }
];

const industries = [
  { icon: <MdLocalShipping className="text-blue-500 text-2xl" />, label: "Logistics & Transportation", desc: "Route optimization, dispatch, aur fuel savings ke liye best." },
  { icon: <MdConstruction className="text-yellow-700 text-2xl" />, label: "Construction", desc: "Heavy equipment & site vehicles ko track karo & usage monitor karo." },
  { icon: <MdLocalHospital className="text-red-500 text-2xl" />, label: "Ambulance Services", desc: "Emergency response ke liye real-time tracking aur route optimization." },
  { icon: <MdBusiness className="text-indigo-500 text-2xl" />, label: "Public Services", desc: "Garbage trucks, water tankers, emergency vans — sab centralized monitoring me." },
  { icon: <MdPerson className="text-pink-500 text-2xl" />, label: "Personal Use", desc: "Apni bike ya car ko live track karo aur loved ones ke safety ensure karo." },
  { icon: <FaCarAlt className="text-gray-700 text-2xl" />, label: "Rental & Leasing", desc: "Maintenance cycles, misuse prevention, aur safety for rented vehicles." },
  { icon: <MdSchool className="text-yellow-500 text-2xl" />, label: "School Buses", desc: "Student safety ke liye live tracking, speed alerts, aur parent notifications." },
  { icon: <MdLocationCity className="text-blue-700 text-2xl" />, label: "Municipal Corporations", desc: "Accountability aur better civic services ke liye city vehicles ka tracking." },
  { icon: <MdAgriculture className="text-green-700 text-2xl" />, label: "Agriculture", desc: "Tractors, harvesters, aur rural vehicles ke liye misuse prevention & efficiency tracking." }
];

// Group the cards: each group has 1 large + 2 small cards
const whyChooseUsGroups: ({ icon: React.JSX.Element; title: string; desc: string; } | { large: boolean; icon: React.JSX.Element; title: string; desc: string; })[][] = [];
for (let i = 0; i < whyChooseUs.length; i += 3) {
  const group = [
    { ...whyChooseUs[i], large: true },
    whyChooseUs[i + 1] || {},
    whyChooseUs[i + 2] || {},
  ];
  whyChooseUsGroups.push(group);
}

const AboutPage: React.FC = () => {
  return (
    <>
      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative max-w-6xl mx-auto min-h-[80vh] flex flex-col justify-center items-center text-center py-20 px-4 overflow-hidden"
        style={{
          fontFamily: "'Poppins', 'Segoe UI', Arial, sans-serif"
        }}
      >
        {/* 1. Introduction Section */}
        <motion.div
          variants={cardVariants}
          className="mb-12 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start text-left gap-10"
        >
          {/* Text Side */}
          <div className="flex-1">
            <motion.h1 className="text-4xl md:text-5xl font-extrabold text-[#f97316] mb-3 text-left">
              Welcome to Location Track
            </motion.h1>
            <motion.h2 className="text-xl md:text-2xl font-semibold text-[var(--color-secondary)] mb-2 text-left">
              India’s Premier GPS Solution for Vehicles & Personal Safety
            </motion.h2>
            <motion.p className="text-base md:text-lg text-[var(--color-foreground)] mb-4 text-left">
              <strong>Location Track</strong> is a telematics solution startup designed and developed by <strong>Everonic
                Solutions PVT. LTD.</strong> with the motive of making your travel safe and secure. <strong>Location Track</strong>&nbsp;
              telematics solution provided you a number of features gives vehicle owner / user piece of
              mind with services to monitor and control his vehicles using mobile phone or computer.
            </motion.p>
            <motion.div className="bg-white/80 rounded-xl shadow-lg p-6 mt-4" style={{ borderLeft: '4px solid #f97316' }}>
              <h3 className="text-lg font-bold text-[#f97316] mb-1">Our Mission</h3>
              <p className="text-gray-700">
                To revolutionize the way individuals and businesses monitor and control their vehicles —
                making transportation safer, smarter, and more cost-efficient.
              </p>
            </motion.div>
          </div>
          {/* Image Side replaced with Lottie iframe */}
          <motion.div
            className="flex-1 flex justify-center items-center"
            initial={{ opacity: 0, scale: 0.92, x: 60 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.9, type: 'spring' as const, stiffness: 60 }}
          >
            <iframe
              src="https://lottie.host/embed/7020ed53-7713-4ec6-ad62-5d8545242974/2UtD1lD7vQ.lottie"
              style={{ width: 420, height: 520, border: 'none', borderRadius: '1rem', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}
              allowFullScreen={false}
              title="Location Track Animation"
            />
          </motion.div>
        </motion.div>

        {/* 2. Why Choose Us */}
        <motion.div
          variants={containerVariants}
          className="mb-24 w-full flex flex-col items-center"
        >
          <motion.h2
            variants={cardVariants}
            className="text-4xl md:text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500"
          >
            Why Choose Us
          </motion.h2>
          <div className="mb-8 text-gray-600 text-lg max-w-2xl text-center">
            Our platform brings together the best hardware, software, analytics, and support to deliver a seamless GPS tracking experience for everyone.
          </div>
          <div className="flex flex-col gap-10 w-full max-w-6xl">
            {whyChooseUsGroups?.map((group, groupIdx) => (
              <div
                key={groupIdx}
                className="flex flex-col md:flex-row gap-8 w-full"
              >
                {/* Alternate large card left/right */}
                {groupIdx % 2 === 0 ? (
                  <>
                    {/* Large card left */}
                    <motion.div
                      variants={cardVariants}
                      whileHover={{
                        y: -8,
                        boxShadow: '0 8px 32px 0 #f97316, 0 1.5px 8px 0 rgba(31,38,135,0.10)'
                      }}
                      className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-start text-left transition-all border border-gray-100 relative md:w-1/2"
                      style={{
                        minHeight: 210,
                        borderTop: '4px solid #f97316',
                        flex: 1.2
                      }}
                    >
                      <div
                        className="flex items-center justify-center w-14 h-14 rounded-full mb-4"
                        style={{
                          background: '#f97316',
                          color: '#fff',
                          boxShadow: '0 2px 8px 0 #f97316'
                        }}
                      >
                        {group[0].icon}
                      </div>
                      <div className="font-bold text-xl text-gray-800 mb-1">{group[0].title}</div>
                      <div className="text-gray-600 text-base">{group[0].desc}</div>
                    </motion.div>
                    {/* 2 small cards right */}
                    <div className="flex flex-col md:flex-row gap-8 md:w-1/2">
                      {group.slice(1).map((item, idx) =>
                        item && item.title ? (
                          <motion.div
                            key={item.title}
                            variants={cardVariants}
                            whileHover={{
                              y: -8,
                              boxShadow: '0 8px 32px 0 #f97316, 0 1.5px 8px 0 rgba(31,38,135,0.10)'
                            }}
                            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-start text-left transition-all border border-gray-100 relative flex-1"
                            style={{
                              minHeight: 120,
                              borderTop: '4px solid #f97316'
                            }}
                          >
                            <div
                              className="flex items-center justify-center w-10 h-10 rounded-full mb-3"
                              style={{
                                background: '#f97316',
                                color: '#fff',
                                boxShadow: '0 2px 8px 0 #f97316'
                              }}
                            >
                              {item.icon}
                            </div>
                            <div className="font-bold text-base text-gray-800 mb-1">{item.title}</div>
                            <div className="text-gray-600 text-xs">{item.desc}</div>
                          </motion.div>
                        ) : (
                          <div key={idx} className="flex-1" />
                        )
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {/* 2 small cards left */}
                    <div className="flex flex-col md:flex-row gap-8 md:w-1/2">
                      {group.slice(1).map((item, idx) =>
                        item && item.title ? (
                          <motion.div
                            key={item.title}
                            variants={cardVariants}
                            whileHover={{
                              y: -8,
                              boxShadow: '0 8px 32px 0 #f97316, 0 1.5px 8px 0 rgba(31,38,135,0.10)'
                            }}
                            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-start text-left transition-all border border-gray-100 relative flex-1"
                            style={{
                              minHeight: 120,
                              borderTop: '4px solid #f97316'
                            }}
                          >
                            <div
                              className="flex items-center justify-center w-10 h-10 rounded-full mb-3"
                              style={{
                                background: '#f97316',
                                color: '#fff',
                                boxShadow: '0 2px 8px 0 #f97316'
                              }}
                            >
                              {item.icon}
                            </div>
                            <div className="font-bold text-base text-gray-800 mb-1">{item.title}</div>
                            <div className="text-gray-600 text-xs">{item.desc}</div>
                          </motion.div>
                        ) : (
                          <div key={idx} className="flex-1" />
                        )
                      )}
                    </div>
                    {/* Large card right */}
                    <motion.div
                      variants={cardVariants}
                      whileHover={{
                        y: -8,
                        boxShadow: '0 8px 32px 0 #f97316, 0 1.5px 8px 0 rgba(31,38,135,0.10)'
                      }}
                      className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-start text-left transition-all border border-gray-100 relative md:w-1/2"
                      style={{
                        minHeight: 210,
                        borderTop: '4px solid #f97316',
                        flex: 1.2
                      }}
                    >
                      <div
                        className="flex items-center justify-center w-14 h-14 rounded-full mb-4"
                        style={{
                          background: '#f97316',
                          color: '#fff',
                          boxShadow: '0 2px 8px 0 #f97316'
                        }}
                      >
                        {group[0].icon}
                      </div>
                      <div className="font-bold text-xl text-gray-800 mb-1">{group[0].title}</div>
                      <div className="text-gray-600 text-base">{group[0].desc}</div>
                    </motion.div>
                  </>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* 3. Our All-in-One Platform */}
        <motion.div variants={containerVariants} className="mb-24 w-full">
          <motion.h2 variants={cardVariants}
            className="text-4xl md:text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500">
            Our All-in-One Platform
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {platformFeatures.map((item) => (
              <motion.div
                key={item.title}
                variants={cardVariants}
                whileHover={{ y: -10, boxShadow: '0 12px 32px 0 rgba(31,38,135,0.18)' }}
                className="bg-white/60 backdrop-blur-md rounded-3xl shadow-xl p-8 flex flex-col items-center text-center transition-all border border-gray-200"
                style={{
                  minHeight: 220
                }}
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-full mb-4 bg-gradient-to-r from-amber-500 to-yellow-500"
                >
                  {item.icon}
                </div>
                <div className="font-bold text-lg text-[var(--color-primary)] mb-2">{item.title}</div>
                <div className="text-gray-700 text-sm">{item.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 5. Industries We Serve */}
        <motion.div variants={containerVariants} className="mb-14 w-full">
          <motion.h2 variants={cardVariants}
            className="text-4xl md:text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500">
            Industries We Serve
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {industries.map((item) => (
              <motion.div
                key={item.label}
                variants={cardVariants}
                whileHover={{ y: -10, boxShadow: '0 12px 32px 0 rgba(31,38,135,0.18)' }}
                className="bg-white/60 backdrop-blur-md rounded-3xl shadow-xl p-8 flex flex-col items-center text-center transition-all border border-gray-200"
                style={{
                  minHeight: 220
                }}
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-full mb-4 bg-gradient-to-r from-amber-500 to-yellow-500"

                >
                  {item.icon}
                </div>
                <div className="font-bold text-lg text-[var(--color-primary)] mb-2">{item.label}</div>
                <div className="text-gray-700 text-sm">{item.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </motion.section>
      <motion.div className="w-full my-12">
        <Testimonials />
      </motion.div>
    </>


  );
};

export default AboutPage;
