'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { fetchVehicleModels, updateVehicleModel } from '@/lib/redux/features/vehicleModelSlice';
import VehicleModelForm, { VehicleModelFormData } from '../VehicleModelForm';

export default function EditVehicleModelPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const modelId = params?.id as string;
  
  const { vehicleModels, status } = useSelector((state: RootState) => state.vehicleModel);
  const [initialData, setInitialData] = useState<VehicleModelFormData | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchVehicleModels());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (vehicleModels.length > 0 && modelId) {
      const model = vehicleModels.find((m) => m._id === modelId);
      if (model) {
        const makeId = typeof model.make === 'object' ? (model.make as { _id: string })._id : model.make;
        const vehicleTypeId = typeof model.vehicleType === 'object' ? (model.vehicleType as { _id: string })._id : model.vehicleType;
        
        setInitialData({
          make: makeId,
          vehicleType: vehicleTypeId,
          vehicleModel: model.vehicleModel,
        });
      }
    }
  }, [vehicleModels, modelId]);

  const handleSubmit = async (formData: VehicleModelFormData) => {
    try {
      await dispatch(updateVehicleModel({
        _id: modelId,
        ...formData
      })).unwrap();
      router.push('/dashboard/masters/vehicle-model');
    } catch (error) {
      console.error('Failed to update vehicle model:', error);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/masters/vehicle-model');
  };

  if (!initialData) {
    return (
      <div className="p-6 bg-[var(--content-bg)] flex items-center justify-center">
        <div className="text-[var(--text-secondary)]">Loading...</div>
      </div>
    );
  }

  return (
    <VehicleModelForm
      title="Edit Vehicle Model"
      submitButtonText="Update"
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}

