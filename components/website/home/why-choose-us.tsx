// components/home/WhyChooseUs.tsx
'use client';
import { motion } from 'framer-motion';
import { FaCogs, FaChartLine, FaUserShield, FaSmile, FaLock, FaHeadset } from 'react-icons/fa';

const features = [
  {
    icon: <FaCogs size={28} className="text-yellow-500" />,
    title: "All-in-One Comprehensive Solution",
    desc: "Get everything you need — hardware, software, analytics, and support — all on one platform.",
  },
  {
    icon: <FaChartLine size={28} className="text-yellow-500" />,
    title: "Cutting-Edge Technology",
    desc: "Modern GPS & telematics-based solutions for accurate, real-time tracking.",
  },
  {
    icon: <FaSmile size={28} className="text-yellow-500" />,
    title: "User-Friendly Interface",
    desc: "Designed for simplicity. Easy to start, navigate, and manage.",
  },
  {
    icon: <FaLock size={28} className="text-yellow-500" />,
    title: "Top-Notch Security",
    desc: "Protect your assets with geo fencing, immobilization, and instant alerts.",
  },
  {
    icon: <FaUserShield size={28} className="text-yellow-500" />,
    title: "Fully Customizable",
    desc: "Flexible solutions tailored to your unique operational needs.",
  },
  {
    icon: <FaHeadset size={28} className="text-yellow-500" />,
    title: "24/7 Support",
    desc: "Our team is always ready to assist you, round the clock.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 relative">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500">
              Why Choose Us
            </span>
          </motion.h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-2xl transition-shadow"
            >
              {f.icon}
              <h3 className="font-semibold text-xl mt-4 mb-2">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}