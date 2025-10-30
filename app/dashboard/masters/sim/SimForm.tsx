'use client';

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { fetchVltDevices } from '@/lib/redux/features/vltDeviceSlice';
import { fetchServiceProviders } from '@/lib/redux/features/serviceProviderSlice';
import { ChevronDown } from 'lucide-react';

export interface SimFormData {
  imeiNumber: string;
  iccid: string;
  sim: string;
  primeryMSISDN?: string;
  fallbackSim?: string;
  fallbackMISIDN?: string;
}

interface SimFormProps {
  initialData?: SimFormData;
  onSubmit: (data: SimFormData) => void;
  onCancel: () => void;
  isEditMode?: boolean;
}

export default function SimForm({
  initialData,
  onSubmit,
  onCancel,
  isEditMode = false,
}: SimFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { vltDevices } = useSelector((state: RootState) => state.vltDevice);
  const { serviceProviders } = useSelector((state: RootState) => state.serviceProvider);

  const [formData, setFormData] = useState<SimFormData>(
    initialData || {
      imeiNumber: '',
      iccid: '',
      sim: '',
      primeryMSISDN: '',
      fallbackSim: '',
      fallbackMISIDN: '',
    }
  );

  useEffect(() => {
    dispatch(fetchVltDevices());
    dispatch(fetchServiceProviders());
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
          {isEditMode ? 'Edit SIM' : 'Add New SIM'}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* IMEI Number (VLT Device) */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                IMEI Number<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  name="imeiNumber"
                  value={formData.imeiNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[var(--primary-orange)] rounded-lg bg-[var(--primary-orange-light)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)] appearance-none"
                >
                  <option value="">Select IMEI Number</option>
                  {vltDevices.map((device) => (
                    <option key={device._id} value={device._id}>
                      {device.imeiNumber}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] pointer-events-none" />
              </div>
            </div>

            {/* ICCID */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                ICCID<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                name="iccid"
                placeholder="Enter ICCID"
                value={formData.iccid}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[var(--primary-orange)] rounded-lg bg-[var(--primary-orange-light)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
              />
            </div>

            {/* SIM Provider */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                SIM Provider<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  name="sim"
                  value={formData.sim}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[var(--primary-orange)] rounded-lg bg-[var(--primary-orange-light)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)] appearance-none"
                >
                  <option value="">Select SIM Provider</option>
                  {serviceProviders.map((provider) => (
                    <option key={provider._id} value={provider._id}>
                      {provider.serviceProviderName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] pointer-events-none" />
              </div>
            </div>

            {/* Primary MSISDN */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Primary MSISDN
              </label>
              <input
                type="text"
                name="primeryMSISDN"
                placeholder="Enter Primary MSISDN"
                value={formData.primeryMSISDN}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[var(--primary-orange)] rounded-lg bg-[var(--primary-orange-light)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
              />
            </div>

            {/* Fallback SIM */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Fallback SIM Provider
              </label>
              <div className="relative">
                <select
                  name="fallbackSim"
                  value={formData.fallbackSim}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[var(--primary-orange)] rounded-lg bg-[var(--primary-orange-light)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)] appearance-none"
                >
                  <option value="">Select Fallback SIM (Optional)</option>
                  {serviceProviders.map((provider) => (
                    <option key={provider._id} value={provider._id}>
                      {provider.serviceProviderName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] pointer-events-none" />
              </div>
            </div>

            {/* Fallback MSISDN */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Fallback MSISDN
              </label>
              <input
                type="text"
                name="fallbackMISIDN"
                placeholder="Enter Fallback MSISDN"
                value={formData.fallbackMISIDN}
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

