'use client'

import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="max-w-3xl mx-auto min-h-[60vh] flex flex-col justify-center items-center text-center py-16"
    >
      <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 mb-4">Privacy Policy</h1>
      <p className="text-lg md:text-xl text-[var(--color-foreground)] max-w-2xl mb-8">
        We value your privacy. Read our policy to understand how we handle your data and keep your information secure.
      </p>
      <div className="text-left text-base md:text-lg text-gray-700 max-w-2xl space-y-4">
        <p><strong>1. Information Collection:</strong> We collect personal information you provide when you use our services, such as your name, email, phone number, and address.</p>
        <p><strong>2. Use of Information:</strong> Your information is used to provide, improve, and personalize our services, and to communicate with you about updates or offers.</p>
        <p><strong>3. Data Sharing:</strong> We do not sell or rent your personal information to third parties. We may share data with trusted partners for service delivery, under strict confidentiality agreements.</p>
        <p><strong>4. Data Security:</strong> We implement industry-standard security measures to protect your data from unauthorized access, alteration, or disclosure.</p>
        <p><strong>5. Cookies:</strong> Our website may use cookies to enhance your browsing experience. You can control cookie preferences in your browser settings.</p>
        <p><strong>6. Your Rights:</strong> You have the right to access, update, or delete your personal information. Contact us for any privacy-related requests.</p>
        <p><strong>7. Policy Updates:</strong> We may update this policy from time to time. Changes will be posted on this page with an updated effective date.</p>
        <p><strong>8. Contact:</strong> For any questions about this privacy policy, please contact us at info@everonics.in.</p>
      </div>
    </motion.section>
  );
};

export default PrivacyPolicyPage;

