'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCar, FaMapMarkerAlt, FaBolt, FaWifi, FaLock, FaRoad, FaUserCheck, FaStar, FaChartLine, FaExclamationTriangle, FaShareAlt } from "react-icons/fa";
import BookDemoModal from './BookDemoModal';

const commonTags = [
  { label: "Live Tracking", icon: <FaWifi size={18} />, style: "top-4 left-32", onImage: false },
  { label: "History Playback", icon: <FaRoad size={18} />, style: "top-4 right-8", onImage: false },
  { label: "Geo Fencing", icon: <FaMapMarkerAlt size={18} />, style: "top-24 left-4", onImage: false },
  { label: "Remote Immobilization", icon: <FaBolt size={18} />, style: "top-24 right-4", onImage: false },
  { label: "Anti-Theft Protection", icon: <FaLock size={18} />, style: "bottom-24 left-8", onImage: false },
  { label: "Towing Alert", icon: <FaExclamationTriangle size={18} />, style: "bottom-24 right-8", onImage: false },
  { label: "Follow Me", icon: <FaUserCheck size={18} />, style: "bottom-8 left-32", onImage: false },
  { label: "Share Location", icon: <FaShareAlt size={18} />, style: "bottom-8 right-32", onImage: false },
  { label: "Locate Vehicle", icon: <FaCar size={18} />, style: "top-1/2 right-2", onImage: true },
  { label: "24*7 Technical Support", icon: <FaStar size={18} />, style: "top-2 left-1/2 -translate-x-1/2", onImage: true },
  { label: "Driving behaviour", icon: <FaChartLine size={18} />, style: "top-1/2 left-2", onImage: true },
];

const slides = [
  { image: "/hero/car.png", tags: commonTags },
  { image: "/hero/truck.png", tags: commonTags },
  { image: "/hero/bus.png", tags: commonTags },
  { image: "/hero/bike.png", tags: commonTags },
  { image: "/hero/tractor.png", tags: commonTags },
  { image: "/hero/scooter.png", tags: commonTags },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);

  // Auto-advance slides every 6 seconds, pause on hover
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section className="relative w-full min-h-[80vh] flex flex-col md:flex-row items-center justify-between px-4 md:px-16 py-12 overflow-hidden" style={{ background: "linear-gradient(120deg, #f8fafc 0%, #fef6e4 100%)" }}>
      {/* Left Side */}
      <div className="flex-1 max-w-xl flex flex-col justify-center z-10">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-5xl font-extrabold text-[var(--color-primary)] mb-4 drop-shadow-sm"
        >
          <span className="text-orange-500">Secure</span>{' '}
          <span className="text-gray-900">Track</span>{' '}
          <span className="text-orange-500">Control</span>
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-xl md:text-2xl font-semibold mb-6 text-gray-800"
        >
          Anytime, Anywhere With <span className="text-orange-500">LocationTrack</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-10 text-lg md:text-xl font-medium text-gray-700 drop-shadow-sm"
        >
          Stay in control of your vehicles - whether it&apos;s a single car or an entire fleet. Location Track offers real-time GPS tracking, anti-theft alerts, immobilization, and smart insights to keep your vehicles and your business safe.
        </motion.p>
        <motion.button
          whileHover={{ scale: 1.06 }}
          className="px-12 w-fit py-4 border-2 border-yellow-400 text-yellow-600 font-bold text-xl bg-white/80 backdrop-blur-md hover:bg-yellow-50 transition-colors shadow-lg rounded-xl"
          onClick={() => setModalOpen(true)}
        >
          Book Demo
        </motion.button>
      </div>
      {/* Right Side: Slider */}
      <div className={`flex-1 relative flex items-center justify-center mt-14 md:mt-0 min-w-[340px] min-h-[320px] z-10 ${isMobile ? 'flex-col' : ''}`}>
        {/* Image & Feature Tags */}
        <AnimatePresence mode="wait">
          <motion.img
            key={slides[current].image}
            src={slides[current].image}
            alt="Vehicle"
            initial={{ opacity: 0, scale: 0.95, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: -40 }}
            transition={{ duration: 0.6 }}
            className="object-contain w-[420px] h-[220px]"
            style={{ zIndex: 1 }}
          />
        </AnimatePresence>
        {/* Feature Tags for current slide - Desktop (absolute) */}
        <AnimatePresence mode="wait" initial={false}>
          {slides[current].tags.map((feature, idx) => (
            <motion.div
              key={feature.label + current}
              initial={{ opacity: 0, y: feature.onImage ? 20 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: feature.onImage ? 20 : 10 }}
              transition={{ delay: 0.2 + idx * 0.07, duration: 0.5 }}
              className={`absolute ${feature.style} ${feature.onImage ? 'z-30' : 'z-20'} bg-white/70 ${feature.onImage ? 'backdrop-blur-lg' : 'backdrop-blur-md'} rounded-xl shadow-xl px-4 py-2 flex items-center gap-2 text-base font-semibold border border-white/70 hover:scale-110 hover:shadow-yellow-300 hover:z-40 transition-transform cursor-pointer hidden md:flex`}
              style={feature.onImage ? { zIndex: 30 } : { zIndex: 20 }}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <span className="text-yellow-600">{feature.icon}</span>
              <span className="text-gray-900 whitespace-nowrap drop-shadow-sm">{feature.label}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        {/* Feature Tags for current slide - Mobile/Tablet (flex row, only 5) */}
        {isMobile && (
          <div className="w-full flex flex-wrap justify-center gap-2 mt-4 mb-8 md:hidden">
            {slides[current].tags.slice(0, 5).map((feature) => (
              <div
                key={feature.label + current}
                className={`bg-white/80 rounded-xl shadow px-3 py-1 flex items-center gap-2 text-sm font-semibold border border-white/70`}
              >
                <span className="text-yellow-600">{feature.icon}</span>
                <span className="text-gray-900 whitespace-nowrap drop-shadow-sm">{feature.label}</span>
              </div>
            ))}
          </div>
        )}
        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-3 h-3 rounded-full border-2 ${current === idx ? 'bg-yellow-500 border-yellow-600' : 'bg-white border-yellow-300'} transition-all`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
      <BookDemoModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
} 