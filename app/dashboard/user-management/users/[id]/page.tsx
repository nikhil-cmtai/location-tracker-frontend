'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { fetchUsers } from '@/lib/redux/features/usersSlice';
import UserForm from '../UserForm';

export default function EditUserPage() {
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { users, status } = useSelector((state: RootState) => state.users);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (users.length > 0 && params.id) {
      const user = users.find((u) => u._id === params.id);
      if (user) {
        setUserData({
          _id: user._id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          hierarchy: user.hierarchy._id,
          role: user.role,
          userLevel: user.userLevel._id,
          userAdmin: user.userAdmin._id,
          parentId: user.parentId,
          status: user.status,
        });
      }
    }
  }, [users, params.id]);

  if (!userData) {
    return (
      <div className="p-6 bg-[var(--content-bg)]">
        <div className="bg-white rounded-lg shadow-sm border border-[var(--border-light)] p-6">
          <p className="text-center text-[var(--text-secondary)]">Loading...</p>
        </div>
      </div>
    );
  }

  return <UserForm initialData={userData} isEdit={true} />;
}

