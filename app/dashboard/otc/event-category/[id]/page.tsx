'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchEventCategories, updateEventCategory } from '@/lib/redux/features/eventCategorySlice';
import EventCategoryForm, { EventCategoryFormData } from '../EventCategoryForm';

export default function EditEventCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const categoryId = params?.id as string;

  const { eventCategories, status } = useSelector((state: RootState) => state.eventCategory);
  const [initialData, setInitialData] = useState<EventCategoryFormData | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchEventCategories());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (categoryId && eventCategories.length > 0) {
      const category = eventCategories.find((c) => c._id === categoryId);
      if (category) {
        setInitialData({
          name: category.name,
          description: category.description || '',
        });
      }
    }
  }, [categoryId, eventCategories]);

  const handleSubmit = async (formData: EventCategoryFormData) => {
    try {
      await dispatch(
        updateEventCategory({
          _id: categoryId,
          ...formData,
        })
      ).unwrap();
      router.push('/dashboard/masters/event-category');
    } catch (error) {
      console.error('Failed to update event category:', error);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/masters/event-category');
  };

  if (status === 'loading' || !initialData) {
    return (
      <div className="p-6 bg-[var(--content-bg)] text-center text-[var(--text-secondary)]">
        Loading event category data...
      </div>
    );
  }

  return (
    <EventCategoryForm
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isEditMode
    />
  );
}

