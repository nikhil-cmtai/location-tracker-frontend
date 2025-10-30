'use client';

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { fetchVltdModels } from '@/lib/redux/features/vltdModelSlice';
import { fetchEventCategories } from '@/lib/redux/features/eventCategorySlice';
import { ChevronDown } from 'lucide-react';

export interface EventConfigurationFormData {
  vlt: string;
  messageId: number;
  eventName: string;
  description: string;
  category?: string;
}

interface EventConfigurationFormProps {
  initialData?: EventConfigurationFormData;
  onSubmit: (data: EventConfigurationFormData) => void;
  onCancel: () => void;
  isEditMode?: boolean;
}

export default function EventConfigurationForm({
  initialData,
  onSubmit,
  onCancel,
  isEditMode = false,
}: EventConfigurationFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { vltdModels } = useSelector((state: RootState) => state.vltdModel);
  const { eventCategories } = useSelector((state: RootState) => state.eventCategory);

  const [formData, setFormData] = useState<EventConfigurationFormData>(
    initialData || {
      vlt: '',
      messageId: 0,
      eventName: '',
      description: '',
      category: '',
    }
  );

  useEffect(() => {
    dispatch(fetchVltdModels());
    dispatch(fetchEventCategories());
  }, [dispatch]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'messageId' ? Number(value) : value,
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
          {isEditMode ? 'Edit Event Configuration' : 'Add New Event Configuration'}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* VLT Model */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                VLT Model<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  name="vlt"
                  value={formData.vlt}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[var(--primary-orange)] rounded-lg bg-[var(--primary-orange-light)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)] appearance-none"
                >
                  <option value="">Select VLT Model</option>
                  {vltdModels.map((model) => (
                    <option key={model._id} value={model._id}>
                      {model.modelName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] pointer-events-none" />
              </div>
            </div>

            {/* Message ID */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Message ID<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                name="messageId"
                placeholder="Enter Message ID"
                value={formData.messageId}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[var(--primary-orange)] rounded-lg bg-[var(--primary-orange-light)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
              />
            </div>

            {/* Event Name */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Event Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                name="eventName"
                placeholder="Enter Event Name"
                value={formData.eventName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[var(--primary-orange)] rounded-lg bg-[var(--primary-orange-light)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
              />
            </div>

            {/* Event Category */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Event Category
              </label>
              <div className="relative">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[var(--primary-orange)] rounded-lg bg-[var(--primary-orange-light)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)] appearance-none"
                >
                  <option value="">Select Category (Optional)</option>
                  {eventCategories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] pointer-events-none" />
              </div>
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

