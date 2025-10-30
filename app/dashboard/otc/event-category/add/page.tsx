'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/redux/store';
import { addNewEventCategory } from '@/lib/redux/features/eventCategorySlice';
import EventCategoryForm, { EventCategoryFormData } from '../EventCategoryForm';

export default function AddEventCategoryPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (formData: EventCategoryFormData) => {
    try {
      await dispatch(addNewEventCategory(formData)).unwrap();
      router.push('/dashboard/otc/event-category');
    } catch (error) {
      console.error('Failed to add event category:', error);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/otc/event-category');
  };

  return <EventCategoryForm onSubmit={handleSubmit} onCancel={handleCancel} />;
}

