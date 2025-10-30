'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { fetchVltdModels, updateVltdModel } from '@/lib/redux/features/vltdModelSlice';
import VltdModelForm, { VltdModelFormData } from '../VltdModelForm';

export default function EditVltdModelPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const modelId = params?.id as string;
  
  const { vltdModels, status } = useSelector((state: RootState) => state.vltdModel);
  const [initialData, setInitialData] = useState<VltdModelFormData | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchVltdModels());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (vltdModels.length > 0 && modelId) {
      const model = vltdModels.find((m) => m._id === modelId);
      if (model) {
        setInitialData({
          manufacturerId: model.manufacturerId || '',
          modelName: model.modelName,
        });
      }
    }
  }, [vltdModels, modelId]);

  const handleSubmit = async (formData: VltdModelFormData) => {
    try {
      await dispatch(updateVltdModel({
        _id: modelId,
        ...formData
      })).unwrap();
      router.push('/dashboard/otc/vltd-model');
    } catch (error) {
      console.error('Failed to update VLTD model:', error);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/otc/vltd-model');
  };

  if (!initialData) {
    return (
      <div className="p-6 bg-[var(--content-bg)] flex items-center justify-center">
        <div className="text-[var(--text-secondary)]">Loading...</div>
      </div>
    );
  }

  return (
    <VltdModelForm
      title="Edit VLTD Model"
      submitButtonText="Update"
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}

