'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { fetchGeoFences, updateGeoFence } from '@/lib/redux/features/geoFenceSlice';
import GeoFenceForm, { GeoFenceFormData } from '../GeoFenceForm';

export default function EditGeoFencePage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const geoFenceId = params?.id as string;
  
  const { geoFences, status } = useSelector((state: RootState) => state.geoFence);
  const [initialData, setInitialData] = useState<GeoFenceFormData | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchGeoFences());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (geoFences.length > 0 && geoFenceId) {
      const geoFence = geoFences.find((gf) => gf._id === geoFenceId);
      if (geoFence) {
        setInitialData({
          city: geoFence.city,
          longitude: geoFence.longitude,
          latitude: geoFence.latitude,
          radius: geoFence.radius,
        });
      }
    }
  }, [geoFences, geoFenceId]);

  const handleSubmit = async (formData: GeoFenceFormData) => {
    try {
      await dispatch(updateGeoFence({
        id: geoFenceId,
        ...formData
      })).unwrap();
      router.push('/dashboard/masters/geo-fences');
    } catch (error) {
      console.error('Failed to update geo-fence:', error);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/masters/geo-fences');
  };

  if (!initialData) {
    return (
      <div className="p-6 bg-[var(--content-bg)] flex items-center justify-center">
        <div className="text-[var(--text-secondary)]">Loading...</div>
      </div>
    );
  }

  return (
    <GeoFenceForm
      title="Edit Geo-Fence"
      submitButtonText="Update"
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}

