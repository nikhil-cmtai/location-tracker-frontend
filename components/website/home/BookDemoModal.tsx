'use client'

import React, { useState, useEffect } from 'react';

interface BookDemoModalProps {
  open: boolean;
  onClose: () => void;
}

const initialForm = {
  owner: '',
  mobile: '',
  address: '',
  vehicles: '',
  type: '',
  email: '',
};

const BookDemoModal: React.FC<BookDemoModalProps> = ({ open, onClose }) => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ owner?: string; mobile?: string; email?: string }>({});

  useEffect(() => {
    const newErrors: { owner?: string; mobile?: string; email?: string } = {};
    if (form.owner && !/^[A-Za-z ]+$/.test(form.owner)) {
      newErrors.owner = 'Name should contain only alphabets and spaces.';
    }
    if (form.mobile && !/^\d{10}$/.test(form.mobile)) {
      newErrors.mobile = 'Mobile number must be exactly 10 digits.';
    }
    if (form.email && !/^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,})$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    setErrors(newErrors);
  }, [form.owner, form.mobile, form.email]);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    // Validation
    if (!form.owner || !form.mobile || !form.address || !form.vehicles || !form.type || !form.email) {
      setMessage('Please fill all fields.');
      return;
    }
    if (errors.owner || errors.mobile || errors.email) {
      setMessage(errors.owner || errors.mobile || errors.email || 'Please fix the errors.');
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
          subject: 'Book Demo Request',
          text: `Owner: ${form.owner}\nMobile: ${form.mobile}\nAddress: ${form.address}\nNumber of Vehicles: ${form.vehicles}\nVehicle Type: ${form.type}`,
          html: `<b>Owner:</b> ${form.owner}<br/><b>Mobile:</b> ${form.mobile}<br/><b>Address:</b> ${form.address}<br/><b>Number of Vehicles:</b> ${form.vehicles}<br/><b>Vehicle Type:</b> ${form.type}`,
        }),
      });
      const userMail = fetch('/api/send-mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: form.email,
          subject: 'Thank you for booking a demo!',
          text: `Dear ${form.owner},\nThank you for booking a demo with Location Track. We have received your request and will contact you soon.`,
          html: `<b>Dear ${form.owner},</b><br/>Thank you for booking a demo with Location Track. We have received your request and will contact you soon.`,
        }),
      });
      const [adminRes, userRes] = await Promise.all([adminMail, userMail]);
      const adminData = await adminRes.json();
      const userData = await userRes.json();
      if (adminRes.ok && userRes.ok) {
        setMessage('Thank you! We will contact you soon.');
        setForm(initialForm);
        setTimeout(() => {
          setMessage('');
          onClose();
        }, 1000);
      } else {
        setMessage(adminData.error || userData.error || 'Failed to send message.');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setMessage('Failed to send message.');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-y-auto max-h-70vh">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative animate-fadeIn max-h-70vh">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold text-center mb-4 text-[var(--color-primary)]">Book a Demo</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Owner Name</label>
            <input
              name="owner"
              value={form.owner}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${errors.owner ? 'border-red-500' : ''}`}
              placeholder="Enter owner name"
              autoComplete="off"
              onBeforeInput={e => {
                const inputEvent = e as unknown as InputEvent;
                if (!/^[A-Za-z ]$/.test(inputEvent.data || '')) e.preventDefault();
              }}
            />
            {errors.owner && <div className="text-red-500 text-xs mt-1">{errors.owner}</div>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mobile</label>
            <input
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${errors.mobile ? 'border-red-500' : ''}`}
              placeholder="Enter mobile number"
              autoComplete="off"
              inputMode="numeric"
              maxLength={10}
              onBeforeInput={e => {
                const inputEvent = e as unknown as InputEvent;
                if (!/^[0-9]$/.test(inputEvent.data || '')) e.preventDefault();
                if (form.mobile.length >= 10) e.preventDefault();
              }}
            />
            {errors.mobile && <div className="text-red-500 text-xs mt-1">{errors.mobile}</div>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${errors.email ? 'border-red-500' : ''}`}
              placeholder="Enter email address"
              autoComplete="off"
              type="email"
            />
            {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="Enter address"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Number of Vehicles</label>
            <input
              type="number"
              name="vehicles"
              value={form.vehicles}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="e.g. 5"
              min={1}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Vehicle Type</label>
            <div className="flex gap-4 mt-1">
              <label className="flex items-center gap-1">
                <input type="radio" name="type" value="Commercial" checked={form.type === 'Commercial'} onChange={handleChange} /> Commercial
              </label>
              <label className="flex items-center gap-1">
                <input type="radio" name="type" value="Personal" checked={form.type === 'Personal'} onChange={handleChange} /> Personal
              </label>
              <label className="flex items-center gap-1">
                <input type="radio" name="type" value="Both" checked={form.type === 'Both'} onChange={handleChange} /> Both
              </label>
            </div>
          </div>
          {message && <div className={`text-center text-sm ${message.startsWith('Thank') ? 'text-green-600' : 'text-red-500'}`}>{message}</div>}
          <button
            type="submit"
            className="w-full py-2 rounded bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-accent)] transition flex items-center justify-center disabled:opacity-60"
            disabled={loading}
          >
            {loading ? <span className="loader mr-2"></span> : null}
            {loading ? 'Booking...' : 'Book Demo'}
          </button>
        </form>
      </div>
      <style jsx>{`
        .loader {
          border: 2px solid #fff;
          border-top: 2px solid var(--color-accent, orange);
          border-radius: 50%;
          width: 18px;
          height: 18px;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default BookDemoModal; 