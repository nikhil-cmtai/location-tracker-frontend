'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const testimonials = [
  {
    name: "SATYA NARAYAN SHUKLA",
    content: "LocationTrack ne mere liye kaafi asaaniyaan laayi hain. Ab main apni gadiyaan real-time track kar sakta hoon. Bahut hi bharosemand service hai."
  },
  {
    name: "ALOK KUMAR SINGH",
    content: "Pehle mujhe vehicle ki location ka andaza lagana padta tha, ab LocationTrack sab kuch live dikhata hai. Kaafi helpfull tool hai."
  },
  {
    name: "ASHISH GUPTA",
    content: "Main LocationTrack use karta hoon aur iska interface bahut simple aur user-friendly hai. Ab fleet management ekdum smooth ho gaya hai."
  },
  {
    name: "BRIJESH KUMAR SINGH",
    content: "LocationTrack ke saath kaam karna ek accha anubhav raha. Isne mere logistics ka control mere haath mein de diya."
  },
  {
    name: "BHGWATI SINGH",
    content: "LocationTrack ka use karne ke baad mere driver ke whereabouts ka tension hi khatam ho gaya. Sab kuch live dekh sakta hoon."
  },
  {
    name: "SHYAM SUNDAR SINGH",
    content: "Main pichhle kuch mahino se LocationTrack ka use kar raha hoon, aur iska live tracking feature mere liye priceless hai."
  },
  {
    name: "RAKESH KUMAR SINGH",
    content: "Bahut hi badiya system hai. Real-time tracking aur reports mujhe har roz ki planning mein madad karte hain."
  },
  {
    name: "MANISH KUMAR YADAV",
    content: "Mujhe pehle fleet handle karna ek mushkil kaam lagta tha, par LocationTrack ne sab easy kar diya."
  },
  {
    name: "NANDLAL PATHAK",
    content: "Main LocationTrack ke through apni delivery vans ka real-time status dekh sakta hoon. Time ki bachat ho gayi hai."
  },
  {
    name: "ABHISHEK KUMAR SINGH",
    content: "LocationTrack ek smart solution hai jo mere business operations ko streamline karta hai. Customer support bhi lajawab hai."
  },
  {
    name: "RAMGOPAL",
    content: "Mujhe ab har gaadi ka pata hota hai, wo bhi bina phone uthaye. LocationTrack ne kaam simple kar diya."
  },
  {
    name: "DHARAM BALI YADAV",
    content: "Pehle har waqt phone pe puchna padta tha driver se, ab sab kuch app mein mil jata hai. Shandar service!"
  },
  {
    name: "ASHISH BAJPAI",
    content: "Main LocationTrack ka interface roz use karta hoon. Har route ka history dekh sakta hoon, planning aur bhi behtar ho gayi hai."
  },
  {
    name: "SANTOSH KUMAR SINGH",
    content: "Tracking system itna accurate hai ki ek-ek turn ka pata chal jata hai. LocationTrack ne kaafi impress kiya mujhe."
  },
  {
    name: "RAVI SHANKAR MISHRA",
    content: "LocationTrack ne meri team ke coordination mein efficiency badhayi hai. Ab har delivery time par hoti hai."
  }
];

const marqueeVariants = {
  animate: {
    x: [0, -1000], // Adjust -1000 based on total width of testimonials
    transition: {
      x: {
        repeat: Infinity,
        repeatType: "loop" as const,
        duration: 20 as const,
        ease: "linear" as const,
      }
    }
  }
};

const Testimonials = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  // Remove the following unused variable:
  // const containerVariants = {
  //   hidden: { opacity: 0 },
  //   visible: {
  //     opacity: 1,
  //     transition: {
  //       staggerChildren: 0.2
  //     }
  //   }
  // };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5 as const,
      }
    }
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
      <div className="text-center mb-16 relative">

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700"
          >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500">
          Why Customers Trust LocationTrack
          </span>
        </motion.h2>
        </div>


        <div className="overflow-hidden group">
          <motion.div
            ref={ref}
            className="flex flex-row gap-8 group-hover:[animation-play-state:paused]"
            variants={marqueeVariants}
            animate="animate"
            style={{ width: "max-content" }}
          >
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg min-w-[320px] max-w-xs my-4 cursor-pointer"
                variants={itemVariants}
              >
                <div className="flex items-center mb-4">
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                  </div>
                </div>
                <p className="text-gray-700">{testimonial.content}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
      </div>
    </section>
  );
};

export default Testimonials;