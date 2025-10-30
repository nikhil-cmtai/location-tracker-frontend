'use client';

import React, { useState, useEffect } from 'react';

export interface UserLevelFormData {
  levelName: string;
  description: string;
  order: number;
}

interface UserLevelFormProps {
  initialData?: UserLevelFormData;
  onSubmit: (data: UserLevelFormData) => void;
  onCancel: () => void;
  isEditMode?: boolean;
}

export default function UserLevelForm({
  initialData,
  onSubmit,
  onCancel,
  isEditMode = false,
}: UserLevelFormProps) {
  const [formData, setFormData] = useState<UserLevelFormData>(
    initialData || {
      levelName: '',
      description: '',
      order: 1,
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
      [name]: name === 'order' ? Number(value) : value,
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
          {isEditMode ? 'Edit User Level' : 'Add New User Level'}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Level Name */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Level Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                name="levelName"
                placeholder="Enter Level Name (e.g., Admin, Manager, User)"
                value={formData.levelName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[var(--primary-orange)] rounded-lg bg-[var(--primary-orange-light)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
              />
            </div>

            {/* Order */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Order<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                name="order"
                placeholder="Enter Order"
                min="1"
                value={formData.order}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[var(--primary-orange)] rounded-lg bg-[var(--primary-orange-light)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Description<span className="text-red-500">*</span>
              </label>
              <textarea
                required
                name="description"
                placeholder="Enter Description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
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

