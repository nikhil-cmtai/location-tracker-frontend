'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/redux/store';
import { addNewDeviceEvent } from '@/lib/redux/features/deviceEventSlice';
import EventConfigurationForm, { EventConfigurationFormData } from '../EventConfigurationForm';

export default function AddEventConfigurationPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (formData: EventConfigurationFormData) => {
    try {
      await dispatch(addNewDeviceEvent(formData)).unwrap();
      router.push('/dashboard/otc/event-configuration');
    } catch (error) {
      console.error('Failed to add event configuration:', error);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/otc/event-configuration');
  };

  return <EventConfigurationForm onSubmit={handleSubmit} onCancel={handleCancel} />;
}

