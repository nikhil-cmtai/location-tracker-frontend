'use client';

import { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Edit2 } from 'lucide-react';
import Link from 'next/link';
import ExportButtons from '@/components/dashboard/ExportButtons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { fetchVltDevices } from '@/lib/redux/features/vltDeviceSlice';
import { fetchVltdModels } from '@/lib/redux/features/vltdModelSlice';

interface VltDeviceDisplay {
  _id: string;
  modelName: string;
  imeiNumber: string;
  iccid: string;
}

// Headers for export
const headers: { key: keyof VltDeviceDisplay; label: string }[] = [
  { key: 'modelName', label: 'VLT Model' },
  { key: 'imeiNumber', label: 'IMEI Number' },
  { key: 'iccid', label: 'ICCID' },
];

export default function VltDevicesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { vltDevices, status } = useSelector((state: RootState) => state.vltDevice);
  const { vltdModels } = useSelector((state: RootState) => state.vltdModel);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchVltDevices());
    }
    dispatch(fetchVltdModels());
  }, [dispatch, status]);

  // Map devices with model names
  const devicesWithModel: VltDeviceDisplay[] = vltDevices.map((device) => {
    let modelName = 'N/A';
    
    if (typeof device.vlt === 'string') {
      const model = vltdModels.find((m) => m._id === device.vlt);
      modelName = model?.modelName || 'N/A';
    } else if (device.vlt && typeof device.vlt === 'object') {
      modelName = device.vlt.modelName || 'N/A';
    }
    
    return {
      _id: device._id,
      modelName,
      imeiNumber: device.imeiNumber.toString(),
      iccid: device.iccid,
    };
  });

  const filteredDevices = devicesWithModel.filter((device) =>
    Object.values(device).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredDevices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDevices = filteredDevices.slice(startIndex, endIndex);

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
              <ExportButtons data={devicesWithModel} headers={headers} filename="vlt_devices" allData={devicesWithModel} />
            </div>
          </div>

          {/* Right Section - Search & Add Button */}
          <div className="flex items-center gap-4 flex-1 justify-end flex-wrap">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
              <input
                type="text"
                placeholder="Search VLT devices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
              />
            </div>

            {/* Add New Device Button */}
            <Link
              href="/dashboard/masters/vlt-devices/add"
              className="bg-[var(--primary-orange)] hover:bg-[var(--primary-orange-hover)] text-white px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap"
            >
              Add New VLT Device
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
                  VLT Model
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  IMEI Number
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  ICCID
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-light)]">
              {status === 'loading' ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-[var(--text-secondary)]">
                    Loading...
                  </td>
                </tr>
              ) : currentDevices.length > 0 ? (
                currentDevices.map((device) => (
                  <tr key={device._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                      {device.modelName}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                      {device.imeiNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                      {device.iccid}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Link
                        href={`/dashboard/masters/vlt-devices/${device._id}`}
                        className="text-[var(--primary-orange)] hover:text-[var(--primary-orange-hover)] transition-colors"
                      >
                        <Edit2 className="w-5 h-5" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-[var(--text-secondary)]">
                    No VLT devices found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-[var(--border-light)] flex items-center justify-between flex-wrap gap-4">
          <div className="text-sm text-[var(--text-secondary)]">
            Showing results {startIndex + 1} out of {filteredDevices.length}
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
