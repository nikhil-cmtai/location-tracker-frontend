'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export interface VehicleFormData {
  customer: string;
  vehicleNumber: string;
  manufacturer: string;
  vehicle: string;
  model: string;
  ownerType: string;
  manufacturingYear: string;
  fuelType: string;
  vltdNumber: string;
  status: string;
}

interface VehicleFormProps {
  initialData?: VehicleFormData;
  onSubmit: (data: VehicleFormData) => void;
  onCancel: () => void;
  title: string;
  submitButtonText: string;
}

const defaultFormData: VehicleFormData = {
  customer: '',
  vehicleNumber: '',
  manufacturer: '',
  vehicle: '',
  model: '',
  ownerType: '',
  manufacturingYear: '',
  fuelType: '',
  vltdNumber: '',
  status: 'Active',
};

export default function VehicleForm({
  initialData,
  onSubmit,
  onCancel,
  title,
  submitButtonText,
}: VehicleFormProps) {
  const [formData, setFormData] = useState<VehicleFormData>(
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
            {/* Choose Customer */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Choose Customer<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  value={formData.customer}
                  onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                  className="w-full px-4 py-3 border border-[var(--primary-orange)] rounded-lg bg-[var(--primary-orange-light)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)] appearance-none"
                >
                  <option value="">Select Customer</option>
                  <option value="C00001">C00001- Siddhartha Pathak</option>
                  <option value="C00002">C00002- John Doe</option>
                  <option value="C00003">C00003- Jane Smith</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] pointer-events-none" />
              </div>
            </div>

            {/* Enter Vehicle Number */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Enter Vehicle Number (AB12AB1234)<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Enter Vehicle Number"
                value={formData.vehicleNumber}
                onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                className="w-full px-4 py-3 border border-[var(--primary-orange)] rounded-lg bg-[var(--primary-orange-light)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
              />
            </div>

            {/* Choose Manufacturer */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Choose Manufacturer<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                  className="w-full px-4 py-3 border border-[var(--primary-orange)] rounded-lg bg-[var(--primary-orange-light)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)] appearance-none"
                >
                  <option value="">Select Manufacturer</option>
                  <option value="Tata Motors">Tata Motors</option>
                  <option value="Maruti Suzuki">Maruti Suzuki</option>
                  <option value="Hyundai">Hyundai</option>
                  <option value="Mahindra">Mahindra</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] pointer-events-none" />
              </div>
            </div>

            {/* Choose Vehicle */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Choose Vehicle<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  value={formData.vehicle}
                  onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                  className="w-full px-4 py-3 border border-[var(--primary-orange)] rounded-lg bg-[var(--primary-orange-light)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)] appearance-none"
                >
                  <option value="">Select Vehicle</option>
                  <option value="Car">Car</option>
                  <option value="Bike">Bike</option>
                  <option value="Truck">Truck</option>
                  <option value="Bus">Bus</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] pointer-events-none" />
              </div>
            </div>

            {/* Choose Model */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Choose Model<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="w-full px-4 py-3 border border-[var(--primary-orange)] rounded-lg bg-[var(--primary-orange-light)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)] appearance-none"
                >
                  <option value="">Select Model</option>
                  <option value="Swift">Swift</option>
                  <option value="Alto">Alto</option>
                  <option value="Nexon">Nexon</option>
                  <option value="Harrier">Harrier</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] pointer-events-none" />
              </div>
            </div>

            {/* Choose Owner Type */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Choose Owner Type<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  value={formData.ownerType}
                  onChange={(e) => setFormData({ ...formData, ownerType: e.target.value })}
                  className="w-full px-4 py-3 border border-[var(--primary-orange)] rounded-lg bg-[var(--primary-orange-light)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)] appearance-none"
                >
                  <option value="">Select Owner Type</option>
                  <option value="Owned">Owned</option>
                  <option value="Leased">Leased</option>
                  <option value="Rented">Rented</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] pointer-events-none" />
              </div>
            </div>

            {/* Choose Manufacturing Year */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Choose Manufacturing Year<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  value={formData.manufacturingYear}
                  onChange={(e) => setFormData({ ...formData, manufacturingYear: e.target.value })}
                  className="w-full px-4 py-3 border border-[var(--primary-orange)] rounded-lg bg-[var(--primary-orange-light)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)] appearance-none"
                >
                  <option value="">Select Year</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] pointer-events-none" />
              </div>
            </div>

            {/* Choose Fuel Type */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Choose Fuel Type<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  value={formData.fuelType}
                  onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                  className="w-full px-4 py-3 border border-[var(--primary-orange)] rounded-lg bg-[var(--primary-orange-light)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)] appearance-none"
                >
                  <option value="">Select Fuel Type</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="CNG">CNG</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] pointer-events-none" />
              </div>
            </div>

            {/* Choose VLTD Number */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Choose VLTD Number<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  value={formData.vltdNumber}
                  onChange={(e) => setFormData({ ...formData, vltdNumber: e.target.value })}
                  className="w-full px-4 py-3 border border-[var(--primary-orange)] rounded-lg bg-[var(--primary-orange-light)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)] appearance-none"
                >
                  <option value="">Select VLTD Number</option>
                  <option value="VLTD001">VLTD001</option>
                  <option value="VLTD002">VLTD002</option>
                  <option value="VLTD003">VLTD003</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] pointer-events-none" />
              </div>
            </div>

            {/* Choose Status */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Choose Status<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 border border-[var(--primary-orange)] rounded-lg bg-[var(--primary-orange-light)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)] appearance-none"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] pointer-events-none" />
              </div>
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

