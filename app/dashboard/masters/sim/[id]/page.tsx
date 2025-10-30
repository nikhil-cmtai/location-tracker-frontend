'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchSims, updateSim } from '@/lib/redux/features/simSlice';
import SimForm, { SimFormData } from '../SimForm';
import toast from 'react-hot-toast';

export default function EditSimPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const simId = params?.id as string;

  const { sims, status } = useSelector((state: RootState) => state.sim);
  const [initialData, setInitialData] = useState<SimFormData | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchSims());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (simId && sims.length > 0) {
      const sim = sims.find((s) => s._id === simId);
      if (sim) {
        setInitialData({
          imeiNumber: typeof sim.imeiNumber === 'object' ? sim.imeiNumber._id : sim.imeiNumber || '',
          iccid: sim.iccid?.toString() || '',
          sim: typeof sim.sim === 'object' ? sim.sim._id : sim.sim || '',
          primeryMSISDN: sim.primeryMSISDN || '',
          fallbackSim: typeof sim.fallbackSim === 'object' ? sim.fallbackSim._id : sim.fallbackSim || '',
          fallbackMISIDN: sim.fallbackMISIDN || '',
        });
      }
    }
  }, [simId, sims]);

  const handleSubmit = async (formData: SimFormData) => {
    try {
      await dispatch(
        updateSim({
          id: simId,
          ...formData,
        })
      ).unwrap();
      toast.success('SIM updated successfully!');
      router.push('/dashboard/masters/sim');
    } catch (error) {
      console.error('Failed to update SIM:', error);
      toast.error('Failed to update SIM');
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/masters/sim');
  };

  if (status === 'loading' || !initialData) {
    return (
      <div className="p-6 bg-[var(--content-bg)] text-center text-[var(--text-secondary)]">
        Loading SIM data...
      </div>
    );
  }

  return (
    <SimForm
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isEditMode
    />
  );
}

