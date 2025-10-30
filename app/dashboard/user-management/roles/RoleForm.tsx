'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { addNewRole, updateRole } from '@/lib/redux/features/roleSlice';
import { fetchHierarchies } from '@/lib/redux/features/hierarchySlice';
import { fetchUserLevels } from '@/lib/redux/features/userLevelSlice';

interface RoleFormProps {
  initialData?: {
    _id?: string;
    role: string;
    hierarchy: string;
    hierarchyOrder: number;
    userLevel: string;
    userLevelOrder: number;
  };
  isEdit?: boolean;
}

export default function RoleForm({ initialData, isEdit = false }: RoleFormProps) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { hierarchies } = useSelector((state: RootState) => state.hierarchy);
  const { userLevels } = useSelector((state: RootState) => state.userLevel);

  const [formData, setFormData] = useState({
    role: initialData?.role || '',
    hierarchy: initialData?.hierarchy || '',
    hierarchyOrder: initialData?.hierarchyOrder || 0,
    userLevel: initialData?.userLevel || '',
    userLevelOrder: initialData?.userLevelOrder || 0,
  });

  useEffect(() => {
    dispatch(fetchHierarchies());
    dispatch(fetchUserLevels());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      permissions: {} as Record<string, unknown>
    };

    if (isEdit && initialData?._id) {
      await dispatch(updateRole({ 
        _id: initialData._id, 
        ...payload
      } as any));
    } else {
      await dispatch(addNewRole(payload as any));
    }

    router.push('/dashboard/user-management/roles');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ['hierarchyOrder', 'userLevelOrder'].includes(name) ? Number(value) : value,
    }));
  };

  return (
    <div className="p-6 bg-[var(--content-bg)]">
      <div className="bg-white rounded-lg shadow-sm border border-[var(--border-light)] p-6">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
          {isEdit ? 'Edit Role' : 'Add New Role'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Role Name */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Role Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
                placeholder="Enter role name (e.g., Admin, Manager)"
              />
            </div>

            {/* Hierarchy */}
            <div>
              <label htmlFor="hierarchy" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Hierarchy
              </label>
              <select
                id="hierarchy"
                name="hierarchy"
                value={formData.hierarchy}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
              >
                <option value="">Select Hierarchy (Optional)</option>
                {hierarchies.map((hierarchy) => (
                  <option key={hierarchy._id} value={hierarchy._id}>
                    {hierarchy.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Hierarchy Order */}
            <div>
              <label htmlFor="hierarchyOrder" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Hierarchy Order
              </label>
              <input
                type="number"
                id="hierarchyOrder"
                name="hierarchyOrder"
                value={formData.hierarchyOrder}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
                placeholder="Enter hierarchy order (0, 1, 2...)"
              />
            </div>

            {/* User Level */}
            <div>
              <label htmlFor="userLevel" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                User Level
              </label>
              <select
                id="userLevel"
                name="userLevel"
                value={formData.userLevel}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
              >
                <option value="">Select User Level (Optional)</option>
                {userLevels.map((level) => (
                  <option key={level._id} value={level._id}>
                    {level.levelName}
                  </option>
                ))}
              </select>
            </div>

            {/* User Level Order */}
            <div>
              <label htmlFor="userLevelOrder" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                User Level Order
              </label>
              <input
                type="number"
                id="userLevelOrder"
                name="userLevelOrder"
                value={formData.userLevelOrder}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
                placeholder="Enter user level order (0, 1, 2...)"
              />
            </div>
          </div>

          {/* Information Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Role permissions will be managed separately through the permissions management interface.
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              className="bg-[var(--primary-orange)] hover:bg-[var(--primary-orange-hover)] text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {isEdit ? 'Update Role' : 'Add Role'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/dashboard/user-management/roles')}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

