"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import {
  Cpu,
  Smartphone,
  Cloud,
  BarChart3,
  Zap,
  HeadphonesIcon,
  CheckCircle2,
  MapPin,
  Gauge,
  Power,
  Droplet,
  Clock,
  AlertTriangle,
  Truck,
  Car,
  Bus,
  Bike,
} from "lucide-react"

const AnimatedVehicle = ({
  IconComponent,
  delay,
  color,
  reverse = false,
  size = 24,
}: {
  IconComponent: React.ComponentType<{ size: number; className: string }>;
  delay: number;
  color: string;
  reverse?: boolean;
  size?: number;
}) => {
  return (
    <motion.div
      initial={{ y: reverse ? -20 : 0 }}
      animate={{
        y: reverse ? [0, 1000] : [0, 1000],
        transition: {
          duration: 15,
          delay: delay,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop", // Ensure this is a valid string literal
          ease: "easeInOut",
        },
      }}
      className="absolute left-1/2 -translate-x-1/2"
      style={{ zIndex: 20 }}
    >
      <div className={`bg-gradient-to-br ${color} rounded-full p-2 shadow-lg`}>
        <IconComponent size={size} className="text-white" />
      </div>
    </motion.div>
  );
};

export default function LocationTrackProcess() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.1 })

  const steps = [
    {
      number: 1,
      title: "Device Installation",
      description:
        "Our certified technicians install high-performance GPS tracking devices into your vehicle or equipment. Installation is quick, clean, and does not tamper with your vehicle original system.",
      icon: <Cpu className="w-full h-full" />,
      benefits: [
        "Tamper-proof & hidden installation",
        "Professional support for all vehicle types",
      ],
      color: "from-orange-400 via-orange-500 to-orange-600",
      darkColor: "from-orange-500 via-orange-600 to-orange-700",
    },
    {
      number: 2,
      title: "Real-Time Data Collection",
      description:
        "Once installed, the device starts collecting live data from your vehicle including location, speed, ignition status, fuel usage, engine hours, and driving behaviour (harsh braking, over speeding, etc.)",
      icon: <Smartphone className="w-full h-full" />,
      subItems: [
        { icon: <MapPin size={18} />, text: "Location" },
        { icon: <Gauge size={18} />, text: "Speed" },
        { icon: <Power size={18} />, text: "Ignition status" },
        { icon: <Droplet size={18} />, text: "Fuel usage" },
        { icon: <Clock size={18} />, text: "Engine hours" },
        { icon: <AlertTriangle size={18} />, text: "Driving behaviour" },
      ],
      footer: "All this data is securely transmitted to our cloud servers using 4G/2G networks.",
      color: "from-orange-300 via-orange-400 to-orange-500",
      darkColor: "from-orange-400 via-orange-500 to-orange-600",
    },
    {
      number: 3,
      title: "Cloud-Based Processing",
      description:
        "The collected data is processed in real-time on our secure cloud platform. Advanced algorithms clean, organize, and analyze the raw data into meaningful insights.",
      icon: <Cloud className="w-full h-full" />,
      benefits: ["End-to-end data encryption", "Lightning-fast data sync", "99.9% uptime with global scalability"],
      color: "from-orange-500 via-orange-600 to-orange-700",
      darkColor: "from-orange-600 via-orange-700 to-orange-800",
    },
    {
      number: 4,
      title: "Smart Dashboard Access",
      description:
        "You get instant access to your vehicle and fleet data via Mobile App (Android & iOS) and Web Dashboard.",
      icon: <BarChart3 className="w-full h-full" />,
      subItems: [
        { icon: <MapPin size={18} />, text: "View real-time location" },
        { icon: <AlertTriangle size={18} />, text: "Get alerts & notifications" },
        { icon: <BarChart3 size={18} />, text: "Download reports" },
        { icon: <MapPin size={18} />, text: "Manage geofences" },
        { icon: <AlertTriangle size={18} />, text: "Monitor driver behaviour" },
        { icon: <Zap size={18} />, text: "Set custom rules" },
      ],
      color: "from-orange-400 via-orange-500 to-orange-600",
      darkColor: "from-orange-500 via-orange-600 to-orange-700",
    },
    {
      number: 5,
      title: "Action & Automation",
      description: "Based on your data, you can take smarter actions:",
      icon: <Zap className="w-full h-full" />,
      benefits: [
        "Immobilize vehicle remotely",
        "Trigger instant alerts",
        "Send commands",
        "Track route history",
        "Optimize driver & fuel performance",
      ],
      color: "from-orange-300 via-orange-400 to-orange-500",
      darkColor: "from-orange-400 via-orange-500 to-orange-600",
    },
    {
      number: 6,
      title: "24/7 Support & Maintenance",
      description:
        "Our team is always there to help with technical support, maintenance, software updates, and device upgrades.",
      icon: <HeadphonesIcon className="w-full h-full" />,
      subItems: [
        { icon: <HeadphonesIcon size={18} />, text: "Technical support" },
        { icon: <Cpu size={18} />, text: "Maintenance" },
        { icon: <Zap size={18} />, text: "Software updates" },
        { icon: <Smartphone size={18} />, text: "Device upgrades" },
      ],
      color: "from-orange-500 via-orange-600 to-orange-700",
      darkColor: "from-orange-600 via-orange-700 to-orange-800",
    },
  ]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.4, 0.0, 0.2, 1] as const,
      },
    },
  }

  const lineVariants = {
    hidden: { height: 0 },
    visible: {
      height: "100%",
      transition: {
        duration: 1.5,
        ease: "easeInOut" as const,
      },
    },
  }

  const iconVariants = {
    hidden: { scale: 0, rotate: -30 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring" as const,
        stiffness: 260,
        damping: 20,
        delay: 0.3,
      },
    },
  }

  const checkmarkVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.6 + i * 0.1,
        duration: 0.5,
      },
    }),
  }

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      boxShadow: [
        "0 0 0 0 rgba(249, 115, 22, 0)",
        "0 0 0 10px rgba(249, 115, 22, 0.2)",
        "0 0 0 0 rgba(249, 115, 22, 0)",
      ],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "loop" as const,
      },
    },
  }

  const glowVariants = {
    glow: {
      boxShadow: [
        "0 0 20px 0px rgba(249, 115, 22, 0.3)",
        "0 0 30px 5px rgba(249, 115, 22, 0.6)",
        "0 0 20px 0px rgba(249, 115, 22, 0.3)",
      ],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "mirror" as const, // <-- fixed
      },
    },
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white overflow-hidden" ref={containerRef}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 inline-block">
            <span className="bg-clip-text text-transparent bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500">
              Simple. Smart. Secure.
            </span>
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">Here&apos;s How LocationTrack Works</h3>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="h-1 mt-4 mx-auto bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-full origin-center"
            style={{ width: "200px" }}
          />
        </motion.div>

        {/* Steps */}
        <motion.div
          className="relative"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Timeline Line */}
          <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 z-0">
            <motion.div
              className="h-full w-full bg-gradient-to-b from-orange-300 via-orange-500 to-orange-600 rounded-full"
              variants={lineVariants}
            />

            {/* Animated Vehicles */}
            <div className="absolute inset-0 overflow-hidden">
              {/* First Vehicle - Truck */}
              <AnimatedVehicle IconComponent={Truck} delay={0} color="from-orange-500 to-orange-600" size={20} />

              {/* Second Vehicle - Car */}
              <AnimatedVehicle
                IconComponent={Car}
                delay={4}
                color="from-orange-400 to-orange-500"
                reverse={true}
                size={18}
              />

              {/* Third Vehicle - Bus */}
              <AnimatedVehicle IconComponent={Bus} delay={8} color="from-orange-600 to-orange-700" size={22} />

              {/* Fourth Vehicle - Bike */}
              <AnimatedVehicle
                IconComponent={Bike}
                delay={12}
                color="from-orange-300 to-orange-400"
                reverse={true}
                size={16}
              />
            </div>
          </div>

          {/* Steps */}
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className={`relative flex flex-col md:flex-row items-start gap-4 md:gap-8 mb-16 md:mb-24 ${
                index % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
              variants={itemVariants}
            >
              {/* Step Number with Icon */}
              <motion.div
                className={`absolute left-0 md:left-1/2 -translate-x-1/2 z-10 w-14 h-14 rounded-full bg-gradient-to-br ${step.darkColor} flex items-center justify-center text-white font-bold text-xl shadow-lg`}
                variants={pulseVariants}
                animate="pulse"
              >
                {step.number}
              </motion.div>

              {/* Content Box */}
              <motion.div
                className={`ml-20 md:ml-0 md:w-[calc(50%-3rem)] ${
                  index % 2 === 1 ? "md:text-right md:items-end" : "md:text-left md:items-start"
                } flex flex-col`}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white/40 backdrop-blur-xl rounded-3xl shadow-xl p-6 md:p-8 border border-orange-100 overflow-hidden relative">
                  {/* Background Glow Effect */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl opacity-30 z-0"
                    variants={glowVariants}
                    animate="glow"
                  />

                  {/* Icon */}
                  <div className="flex items-center gap-4 mb-4">
                    <motion.div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} p-2.5 text-white shadow-lg`}
                      variants={iconVariants}
                    >
                      {step.icon}
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {step.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 mb-4 relative z-10">{step.description.replace(/'/g, "&apos;")}</p>

                  {/* Sub Items Grid */}
                  {step.subItems && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                      {step.subItems.map((item, i) => (
                        <motion.div
                          key={i}
                          className="flex items-center gap-2 text-gray-700"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                        >
                          <span className="text-orange-500">{item.icon}</span>
                          <span className="text-sm">{item.text}</span>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Benefits List */}
                  {step.benefits && (
                    <div className="space-y-2 mt-4">
                      {step.benefits.map((benefit, i) => (
                        <motion.div key={i} className="flex items-center gap-2" custom={i} variants={checkmarkVariants}>
                          <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0" />
                          <span className="text-gray-700">{benefit}</span>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Footer Text */}
                  {step.footer && <p className="mt-4 text-gray-600 italic">{step.footer}</p>}
                </div>
              </motion.div>

              {/* Visual Element (only visible on larger screens) */}
              <div className="hidden md:block md:w-[calc(50%-3rem)]">
                {index % 2 === 0 && (
                  <motion.div
                    className="h-full w-full flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${step.color} p-4 text-white shadow-xl`}>
                      {step.icon}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}

          {/* Summary Box */}
          <motion.div
            className="relative z-10 max-w-3xl mx-auto mt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7, delay: 1.2 }}
          >
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl shadow-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Summary:</h3>
              <p className="text-lg">
                LocationTrack works in 6 simple steps &mdash; Install &rarr; Track &rarr; Analyse &rarr; Control &rarr; Automate &rarr; Support. It&apos;s
                the easiest way to manage your vehicles smartly and securely.
              </p>

              <motion.div className="mt-6 flex justify-center" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <a
                  href="#get-started"
                  className="bg-white text-orange-600 font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get Started Today
                </a>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
