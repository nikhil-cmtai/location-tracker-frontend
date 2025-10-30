'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { fetchVltdModels } from '@/lib/redux/features/vltdModelSlice';

export interface VltDeviceFormData {
  vlt: string;
  imeiNumber: string;
  iccid: string;
}

interface VltDeviceFormProps {
  initialData?: VltDeviceFormData;
  onSubmit: (data: VltDeviceFormData) => void;
  onCancel: () => void;
  title: string;
  submitButtonText: string;
}

const defaultFormData: VltDeviceFormData = {
  vlt: '',
  imeiNumber: '',
  iccid: '',
};

export default function VltDeviceForm({
  initialData,
  onSubmit,
  onCancel,
  title,
  submitButtonText,
}: VltDeviceFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { vltdModels, status } = useSelector((state: RootState) => state.vltdModel);
  
  const [formData, setFormData] = useState<VltDeviceFormData>(
    initialData || defaultFormData
  );

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchVltdModels());
    }
  }, [dispatch, status]);

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
            {/* Choose VLT Model */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Choose VLT Model<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  value={formData.vlt}
                  onChange={(e) => setFormData({ ...formData, vlt: e.target.value })}
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

            {/* Enter IMEI Number */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Enter IMEI Number<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Enter IMEI Number"
                value={formData.imeiNumber}
                onChange={(e) => setFormData({ ...formData, imeiNumber: e.target.value })}
                className="w-full px-4 py-3 border border-[var(--primary-orange)] rounded-lg bg-[var(--primary-orange-light)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
              />
            </div>

            {/* Enter ICCID */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Enter ICCID<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Enter ICCID"
                value={formData.iccid}
                onChange={(e) => setFormData({ ...formData, iccid: e.target.value })}
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

