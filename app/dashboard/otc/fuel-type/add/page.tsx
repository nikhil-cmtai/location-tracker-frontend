'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/redux/store';
import { addFuelType } from '@/lib/redux/features/fuelTypeSlice';
import FuelTypeForm, { FuelTypeFormData } from '../FuelTypeForm';

export default function AddFuelTypePage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (formData: FuelTypeFormData) => {
    try {
      await dispatch(addFuelType(formData)).unwrap();
      router.push('/dashboard/otc/fuel-type');
    } catch (error) {
      console.error('Failed to add fuel type:', error);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/otc/fuel-type');
  };

  return <FuelTypeForm onSubmit={handleSubmit} onCancel={handleCancel} />;
}

