'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchAllFuelTypes, updateFuelType } from '@/lib/redux/features/fuelTypeSlice';
import FuelTypeForm, { FuelTypeFormData } from '../FuelTypeForm';

export default function EditFuelTypePage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const fuelTypeId = params?.id as string;

  const { fuelTypes, status } = useSelector((state: RootState) => state.fuelType);
  const [initialData, setInitialData] = useState<FuelTypeFormData | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAllFuelTypes());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (fuelTypeId && fuelTypes.length > 0) {
      const fuelType = fuelTypes.find((ft) => ft._id === fuelTypeId);
      if (fuelType) {
        setInitialData({
          fuelTypeName: fuelType.fuelTypeName,
          fuelTypeDescription: fuelType.fuelTypeDescription,
        });
      }
    }
  }, [fuelTypeId, fuelTypes]);

  const handleSubmit = async (formData: FuelTypeFormData) => {
    try {
      await dispatch(
        updateFuelType({
          _id: fuelTypeId,
          ...formData,
        })
      ).unwrap();
      router.push('/dashboard/otc/fuel-type');
    } catch (error) {
      console.error('Failed to update fuel type:', error);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/otc/fuel-type');
  };

  if (status === 'loading' || !initialData) {
    return (
      <div className="p-6 bg-[var(--content-bg)] text-center text-[var(--text-secondary)]">
        Loading fuel type data...
      </div>
    );
  }

  return (
    <FuelTypeForm
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isEditMode
    />
  );
}

