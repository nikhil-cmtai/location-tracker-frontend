'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { fetchVltdManufacturers, updateVltdManufacturer } from '@/lib/redux/features/vltdManufacturerSlice';
import VltdManufacturerForm, { VltdManufacturerFormData } from '../VltdManufacturerForm';

export default function EditVltdManufacturerPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const manufacturerId = params?.id as string;
  
  const { vltdManufacturers, status } = useSelector((state: RootState) => state.vltdManufacturer);
  const [initialData, setInitialData] = useState<VltdManufacturerFormData | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchVltdManufacturers());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (vltdManufacturers.length > 0 && manufacturerId) {
      const manufacturer = vltdManufacturers.find((m) => m._id === manufacturerId);
      if (manufacturer) {
        setInitialData({
          manufacturerName: manufacturer.manufacturerName,
          shortName: manufacturer.shortName,
        });
      }
    }
  }, [vltdManufacturers, manufacturerId]);

  const handleSubmit = async (formData: VltdManufacturerFormData) => {
    try {
      await dispatch(updateVltdManufacturer({
        _id: manufacturerId,
        ...formData
      })).unwrap();
      router.push('/dashboard/masters/vlt-manufacturer');
    } catch (error) {
      console.error('Failed to update VLTD manufacturer:', error);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/masters/vlt-manufacturer');
  };

  if (!initialData) {
    return (
      <div className="p-6 bg-[var(--content-bg)] flex items-center justify-center">
        <div className="text-[var(--text-secondary)]">Loading...</div>
      </div>
    );
  }

  return (
    <VltdManufacturerForm
      title="Edit VLTD Manufacturer"
      submitButtonText="Update"
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}

