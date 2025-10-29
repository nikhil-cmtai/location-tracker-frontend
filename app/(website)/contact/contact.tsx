'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaLinkedin, FaInstagram, FaFacebookF } from 'react-icons/fa';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState<{ name?: string; mobile?: string; email?: string }>({});

  useEffect(() => {
    const newErrors: { name?: string; mobile?: string; email?: string } = {};
    if (formData.name && !/^[A-Za-z ]+$/.test(formData.name)) {
      newErrors.name = 'Name should contain only alphabets and spaces.';
    }
    if (formData.email && !/^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,})$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    setErrors(newErrors);
  }, [formData.name, formData.email]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (status) {
      timeoutId = setTimeout(() => {
        setStatus('');
      }, 3000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('');
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setStatus('Please fill all fields.');
      return;
    }
    if (errors.name || errors.email) {
      setStatus(errors.name || errors.email || 'Please fix the errors.');
      return;
    }
    setLoading(true);
    try {
      // Send mail to admin and user
      const adminMail = fetch('/api/send-mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'locationtracker21@gmail.com',
          subject: formData.subject,
          text: `Name: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject}\nMessage: ${formData.message}`,
          html: `<b>Name:</b> ${formData.name}<br/><b>Email:</b> ${formData.email}<br/><b>Subject:</b> ${formData.subject}<br/><b>Message:</b><br/>${formData.message}`,
        }),
      });
      const userMail = fetch('/api/send-mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: formData.email,
          subject: 'Thank you for contacting us!',
          text: `Dear ${formData.name},\nThank you for reaching out to Location Track. We have received your message and will get back to you soon.`,
          html: `<b>Dear ${formData.name},</b><br/>Thank you for reaching out to Location Track. We have received your message and will get back to you soon.`,
        }),
      });
      const [adminRes, userRes] = await Promise.all([adminMail, userMail]);
      const adminData = await adminRes.json();
      const userData = await userRes.json();
      if (adminRes.ok && userRes.ok) {
        setStatus('Message sent successfully!');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus(adminData.error || userData.error || 'Failed to send message.');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setStatus('Failed to send message.');
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20 px-4">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-200 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-yellow-600 mb-4"
          >
            Let&apos;s Connect
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Have questions or want to work with us? Fill out the form below and our team will get back to you soon.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-8 border border-orange-100"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-200'} focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all`}
                    placeholder="John Doe"
                    autoComplete="off"
                    onBeforeInput={e => {
                      const inputEvent = e as unknown as InputEvent;
                      if (!/^[A-Za-z ]$/.test(inputEvent.data || '')) e.preventDefault();
                    }}
                  />
                  {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all`}
                    placeholder="john@example.com"
                    autoComplete="off"
                  />
                  {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                  placeholder="How can we help?"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all resize-none"
                  placeholder="Your message here..."
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </motion.button>
              {status && (
                <div className={`text-center text-sm mt-2 ${status.includes('success') ? 'text-green-600' : 'text-red-500'}`}>{status}</div>
              )}
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            {/* Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white p-6 rounded-xl shadow-lg border border-orange-100"
              >
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                  <FaPhone className="text-orange-600 text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone</h3>
                <p className="text-gray-600">+91 9984024365</p>
                <p className="text-gray-600">+91 8604669409</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white p-6 rounded-xl shadow-lg border border-orange-100"
              >
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                  <FaEnvelope className="text-orange-600 text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600">info@everonics.in</p>
                <p className="text-gray-600">locationtrack@everonics.in</p>
                <p className="text-gray-600">sales@everonics.in</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white p-6 rounded-xl shadow-lg border border-orange-100"
              >
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                  <FaWhatsapp className="text-orange-600 text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">WhatsApp</h3>
                <p className="text-gray-600">+91 9984024365</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white p-6 rounded-xl shadow-lg border border-orange-100"
              >
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                  <FaMapMarkerAlt className="text-orange-600 text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Address</h3>
                <p className="text-gray-600">T-4, Sanjay Gandhi Puram, Lucknow, Uttar Pradesh, 226016</p>
              </motion.div>
            </div>

            {/* Social Links */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-orange-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <a href="https://www.facebook.com/locationtrack.in/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-2xl text-blue-600 hover:text-blue-800 transition"><FaFacebookF /></a>
                <a href="https://www.instagram.com/locationtrack.in/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-2xl text-pink-500 hover:text-pink-700 transition"><FaInstagram /></a>
                <a href="https://www.linkedin.com/company/locationtrack/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-2xl text-blue-800 hover:text-blue-900 transition"><FaLinkedin /></a>
              </div>
            </div>
          
          </motion.div>
        </div>
        
      </div>
    </section>
  );
};

export default ContactPage;

