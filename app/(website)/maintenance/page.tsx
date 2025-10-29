'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { FaTools } from 'react-icons/fa';

const MaintenancePage: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="min-h-[100vh] flex flex-col justify-center items-center text-center py-24 bg-[var(--color-background)]"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full flex flex-col items-center"
      >
        <FaTools className="text-[3rem] md:text-[4rem] text-[var(--color-primary)] mb-4 animate-spin-slow" />
        <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--color-primary)] mb-4 leading-tight">We&apos;ll Be Back Soon!</h1>
        <p className="text-base md:text-lg text-[var(--color-foreground)] max-w-xl mb-8 font-medium leading-relaxed">
          Our website is currently undergoing <span className="font-semibold text-[var(--color-primary)]">scheduled maintenance</span>.<br />We appreciate your patience and will be back online shortly.
        </p>
        <div className="text-xs md:text-sm text-[var(--color-foreground)] opacity-70 mt-2">&copy; {new Date().getFullYear()} Everonic Solutions</div>
      </motion.div>
    </motion.section>
  );
};

export default MaintenancePage;
