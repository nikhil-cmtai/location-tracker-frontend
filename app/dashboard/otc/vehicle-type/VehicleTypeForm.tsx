'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { fetchVehicleMakes } from '@/lib/redux/features/vehicleManufacturer';

export interface VehicleTypeFormData {
  make: string;
  vehicleType: string;
}

interface VehicleTypeFormProps {
  initialData?: VehicleTypeFormData;
  onSubmit: (data: VehicleTypeFormData) => void;
  onCancel: () => void;
  title: string;
  submitButtonText: string;
}

const defaultFormData: VehicleTypeFormData = {
  make: '',
  vehicleType: '',
};

export default function VehicleTypeForm({
  initialData,
  onSubmit,
  onCancel,
  title,
  submitButtonText,
}: VehicleTypeFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { vehicleMakes, status } = useSelector((state: RootState) => state.vehicleManufacturer);
  
  const [formData, setFormData] = useState<VehicleTypeFormData>(
    initialData || defaultFormData
  );

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchVehicleMakes());
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
            {/* Choose Manufacturer */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Choose Manufacturer<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  value={formData.make}
                  onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                  className="w-full px-4 py-3 border border-[var(--primary-orange)] rounded-lg bg-[var(--primary-orange-light)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)] appearance-none"
                >
                  <option value="">Select Manufacturer</option>
                  {vehicleMakes.map((manufacturer) => (
                    <option key={manufacturer._id} value={manufacturer._id}>
                      {manufacturer.make} ({manufacturer.shortName})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] pointer-events-none" />
              </div>
            </div>

            {/* Enter Vehicle Type */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Enter Vehicle Type<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Enter Vehicle Type (e.g., Car, Bike, Truck)"
                value={formData.vehicleType}
                onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
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

