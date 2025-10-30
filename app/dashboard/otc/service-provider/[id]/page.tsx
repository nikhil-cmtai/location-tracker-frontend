'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchServiceProviders, updateServiceProvider } from '@/lib/redux/features/serviceProviderSlice';
import ServiceProviderForm, { ServiceProviderFormData } from '../ServiceProviderForm';

export default function EditServiceProviderPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const providerId = params?.id as string;

  const { serviceProviders, status } = useSelector((state: RootState) => state.serviceProvider);
  const [initialData, setInitialData] = useState<ServiceProviderFormData | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchServiceProviders());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (providerId && serviceProviders.length > 0) {
      const provider = serviceProviders.find((p) => p._id === providerId);
      if (provider) {
        setInitialData({
          serviceProviderName: provider.serviceProviderName,
          shortName: provider.shortName,
        });
      }
    }
  }, [providerId, serviceProviders]);

  const handleSubmit = async (formData: ServiceProviderFormData) => {
    try {
      await dispatch(
        updateServiceProvider({
          _id: providerId,
          ...formData,
        })
      ).unwrap();
      router.push('/dashboard/otc/service-provider');
    } catch (error) {
      console.error('Failed to update service provider:', error);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/otc/service-provider');
  };

  if (status === 'loading' || !initialData) {
    return (
      <div className="p-6 bg-[var(--content-bg)] text-center text-[var(--text-secondary)]">
        Loading service provider data...
      </div>
    );
  }

  return (
    <ServiceProviderForm
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isEditMode
    />
  );
}

