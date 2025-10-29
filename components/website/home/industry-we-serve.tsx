"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence, useMotionTemplate, useMotionValue } from "framer-motion"
import {
  FaTruck,
  FaHardHat,
  FaCity,
  FaUserAlt,
  FaCarSide,
  FaAmbulance,
  FaBuilding,
  FaBus,
  FaSeedling,
} from "react-icons/fa"

const industries = [
  {
    icon: <FaTruck size={28} />,
    title: "Logistics & Transportation",
    desc: "Improve fleet efficiency, cut fuel costs, and ensure timely deliveries with route optimization and smart dispatching.",
  },
  {
    icon: <FaHardHat size={28} />,
    title: "Construction",
    desc: "Track heavy equipment and on-site vehicles, monitor usage, and streamline project execution through real-time tracking.",
  },
  {
    icon: <FaCity size={28} />,
    title: "Public Services",
    desc: "Ensure efficient and safe operation of public vehicles like garbage trucks, water tankers, and emergency services with centralized monitoring.",
  },
  {
    icon: <FaUserAlt size={28} />,
    title: "Personal Use",
    desc: "Track your personal car or bike in real-time, receive driving behaviour insights, and protect your loved ones with safety-first technology.",
  },
  {
    icon: <FaCarSide size={28} />,
    title: "Rental & Leasing",
    desc: "Monitor leased vehicles, track maintenance cycles, and ensure the safety of rented cars or equipment using reliable GPS tracking.",
  },
  {
    icon: <FaAmbulance size={28} />,
    title: "Ambulance Services",
    desc: "Save lives with rapid response times by tracking ambulances in real time and optimizing dispatch routes.",
  },
  {
    icon: <FaBuilding size={28} />,
    title: "Municipal Corporations",
    desc: "Improve accountability and service delivery by tracking waste collection vehicles, maintenance vans, and civic utility vehicles.",
  },
  {
    icon: <FaBus size={28} />,
    title: "School Buses",
    desc: "Ensure student safety with live tracking, speed monitoring, and automated alerts for parents during pickup and drop-off.",
  },
  {
    icon: <FaSeedling size={28} />,
    title: "Agriculture",
    desc: "Track tractors, harvesters, and rural transport vehicles across large farmlands. Prevent misuse, reduce idle time, and ensure asset security.",
  },
]

export default function IndustriesWeServe() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="relative overflow-hidden py-20 px-4">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-orange-200/30 to-orange-400/20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-tr from-orange-300/20 to-orange-500/10 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -10, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 18,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="absolute top-10 left-0 w-full h-full pointer-events-none"
        >
          {[
            { top: "10%", left: "20%" },
            { top: "30%", left: "80%" },
            { top: "50%", left: "40%" },
            { top: "70%", left: "60%" },
            { top: "20%", left: "50%" },
            { top: "40%", left: "30%" },
            { top: "60%", left: "70%" },
            { top: "80%", left: "10%" },
            { top: "15%", left: "90%" },
            { top: "35%", left: "25%" },
            { top: "55%", left: "85%" },
            { top: "75%", left: "45%" },
            { top: "25%", left: "15%" },
            { top: "45%", left: "95%" },
            { top: "65%", left: "35%" },
            { top: "85%", left: "75%" },
            { top: "5%", left: "55%" },
            { top: "95%", left: "65%" },
            { top: "15%", left: "85%" },
            { top: "35%", left: "5%" }
          ].map((position, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-orange-300"
              style={{
                top: position.top,
                left: position.left,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 4 + (i % 3) * 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.5,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>

        <div className="text-center mb-16 relative">

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500">
              Industries We Serve
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            From logistics to agriculture, public services to personal use—our solutions empower every sector to achieve
            digital excellence.
          </motion.p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {industries.map((industry, index) => (
            <IndustryCard
              key={industry.title}
              industry={industry}
              index={index}
              isHovered={hoveredIndex === index}
              onHover={() => setHoveredIndex(index)}
              onLeave={() => setHoveredIndex(null)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

interface IndustryCardProps {
  industry: {
    icon: React.ReactNode
    title: string
    desc: string
  }
  index: number
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
}

function IndustryCard({ industry, index, isHovered, onHover, onLeave }: IndustryCardProps) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    mouseX.set(x)
    mouseY.set(y)
  }

  const background = useMotionTemplate`radial-gradient(
    650px circle at ${mouseX}px ${mouseY}px,
    rgba(253, 224, 71, 0.15),
    transparent 80%
  )`

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
            delay: index * 0.1,
          },
        },
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onMouseMove={handleMouseMove}
      className="group relative"
    >
      <AnimatePresence>
        {isHovered && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-orange-200 to-orange-300 opacity-80 blur-xl"
          />
        )}
      </AnimatePresence>

      <motion.div
        style={{ background }}
        className="absolute inset-0 -z-10 rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
      />

      <div className="relative h-full bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200/50 shadow-lg overflow-hidden p-6 transition-all duration-300 hover:shadow-xl hover:border-orange-200/50">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(#fef9c3_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

        <div className="flex flex-col h-full">
          <div className="flex justify-center mb-5">
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: isHovered ? -5 : 0 }}
              whileHover={{ scale: 1.1 }}
              className="relative"
            >
              <motion.div
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }}
                className="relative z-10 flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full text-white shadow-lg"
              >
                {industry.icon}
              </motion.div>

              <motion.div
                animate={{
                  scale: isHovered ? [1, 1.2, 1] : 1,
                  opacity: isHovered ? [0.7, 0.2, 0.7] : 0.5,
                }}
                transition={{
                  duration: 2,
                  repeat: isHovered ? Number.POSITIVE_INFINITY : 0,
                  repeatType: "mirror",
                }}
                className="absolute inset-0 bg-orange-400 rounded-full blur-xl opacity-50 -z-10"
              />
            </motion.div>
          </div>

          <motion.h3
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
            className="text-xl font-bold text-center text-gray-900 mb-3"
          >
            {industry.title}
          </motion.h3>

          <motion.p
            animate={{ opacity: isHovered ? 1 : 0.8 }}
            transition={{ duration: 0.3 }}
            className="text-gray-600 text-center flex-grow"
          >
            {industry.desc}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              y: isHovered ? 0 : 10,
            }}
            transition={{ duration: 0.3 }}
            className="mt-4 pt-3 text-center"
          >
            <span className="inline-flex items-center text-orange-600 font-medium">
              Learn more
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
