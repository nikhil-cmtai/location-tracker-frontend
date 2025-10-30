'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { addNewUser, updateUser, fetchUsers } from '@/lib/redux/features/usersSlice';
import { fetchHierarchies } from '@/lib/redux/features/hierarchySlice';
import { fetchUserLevels } from '@/lib/redux/features/userLevelSlice';

interface UserFormProps {
  initialData?: {
    _id?: string;
    username: string;
    email: string;
    phone: string;
    hierarchy: string;
    role: string;
    userLevel: string;
    userAdmin: string;
    parentId: string;
    status: 'active' | 'inactive';
  };
  isEdit?: boolean;
}

export default function UserForm({ initialData, isEdit = false }: UserFormProps) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { hierarchies } = useSelector((state: RootState) => state.hierarchy);
  const { userLevels } = useSelector((state: RootState) => state.userLevel);
  const { users } = useSelector((state: RootState) => state.users);

  const [formData, setFormData] = useState({
    username: initialData?.username || '',
    email: initialData?.email || '',
    password: '',
    phone: initialData?.phone || '',
    hierarchy: initialData?.hierarchy || '',
    role: initialData?.role || '',
    userLevel: initialData?.userLevel || '',
    userAdmin: initialData?.userAdmin || '',
    parentId: initialData?.parentId || '',
    status: initialData?.status || 'active' as 'active' | 'inactive',
  });

  useEffect(() => {
    dispatch(fetchHierarchies());
    dispatch(fetchUserLevels());
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEdit && initialData?._id) {
      const { password, ...updateData } = formData;
      await dispatch(updateUser({ id: initialData._id, ...updateData }));
    } else {
      await dispatch(addNewUser(formData));
    }

    router.push('/dashboard/user-management/users');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="p-6 bg-[var(--content-bg)]">
      <div className="bg-white rounded-lg shadow-sm border border-[var(--border-light)] p-6">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
          {isEdit ? 'Edit User' : 'Add New User'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
                placeholder="Enter username"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
                placeholder="Enter email"
              />
            </div>

            {/* Password (Only for Add) */}
            {!isEdit && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required={!isEdit}
                  className="w-full px-4 py-2 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
                  placeholder="Enter password"
                />
              </div>
            )}

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
                placeholder="Enter phone number"
              />
            </div>

            {/* Hierarchy */}
            <div>
              <label htmlFor="hierarchy" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Hierarchy <span className="text-red-500">*</span>
              </label>
              <select
                id="hierarchy"
                name="hierarchy"
                value={formData.hierarchy}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
              >
                <option value="">Select Hierarchy</option>
                {hierarchies.map((hierarchy) => (
                  <option key={hierarchy._id} value={hierarchy._id}>
                    {hierarchy.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
              >
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="User">User</option>
                <option value="Operator">Operator</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>

            {/* User Level */}
            <div>
              <label htmlFor="userLevel" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                User Level <span className="text-red-500">*</span>
              </label>
              <select
                id="userLevel"
                name="userLevel"
                value={formData.userLevel}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
              >
                <option value="">Select User Level</option>
                {userLevels.map((level) => (
                  <option key={level._id} value={level._id}>
                    {level.levelName}
                  </option>
                ))}
              </select>
            </div>

            {/* User Admin */}
            <div>
              <label htmlFor="userAdmin" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                User Admin <span className="text-red-500">*</span>
              </label>
              <select
                id="userAdmin"
                name="userAdmin"
                value={formData.userAdmin}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
              >
                <option value="">Select User Admin</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.username}
                  </option>
                ))}
              </select>
            </div>

            {/* Parent ID */}
            <div>
              <label htmlFor="parentId" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Parent ID
              </label>
              <input
                type="text"
                id="parentId"
                name="parentId"
                value={formData.parentId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
                placeholder="Enter parent ID (optional)"
              />
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              className="bg-[var(--primary-orange)] hover:bg-[var(--primary-orange-hover)] text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {isEdit ? 'Update User' : 'Add User'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/dashboard/user-management/users')}
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

