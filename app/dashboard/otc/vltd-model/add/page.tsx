'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/redux/store';
import { addNewVltdModel } from '@/lib/redux/features/vltdModelSlice';
import VltdModelForm, { VltdModelFormData } from '../VltdModelForm';

export default function AddVltdModelPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (formData: VltdModelFormData) => {
    try {
      await dispatch(addNewVltdModel(formData)).unwrap();
      router.push('/dashboard/otc/vltd-model');
    } catch (error) {
      console.error('Failed to add VLTD model:', error);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/otc/vltd-model');
  };

  return (
    <VltdModelForm
      title="Add New VLTD Model"
      submitButtonText="Submit"
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}

