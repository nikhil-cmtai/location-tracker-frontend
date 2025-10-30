'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { fetchVehicleTypes, updateVehicleType } from '@/lib/redux/features/vehicleTypeSlice';
import VehicleTypeForm, { VehicleTypeFormData } from '../VehicleTypeForm';

export default function EditVehicleTypePage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const typeId = params?.id as string;
  
  const { vehicleTypes, status } = useSelector((state: RootState) => state.vehicleType);
  const [initialData, setInitialData] = useState<VehicleTypeFormData | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchVehicleTypes());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (vehicleTypes.length > 0 && typeId) {
      const type = vehicleTypes.find((t) => t._id === typeId);
      if (type) {
        setInitialData({
          make: type.make,
          vehicleType: type.vehicleType || '',
        });
      }
    }
  }, [vehicleTypes, typeId]);

  const handleSubmit = async (formData: VehicleTypeFormData) => {
    try {
      await dispatch(updateVehicleType({
        id: typeId,
        data: formData
      })).unwrap();
      router.push('/dashboard/masters/vehicle-type');
    } catch (error) {
      console.error('Failed to update vehicle type:', error);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/masters/vehicle-type');
  };

  if (!initialData) {
    return (
      <div className="p-6 bg-[var(--content-bg)] flex items-center justify-center">
        <div className="text-[var(--text-secondary)]">Loading...</div>
      </div>
    );
  }

  return (
    <VehicleTypeForm
      title="Edit Vehicle Type"
      submitButtonText="Update"
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}

