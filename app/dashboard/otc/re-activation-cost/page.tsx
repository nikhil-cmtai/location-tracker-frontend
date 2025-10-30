'use client';

import { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Edit2 } from 'lucide-react';
import Link from 'next/link';
import ExportButtons from '@/components/dashboard/ExportButtons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { fetchReactivationPlans } from '@/lib/redux/features/re-activationSlice';

interface ReactivationCostDisplay {
  _id: string;
  vltdManufacturer: string;
  vltdModel: string;
  reactivationCost: number;
}

// Headers for export
const headers: { key: keyof ReactivationCostDisplay; label: string }[] = [
  { key: 'vltdManufacturer', label: 'VLTD Manufacturer' },
  { key: 'vltdModel', label: 'VLTD Model' },
  { key: 'reactivationCost', label: 'Reactivation Cost' },
];

export default function ReactivationCostPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { reactivationPlans, status } = useSelector((state: RootState) => state.reactivationPlan);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchReactivationPlans());
    }
  }, [dispatch, status]);

  const displayPlans: ReactivationCostDisplay[] = reactivationPlans.map((plan) => ({
    _id: plan._id,
    vltdManufacturer: plan.vltdManufacturer?.manufacturerName || 'N/A',
    vltdModel: plan.vltdModel?.modelName || 'N/A',
    reactivationCost: plan.reactivationCost,
  }));

  const filteredPlans = displayPlans.filter((plan) =>
    Object.values(plan).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredPlans.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPlans = filteredPlans.slice(startIndex, endIndex);

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
              <ExportButtons data={displayPlans} headers={headers} filename="reactivation_costs" allData={displayPlans} />
            </div>
          </div>

          {/* Right Section - Search & Add Button */}
          <div className="flex items-center gap-4 flex-1 justify-end flex-wrap">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
              <input
                type="text"
                placeholder="Search reactivation costs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
              />
            </div>

            {/* Add New Button */}
            <Link
              href="/dashboard/otc/re-activation-cost/add"
              className="bg-[var(--primary-orange)] hover:bg-[var(--primary-orange-hover)] text-white px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap"
            >
              Add New Cost
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
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  S.No
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  VLTD Manufacturer
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  VLTD Model
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Reactivation Cost (₹)
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-light)]">
              {status === 'loading' ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[var(--text-secondary)]">
                    Loading...
                  </td>
                </tr>
              ) : currentPlans.length > 0 ? (
                currentPlans.map((plan, index) => (
                  <tr key={plan._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)] font-medium">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                      {plan.vltdManufacturer}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                      {plan.vltdModel}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                      ₹{plan.reactivationCost.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Link
                        href={`/dashboard/otc/re-activation-cost/${plan._id}`}
                        className="text-[var(--primary-orange)] hover:text-[var(--primary-orange-hover)] transition-colors"
                      >
                        <Edit2 className="w-5 h-5" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[var(--text-secondary)]">
                    No reactivation costs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-[var(--border-light)] flex items-center justify-between flex-wrap gap-4">
          <div className="text-sm text-[var(--text-secondary)]">
            Showing results {startIndex + 1} out of {filteredPlans.length}
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