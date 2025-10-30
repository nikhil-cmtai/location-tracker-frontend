'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/redux/store';
import { addNewOwnerType } from '@/lib/redux/features/VehicleOwnerSlice';
import VehicleOwnerForm, { VehicleOwnerFormData } from '../VehicleOwnerForm';

export default function AddVehicleOwnerPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (formData: VehicleOwnerFormData) => {
    try {
      await dispatch(addNewOwnerType(formData)).unwrap();
      router.push('/dashboard/otc/vehicle-owner');
    } catch (error) {
      console.error('Failed to add vehicle owner:', error);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/otc/vehicle-owner');
  };

  return <VehicleOwnerForm onSubmit={handleSubmit} onCancel={handleCancel} />;
}

