'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/redux/store';
import { addNewReactivationPlan } from '@/lib/redux/features/re-activationSlice';
import ReactivationCostForm, { ReactivationCostFormData } from '../ReactivationCostForm';

export default function AddReactivationCostPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (formData: ReactivationCostFormData) => {
    try {
      await dispatch(addNewReactivationPlan(formData)).unwrap();
      router.push('/dashboard/otc/re-activation-cost');
    } catch (error) {
      console.error('Failed to add reactivation cost:', error);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/otc/re-activation-cost');
  };

  return <ReactivationCostForm onSubmit={handleSubmit} onCancel={handleCancel} />;
}

