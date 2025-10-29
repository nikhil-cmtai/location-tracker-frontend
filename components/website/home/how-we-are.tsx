'use client'

import React from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import locationAnimation from '../../../public/animations/location-tracking.json';

const HowWeAre: React.FC = () => (
  <section className="py-20 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Lottie Animation */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative flex justify-start"
        >
          <div className="aspect-square max-w-2xl w-full ml-[-0px]">
            <Lottie
              animationData={locationAnimation}
              loop={true}
              className="w-full h-full"
            />
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-yellow-200 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-200 rounded-full opacity-20 blur-3xl" />
        </motion.div>

        {/* Right side - Content */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="space-y-8"
        >
          <div className="space-y-4">
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-yellow-600"
            >
              India&apos;s Premier GPS Solution
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-lg text-gray-600"
            >
              We take immense pride in being the preferred GPS tracking brand for thousands of satisfied customers across the nation.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-xl border border-orange-100"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
            <p className="text-gray-600">
              To revolutionize the way individuals and businesses monitor and control their vehicles — making transportation safer, smarter, and more cost-efficient.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-orange-600">10K+</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-orange-600">98%</div>
              <div className="text-sm text-gray-600">Customer Satisfaction</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default HowWeAre;

