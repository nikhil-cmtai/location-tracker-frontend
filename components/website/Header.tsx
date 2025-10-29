'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { FaBars, FaTimes, FaUser } from 'react-icons/fa';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/about', label: 'About Us' },
  { href: '/how-it-works', label: 'How it Works' },
  { href: '/features', label: 'Features' },
  { href: '/contact', label: 'Contact Us' },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <motion.header
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full bg-white shadow z-20 sticky top-0"
    >
      <div className="container mx-auto flex justify-between items-center px-4 py-2 relative">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="Location Track Logo" width={150} height={50} priority className="h-16 w-auto" />
        </Link>
        {/* Right side nav and login */}
        <div className="ml-auto flex items-center">
          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-6 text-[var(--color-primary)] font-semibold items-center">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className={`px-1 py-0.5 transition hover:text-[var(--color-accent)] hover:underline underline-offset-4 ${pathname === link.href ? 'border-b-2 border-amber-400' : ''}`}
              >
                {link.label}
              </a>
            ))}
          </nav>
          {/* User Login hidden on sm screens */}
          <a
            href="/login"
            className="hidden sm:flex items-center gap-2 ml-6 rounded-full px-4 py-1.5 bg-[var(--color-primary)] text-white font-semibold border border-[var(--color-primary)] hover:bg-white hover:text-[var(--color-primary)] hover:border-[var(--color-accent)] transition z-30"
          >
            <FaUser size={14} />
            <span>Login</span>
          </a>
          {/* Hamburger for mobile */}
          <button
            className="md:hidden ml-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] z-30"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Open menu"
          >
            {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 w-72 h-full bg-white shadow-2xl z-50 flex flex-col md:hidden"
            >
              {/* Mobile Menu Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <Link href="/" onClick={() => setMenuOpen(false)}>
                    <Image src="/logo.png" alt="Location Track Logo" width={120} height={40} className="h-12 w-auto" />
                  </Link>
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>
              </div>
              
              {/* Mobile Menu Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <nav className="flex flex-col gap-2 z-50">
                  {navLinks.map(link => (
                    <a
                      key={link.href}
                      href={link.href}
                      className={`text-lg font-medium text-gray-700 hover:text-[var(--color-primary)] transition py-3 border-b border-gray-100 ${pathname === link.href ? 'border-b-2 border-amber-400' : ''}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Mobile Menu Footer */}
              <div className="p-6 border-t border-gray-100">
                <a
                  href="/login"
                  className="flex items-center justify-center gap-2 w-full rounded-full px-4 py-3 bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-accent)] transition"
                  onClick={() => setMenuOpen(false)}
                >
                  <FaUser size={16} />
                  <span>User Login</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Overlay when menu is open */}
        {menuOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-10 md:hidden"
            onClick={() => setMenuOpen(false)}
          />
        )}
      </div>
    </motion.header>
  );
};

export default Header;
