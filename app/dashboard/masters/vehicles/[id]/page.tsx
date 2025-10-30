'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import VehicleForm, { VehicleFormData } from '../VehicleForm';

// Sample data - in real app, fetch from API
const vehicleData = {
  '1': {
    customer: 'C00001',
    vehicleNumber: 'UP32HF0374',
    manufacturer: 'Maruti Suzuki',
    vehicle: 'Car',
    model: 'Swift',
    ownerType: 'Owned',
    manufacturingYear: '2020',
    fuelType: 'Petrol',
    vltdNumber: 'VLTD001',
    status: 'Active',
  },
  '2': {
    customer: 'C00001',
    vehicleNumber: 'UP32HF0374',
    manufacturer: 'Maruti Suzuki',
    vehicle: 'Car',
    model: 'Swift',
    ownerType: 'Owned',
    manufacturingYear: '2020',
    fuelType: 'Petrol',
    vltdNumber: 'VLTD001',
    status: 'Active',
  },
  '3': {
    customer: 'C00001',
    vehicleNumber: 'UP32HF0374',
    manufacturer: 'Maruti Suzuki',
    vehicle: 'Car',
    model: 'Swift',
    ownerType: 'Owned',
    manufacturingYear: '2020',
    fuelType: 'Petrol',
    vltdNumber: 'VLTD001',
    status: 'Active',
  },
};

export default function EditVehiclePage() {
  const router = useRouter();
  const params = useParams();
  const vehicleId = params?.id as string;
  const [initialData, setInitialData] = useState<VehicleFormData | null>(null);

  useEffect(() => {
    // Load vehicle data based on ID
    if (vehicleId && vehicleData[vehicleId as keyof typeof vehicleData]) {
      setInitialData(vehicleData[vehicleId as keyof typeof vehicleData]);
    }
  }, [vehicleId]);

  const handleSubmit = (formData: VehicleFormData) => {
    // Handle form submission - API call would go here
    console.log('Updated form data:', formData);
    // Redirect to vehicles list after submission
    router.push('/dashboard/masters/vehicles');
  };

  const handleCancel = () => {
    router.push('/dashboard/masters/vehicles');
  };

  if (!initialData) {
    return (
      <div className="p-6 bg-[var(--content-bg)] flex items-center justify-center">
        <div className="text-[var(--text-secondary)]">Loading...</div>
      </div>
    );
  }

  return (
    <VehicleForm
      title="Edit Vehicle"
      submitButtonText="Update"
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}
