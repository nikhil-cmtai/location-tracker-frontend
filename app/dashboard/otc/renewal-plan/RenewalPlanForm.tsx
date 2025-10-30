  'use client';

  import { useState, useEffect } from 'react';
  import { useRouter } from 'next/navigation';
  import { useDispatch, useSelector } from 'react-redux';
  import { AppDispatch, RootState } from '@/lib/redux/store';
  import { addNewRenewalPlan, updateRenewalPlan } from '@/lib/redux/features/renewalSlice';
  import { fetchVltdManufacturers } from '@/lib/redux/features/vltdManufacturerSlice';
  import { fetchVltdModels } from '@/lib/redux/features/vltdModelSlice';

  interface RenewalPlanFormProps {
    initialData?: {
      _id?: string;
      planName: string;
      vltdManufacturer: string;
      vltdModel: string;
      tariff: number;
      gst: number;
      total: number;
      validityDays: number;
      gracePeriodDays: number;
      deactivationPeriodDays: number;
      status: 'active' | 'inactive';
    };
    isEdit?: boolean;
  }

  export default function RenewalPlanForm({ initialData, isEdit = false }: RenewalPlanFormProps) {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { vltdManufacturers } = useSelector((state: RootState) => state.vltdManufacturer);
    const { vltdModels } = useSelector((state: RootState) => state.vltdModel);

    const [formData, setFormData] = useState({
      planName: initialData?.planName || '',
      vltdManufacturer: initialData?.vltdManufacturer || '',
      vltdModel: initialData?.vltdModel || '',
      tariff: initialData?.tariff || 0,
      gst: initialData?.gst || 0,
      total: initialData?.total || 0,
      validityDays: initialData?.validityDays || 0,
      gracePeriodDays: initialData?.gracePeriodDays || 0,
      deactivationPeriodDays: initialData?.deactivationPeriodDays || 0,
      status: initialData?.status || 'active' as 'active' | 'inactive',
    });

    useEffect(() => {
      dispatch(fetchVltdManufacturers());
      dispatch(fetchVltdModels());
    }, [dispatch]);

    // Calculate total when tariff or GST changes
    useEffect(() => {
      const calculatedTotal = formData.tariff + (formData.tariff * formData.gst / 100);
      setFormData(prev => ({ ...prev, total: Math.round(calculatedTotal * 100) / 100 }));
    }, [formData.tariff, formData.gst]);

    // Filter models based on selected manufacturer
    const filteredModels = formData.vltdManufacturer
      ? vltdModels.filter((model) => model.manufacturerId === formData.vltdManufacturer)
      : vltdModels;

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (isEdit && initialData?._id) {
        await dispatch(updateRenewalPlan({ id: initialData._id, ...formData }));
      } else {
        await dispatch(addNewRenewalPlan(formData));
      }

      router.push('/dashboard/otc/renewal-plan');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: ['tariff', 'gst', 'validityDays', 'gracePeriodDays', 'deactivationPeriodDays'].includes(name)
          ? Number(value)
          : value,
      }));
    };

    return (
      <div className="p-6 bg-[var(--content-bg)]">
        <div className="bg-white rounded-lg shadow-sm border border-[var(--border-light)] p-6">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
            {isEdit ? 'Edit Renewal Plan' : 'Add New Renewal Plan'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Plan Name */}
              <div>
                <label htmlFor="planName" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Plan Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="planName"
                  name="planName"
                  value={formData.planName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
                  placeholder="Enter plan name"
                />
              </div>

              {/* VLTD Manufacturer */}
              <div>
                <label htmlFor="vltdManufacturer" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  VLTD Manufacturer <span className="text-red-500">*</span>
                </label>
                <select
                  id="vltdManufacturer"
                  name="vltdManufacturer"
                  value={formData.vltdManufacturer}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
                >
                  <option value="">Select Manufacturer</option>
                  {vltdManufacturers.map((manufacturer) => (
                    <option key={manufacturer._id} value={manufacturer._id}>
                      {manufacturer.manufacturerName}
                    </option>
                  ))}
                </select>
              </div>

              {/* VLTD Model */}
              <div>
                <label htmlFor="vltdModel" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  VLTD Model <span className="text-red-500">*</span>
                </label>
                <select
                  id="vltdModel"
                  name="vltdModel"
                  value={formData.vltdModel}
                  onChange={handleChange}
                  required
                  disabled={!formData.vltdManufacturer}
                  className="w-full px-4 py-2 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)] disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select Model</option>
                  {filteredModels.map((model) => (
                    <option key={model.manufacturerId as string} value={model.manufacturerId as string}>
                      {model.modelName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tariff */}
              <div>
                <label htmlFor="tariff" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Tariff (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="tariff"
                  name="tariff"
                  value={formData.tariff}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
                  placeholder="Enter tariff amount"
                />
              </div>

              {/* GST (%) */}
              <div>
                <label htmlFor="gst" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  GST (%) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="gst"
                  name="gst"
                  value={formData.gst}
                  onChange={handleChange}
                  required
                  min="0"
                  max="100"
                  step="0.01"
                  className="w-full px-4 py-2 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
                  placeholder="Enter GST percentage"
                />
              </div>

              {/* Total (Auto-calculated) */}
              <div>
                <label htmlFor="total" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Total Amount (₹)
                </label>
                <input
                  type="number"
                  id="total"
                  name="total"
                  value={formData.total}
                  readOnly
                  className="w-full px-4 py-2 border border-[var(--border-light)] rounded-lg bg-gray-100 cursor-not-allowed"
                  placeholder="Auto-calculated"
                />
              </div>

              {/* Validity Days */}
              <div>
                <label htmlFor="validityDays" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Validity (Days) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="validityDays"
                  name="validityDays"
                  value={formData.validityDays}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-2 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
                  placeholder="Enter validity in days"
                />
              </div>

              {/* Grace Period Days */}
              <div>
                <label htmlFor="gracePeriodDays" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Grace Period (Days) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="gracePeriodDays"
                  name="gracePeriodDays"
                  value={formData.gracePeriodDays}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
                  placeholder="Enter grace period in days"
                />
              </div>

              {/* Deactivation Period Days */}
              <div>
                <label htmlFor="deactivationPeriodDays" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Deactivation Period (Days) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="deactivationPeriodDays"
                  name="deactivationPeriodDays"
                  value={formData.deactivationPeriodDays}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
                  placeholder="Enter deactivation period in days"
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
                {isEdit ? 'Update Plan' : 'Add Plan'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/dashboard/otc/renewal-plan')}
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

