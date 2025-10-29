'use client'

import { Facebook, Instagram, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';

const socialLinks = [
  { href: 'https://www.facebook.com/locationtrack.in/', icon: <Facebook />, label: 'Facebook' },
  { href: 'https://www.instagram.com/locationtrack.in/', icon: <Instagram />, label: 'Instagram' },
  { href: 'https://www.linkedin.com/company/locationtrack/', icon: <Linkedin />, label: 'LinkedIn' },
];

const Footer = () => (
  <motion.footer
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, ease: 'easeOut' }}
    className="w-full bg-[var(--color-primary)] text-white pt-8 pb-4 mt-10 shadow-inner"
  >
    <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4 gap-4 md:gap-0">
      {/* Social Icons Left */}
      <div className="flex gap-4 order-1 md:order-none w-full md:w-auto justify-center md:justify-start mb-4 md:mb-0">
        {socialLinks.map((s) => (
          <motion.a
            key={s.label}
            href={s.href}
            aria-label={s.label}
            whileHover={{ scale: 1.2, rotate: 8 }}
            whileTap={{ scale: 0.95 }}
            className="text-2xl hover:text-[var(--color-accent)] transition"
            target="_blank" rel="noopener noreferrer"
          >
            {s.icon}
          </motion.a>
        ))}
      </div>
      {/* Copyright Center */}
      <div className="flex-1 order-3 md:order-none w-full md:w-auto flex justify-center items-center">
        <div className="text-sm md:text-base text-center font-bold tracking-wide opacity-90">
          &copy; {new Date().getFullYear()} <a href="https://locationtrack.in/features" className="font-bold hover:text-[var(--color-accent)] transition">Location Track</a>. Designed by <a href="https://everonics.in" className="font-bold hover:text-[var(--color-accent)] underline transition">Everonic Solutions Pvt Ltd</a>.
        </div>
      </div>
      {/* Terms/Privacy Right */}
      <div className="flex gap-6 font-semibold order-2 md:order-none w-full md:w-auto justify-center md:justify-end">
        <a href="/terms" className="hover:text-[var(--color-accent)] transition">Terms</a>
        <a href="/privacy-policy" className="hover:text-[var(--color-accent)] transition">Privacy Policy</a>
      </div>
    </div>
  </motion.footer>
);

export default Footer;
