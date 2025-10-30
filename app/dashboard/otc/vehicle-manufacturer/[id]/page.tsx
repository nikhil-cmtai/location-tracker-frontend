'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { fetchVehicleMakes, updateVehicleMake } from '@/lib/redux/features/vehicleManufacturer';
import VehicleManufacturerForm, { VehicleManufacturerFormData } from '../VehicleManufacturerForm';

export default function EditVehicleManufacturerPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const manufacturerId = params?.id as string;
  
  const { vehicleMakes, status } = useSelector((state: RootState) => state.vehicleManufacturer);
  const [initialData, setInitialData] = useState<VehicleManufacturerFormData | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchVehicleMakes());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (vehicleMakes.length > 0 && manufacturerId) {
      const manufacturer = vehicleMakes.find((m) => m._id === manufacturerId);
      if (manufacturer) {
        setInitialData({
          make: manufacturer.make,
          shortName: manufacturer.shortName,
        });
      }
    }
  }, [vehicleMakes, manufacturerId]);

  const handleSubmit = async (formData: VehicleManufacturerFormData) => {
    try {
      await dispatch(updateVehicleMake({
        _id: manufacturerId,
        ...formData
      })).unwrap();
      router.push('/dashboard/otc/vehicle-manufacturer');
    } catch (error) {
      console.error('Failed to update vehicle manufacturer:', error);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/otc/vehicle-manufacturer');
  };

  if (!initialData) {
    return (
      <div className="p-6 bg-[var(--content-bg)] flex items-center justify-center">
        <div className="text-[var(--text-secondary)]">Loading...</div>
      </div>
    );
  }

  return (
    <VehicleManufacturerForm
      title="Edit Vehicle Manufacturer"
      submitButtonText="Update"
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}

