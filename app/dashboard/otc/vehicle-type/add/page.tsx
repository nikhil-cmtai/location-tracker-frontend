'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/redux/store';
import { createVehicleType } from '@/lib/redux/features/vehicleTypeSlice';
import VehicleTypeForm, { VehicleTypeFormData } from '../VehicleTypeForm';

export default function AddVehicleTypePage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (formData: VehicleTypeFormData) => {
    try {
      await dispatch(createVehicleType(formData)).unwrap();
      router.push('/dashboard/masters/vehicle-type');
    } catch (error) {
      console.error('Failed to add vehicle type:', error);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/masters/vehicle-type');
  };

  return (
    <VehicleTypeForm
      title="Add New Vehicle Type"
      submitButtonText="Submit"
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}

