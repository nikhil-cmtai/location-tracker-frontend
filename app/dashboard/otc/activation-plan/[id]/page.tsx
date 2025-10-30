'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { fetchPlans, updatePlan } from '@/lib/redux/features/planSlice';
import PlanForm, { PlanFormData } from '../PlanForm';

export default function EditPlanPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const planId = params?.id as string;
  
  const { plans, status } = useSelector((state: RootState) => state.plan);
  const [initialData, setInitialData] = useState<PlanFormData | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPlans());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (plans.length > 0 && planId) {
      const plan = plans.find((p) => p._id === planId);
      if (plan) {
        setInitialData({
          planName: plan.planName,
          vltdManufacturer: plan.vltdManufacturer?._id || '',
          vltdModel: plan.vltdModel?._id || '',
          durationDays: plan.durationDays,
        });
      }
    }
  }, [plans, planId]);

  const handleSubmit = async (formData: PlanFormData) => {
    try {
      await dispatch(updatePlan({
        id: planId,
        ...formData
      })).unwrap();
      router.push('/dashboard/otc/activation-plan');
    } catch (error) {
      console.error('Failed to update plan:', error);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/otc/activation-plan');
  };

  if (!initialData) {
    return (
      <div className="p-6 bg-[var(--content-bg)] flex items-center justify-center">
        <div className="text-[var(--text-secondary)]">Loading...</div>
      </div>
    );
  }

  return (
    <PlanForm
      title="Edit Plan"
      submitButtonText="Update"
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}

