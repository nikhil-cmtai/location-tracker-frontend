'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/redux/store';
import { addNewSim } from '@/lib/redux/features/simSlice';
import SimForm, { SimFormData } from '../SimForm';
import toast from 'react-hot-toast';

export default function AddSimPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (formData: SimFormData) => {
    try {
      await dispatch(addNewSim(formData)).unwrap();
      toast.success('SIM added successfully!');
      router.push('/dashboard/masters/sim');
    } catch (error) {
      console.error('Failed to add SIM:', error);
      toast.error('Failed to add SIM');
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/masters/sim');
  };

  return <SimForm onSubmit={handleSubmit} onCancel={handleCancel} />;
}

