'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { fetchRoles } from '@/lib/redux/features/roleSlice';
import RoleForm from '../RoleForm';

export default function EditRolePage() {
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { roles, status } = useSelector((state: RootState) => state.role);
  const [roleData, setRoleData] = useState<any>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchRoles());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (roles.length > 0 && params.id) {
      const role = roles.find((r) => r._id === params.id);
      if (role) {
        setRoleData({
          _id: role._id,
          role: role.role,
          hierarchy: role.hierarchy?._id || '',
          hierarchyOrder: role.hierarchyOrder || 0,
          userLevel: role.userLevel?._id || '',
          userLevelOrder: role.userLevelOrder || 0,
        });
      }
    }
  }, [roles, params.id]);

  if (!roleData) {
    return (
      <div className="p-6 bg-[var(--content-bg)]">
        <div className="bg-white rounded-lg shadow-sm border border-[var(--border-light)] p-6">
          <p className="text-center text-[var(--text-secondary)]">Loading...</p>
        </div>
      </div>
    );
  }

  return <RoleForm initialData={roleData} isEdit={true} />;
}

