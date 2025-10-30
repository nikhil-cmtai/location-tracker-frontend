'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchDeviceEvents, updateDeviceEvent } from '@/lib/redux/features/deviceEventSlice';
import EventConfigurationForm, { EventConfigurationFormData } from '../EventConfigurationForm';

export default function EditEventConfigurationPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const eventId = params?.id as string;

  const { deviceEvents, status } = useSelector((state: RootState) => state.deviceEvent);
  const [initialData, setInitialData] = useState<EventConfigurationFormData | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchDeviceEvents());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (eventId && deviceEvents.length > 0) {
      const event = deviceEvents.find((e) => e._id === eventId);
      if (event) {
        setInitialData({
          vlt: typeof event.vlt === 'string' ? event.vlt : event.vlt?._id || '',
          messageId: event.messageId,
          eventName: event.eventName,
          description: event.description,
          category: typeof event.category === 'string' ? event.category : event.category?._id || '',
        });
      }
    }
  }, [eventId, deviceEvents]);

  const handleSubmit = async (formData: EventConfigurationFormData) => {
    try {
      await dispatch(
        updateDeviceEvent({
          _id: eventId,
          ...formData,
        })
      ).unwrap();
      router.push('/dashboard/masters/event-configuration');
    } catch (error) {
      console.error('Failed to update event configuration:', error);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/masters/event-configuration');
  };

  if (status === 'loading' || !initialData) {
    return (
      <div className="p-6 bg-[var(--content-bg)] text-center text-[var(--text-secondary)]">
        Loading event configuration data...
      </div>
    );
  }

  return (
    <EventConfigurationForm
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isEditMode
    />
  );
}

