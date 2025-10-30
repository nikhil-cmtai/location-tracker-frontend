'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchReactivationPlans, updateReactivationPlan } from '@/lib/redux/features/re-activationSlice';
import ReactivationCostForm, { ReactivationCostFormData } from '../ReactivationCostForm';

export default function EditReactivationCostPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const planId = params?.id as string;

  const { reactivationPlans, status } = useSelector((state: RootState) => state.reactivationPlan);
  const [initialData, setInitialData] = useState<ReactivationCostFormData | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchReactivationPlans());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (planId && reactivationPlans.length > 0) {
      const plan = reactivationPlans.find((p) => p._id === planId);
      if (plan) {
        setInitialData({
          vltdManufacturer: plan.vltdManufacturer?._id || '',
          vltdModel: plan.vltdModel?._id || '',
          reactivationCost: plan.reactivationCost,
        });
      }
    }
  }, [planId, reactivationPlans]);

  const handleSubmit = async (formData: ReactivationCostFormData) => {
    try {
      await dispatch(
        updateReactivationPlan({
          id: planId,
          ...formData,
        })
      ).unwrap();
      router.push('/dashboard/otc/re-activation-cost');
    } catch (error) {
      console.error('Failed to update reactivation cost:', error);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/otc/re-activation-cost');
  };

  if (status === 'loading' || !initialData) {
    return (
      <div className="p-6 bg-[var(--content-bg)] text-center text-[var(--text-secondary)]">
        Loading reactivation cost data...
      </div>
    );
  }

  return (
    <ReactivationCostForm
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isEditMode
    />
  );
}

