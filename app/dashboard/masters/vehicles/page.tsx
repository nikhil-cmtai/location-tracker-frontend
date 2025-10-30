'use client';

import { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Edit2 } from 'lucide-react';
import Link from 'next/link';
import ExportButtons from '@/components/dashboard/ExportButtons';

interface Vehicle {
  id: string;
  customerName: string;
  vehicleNumber: string;
  manufacturer: string;
  vehicle: string;
  model: string;
  ownerType: string;
  mfgYear: string;
  vltdNumber: string;
  status: 'Active' | 'Inactive';
}

// Headers for export
const headers: { key: keyof Vehicle; label: string }[] = [
  { key: 'customerName', label: 'Customer Name' },
  { key: 'vehicleNumber', label: 'Vehicle Number' },
  { key: 'manufacturer', label: 'Manufacturer' },
  { key: 'vehicle', label: 'Vehicle' },
  { key: 'model', label: 'Model' },
  { key: 'ownerType', label: 'Owner Type' },
  { key: 'mfgYear', label: 'MFG Year' },
  { key: 'vltdNumber', label: 'VLTD Number' },
  { key: 'status', label: 'Status' },
];

// Sample data
const vehiclesData: Vehicle[] = [
  {
    id: '1',
    customerName: 'C00001 Siddhartha Pathak',
    vehicleNumber: 'UP32HF0374',
    manufacturer: 'Maruti Suzuki',
    vehicle: 'Car',
    model: 'Swift',
    ownerType: 'Owned',
    mfgYear: '2020',
    vltdNumber: 'XXXXXX XXX',
    status: 'Active',
  },
  {
    id: '2',
    customerName: 'C00001 Siddhartha Pathak',
    vehicleNumber: 'UP32HF0374',
    manufacturer: 'Maruti Suzuki',
    vehicle: 'Car',
    model: 'Swift',
    ownerType: 'Owned',
    mfgYear: '2020',
    vltdNumber: 'XXXXXX XXX',
    status: 'Active',
  },
  {
    id: '3',
    customerName: 'C00001 Siddhartha Pathak',
    vehicleNumber: 'UP32HF0374',
    manufacturer: 'Maruti Suzuki',
    vehicle: 'Car',
    model: 'Swift',
    ownerType: 'Owned',
    mfgYear: '2020',
    vltdNumber: 'XXXXXX XXX',
    status: 'Active',
  },
];

export default function VehiclesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredVehicles = vehiclesData.filter((vehicle) =>
    Object.values(vehicle).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVehicles = filteredVehicles.slice(startIndex, endIndex);

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
              <ExportButtons data={vehiclesData} headers={headers} filename="vehicles" allData={vehiclesData} />
            </div>
          </div>

          {/* Right Section - Search & Add Button */}
          <div className="flex items-center gap-4 flex-1 justify-end flex-wrap">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
              <input
                type="text"
                placeholder="Search vehicles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
              />
            </div>

            {/* Add New Vehicle Button */}
            <Link
              href="/dashboard/masters/vehicles/add"
              className="bg-[var(--primary-orange)] hover:bg-[var(--primary-orange-hover)] text-white px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap"
            >
              Add New Vehicle
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
                  Customer Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Vehicle Number
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Manufacturer
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Vehicle
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Model
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Owner Type
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  MFG Year
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  VLTD Number
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-light)]">
              {currentVehicles.length > 0 ? (
                currentVehicles.map((vehicle, index) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)] font-medium">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                      {vehicle.customerName}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                      {vehicle.vehicleNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                      {vehicle.manufacturer}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                      {vehicle.vehicle}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                      {vehicle.model}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                      {vehicle.ownerType}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                      {vehicle.mfgYear}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                      {vehicle.vltdNumber}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          vehicle.status === 'Active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {vehicle.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Link
                        href={`/dashboard/masters/vehicles/${vehicle.id}`}
                        className="text-[var(--primary-orange)] hover:text-[var(--primary-orange-hover)] transition-colors"
                      >
                        <Edit2 className="w-5 h-5" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} className="px-6 py-8 text-center text-[var(--text-secondary)]">
                    No vehicles found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-[var(--border-light)] flex items-center justify-between flex-wrap gap-4">
          <div className="text-sm text-[var(--text-secondary)]">
            Showing results {startIndex + 1} out of {filteredVehicles.length}
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