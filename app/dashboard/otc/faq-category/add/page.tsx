'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/redux/store';
import { addNewFaqCategory } from '@/lib/redux/features/faqCategorySlice';
import FaqCategoryForm, { FaqCategoryFormData } from '../FaqCategoryForm';
import toast from 'react-hot-toast';

export default function AddFaqCategoryPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (formData: FaqCategoryFormData) => {
    try {
      await dispatch(addNewFaqCategory(formData)).unwrap();
      toast.success('FAQ Category added successfully!');
      router.push('/dashboard/otc/faq-category');
    } catch (error) {
      console.error('Failed to add FAQ category:', error);
      toast.error('Failed to add FAQ Category');
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/otc/faq-category');
  };

  return <FaqCategoryForm onSubmit={handleSubmit} onCancel={handleCancel} />;
}

