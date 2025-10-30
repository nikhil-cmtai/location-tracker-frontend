'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchOwnerTypes, updateOwnerType } from '@/lib/redux/features/VehicleOwnerSlice';
import VehicleOwnerForm, { VehicleOwnerFormData } from '../VehicleOwnerForm';

export default function EditVehicleOwnerPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const ownerId = params?.id as string;

  const { ownerTypes, status } = useSelector((state: RootState) => state.ownerType);
  const [initialData, setInitialData] = useState<VehicleOwnerFormData | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchOwnerTypes());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (ownerId && ownerTypes.length > 0) {
      const owner = ownerTypes.find((o) => o._id === ownerId);
      if (owner) {
        setInitialData({
          ownerType: owner.ownerType,
          description: owner.description,
        });
      }
    }
  }, [ownerId, ownerTypes]);

  const handleSubmit = async (formData: VehicleOwnerFormData) => {
    try {
      await dispatch(
        updateOwnerType({
          _id: ownerId,
          ...formData,
        })
      ).unwrap();
      router.push('/dashboard/otc/vehicle-owner');
    } catch (error) {
      console.error('Failed to update vehicle owner:', error);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/otc/vehicle-owner');
  };

  if (status === 'loading' || !initialData) {
    return (
      <div className="p-6 bg-[var(--content-bg)] text-center text-[var(--text-secondary)]">
        Loading vehicle owner data...
      </div>
    );
  }

  return (
    <VehicleOwnerForm
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isEditMode
    />
  );
}

