'use client';

import { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Edit2 } from 'lucide-react';
import Link from 'next/link';
import ExportButtons from '@/components/dashboard/ExportButtons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { fetchVehicleModels } from '@/lib/redux/features/vehicleModelSlice';
import { fetchVehicleMakes } from '@/lib/redux/features/vehicleManufacturer';
import { fetchVehicleTypes } from '@/lib/redux/features/vehicleTypeSlice';

interface VehicleModelDisplay {
  _id: string;
  manufacturerName: string;
  vehicleTypeName: string;
  modelName: string;
}

// Headers for export
const headers: { key: keyof VehicleModelDisplay; label: string }[] = [
  { key: 'manufacturerName', label: 'Manufacturer' },
  { key: 'vehicleTypeName', label: 'Vehicle Type' },
  { key: 'modelName', label: 'Model Name' },
];

export default function VehicleModelPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { vehicleModels, status } = useSelector((state: RootState) => state.vehicleModel);
  const { vehicleMakes } = useSelector((state: RootState) => state.vehicleManufacturer);
  const { vehicleTypes } = useSelector((state: RootState) => state.vehicleType);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchVehicleModels());
    }
    dispatch(fetchVehicleMakes());
    dispatch(fetchVehicleTypes());
  }, [dispatch, status]);

  // Map models with manufacturer and type names
  const modelsWithDetails: VehicleModelDisplay[] = vehicleModels.map((model) => {
    let manufacturerName = 'N/A';
    let vehicleTypeName = 'N/A';
    
    // Handle manufacturer
    if (typeof model.make === 'string') {
      const manufacturer = vehicleMakes.find((m) => m._id === model.make);
      manufacturerName = manufacturer?.make || 'N/A';
    } else if (model.make && typeof model.make === 'object') {
      manufacturerName = model.make.make || 'N/A';
    }
    
    // Handle vehicle type
    if (typeof model.vehicleType === 'string') {
      const type = vehicleTypes.find((t) => t._id === model.vehicleType);
      vehicleTypeName = type?.vehicleType || 'N/A';
    } else if (model.vehicleType && typeof model.vehicleType === 'object') {
      vehicleTypeName = model.vehicleType.vehicleType || 'N/A';
    }
    
    return {
      _id: model._id || '',
      manufacturerName,
      vehicleTypeName,
      modelName: model.vehicleModel,
    };
  });

  const filteredModels = modelsWithDetails.filter((model) =>
    Object.values(model).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredModels.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentModels = filteredModels.slice(startIndex, endIndex);

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
              <ExportButtons data={modelsWithDetails} headers={headers} filename="vehicle_models" allData={modelsWithDetails} />
            </div>
          </div>

          {/* Right Section - Search & Add Button */}
          <div className="flex items-center gap-4 flex-1 justify-end flex-wrap">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
              <input
                type="text"
                placeholder="Search vehicle models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
              />
            </div>

            {/* Add New Model Button */}
            <Link
              href="/dashboard/otc/vehicle-model/add"
              className="bg-[var(--primary-orange)] hover:bg-[var(--primary-orange-hover)] text-white px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap"
            >
              Add New Vehicle Model
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
                  Manufacturer
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Vehicle Type
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Model Name
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
              ) : currentModels.length > 0 ? (
                currentModels.map((model, index) => (
                  <tr key={model._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)] font-medium">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                      {model.manufacturerName}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                      {model.vehicleTypeName}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                      {model.modelName}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Link
                        href={`/dashboard/otc/vehicle-model/${model._id}`}
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
                    No vehicle models found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-[var(--border-light)] flex items-center justify-between flex-wrap gap-4">
          <div className="text-sm text-[var(--text-secondary)]">
            Showing results {startIndex + 1} out of {filteredModels.length}
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

