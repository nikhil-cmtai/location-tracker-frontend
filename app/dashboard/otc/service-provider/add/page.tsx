'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/redux/store';
import { addNewServiceProvider } from '@/lib/redux/features/serviceProviderSlice';
import ServiceProviderForm, { ServiceProviderFormData } from '../ServiceProviderForm';

export default function AddServiceProviderPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (formData: ServiceProviderFormData) => {
    try {
      await dispatch(addNewServiceProvider(formData)).unwrap();
      router.push('/dashboard/otc/service-provider');
    } catch (error) {
      console.error('Failed to add service provider:', error);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/otc/service-provider');
  };

  return <ServiceProviderForm onSubmit={handleSubmit} onCancel={handleCancel} />;
}

