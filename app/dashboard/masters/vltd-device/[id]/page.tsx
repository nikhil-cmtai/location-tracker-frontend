'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { fetchVltDevices, updateVltDevice } from '@/lib/redux/features/vltDeviceSlice';
import VltDeviceForm, { VltDeviceFormData } from '../VltDeviceForm';
import toast from 'react-hot-toast';

export default function EditVltDevicePage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const deviceId = params?.id as string;
  
  const { vltDevices, status } = useSelector((state: RootState) => state.vltDevice);
  const [initialData, setInitialData] = useState<VltDeviceFormData | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchVltDevices());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (vltDevices.length > 0 && deviceId) {
      const device = vltDevices.find((d) => d._id === deviceId);
      if (device) {
        const vltId = typeof device.vlt === 'string' ? device.vlt : device.vlt._id;
        setInitialData({
          vlt: vltId,
          imeiNumber: device.imeiNumber.toString(),
          iccid: device.iccid,
        });
      }
    }
  }, [vltDevices, deviceId]);

  const handleSubmit = async (formData: VltDeviceFormData) => {
    try {
      const device = vltDevices.find((d) => d._id === deviceId);
      
      const payload = {
        _id: deviceId,
        vlt: formData.vlt,
        imeiNumber: Number(formData.imeiNumber),
        iccid: formData.iccid,
        region: device?.region || null,
        customer: device?.customer || null,
      };
      
      await dispatch(updateVltDevice(payload)).unwrap();
      toast.success('VLT Device updated successfully!');
      router.push('/dashboard/masters/vlt-devices');
    } catch (error) {
      console.error('Failed to update VLT device:', error);
      toast.error('Failed to update VLT device');
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/masters/vlt-devices');
  };

  if (!initialData) {
    return (
      <div className="p-6 bg-[var(--content-bg)] flex items-center justify-center">
        <div className="text-[var(--text-secondary)]">Loading...</div>
      </div>
    );
  }

  return (
    <VltDeviceForm
      title="Edit VLT Device"
      submitButtonText="Update"
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}

