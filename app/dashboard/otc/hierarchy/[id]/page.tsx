'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchHierarchies, updateHierarchy } from '@/lib/redux/features/hierarchySlice';
import HierarchyForm, { HierarchyFormData } from '../HierarchyForm';

export default function EditHierarchyPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const hierarchyId = params?.id as string;

  const { hierarchies, status } = useSelector((state: RootState) => state.hierarchy);
  const [initialData, setInitialData] = useState<HierarchyFormData | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchHierarchies());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (hierarchyId && hierarchies.length > 0) {
      const hierarchy = hierarchies.find((h) => h._id === hierarchyId);
      if (hierarchy) {
        setInitialData({
          name: hierarchy.name,
          level: hierarchy.level,
        });
      }
    }
  }, [hierarchyId, hierarchies]);

  const handleSubmit = async (formData: HierarchyFormData) => {
    try {
      await dispatch(
        updateHierarchy({
          id: hierarchyId,
          data: formData,
        })
      ).unwrap();
      router.push('/dashboard/otc/hierarchy');
    } catch (error) {
      console.error('Failed to update hierarchy:', error);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/otc/hierarchy');
  };

  if (status === 'loading' || !initialData) {
    return (
      <div className="p-6 bg-[var(--content-bg)] text-center text-[var(--text-secondary)]">
        Loading hierarchy data...
      </div>
    );
  }

  return (
    <HierarchyForm
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isEditMode
    />
  );
}

