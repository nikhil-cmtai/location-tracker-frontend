'use client';

import React, { useState, useEffect } from 'react';

export interface GeoFenceFormData {
  city: string;
  longitude: number;
  latitude: number;
  radius: number;
}

interface GeoFenceFormProps {
  initialData?: GeoFenceFormData;
  onSubmit: (data: GeoFenceFormData) => void;
  onCancel: () => void;
  title: string;
  submitButtonText: string;
}

const defaultFormData: GeoFenceFormData = {
  city: '',
  longitude: 0,
  latitude: 0,
  radius: 0,
};

export default function GeoFenceForm({
  initialData,
  onSubmit,
  onCancel,
  title,
  submitButtonText,
}: GeoFenceFormProps) {
  const [formData, setFormData] = useState<GeoFenceFormData>(
    initialData || defaultFormData
  );

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="p-6 bg-[var(--content-bg)]">
      <div className="bg-white rounded-lg shadow-sm border border-[var(--border-light)] p-6">
        <h1 className="text-2xl font-bold text-[var(--primary-orange)] mb-6">
          {title}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Enter City */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Enter City Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Enter City Name"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-3 border border-[var(--primary-orange)] rounded-lg bg-[var(--primary-orange-light)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
              />
            </div>

            {/* Enter Longitude */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Longitude<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                step="any"
                placeholder="Enter Longitude (e.g., 77.1025)"
                value={formData.longitude || ''}
                onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3 border border-[var(--primary-orange)] rounded-lg bg-[var(--primary-orange-light)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
              />
            </div>

            {/* Enter Latitude */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Latitude<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                step="any"
                placeholder="Enter Latitude (e.g., 28.7041)"
                value={formData.latitude || ''}
                onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3 border border-[var(--primary-orange)] rounded-lg bg-[var(--primary-orange-light)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
              />
            </div>

            {/* Enter Radius */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Radius (meters)<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                placeholder="Enter Radius in meters"
                value={formData.radius || ''}
                onChange={(e) => setFormData({ ...formData, radius: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 border border-[var(--primary-orange)] rounded-lg bg-[var(--primary-orange-light)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 border-2 border-[var(--primary-orange)] text-[var(--primary-orange)] rounded-lg font-medium hover:bg-[var(--primary-orange-light)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[var(--primary-orange)] hover:bg-[var(--primary-orange-hover)] text-white rounded-lg font-medium transition-colors"
            >
              {submitButtonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

