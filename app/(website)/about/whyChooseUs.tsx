'use client';
import React from 'react';
import { FaStar, FaSatelliteDish, FaChartBar, FaCheckCircle } from 'react-icons/fa';
import { MdDevices, MdBusiness, MdSupportAgent, MdSecurity } from 'react-icons/md';

export const whyChooseUs = [
  {
    icon: <FaStar className="text-yellow-500 text-2xl" />,
    title: "All-in-One Comprehensive Solution",
    desc: "High-quality hardware, powerful software, data analytics & expert support — sab kuch ek hi platform par. No more juggling multiple systems."
  },
  {
    icon: <FaSatelliteDish className="text-blue-500 text-2xl" />,
    title: "Cutting-Edge Technology",
    desc: "Latest GPS & telematics technology with real-time tracking & monitoring."
  },
  {
    icon: <FaChartBar className="text-purple-500 text-2xl" />,
    title: "Smart Data Insights",
    desc: "Driver behaviour, fuel usage, fleet performance — sab kuch ka detailed analytics milta hai."
  },
  {
    icon: <MdDevices className="text-pink-500 text-2xl" />,
    title: "User-Friendly Interface",
    desc: "Tech-savvy ho ya beginner, platform sabke liye easy to use hai."
  },
  {
    icon: <FaCheckCircle className="text-green-500 text-2xl" />,
    title: "Trusted Reliability",
    desc: "Accurate location updates and dependable data, backed by advanced tracking systems."
  },
  {
    icon: <MdBusiness className="text-indigo-500 text-2xl" />,
    title: "Fully Customizable",
    desc: "Har business alag hota hai, isliye hum solutions ko aapke operations ke hisaab se tailor karte hain."
  },
  {
    icon: <MdSupportAgent className="text-orange-500 text-2xl" />,
    title: "Dedicated Customer Support",
    desc: "Setup se lekar support tak, hamari team hamesha help ke liye ready hai."
  },
  {
    icon: <FaChartBar className="text-blue-400 text-2xl" />,
    title: "Cost-Effective Operations",
    desc: "Route optimization, fuel tracking, aur smart driving se cost bacha sakte ho."
  },
  {
    icon: <MdSecurity className="text-red-500 text-2xl" />,
    title: "Top-Notch Security",
    desc: "Geofencing, immobilization & real-time alerts ke saath aapke assets hamesha safe rahenge."
  },
  {
    icon: <MdSupportAgent className="text-yellow-600 text-2xl" />,
    title: "24/7 Support",
    desc: "Din ho ya raat — hamari support team har waqt available hai."
  }
  // Add two more cards for the last row's left side
  ,
  // Add two more cards for the last row's left side
  {
    icon: <FaCheckCircle className="text-green-400 text-2xl" />,
    title: "Seamless Integration",
    desc: "Hamare solutions aapke existing systems ke saath easily integrate ho jaate hain, bina kisi hassle ke."
  },
  {
    icon: <FaStar className="text-orange-400 text-2xl" />,
    title: "Pan India Presence",
    desc: "Bharat ke har kone mein hamari service available hai, chahe metro ho ya remote area."
  }
];
