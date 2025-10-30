'use client';

import React, { useState, useEffect } from 'react';

export interface ServiceProviderFormData {
  serviceProviderName: string;
  shortName: string;
}

interface ServiceProviderFormProps {
  initialData?: ServiceProviderFormData;
  onSubmit: (data: ServiceProviderFormData) => void;
  onCancel: () => void;
  isEditMode?: boolean;
}

export default function ServiceProviderForm({
  initialData,
  onSubmit,
  onCancel,
  isEditMode = false,
}: ServiceProviderFormProps) {
  const [formData, setFormData] = useState<ServiceProviderFormData>(
    initialData || {
      serviceProviderName: '',
      shortName: '',
    }
  );

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="p-6 bg-[var(--content-bg)]">
      <div className="bg-white rounded-lg shadow-sm border border-[var(--border-light)] p-6">
        <h1 className="text-2xl font-bold text-[var(--primary-orange)] mb-6">
          {isEditMode ? 'Edit Service Provider' : 'Add New Service Provider'}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Service Provider Name */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Service Provider Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                name="serviceProviderName"
                placeholder="Enter Service Provider Name"
                value={formData.serviceProviderName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[var(--primary-orange)] rounded-lg bg-[var(--primary-orange-light)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
              />
            </div>

            {/* Short Name */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Short Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                name="shortName"
                placeholder="Enter Short Name"
                value={formData.shortName}
                onChange={handleChange}
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
              {isEditMode ? 'Update' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

