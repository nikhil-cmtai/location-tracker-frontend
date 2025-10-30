'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/redux/store';
import { addNewSubscription } from '@/lib/redux/features/subscriptionSlice';
import SubscriptionForm, { SubscriptionFormData } from '../SubscriptionForm';

export default function AddSubscriptionPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (formData: SubscriptionFormData) => {
    try {
      await dispatch(addNewSubscription(formData)).unwrap();
      router.push('/dashboard/masters/subscriptions');
    } catch (error) {
      console.error('Failed to add subscription:', error);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/masters/subscriptions');
  };

  return (
    <SubscriptionForm
      title="Add New Subscription"
      submitButtonText="Submit"
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}

