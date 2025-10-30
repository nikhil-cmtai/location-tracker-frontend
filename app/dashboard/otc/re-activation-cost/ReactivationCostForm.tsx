'use client';

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { fetchVltdManufacturers } from '@/lib/redux/features/vltdManufacturerSlice';
import { fetchVltdModels } from '@/lib/redux/features/vltdModelSlice';
import { ChevronDown } from 'lucide-react';

export interface ReactivationCostFormData {
  vltdManufacturer: string;
  vltdModel: string;
  reactivationCost: number;
}

interface ReactivationCostFormProps {
  initialData?: ReactivationCostFormData;
  onSubmit: (data: ReactivationCostFormData) => void;
  onCancel: () => void;
  isEditMode?: boolean;
}

export default function ReactivationCostForm({
  initialData,
  onSubmit,
  onCancel,
  isEditMode = false,
}: ReactivationCostFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { vltdManufacturers } = useSelector((state: RootState) => state.vltdManufacturer);
  const { vltdModels } = useSelector((state: RootState) => state.vltdModel);

  const [formData, setFormData] = useState<ReactivationCostFormData>(
    initialData || {
      vltdManufacturer: '',
      vltdModel: '',
      reactivationCost: 0,
    }
  );

  useEffect(() => {
    dispatch(fetchVltdManufacturers());
    dispatch(fetchVltdModels());
  }, [dispatch]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'reactivationCost' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Filter VLTD Models based on selected manufacturer
  const filteredModels = formData.vltdManufacturer
    ? vltdModels.filter((model) => {
        const manufacturerId = typeof model.manufacturerId === 'object' 
          ? (model.manufacturerId as { _id: string })._id
          : model.manufacturerId;
        return manufacturerId === formData.vltdManufacturer;
      })
    : vltdModels;

  return (
    <div className="p-6 bg-[var(--content-bg)]">
      <div className="bg-white rounded-lg shadow-sm border border-[var(--border-light)] p-6">
        <h1 className="text-2xl font-bold text-[var(--primary-orange)] mb-6">
          {isEditMode ? 'Edit Re-activation Cost' : 'Add New Re-activation Cost'}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* VLTD Manufacturer */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                VLTD Manufacturer<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  name="vltdManufacturer"
                  value={formData.vltdManufacturer}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[var(--primary-orange)] rounded-lg bg-[var(--primary-orange-light)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)] appearance-none"
                >
                  <option value="">Select VLTD Manufacturer</option>
                  {vltdManufacturers.map((manufacturer) => (
                    <option key={manufacturer._id} value={manufacturer._id}>
                      {manufacturer.manufacturerName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] pointer-events-none" />
              </div>
            </div>

            {/* VLTD Model */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                VLTD Model<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  name="vltdModel"
                  value={formData.vltdModel}
                  onChange={handleChange}
                  disabled={!formData.vltdManufacturer}
                  className="w-full px-4 py-3 border border-[var(--primary-orange)] rounded-lg bg-[var(--primary-orange-light)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)] appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select VLTD Model</option>
                  {filteredModels.map((model) => (
                    <option key={model._id} value={model._id}>
                      {model.modelName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] pointer-events-none" />
              </div>
            </div>

            {/* Reactivation Cost */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Reactivation Cost (₹)<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                name="reactivationCost"
                placeholder="Enter Reactivation Cost"
                min="0"
                step="0.01"
                value={formData.reactivationCost}
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

