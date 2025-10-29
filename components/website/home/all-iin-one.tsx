"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { FaLaptopCode, FaMicrochip, FaChartBar } from "react-icons/fa"
import type { Variants } from "framer-motion"

const features = [
  {
    icon: <FaLaptopCode size={40} />,
    title: "Vehicle Tracking Software",
    desc: "Monitor and manage your entire fleet using our robust and easy-to-use platform. Get real-time updates, trip history, driver behaviour, and insightful reports at your fingertips.",
    color: "from-orange-400 via-orange-500 to-orange-600",
  },
  {
    icon: <FaMicrochip size={40} />,
    title: "Cutting-Edge Hardware",
    desc: "We provide high-performance GPS trackers, sensors, and IoT devices that integrate seamlessly with our software for accurate and uninterrupted data collection.",
    color: "from-orange-300 via-orange-400 to-orange-500",
  },
  {
    icon: <FaChartBar size={40} />,
    title: "Actionable Insights",
    desc: "Transform raw vehicle data into meaningful insights. Make data-driven decisions to boost productivity, safety, and operational ROI.",
    color: "from-orange-500 via-orange-600 to-orange-700",
  },
]

const featureVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.1 * i,
      duration: 0.7,
      ease: "easeOut" as const,
    },
  }),
}

const iconFloat: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 2.2,
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "mirror" as const,
      ease: "easeInOut",
    },
  },
}

// Animated dots for the map visualization
const Dots = () => {
  const [positions, setPositions] = useState<{ left: number; top: number }[]>([])
  useEffect(() => {
    setPositions(Array.from({ length: 12 }).map(() => ({
      left: Math.random() * 80 + 10,
      top: Math.random() * 80 + 10,
    })))
  }, [])
  if (!positions.length) return null
  return (
    <div className="relative w-full h-full">
      {positions.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full bg-orange-500"
          style={{ left: `${pos.left}%`, top: `${pos.top}%` }}
          initial={{ opacity: 0.3, scale: 0.5 }}
          animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.5, 1, 0.5] }}
          transition={{ duration: Math.random() * 3 + 2, repeat: Number.POSITIVE_INFINITY, delay: Math.random() * 2 }}
        />
      ))}
    </div>
  )
}

// Animated routes for the map visualization
const Routes = () => {
  const routes = [
    { start: { x: 20, y: 30 }, end: { x: 70, y: 60 } },
    { start: { x: 30, y: 70 }, end: { x: 80, y: 40 } },
    { start: { x: 15, y: 50 }, end: { x: 60, y: 20 } },
    { start: { x: 40, y: 80 }, end: { x: 90, y: 70 } },
  ]

  return (
    <>
      {routes.map((route, i) => (
        <motion.div
          key={i}
          className="absolute bg-gradient-to-r from-orange-400 to-orange-600 h-[2px] origin-left"
          style={{
            left: `${route.start.x}%`,
            top: `${route.start.y}%`,
            width: `${Math.sqrt(Math.pow(route.end.x - route.start.x, 2) + Math.pow(route.end.y - route.start.y, 2))}%`,
            transform: `rotate(${
              Math.atan2(route.end.y - route.start.y, route.end.x - route.start.x) * (180 / Math.PI)
            }deg)`,
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{
            scaleX: 1,
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 1.5,
            repeatDelay: 2,
          }}
        />
      ))}
    </>
  )
}

const FloatingDataPoints = () => {
  const [positions, setPositions] = useState<{ left: number; top: number }[]>([])
  useEffect(() => {
    setPositions(Array.from({ length: 5 }).map(() => ({
      left: Math.random() * 70 + 15,
      top: Math.random() * 70 + 15,
    })))
  }, [])
  if (!positions.length) return null
  const labels = ["Speed: 65 mph", "Fuel: 78%", "ETA: 14 min", "Distance: 12.4 mi", "Status: Active"]
  return (
    <>
      {positions.map((pos, i) => (
        <motion.div
          key={`data-${i}`}
          className="absolute bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md border border-orange-100 text-xs font-medium text-gray-700"
          style={{ left: `${pos.left}%`, top: `${pos.top}%` }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + i * 0.2, duration: 0.5 }}
        >
          {labels[i]}
        </motion.div>
      ))}
    </>
  )
}

const SplitFeatures: React.FC = () => (
  <section className="py-20 px-4 overflow-hidden">
    <div className="max-w-7xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-16"
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500">
          All-in-One Platform
        </span>
      </motion.h2>

      <div className="flex flex-col lg:flex-row gap-10 items-center">
        {/* Left side - Features */}
        <motion.div
          className="w-full lg:w-1/2 space-y-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {features.map((feature, i) => (
            <motion.div key={feature.title} custom={i} variants={featureVariants} className="flex gap-6 group">
              <motion.div
                variants={iconFloat}
                animate="animate"
                className={`flex-shrink-0 bg-gradient-to-br ${feature.color} text-white p-4 rounded-2xl shadow-lg h-fit`}
              >
                {feature.icon}
              </motion.div>

              <div>
                <h3 className="font-bold text-2xl mb-2 text-gray-900 group-hover:text-orange-500 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-700 font-medium">{feature.desc}</p>

                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                  viewport={{ once: true }}
                  className={`h-[1px] mt-4 bg-gradient-to-r ${feature.color} opacity-50`}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Right side - Visualization */}
        <motion.div
          className="w-full lg:w-1/2 h-[500px] relative"
          initial={{ opacity: 0, scale: 0.9, x: 50 }}
          whileInView={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-orange-100">
            {/* Map-like background */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="gray" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Map visualization elements */}
            <Routes />
            <Dots />

            {/* Central hub */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white shadow-lg"
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(249, 115, 22, 0.4)",
                  "0 0 0 20px rgba(249, 115, 22, 0)",
                  "0 0 0 0 rgba(249, 115, 22, 0)",
                ],
              }}
              transition={{
                duration: 2.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 0.5,
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-white/30"
              />
              <FaLaptopCode size={30} />
            </motion.div>

            {/* Floating data points */}
            <FloatingDataPoints />

            {/* Legend */}
            <div className="absolute bottom-6 left-6 right-6 bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-orange-100">
              <div className="text-center text-sm font-medium text-gray-700">
                Real-time Fleet Monitoring Visualization
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
)

export default SplitFeatures
