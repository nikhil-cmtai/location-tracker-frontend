'use client'

import React from 'react';
import { motion } from 'framer-motion';

const TermsPage: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="max-w-3xl mx-auto min-h-[60vh] flex flex-col justify-center items-center text-center py-16"
    >
      <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 mb-4">Terms & Conditions</h1>
      <p className="text-lg md:text-xl text-[var(--color-foreground)] max-w-2xl mb-8">
        Please read our terms and conditions carefully before using our services. Your use of our site means you agree to these terms.
      </p>
      <div className="text-left text-base md:text-lg text-gray-700 max-w-2xl space-y-4">
        <p><strong>1. Acceptance of Terms:</strong> By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
        <p><strong>2. Changes to Terms:</strong> We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting.</p>
        <p><strong>3. User Responsibilities:</strong> You agree to use the website only for lawful purposes and not to engage in any activity that disrupts or interferes with the website.</p>
        <p><strong>4. Intellectual Property:</strong> All content, trademarks, and data on this website are the property of their respective owners and protected by applicable laws.</p>
        <p><strong>5. Limitation of Liability:</strong> We are not liable for any damages or losses resulting from your use of this website or its content.</p>
        <p><strong>6. Privacy Policy:</strong> Please review our Privacy Policy to understand how we collect and use your information.</p>
        <p><strong>7. Governing Law:</strong> These terms are governed by the laws of India. Any disputes will be subject to the jurisdiction of the courts in India.</p>
      </div>
    </motion.section>
  );
};

export default TermsPage;

