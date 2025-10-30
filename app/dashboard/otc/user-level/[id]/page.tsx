'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchUserLevels, updateUserLevel } from '@/lib/redux/features/userLevelSlice';
import UserLevelForm, { UserLevelFormData } from '../UserLevelForm';

export default function EditUserLevelPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const levelId = params?.id as string;

  const { userLevels, status } = useSelector((state: RootState) => state.userLevel);
  const [initialData, setInitialData] = useState<UserLevelFormData | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUserLevels());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (levelId && userLevels.length > 0) {
      const level = userLevels.find((l) => l._id === levelId);
      if (level) {
        setInitialData({
          levelName: level.levelName,
          description: level.description,
          order: level.order,
        });
      }
    }
  }, [levelId, userLevels]);

  const handleSubmit = async (formData: UserLevelFormData) => {
    try {
      await dispatch(
        updateUserLevel({
          id: levelId,
          data: formData,
        })
      ).unwrap();
      router.push('/dashboard/otc/user-level');
    } catch (error) {
      console.error('Failed to update user level:', error);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/otc/user-level');
  };

  if (status === 'loading' || !initialData) {
    return (
      <div className="p-6 bg-[var(--content-bg)] text-center text-[var(--text-secondary)]">
        Loading user level data...
      </div>
    );
  }

  return (
    <UserLevelForm
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isEditMode
    />
  );
}

