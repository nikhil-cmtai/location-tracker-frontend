'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchFaqCategories, updateFaqCategory } from '@/lib/redux/features/faqCategorySlice';
import FaqCategoryForm, { FaqCategoryFormData } from '../FaqCategoryForm';
import toast from 'react-hot-toast';

export default function EditFaqCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const categoryId = params?.id as string;

  const { faqCategories, status } = useSelector((state: RootState) => state.faqCategory);
  const [initialData, setInitialData] = useState<FaqCategoryFormData | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchFaqCategories());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (categoryId && faqCategories.length > 0) {
      const category = faqCategories.find((c) => c._id === categoryId);
      if (category) {
        setInitialData({
          name: category.name,
          description: category.description || '',
        });
      }
    }
  }, [categoryId, faqCategories]);

  const handleSubmit = async (formData: FaqCategoryFormData) => {
    try {
      await dispatch(
        updateFaqCategory({
          _id: categoryId,
          ...formData,
        })
      ).unwrap();
      toast.success('FAQ Category updated successfully!');
      router.push('/dashboard/otc/faq-category');
    } catch (error) {
      console.error('Failed to update FAQ category:', error);
      toast.error('Failed to update FAQ Category');
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/otc/faq-category');
  };

  if (status === 'loading' || !initialData) {
    return (
      <div className="p-6 bg-[var(--content-bg)] text-center text-[var(--text-secondary)]">
        Loading FAQ category data...
      </div>
    );
  }

  return (
    <FaqCategoryForm
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isEditMode
    />
  );
}

