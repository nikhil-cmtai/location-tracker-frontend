'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { fetchPlans } from '@/lib/redux/features/planSlice';
import { fetchVltDevices } from '@/lib/redux/features/vltDeviceSlice';

export interface SubscriptionFormData {
  vehicleNumber: string;
  vltdDevice: string;
  plan: string;
  activePlan: string;
  expiry: string;
}

interface SubscriptionFormProps {
  initialData?: SubscriptionFormData;
  onSubmit: (data: SubscriptionFormData) => void;
  onCancel: () => void;
  title: string;
  submitButtonText: string;
}

const defaultFormData: SubscriptionFormData = {
  vehicleNumber: '',
  vltdDevice: '',
  plan: '',
  activePlan: '',
  expiry: '',
};

export default function SubscriptionForm({
  initialData,
  onSubmit,
  onCancel,
  title,
  submitButtonText,
}: SubscriptionFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { plans, status: plansStatus } = useSelector((state: RootState) => state.plan);
  const { vltDevices, status: devicesStatus } = useSelector((state: RootState) => state.vltDevice);
  
  const [formData, setFormData] = useState<SubscriptionFormData>(
    initialData || defaultFormData
  );

  useEffect(() => {
    if (plansStatus === 'idle') {
      dispatch(fetchPlans());
    }
    if (devicesStatus === 'idle') {
      dispatch(fetchVltDevices());
    }
  }, [dispatch, plansStatus, devicesStatus]);

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
            {/* Enter Vehicle Number */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Enter Vehicle Number<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Enter Vehicle Number (e.g., AB12CD1234)"
                value={formData.vehicleNumber}
                onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                className="w-full px-4 py-3 border border-[var(--primary-orange)] rounded-lg bg-[var(--primary-orange-light)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
              />
            </div>

            {/* Choose VLTD Device */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Choose VLTD Device<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  value={formData.vltdDevice}
                  onChange={(e) => setFormData({ ...formData, vltdDevice: e.target.value })}
                  className="w-full px-4 py-3 border border-[var(--primary-orange)] rounded-lg bg-[var(--primary-orange-light)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)] appearance-none"
                >
                  <option value="">Select VLTD Device</option>
                  {vltDevices.map((device) => (
                    <option key={device._id} value={device._id}>
                      IMEI: {device.imeiNumber}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] pointer-events-none" />
              </div>
            </div>

            {/* Choose Plan */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Choose Plan<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  value={formData.plan}
                  onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                  className="w-full px-4 py-3 border border-[var(--primary-orange)] rounded-lg bg-[var(--primary-orange-light)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)] appearance-none"
                >
                  <option value="">Select Plan</option>
                  {plans.map((plan) => (
                    <option key={plan._id} value={plan._id}>
                      {plan.planName} ({plan.durationDays} days)
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] pointer-events-none" />
              </div>
            </div>

            {/* Enter Active Plan */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Active Plan<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Enter Active Plan Name"
                value={formData.activePlan}
                onChange={(e) => setFormData({ ...formData, activePlan: e.target.value })}
                className="w-full px-4 py-3 border border-[var(--primary-orange)] rounded-lg bg-[var(--primary-orange-light)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
              />
            </div>

            {/* Enter Expiry Date */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Expiry Date<span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.expiry}
                onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
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

