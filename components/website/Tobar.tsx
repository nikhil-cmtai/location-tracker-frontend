'use client'

import { Facebook, Instagram, Linkedin, Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const socialLinks = [
  { href: 'https://www.facebook.com/locationtrack.in/', icon: <Facebook size={16} />, label: 'Facebook' },
  { href: 'https://www.instagram.com/locationtrack.in/', icon: <Instagram size={16} />, label: 'Instagram' },
  { href: 'https://www.linkedin.com/company/locationtrack/', icon: <Linkedin size={16} />, label: 'LinkedIn' },
];

const Topbar = () => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2, ease: 'easeOut' }}
    className="w-full bg-[var(--color-primary)] text-white text-xs md:text-sm shadow z-30"
  >
    <div className="container mx-auto flex justify-between items-center px-4 py-1 min-h-8">
      <div className="flex gap-2 items-center flex-wrap">
        <span className="hidden sm:inline-flex items-center gap-1"><Mail size={14} />info@everonics.in</span>
        <span className="hidden sm:inline">|</span>
        <span className="flex items-center gap-1"><Phone size={14} />+91 9984024365</span>
      </div>
      <div className="flex gap-2">
        {socialLinks.map((s) => (
          <a
            key={s.label}
            href={s.href}
            aria-label={s.label}
            className="hover:text-[var(--color-accent)] transition text-base md:text-lg"
            target="_blank" rel="noopener noreferrer"
          >
            {s.icon}
          </a>
        ))}
      </div>
    </div>
  </motion.div>
);

export default Topbar;
