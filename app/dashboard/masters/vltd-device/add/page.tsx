'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/redux/store';
import { addNewVltDevice } from '@/lib/redux/features/vltDeviceSlice';
import VltDeviceForm, { VltDeviceFormData } from '../VltDeviceForm';
import toast from 'react-hot-toast';

export default function AddVltDevicePage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (formData: VltDeviceFormData) => {
    try {
      // Convert imeiNumber to number before submitting
      const payload = {
        vlt: formData.vlt,
        imeiNumber: Number(formData.imeiNumber),
        iccid: formData.iccid,
        region: null,
        customer: null,
      };
      
      await dispatch(addNewVltDevice(payload)).unwrap();
      toast.success('VLT Device added successfully!');
      router.push('/dashboard/masters/vlt-devices');
    } catch (error) {
      console.error('Failed to add VLT device:', error);
      toast.error('Failed to add VLT device');
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/masters/vlt-devices');
  };

  return (
    <VltDeviceForm
      title="Add New VLT Device"
      submitButtonText="Submit"
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}

