'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { fetchRenewalPlans } from '@/lib/redux/features/renewalSlice';
import RenewalPlanForm from '../RenewalPlanForm';

export default function EditRenewalPlanPage() {
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { renewalPlans, status } = useSelector((state: RootState) => state.renewalPlan);
  const [planData, setPlanData] = useState<any>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchRenewalPlans());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (renewalPlans.length > 0 && params.id) {
      const plan = renewalPlans.find((p) => p._id === params.id);
      if (plan) {
        setPlanData({
          _id: plan._id,
          planName: plan.planName,
          vltdManufacturer: plan.vltdManufacturer._id,
          vltdModel: plan.vltdModel._id,
          tariff: plan.tariff,
          gst: plan.gst,
          total: plan.total,
          validityDays: plan.validityDays,
          gracePeriodDays: plan.gracePeriodDays,
          deactivationPeriodDays: plan.deactivationPeriodDays,
          status: plan.status,
        });
      }
    }
  }, [renewalPlans, params.id]);

  if (!planData) {
    return (
      <div className="p-6 bg-[var(--content-bg)]">
        <div className="bg-white rounded-lg shadow-sm border border-[var(--border-light)] p-6">
          <p className="text-center text-[var(--text-secondary)]">Loading...</p>
        </div>
      </div>
    );
  }

  return <RenewalPlanForm initialData={planData} isEdit={true} />;
}

