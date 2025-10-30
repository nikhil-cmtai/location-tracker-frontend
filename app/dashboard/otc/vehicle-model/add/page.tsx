'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/redux/store';
import { addNewVehicleModel } from '@/lib/redux/features/vehicleModelSlice';
import VehicleModelForm, { VehicleModelFormData } from '../VehicleModelForm';

export default function AddVehicleModelPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (formData: VehicleModelFormData) => {
    try {
      await dispatch(addNewVehicleModel(formData)).unwrap();
      router.push('/dashboard/masters/vehicle-model');
    } catch (error) {
      console.error('Failed to add vehicle model:', error);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/masters/vehicle-model');
  };

  return (
    <VehicleModelForm
      title="Add New Vehicle Model"
      submitButtonText="Submit"
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}

