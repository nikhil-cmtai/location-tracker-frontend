'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/redux/store';
import { addNewPlan } from '@/lib/redux/features/planSlice';
import PlanForm, { PlanFormData } from '../PlanForm';

export default function AddPlanPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (formData: PlanFormData) => {
    try {
      await dispatch(addNewPlan(formData)).unwrap();
      router.push('/dashboard/masters/plans');
    } catch (error) {
      console.error('Failed to add plan:', error);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/masters/plans');
  };

  return (
    <PlanForm
      title="Add New Plan"
      submitButtonText="Submit"
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}

