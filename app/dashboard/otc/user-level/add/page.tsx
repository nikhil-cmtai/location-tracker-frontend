'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/redux/store';
import { addUserLevel } from '@/lib/redux/features/userLevelSlice';
import UserLevelForm, { UserLevelFormData } from '../UserLevelForm';

export default function AddUserLevelPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (formData: UserLevelFormData) => {
    try {
      await dispatch(addUserLevel(formData)).unwrap();
      router.push('/dashboard/otc/user-level');
    } catch (error) {
      console.error('Failed to add user level:', error);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/otc/user-level');
  };

  return <UserLevelForm onSubmit={handleSubmit} onCancel={handleCancel} />;
}

