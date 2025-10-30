'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { fetchVltdManufacturers } from '@/lib/redux/features/vltdManufacturerSlice';
import { fetchVltdModels } from '@/lib/redux/features/vltdModelSlice';

export interface PlanFormData {
  planName: string;
  vltdManufacturer: string;
  vltdModel: string;
  durationDays: number;
}

interface PlanFormProps {
  initialData?: PlanFormData;
  onSubmit: (data: PlanFormData) => void;
  onCancel: () => void;
  title: string;
  submitButtonText: string;
}

const defaultFormData: PlanFormData = {
  planName: '',
  vltdManufacturer: '',
  vltdModel: '',
  durationDays: 0,
};

export default function PlanForm({
  initialData,
  onSubmit,
  onCancel,
  title,
  submitButtonText,
}: PlanFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { vltdManufacturers, status: manufacturersStatus } = useSelector((state: RootState) => state.vltdManufacturer);
  const { vltdModels, status: modelsStatus } = useSelector((state: RootState) => state.vltdModel);
  
  const [formData, setFormData] = useState<PlanFormData>(
    initialData || defaultFormData
  );

  useEffect(() => {
    if (manufacturersStatus === 'idle') {
      dispatch(fetchVltdManufacturers());
    }
    if (modelsStatus === 'idle') {
      dispatch(fetchVltdModels());
    }
  }, [dispatch, manufacturersStatus, modelsStatus]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Filter models based on selected manufacturer
  const filteredModels = vltdModels.filter((model) => {
    if (!formData.vltdManufacturer) return true;
    return model.manufacturerId === formData.vltdManufacturer;
  });

  return (
    <div className="p-6 bg-[var(--content-bg)]">
      <div className="bg-white rounded-lg shadow-sm border border-[var(--border-light)] p-6">
        <h1 className="text-2xl font-bold text-[var(--primary-orange)] mb-6">
          {title}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Enter Plan Name */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Enter Plan Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Enter Plan Name"
                value={formData.planName}
                onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                className="w-full px-4 py-3 border border-[var(--primary-orange)] rounded-lg bg-[var(--primary-orange-light)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
              />
            </div>

            {/* Choose VLTD Manufacturer */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Choose VLTD Manufacturer<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  value={formData.vltdManufacturer}
                  onChange={(e) => setFormData({ ...formData, vltdManufacturer: e.target.value, vltdModel: '' })}
                  className="w-full px-4 py-3 border border-[var(--primary-orange)] rounded-lg bg-[var(--primary-orange-light)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)] appearance-none"
                >
                  <option value="">Select Manufacturer</option>
                  {vltdManufacturers.map((manufacturer) => (
                    <option key={manufacturer._id} value={manufacturer._id}>
                      {manufacturer.manufacturerName} ({manufacturer.shortName})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] pointer-events-none" />
              </div>
            </div>

            {/* Choose VLTD Model */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Choose VLTD Model<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  value={formData.vltdModel}
                  onChange={(e) => setFormData({ ...formData, vltdModel: e.target.value })}
                  className="w-full px-4 py-3 border border-[var(--primary-orange)] rounded-lg bg-[var(--primary-orange-light)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)] appearance-none"
                  disabled={!formData.vltdManufacturer}
                >
                  <option value="">Select Model</option>
                  {filteredModels.map((model) => (
                    <option key={model._id} value={model._id}>
                      {model.modelName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] pointer-events-none" />
              </div>
              {!formData.vltdManufacturer && (
                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                  Please select a manufacturer first
                </p>
              )}
            </div>

            {/* Enter Duration Days */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Duration (Days)<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                placeholder="Enter Duration in Days"
                value={formData.durationDays || ''}
                onChange={(e) => setFormData({ ...formData, durationDays: parseInt(e.target.value) || 0 })}
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

