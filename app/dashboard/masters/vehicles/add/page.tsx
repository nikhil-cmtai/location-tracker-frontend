'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import VehicleForm, { VehicleFormData } from '../VehicleForm';

export default function AddVehiclePage() {
  const router = useRouter();

  const handleSubmit = (formData: VehicleFormData) => {
    // Handle form submission - API call would go here
    console.log('Form data:', formData);
    // Redirect to vehicles list after submission
    router.push('/dashboard/masters/vehicles');
  };

  const handleCancel = () => {
    router.push('/dashboard/masters/vehicles');
  };

  return (
    <VehicleForm
      title="Add New Vehicle"
      submitButtonText="Submit"
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}
