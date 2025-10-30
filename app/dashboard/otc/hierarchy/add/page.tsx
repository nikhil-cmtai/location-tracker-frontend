'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/redux/store';
import { addHierarchy } from '@/lib/redux/features/hierarchySlice';
import HierarchyForm, { HierarchyFormData } from '../HierarchyForm';

export default function AddHierarchyPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (formData: HierarchyFormData) => {
    try {
      await dispatch(addHierarchy(formData)).unwrap();
      router.push('/dashboard/otc/hierarchy');
    } catch (error) {
      console.error('Failed to add hierarchy:', error);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/otc/hierarchy');
  };

  return <HierarchyForm onSubmit={handleSubmit} onCancel={handleCancel} />;
}

