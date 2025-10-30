'use client';

import { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Edit2 } from 'lucide-react';
import Link from 'next/link';
import ExportButtons from '@/components/dashboard/ExportButtons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { fetchRoles } from '@/lib/redux/features/roleSlice';

interface RoleDisplay {
  _id: string;
  role: string;
  hierarchy: string;
  hierarchyOrder: number;
  userLevel: string;
  userLevelOrder: number;
}

// Headers for export
const headers: { key: keyof RoleDisplay; label: string }[] = [
  { key: 'role', label: 'Role Name' },
  { key: 'hierarchy', label: 'Hierarchy' },
  { key: 'hierarchyOrder', label: 'Hierarchy Order' },
  { key: 'userLevel', label: 'User Level' },
  { key: 'userLevelOrder', label: 'User Level Order' },
];

export default function RolesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { roles, status } = useSelector((state: RootState) => state.role);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchRoles());
    }
  }, [dispatch, status]);

  const displayRoles: RoleDisplay[] = roles.map((role) => ({
    _id: role._id || '',
    role: role.role,
    hierarchy: role.hierarchy?.name || 'N/A',
    hierarchyOrder: role.hierarchyOrder || 0,
    userLevel: role.userLevel?.name || 'N/A',
    userLevelOrder: role.userLevelOrder || 0,
  }));

  const filteredRoles = displayRoles.filter((role) =>
    Object.values(role).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRoles = filteredRoles.slice(startIndex, endIndex);

  return (
    <div className="p-6 bg-[var(--content-bg)]">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm border border-[var(--border-light)] mb-6">
        <div className="p-4 flex items-center justify-between gap-4 flex-wrap">
          {/* Left Section - Shows & Export Buttons */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--text-secondary)]">Shows</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="border border-[var(--border-light)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            {/* Export Buttons */}
            <div className="flex items-center gap-2">
              <ExportButtons data={displayRoles} headers={headers} filename="roles" allData={displayRoles} />
            </div>
          </div>

          {/* Right Section - Search & Add Button */}
          <div className="flex items-center gap-4 flex-1 justify-end flex-wrap">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
              <input
                type="text"
                placeholder="Search roles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
              />
            </div>

            {/* Add New Button */}
            <Link
              href="/dashboard/user-management/roles/add"
              className="bg-[var(--primary-orange)] hover:bg-[var(--primary-orange-hover)] text-white px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap"
            >
              Add New Role
            </Link>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm border border-[var(--border-light)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--navy-dark)] text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">S.No</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Role Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Hierarchy</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Hierarchy Order</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">User Level</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">User Level Order</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-light)]">
              {status === 'loading' ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-[var(--text-secondary)]">
                    Loading...
                  </td>
                </tr>
              ) : currentRoles.length > 0 ? (
                currentRoles.map((role, index) => (
                  <tr key={role._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)] font-medium">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                      {role.role}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                      {role.hierarchy}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                      {role.hierarchyOrder}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                      {role.userLevel}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                      {role.userLevelOrder}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Link
                        href={`/dashboard/user-management/roles/${role._id}`}
                        className="text-[var(--primary-orange)] hover:text-[var(--primary-orange-hover)] transition-colors"
                      >
                        <Edit2 className="w-5 h-5" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-[var(--text-secondary)]">
                    No roles found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-[var(--border-light)] flex items-center justify-between flex-wrap gap-4">
          <div className="text-sm text-[var(--text-secondary)]">
            Showing results {startIndex + 1} out of {filteredRoles.length}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border border-[var(--border-light)] rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-4 py-2 bg-[var(--primary-orange)] text-white rounded-lg font-semibold">
              {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 border border-[var(--border-light)] rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}