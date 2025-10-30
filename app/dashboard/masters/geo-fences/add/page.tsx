'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/redux/store';
import { addGeoFence } from '@/lib/redux/features/geoFenceSlice';
import GeoFenceForm, { GeoFenceFormData } from '../GeoFenceForm';

export default function AddGeoFencePage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (formData: GeoFenceFormData) => {
    try {
      await dispatch(addGeoFence(formData)).unwrap();
      router.push('/dashboard/masters/geo-fences');
    } catch (error) {
      console.error('Failed to add geo-fence:', error);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/masters/geo-fences');
  };

  return (
    <GeoFenceForm
      title="Add New Geo-Fence"
      submitButtonText="Submit"
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}

