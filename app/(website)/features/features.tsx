"use client"

import { useState, useRef, useEffect, useCallback } from "react" 
import { motion, useInView, AnimatePresence } from "framer-motion"
import {
  MapPin,
  Clock,
  Bell,
  Lock,
  Smartphone,
  AlertTriangle,
  Shield,
  Gauge,
  Route,
  Calendar,
  Zap,
  Truck,
  Car,
  BellRing,
  ShieldCheck,
  Power,
  AlarmClock,
  BarChart3,
  Navigation,
  Share2,
} from "lucide-react"
import Image from "next/image"
import type { Variants } from 'framer-motion'

export default function LocationTrackFeatures() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.1 })
  const [activeFeature, setActiveFeature] = useState(0)
  
  const features = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Live GPS Tracking",
      description:
        "Track the live location of your vehicles on an interactive map 24/7. Location Track uses high-accuracy GPS to provide real-time position updates, helping you monitor vehicle movement and respond instantly when needed.",
      points: [
        "See exact location on map",
        "Update every few seconds",
        "Useful for delivery fleets, school vans, and private vehicles",
      ],
      color: "from-orange-400 to-orange-600",
      darkColor: "from-orange-500 to-orange-700",
      image:
        "/features/LiveTracking.png",
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "History Playback",
      description:
        "Review the complete movement history of any vehicle for any past date. You can playback routes to analyze where the vehicle stopped, how long it stayed, and whether it followed the assigned path.",
      points: [
        "Improve accountability",
        "Identify route deviations",
        "Analyze delays and performance",
      ],
      color: "from-blue-400 to-blue-600",
      darkColor: "from-blue-500 to-blue-700",
      image:
        "/features/historyPlayback.png",
    },
    {
      icon: <BellRing className="w-8 h-8" />,
      title: "Geo-Fencing Alerts",
      description:
        "Set up virtual boundaries (geo-fences) on the map. Get instant alerts when a vehicle enters or exits a specific area such as a warehouse, customer location, or restricted zone.",
      points: [
        "Protect high-security zones",
        "Monitor area compliance",
        "Track arrival/departure timings",
      ],
      color: "from-green-400 to-green-600",
      darkColor: "from-green-500 to-green-700",
      image:
        "/features/geoFence.png",
    },
    {
      icon: <Power className="w-8 h-8" />,
      title: "Remote Vehicle Immobilization",
      description:
        "Remotely disable the engine of a vehicle in case of theft, unauthorized movement, or security breach. Stop the vehicle from being driven further right from your dashboard or app.",
      points: [
        "Instantly stop stolen vehicles",
        "Prevent unauthorized usage",
        "Increase vehicle recovery chances",
        "Enhanced control for high-value fleets",
      ],
      color: "from-red-400 to-red-600",
      darkColor: "from-red-500 to-red-700",
      image:
        "/features/remoteImmobilization.png",
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: "Advanced Anti-Theft Protection",
      description:
        "Location Track is equipped with intelligent anti-theft features to protect your vehicle at all times. Get immediate alerts in case of any suspicious activity.",
      points: [
        "Peace of mind — your vehicle is always under watch",
        "Fast response to theft attempts",
        "Enhanced security for personal and commercial vehicles",
        "Reduces insurance risks and losses",
      ],
      color: "from-purple-400 to-purple-600",
      darkColor: "from-purple-500 to-purple-700",
      image:
        "/features/Advanced Anti-Theft Protection.png",
    },
    {
      icon: <AlarmClock className="w-8 h-8" />,
      title: "Towing Alarm/Alert",
      description:
        "Get immediate alerts if your vehicle is moved without ignition — a common sign of towing or attempted theft.",
      points: [
        "Get alerted before it’s too late",
        "Prevent unauthorized towing or relocation",
        "Improve chances of vehicle recovery",
        "Useful for both private vehicles and delivery fleet",
      ],
      color: "from-yellow-400 to-yellow-600",
      darkColor: "from-yellow-500 to-yellow-700",
      image:
        "/features/Towing Alert Alarm.png",
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile App Support",
      description:
        "Track vehicles anytime, anywhere using our mobile app. Stay connected with your fleet on-the-go.",
      points: [
        "Available on Android (iOS coming soon)",
        "Push notifications for alerts",
        "Instant location view with maps",
      ],
      color: "from-indigo-400 to-indigo-600",
      darkColor: "from-indigo-500 to-indigo-700",
      image:
        "/features/Mobile app support.png",
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Data Security & Privacy",
      description:
        "We use end-to-end encryption and secure cloud storage to protect your data. Only authorized users can access the dashboard.",
      points: [
        "Data is stored securely on cloud",
        "Role-based access control",
        "GDPR-compliant privacy practices",
      ],
      color: "from-slate-400 to-slate-600",
      darkColor: "from-slate-500 to-slate-700",
      image:
        "/features/Data security and privacy.png",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Fleet Analytics & Reports",
      description:
        "View analytics to understand performance. Track speed, idle time, distance, and optimize vehicle usage.",
      points: [
        "Make data-driven decisions",
        "Identify underperforming vehicles",
        "Optimize routes and usage",
      ],
      color: "from-pink-400 to-pink-600",
      darkColor: "from-pink-500 to-pink-700",
      image:
        "/features/fleet analytics report.png",
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Locate Vehicle",
      description:
        "Find your parked vehicle instantly. Whether you’ve forgotten where you parked in a crowded lot or want to know exactly where your vehicle is, this feature helps you locate it in real-time with precise distance and direction.",
      points: [
        "Pinpoints exact parking location",
        "Shows distance from your current position",
        "Great for large parking areas, malls, and unfamiliar places",
        "Navigate directly to your vehicle",
      ],
      color: "from-lime-400 to-lime-600",
      darkColor: "from-lime-500 to-lime-700",
      image: "/features/Locate Vehicle.png", // Replace with actual image path
    },
    {
      icon: <Share2 className="w-8 h-8" />,
      title: "Share Location",
      description:
        "Easily share your vehicle's location with anyone. Whether it’s for safety, coordination, or pickup, this feature allows you to send your live vehicle location to family, friends, or colleagues via a secure link.",
      points: [
        "Share real-time vehicle location with just a tap",
        "Set time limits for shared access",
        "No app installation needed on receiver's end",
        "Ideal for emergencies, pickups, or coordination",
      ],
      color: "from-rose-400 to-rose-600",
      darkColor: "from-rose-500 to-rose-700",
      image: "/features/share location.png", // Replace with actual image path
    },
    {
      icon: <Navigation className="w-8 h-8" />,
      title: "Follow Me",
      description:
        "Let others follow your vehicle in real time. Perfect for group travel or convoys, this feature allows others to see your vehicle's movement live so they can follow the same route without confusion.",
      points: [
        "Live vehicle movement tracking for others",
        "Helps in family/group travel or delivery handovers",
        "Reduces chances of getting lost",
        "No need to explain routes or give directions repeatedly",
      ],
      color: "from-cyan-400 to-cyan-600",
      darkColor: "from-cyan-500 to-cyan-700",
      image: "/features/follow me.png", // Replace with actual image path
    },
  ];
  

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  const featureCardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.3,
      },
    },
  }

  // Changed literal type assertions to `as const` for better type inference and to resolve ESLint errors
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
        repeatType: "loop",
      },
    },
  } as const; // Added as const

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
        repeatType: "mirror",
      },
    },
  } as const; // Added as const

  const floatVariants = {
    float: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "loop",
      },
    },
  } as const; // Added as const

  // Autoplay logic
  const autoplayRef = useRef<NodeJS.Timeout | null>(null)

  // Wrapped startAutoplay in useCallback to fix exhaustive-deps warning
  const startAutoplay = useCallback(() => {
    if (autoplayRef.current) return
    autoplayRef.current = setInterval(() => {
      setActiveFeature((prev) => (prev === features.length - 1 ? 0 : prev + 1))
    }, 5000)
  }, [features.length]); // Added features.length as dependency

  // Wrapped stopAutoplay in useCallback
  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current)
      autoplayRef.current = null
    }
  }, []);

  // Start autoplay when component mounts
  useEffect(() => {
    startAutoplay()
    return () => stopAutoplay()
  }, [startAutoplay, stopAutoplay]); // Added startAutoplay and stopAutoplay as dependencies

  // Helper to restart autoplay
  const restartAutoplay = useCallback(() => { // Wrapped in useCallback
    stopAutoplay();
    startAutoplay();
  }, [startAutoplay, stopAutoplay]);


  const selectFeature = (index: number) => {
    setActiveFeature(index);
    restartAutoplay();
  };

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
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            <span className="bg-clip-text text-transparent bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500">
              Powerful Features
            </span>
          </h2>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">to Track Smarter, Safer, and Faster</h3>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="h-1 mt-4 mx-auto bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-full origin-center"
            style={{ width: "200px" }}
          />
        </motion.div>

        {/* Feature Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Feature Navigation - Left Side */}
          <motion.div
            className="lg:col-span-4 flex flex-col"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <div className="bg-white/40 backdrop-blur-sm rounded-3xl shadow-xl p-6 h-full">
              <h3 className="text-xl font-bold text-gray-800 mb-4">All Features</h3>
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-transparent">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                      activeFeature === index
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
                        : "hover:bg-orange-50"
                    }`}
                    onClick={() => selectFeature(index)}
                    variants={itemVariants}
                    whileHover={{ x: 5 }}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        activeFeature === index ? "bg-white/20" : `bg-gradient-to-br ${feature.color} text-white`
                      }`}
                    >
                      {feature.icon}
                    </div>
                    <span className="font-medium">{feature.title}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Feature Details - Right Side */}
          <motion.div
            className="lg:col-span-8 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* Feature Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature}
                className="bg-white/40 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border border-orange-100 overflow-hidden relative h-full"
                variants={featureCardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Background Glow Effect */}
                <motion.div
                  className="absolute inset-0 rounded-3xl opacity-30 z-0"
                  variants={glowVariants as unknown as Variants}
                  animate="glow"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                  {/* Feature Content */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-4 mb-4">
                      <motion.div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${features[activeFeature].color} p-3 text-white shadow-lg`}
                        variants={pulseVariants as unknown as Variants}
                        animate="pulse"
                      >
                        {features[activeFeature].icon}
                      </motion.div>
                      <h3 className="text-2xl font-bold text-gray-900">{features[activeFeature].title}</h3>
                    </div>

                    <p className="text-gray-700 mb-6">{features[activeFeature].description}</p>

                    <div className="space-y-3 mt-auto">
                      {features[activeFeature].points.map((point, i) => (
                        <motion.div
                          key={i}
                          className="flex items-start gap-2"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                        >
                          <div className="mt-1 flex-shrink-0">
                            <motion.div
                              className="w-5 h-5 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.4 + i * 0.1, type: "spring" }}
                            >
                              ✓
                            </motion.div>
                          </div>
                          <span className="text-gray-700">{point}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Feature Image */}
                  <div className="flex items-center justify-center relative">
                    <motion.div
                      className="w-full h-full max-h-[300px] rounded-2xl overflow-hidden shadow-lg relative"
                      variants={floatVariants as unknown as Variants}
                      animate="float"
                    >
                      {/* Animated Vehicle Icons */}
                      <div className="absolute inset-0 z-10 overflow-hidden">
                        <motion.div
                          className="absolute"
                          animate={{
                            x: ["-10%", "110%"],
                            y: ["40%", "40%"],
                          }}
                          transition={{
                            duration: 8,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "loop",
                          }}
                        >
                          <div className="bg-orange-500 rounded-full p-1 shadow-lg">
                            <Car size={16} className="text-white" />
                          </div>
                        </motion.div>
                        <motion.div
                          className="absolute"
                          animate={{
                            x: ["110%", "-10%"],
                            y: ["60%", "60%"],
                          }}
                          transition={{
                            duration: 10,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "loop",
                          }}
                        >
                          <div className="bg-orange-600 rounded-full p-1 shadow-lg">
                            <Truck size={16} className="text-white" />
                          </div>
                        </motion.div>
                      </div>

                      <Image
                        src={features[activeFeature].image}
                        alt={features[activeFeature].title}
                        width={600}
                        height={300}
                        className="w-full h-full object-cover"
                      />

                      {/* Overlay with feature-specific icons */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end justify-center p-4">
                        <div className="flex gap-3">
                          {activeFeature === 0 && (
                            <>
                              <motion.div
                                className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-orange-600"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5 }}
                              >
                                <MapPin size={16} />
                              </motion.div>
                              <motion.div
                                className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-orange-600"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.6 }}
                              >
                                <Route size={16} />
                              </motion.div>
                              <motion.div
                                className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-orange-600"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.7 }}
                              >
                                <Gauge size={16} />
                              </motion.div>
                            </>
                          )}
                          {activeFeature === 1 && (
                            <>
                              <motion.div
                                className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-orange-600"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5 }}
                              >
                                <Route size={16} />
                              </motion.div>
                              <motion.div
                                className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-orange-600"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.6 }}
                              >
                                <Clock size={16} />
                              </motion.div>
                              <motion.div
                                className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-orange-600"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.7 }}
                              >
                                <Calendar size={16} />
                              </motion.div>
                            </>
                          )}
                          {activeFeature === 2 && (
                            <>
                              <motion.div
                                className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-orange-600"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5 }}
                              >
                                <Bell size={16} />
                              </motion.div>
                              <motion.div
                                className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-orange-600"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.6 }}
                              >
                                <AlertTriangle size={16} />
                              </motion.div>
                              <motion.div
                                className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-orange-600"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.7 }}
                              >
                                <Zap size={16} />
                              </motion.div>
                            </>
                          )}
                          {activeFeature === 3 && (
                            <>
                              <motion.div
                                className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-orange-600"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5 }}
                              >
                                <Lock size={16} />
                              </motion.div>
                              <motion.div
                                className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-orange-600"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.6 }}
                              >
                                <Shield size={16} />
                              </motion.div>
                              <motion.div
                                className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-orange-600"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.7 }}
                              >
                                <Zap size={16} />
                              </motion.div>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Feature Indicators */}
            <div className="flex justify-center mt-6 gap-1.5">
              {features.map((_, index) => (
                <motion.button
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full ${activeFeature === index ? "bg-orange-500" : "bg-orange-200"}`}
                  onClick={() => selectFeature(index)}
                  whileHover={{ scale: 1.5 }}
                  animate={
                    activeFeature === index
                      ? {
                          scale: [1, 1.3, 1],
                          transition: { duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" },
                        }
                      : {}
                  }
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Summary Box */}
        <motion.div
          className="relative z-10 max-w-3xl mx-auto mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.8 }}
        >
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl shadow-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Summary:</h3>
            <p className="text-lg">
              With over 25+ smart features, LocationTrack gives you total control of your vehicles and operations — all
              in one place.
            </p>

          </div>
        </motion.div>
      </div>
    </section>
  )
}