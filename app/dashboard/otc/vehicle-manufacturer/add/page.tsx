'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/redux/store';
import { addNewVehicleMake } from '@/lib/redux/features/vehicleManufacturer';
import VehicleManufacturerForm, { VehicleManufacturerFormData } from '../VehicleManufacturerForm';

export default function AddVehicleManufacturerPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (formData: VehicleManufacturerFormData) => {
    try {
      await dispatch(addNewVehicleMake(formData)).unwrap();
      router.push('/dashboard/masters/vehicle-manufacturer');
    } catch (error) {
      console.error('Failed to add vehicle manufacturer:', error);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/masters/vehicle-manufacturer');
  };

  return (
    <VehicleManufacturerForm
      title="Add New Vehicle Manufacturer"
      submitButtonText="Submit"
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}

