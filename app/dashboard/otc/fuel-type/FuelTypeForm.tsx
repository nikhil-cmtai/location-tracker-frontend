'use client';

import React, { useState, useEffect } from 'react';

export interface FuelTypeFormData {
  fuelTypeName: string;
  fuelTypeDescription: string;
}

interface FuelTypeFormProps {
  initialData?: FuelTypeFormData;
  onSubmit: (data: FuelTypeFormData) => void;
  onCancel: () => void;
  isEditMode?: boolean;
}

export default function FuelTypeForm({
  initialData,
  onSubmit,
  onCancel,
  isEditMode = false,
}: FuelTypeFormProps) {
  const [formData, setFormData] = useState<FuelTypeFormData>(
    initialData || {
      fuelTypeName: '',
      fuelTypeDescription: '',
    }
  );

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
          {isEditMode ? 'Edit Fuel Type' : 'Add New Fuel Type'}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fuel Type Name */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Fuel Type Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                name="fuelTypeName"
                placeholder="Enter Fuel Type Name (e.g., Petrol, Diesel, Electric)"
                value={formData.fuelTypeName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[var(--primary-orange)] rounded-lg bg-[var(--primary-orange-light)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Description<span className="text-red-500">*</span>
              </label>
              <textarea
                required
                name="fuelTypeDescription"
                placeholder="Enter Description"
                value={formData.fuelTypeDescription}
                onChange={handleChange}
                rows={1}
                className="w-full px-4 py-3 border border-[var(--primary-orange)] rounded-lg bg-[var(--primary-orange-light)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)] resize-none"
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

