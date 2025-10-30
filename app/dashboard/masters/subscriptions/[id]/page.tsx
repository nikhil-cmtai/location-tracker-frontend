'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { fetchSubscriptions, updateSubscription } from '@/lib/redux/features/subscriptionSlice';
import SubscriptionForm, { SubscriptionFormData } from '../SubscriptionForm';

export default function EditSubscriptionPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const subscriptionId = params?.id as string;
  
  const { subscriptions, status } = useSelector((state: RootState) => state.subscription);
  const [initialData, setInitialData] = useState<SubscriptionFormData | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchSubscriptions());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (subscriptions.length > 0 && subscriptionId) {
      const subscription = subscriptions.find((s) => s._id === subscriptionId);
      if (subscription) {
        const vltdDeviceId = typeof subscription.vltdDevice === 'string' 
          ? subscription.vltdDevice 
          : subscription.vltdDevice._id;
        
        const planId = typeof subscription.plan === 'object' && subscription.plan 
          ? subscription.plan._id 
          : '';
        
        // Format date for input[type="date"]
        const expiryDate = new Date(subscription.expiry).toISOString().split('T')[0];
        
        setInitialData({
          vehicleNumber: subscription.vehicleNumber,
          vltdDevice: vltdDeviceId,
          plan: planId,
          activePlan: subscription.activePlan,
          expiry: expiryDate,
        });
      }
    }
  }, [subscriptions, subscriptionId]);

  const handleSubmit = async (formData: SubscriptionFormData) => {
    try {
      await dispatch(updateSubscription({
        _id: subscriptionId,
        ...formData
      })).unwrap();
      router.push('/dashboard/masters/subscriptions');
    } catch (error) {
      console.error('Failed to update subscription:', error);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/masters/subscriptions');
  };

  if (!initialData) {
    return (
      <div className="p-6 bg-[var(--content-bg)] flex items-center justify-center">
        <div className="text-[var(--text-secondary)]">Loading...</div>
      </div>
    );
  }

  return (
    <SubscriptionForm
      title="Edit Subscription"
      submitButtonText="Update"
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}

