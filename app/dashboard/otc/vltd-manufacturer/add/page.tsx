'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/redux/store';
import { addNewVltdManufacturer } from '@/lib/redux/features/vltdManufacturerSlice';
import VltdManufacturerForm, { VltdManufacturerFormData } from '../VltdManufacturerForm';

export default function AddVltdManufacturerPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (formData: VltdManufacturerFormData) => {
    try {
      await dispatch(addNewVltdManufacturer(formData)).unwrap();
      router.push('/dashboard/masters/vlt-manufacturer');
    } catch (error) {
      console.error('Failed to add VLTD manufacturer:', error);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/masters/vlt-manufacturer');
  };

  return (
    <VltdManufacturerForm
      title="Add New VLTD Manufacturer"
      submitButtonText="Submit"
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}

