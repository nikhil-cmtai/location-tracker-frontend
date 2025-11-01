'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchVehicleStatus } from '@/lib/redux/features/vehicleStatusSlice';
import { 
  Users, 
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Search
} from 'lucide-react';
import Link from 'next/link';
import ExportButtons from '@/components/dashboard/ExportButtons';

interface BusinessAccount {
  id: string;
  name: string;
  accountType: string;
  stats: {
    moving: number;
    stopped: number;
    idle: number;
    noNetwork: number;
    disconnected: number;
    total: number;
  };
  subGroups: {
    id: string;
    name: string;
    stats: {
      moving: number;
      stopped: number;
      idle: number;
      noNetwork: number;
      disconnected: number;
    };
    customers: {
      id: string;
      name: string;
      stats: {
        moving: number;
        stopped: number;
        idle: number;
        noNetwork: number;
        disconnected: number;
      };
    }[];
  }[];
}

// Mock data structure based on the images
const mockBusinessAccounts: BusinessAccount[] = [
  {
    id: '1',
    name: 'Veerendra Singh',
    accountType: 'Enterprise Account',
    stats: {
      moving: 3100,
      stopped: 2450,
      idle: 245,
      noNetwork: 35,
      disconnected: 45,
      total: 5875
    },
    subGroups: [
      {
        id: '1-1',
        name: 'Durga Spares',
        stats: {
          moving: 3100,
          stopped: 2450,
          idle: 245,
          noNetwork: 35,
          disconnected: 45
        },
        customers: [
          {
            id: '1-1-1',
            name: 'Central Academy, Indira Nagar',
            stats: {
              moving: 1400,
              stopped: 1174,
              idle: 200,
              noNetwork: 19,
              disconnected: 36
            }
          },
          {
            id: '1-1-2',
            name: 'Anoop Kumar Pathak',
            stats: {
              moving: 1698,
              stopped: 1275,
              idle: 44,
              noNetwork: 14,
              disconnected: 8
            }
          },
          {
            id: '1-1-3',
            name: 'Rajesh Kumar',
            stats: {
              moving: 2,
              stopped: 1,
              idle: 1,
              noNetwork: 2,
              disconnected: 1
            }
          }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Amit Kumar Singh',
    accountType: 'Premium Account',
    stats: {
      moving: 1200,
      stopped: 2700,
      idle: 1300,
      noNetwork: 130,
      disconnected: 15,
      total: 5345
    },
    subGroups: []
  },
  {
    id: '3',
    name: 'Chandrashekhar Yadav',
    accountType: 'Standard Account',
    stats: {
      moving: 2500,
      stopped: 1900,
      idle: 155,
      noNetwork: 95,
      disconnected: 20,
      total: 4670
    },
    subGroups: []
  }
];

// Headers for export - flattened structure for table export
interface FlattenedTableRow {
  'Business Account': string;
  'Account Type': string;
  'Sub-group': string;
  'Customer': string;
  'Moving': number;
  'Stopped': number;
  'Idle': number;
  'No Network': number;
  'Disconnected': number;
  'Total': number;
}

const headers: { key: keyof FlattenedTableRow; label: string }[] = [
  { key: 'Business Account', label: 'Business Account' },
  { key: 'Account Type', label: 'Account Type' },
  { key: 'Sub-group', label: 'Sub-group' },
  { key: 'Customer', label: 'Customer' },
  { key: 'Moving', label: 'Moving' },
  { key: 'Stopped', label: 'Stopped' },
  { key: 'Idle', label: 'Idle' },
  { key: 'No Network', label: 'No Network' },
  { key: 'Disconnected', label: 'Disconnected' },
  { key: 'Total', label: 'Total' },
];

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { vehicleStatuses } = useSelector((state: RootState) => state.vehicleStatus);

  // State for expanded rows
  const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(new Set());
  const [expandedSubGroups, setExpandedSubGroups] = useState<Set<string>>(new Set());
  const [expandedCustomers, setExpandedCustomers] = useState<Set<string>>(new Set());
  const [loadedVehicles, setLoadedVehicles] = useState<{ [key: string]: any[] }>({});

  // Table states
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch vehicle statuses on mount
  useEffect(() => {
    dispatch(fetchVehicleStatus({}));
  }, [dispatch]);

  const toggleAccount = (accountId: string) => {
    const newExpanded = new Set(expandedAccounts);
    if (newExpanded.has(accountId)) {
      newExpanded.delete(accountId);
      // Also collapse all sub-groups and customers when collapsing account
      const subGroups = mockBusinessAccounts.find(a => a.id === accountId)?.subGroups || [];
      subGroups.forEach(sg => {
        setExpandedSubGroups(prev => {
          const newSet = new Set(prev);
          newSet.delete(sg.id);
          return newSet;
        });
        sg.customers.forEach(c => {
          setExpandedCustomers(prev => {
            const newSet = new Set(prev);
            newSet.delete(c.id);
            return newSet;
          });
        });
      });
    } else {
      newExpanded.add(accountId);
    }
    setExpandedAccounts(newExpanded);
  };

  const toggleSubGroup = (subGroupId: string) => {
    const newExpanded = new Set(expandedSubGroups);
    if (newExpanded.has(subGroupId)) {
      newExpanded.delete(subGroupId);
      // Also collapse all customers when collapsing sub-group
      const subGroup = mockBusinessAccounts
        .flatMap(a => a.subGroups)
        .find(sg => sg.id === subGroupId);
      if (subGroup) {
        subGroup.customers.forEach(c => {
          setExpandedCustomers(prev => {
            const newSet = new Set(prev);
            newSet.delete(c.id);
            return newSet;
          });
        });
      }
    } else {
      newExpanded.add(subGroupId);
    }
    setExpandedSubGroups(newExpanded);
  };

  const toggleCustomer = async (customerId: string, customerName: string) => {
    const newExpanded = new Set(expandedCustomers);
    if (newExpanded.has(customerId)) {
      newExpanded.delete(customerId);
    } else {
      newExpanded.add(customerId);
      // Fetch vehicles for this customer if not already loaded
      if (!loadedVehicles[customerId]) {
        // Filter vehicles based on customer name (mock implementation)
        // In real implementation, you would fetch from API
        const vehicles = Object.values(vehicleStatuses).filter((v: any) => 
          v.vehicleNumber?.includes(customerName.substring(0, 3)) || Math.random() > 0.7
        ).slice(0, 5); // Limit to 5 vehicles for demo
        
        setLoadedVehicles(prev => ({
          ...prev,
          [customerId]: vehicles.length > 0 ? vehicles : [
            {
              vehicleNumber: 'UP14FT2583',
              status: 'Running',
              batteryStatus: 'Connected',
              speed: '75 km/h',
              lastLocation: 'Mahatma Gandhi Road, Lucknow, Uttar Pradesh, India',
              lastUpdate: '08-11-2024 17:53:25'
            },
            {
              vehicleNumber: 'UP14FT3799',
              status: 'Running',
              batteryStatus: 'Connected',
              speed: '42 km/h',
              lastLocation: 'Mahatma Gandhi Road, Lucknow, Uttar Pradesh, India',
              lastUpdate: '08-11-2024 17:53:25'
            },
            {
              vehicleNumber: 'UP14FT3802',
              status: 'Stopped',
              batteryStatus: 'Connected',
              speed: '0 km/h',
              lastLocation: 'Alambagh, Lucknow, Uttar Pradesh, India',
              lastUpdate: '08-11-2024 17:53:25'
            }
          ]
        }));
      }
    }
    setExpandedCustomers(newExpanded);
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'running' || statusLower === 'moving') {
      return 'bg-green-100 text-green-700';
    } else if (statusLower === 'stopped') {
      return 'bg-orange-100 text-orange-700';
    } else if (statusLower === 'idle') {
      return 'bg-yellow-100 text-yellow-700';
    } else if (statusLower === 'offline' || statusLower === 'no network') {
      return 'bg-gray-100 text-gray-700';
    } else if (statusLower === 'disconnected') {
      return 'bg-red-100 text-red-700';
    }
    return 'bg-gray-100 text-gray-700';
  };

  // Filter business accounts based on search
  const filteredAccounts = mockBusinessAccounts.filter((account) =>
    account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    account.accountType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    account.subGroups.some((sg) =>
      sg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sg.customers.some((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAccounts = filteredAccounts.slice(startIndex, endIndex);

  // Prepare data for export
  const getExportData = (): FlattenedTableRow[] => {
    const exportData: FlattenedTableRow[] = [];
    filteredAccounts.forEach((account) => {
      // Add business account row
      exportData.push({
        'Business Account': account.name,
        'Account Type': account.accountType,
        'Sub-group': '',
        'Customer': '',
        'Moving': account.stats.moving,
        'Stopped': account.stats.stopped,
        'Idle': account.stats.idle,
        'No Network': account.stats.noNetwork,
        'Disconnected': account.stats.disconnected,
        'Total': account.stats.total,
      });

      // Add sub-groups and customers
      account.subGroups.forEach((subGroup) => {
        exportData.push({
          'Business Account': account.name,
          'Account Type': account.accountType,
          'Sub-group': subGroup.name,
          'Customer': '',
          'Moving': subGroup.stats.moving,
          'Stopped': subGroup.stats.stopped,
          'Idle': subGroup.stats.idle,
          'No Network': subGroup.stats.noNetwork,
          'Disconnected': subGroup.stats.disconnected,
          'Total': subGroup.stats.moving + subGroup.stats.stopped + subGroup.stats.idle + subGroup.stats.noNetwork + subGroup.stats.disconnected,
        });

        subGroup.customers.forEach((customer) => {
          exportData.push({
            'Business Account': account.name,
            'Account Type': account.accountType,
            'Sub-group': subGroup.name,
            'Customer': customer.name,
            'Moving': customer.stats.moving,
            'Stopped': customer.stats.stopped,
            'Idle': customer.stats.idle,
            'No Network': customer.stats.noNetwork,
            'Disconnected': customer.stats.disconnected,
            'Total': customer.stats.moving + customer.stats.stopped + customer.stats.idle + customer.stats.noNetwork + customer.stats.disconnected,
          });
        });
      });
    });
    return exportData;
  };

  return (
    <div className="p-6 bg-[var(--content-bg)] min-h-screen">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm border border-[var(--border-light)] mb-6">
        <div className="p-4 flex items-center justify-between gap-4 flex-wrap">
          {/* Left Section - Shows & Export Buttons */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--text-secondary)]">Shows</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
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
              <ExportButtons data={getExportData()} headers={headers} filename="fleet-overview" allData={getExportData()} />
            </div>
          </div>

          {/* Right Section - Search */}
          <div className="flex items-center gap-4 flex-1 justify-end flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
              <input
                type="text"
                placeholder="Search accounts..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Fleet Overview Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[var(--border-light)] overflow-hidden">
        <div className="p-6 border-b border-[var(--border-light)] flex items-center justify-between">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Fleet Overview by Business Account</h2>
          <Link 
            href="/dashboard/reports/current-status" 
            className="text-[var(--primary-orange)] hover:text-[var(--primary-orange-hover)] flex items-center text-sm font-semibold"
          >
            View All
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--navy-dark)] text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Business Account</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Moving</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Stopped</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Idle</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">No Network</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Disconnected</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-light)]">
              {currentAccounts.map((account) => (
                <React.Fragment key={account.id}>
                  {/* Business Account Row */}
                  <tr 
                    className={`${expandedAccounts.has(account.id) ? 'bg-gray-100' : 'hover:bg-gray-50'} transition-colors cursor-pointer`}
                    onClick={() => toggleAccount(account.id)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="mr-3">
                          {expandedAccounts.has(account.id) ? (
                            <ChevronUp className="w-5 h-5 text-[var(--primary-orange)]" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-[var(--primary-orange)]" />
                          )}
                        </div>
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-[var(--text-primary)]">{account.name}</div>
                          <div className="text-xs text-[var(--text-secondary)]">{account.accountType}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                        {account.stats.moving.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold bg-orange-100 text-orange-700">
                        {account.stats.stopped.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-700">
                        {account.stats.idle.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-700">
                        {account.stats.noNetwork.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700">
                        {account.stats.disconnected.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-bold text-[var(--text-primary)]">{account.stats.total.toLocaleString()}</span>
                    </td>
                  </tr>

                  {/* Sub-Groups and Customers when expanded */}
                  {expandedAccounts.has(account.id) && account.subGroups.map((subGroup) => (
                    <React.Fragment key={subGroup.id}>
                      {/* Sub-Group Summary Row */}
                      {expandedSubGroups.has(subGroup.id) && (
                        <tr className="bg-gray-50">
                          <td colSpan={7} className="px-6 py-3">
                            <div className="pl-8 text-sm font-semibold text-[var(--text-primary)]">
                              {subGroup.name}
                            </div>
                          </td>
                        </tr>
                      )}

                      {/* Sub-Group Row */}
                      <tr 
                        className={`${expandedSubGroups.has(subGroup.id) ? 'bg-gray-50' : 'bg-gray-100'} transition-colors cursor-pointer`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSubGroup(subGroup.id);
                        }}
                      >
                        <td className="px-6 py-3">
                          <div className="flex items-center pl-8">
                            <div className="mr-3">
                              {expandedSubGroups.has(subGroup.id) ? (
                                <ChevronUp className="w-4 h-4 text-[var(--primary-orange)]" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-[var(--primary-orange)]" />
                              )}
                            </div>
                            <div className="text-sm font-medium text-[var(--text-primary)]">Sub-group</div>
                            <div className="ml-3 text-sm text-[var(--text-primary)] font-semibold">{subGroup.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-center">
                          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                            {subGroup.stats.moving.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-center">
                          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold bg-orange-100 text-orange-700">
                            {subGroup.stats.stopped.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-center">
                          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-700">
                            {subGroup.stats.idle.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-center">
                          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-700">
                            {subGroup.stats.noNetwork.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-center">
                          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700">
                            {subGroup.stats.disconnected.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-center">
                          <span className="text-sm font-semibold text-[var(--text-primary)]">
                            {(subGroup.stats.moving + subGroup.stats.stopped + subGroup.stats.idle + subGroup.stats.noNetwork + subGroup.stats.disconnected).toLocaleString()}
                          </span>
                        </td>
                      </tr>

                      {/* Customer Header Row when Sub-Group is expanded */}
                      {expandedSubGroups.has(subGroup.id) && (
                        <tr className="bg-[var(--navy-dark)] text-white">
                          <th className="px-6 py-3 text-left text-sm font-semibold pl-16">Customer</th>
                          <th className="px-6 py-3 text-center text-sm font-semibold">Moving</th>
                          <th className="px-6 py-3 text-center text-sm font-semibold">Stopped</th>
                          <th className="px-6 py-3 text-center text-sm font-semibold">Idle</th>
                          <th className="px-6 py-3 text-center text-sm font-semibold">No Network</th>
                          <th className="px-6 py-3 text-center text-sm font-semibold">Disconnected</th>
                          <th className="px-6 py-3 text-center text-sm font-semibold"></th>
                        </tr>
                      )}

                      {/* Customer Rows */}
                      {expandedSubGroups.has(subGroup.id) && subGroup.customers.map((customer) => (
                        <React.Fragment key={customer.id}>
                          <tr 
                            className="bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCustomer(customer.id, customer.name);
                            }}
                          >
                            <td className="px-6 py-3">
                              <div className="flex items-center pl-16">
                                <div className="mr-3">
                                  {expandedCustomers.has(customer.id) ? (
                                    <ChevronUp className="w-4 h-4 text-[var(--primary-orange)]" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4 text-[var(--primary-orange)]" />
                                  )}
                                </div>
                                <div className="text-sm font-medium text-[var(--text-primary)]">{customer.name}</div>
                              </div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                                {customer.stats.moving.toLocaleString()}
                              </span>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold bg-orange-100 text-orange-700">
                                {customer.stats.stopped.toLocaleString()}
                              </span>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-700">
                                {customer.stats.idle.toLocaleString()}
                              </span>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-700">
                                {customer.stats.noNetwork.toLocaleString()}
                              </span>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700">
                                {customer.stats.disconnected.toLocaleString()}
                              </span>
                            </td>
                            <td className="px-6 py-3 text-center"></td>
                          </tr>

                          {/* Vehicles Row when Customer is expanded */}
                          {expandedCustomers.has(customer.id) && loadedVehicles[customer.id] && (
                            <tr className="bg-white">
                              <td colSpan={7} className="px-6 py-4">
                                <div className="pl-20">
                                  <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="text-sm font-semibold text-[var(--text-primary)] mb-3">
                                      Vehicles ({loadedVehicles[customer.id].length})
                                    </div>
                                    <table className="w-full">
                                      <thead className="bg-[var(--navy-dark)] text-white">
                                        <tr>
                                          <th className="px-4 py-2 text-left text-xs font-semibold">Vehicle No.</th>
                                          <th className="px-4 py-2 text-center text-xs font-semibold">Vehicle Status</th>
                                          <th className="px-4 py-2 text-center text-xs font-semibold">Battery Status</th>
                                          <th className="px-4 py-2 text-center text-xs font-semibold">Speed (KM/H)</th>
                                          <th className="px-4 py-2 text-left text-xs font-semibold">Location</th>
                                          <th className="px-4 py-2 text-left text-xs font-semibold">Last Update</th>
                                          <th className="px-4 py-2 text-center text-xs font-semibold">Map View</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-gray-200">
                                        {loadedVehicles[customer.id].map((vehicle: any, idx: number) => (
                                          <tr key={idx} className="hover:bg-gray-100">
                                            <td className="px-4 py-2 text-sm text-[var(--text-primary)] font-medium">
                                              {vehicle.vehicleNumber || vehicle.vehicle_reg_no || `VEH-${idx + 1}`}
                                            </td>
                                            <td className="px-4 py-2 text-center">
                                              <span className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(vehicle.status || vehicle.speed || 'Stopped')}`}>
                                                {vehicle.status || (vehicle.speed && parseFloat(vehicle.speed) > 0 ? 'Moving' : 'Stopped')}
                                              </span>
                                            </td>
                                            <td className="px-4 py-2 text-center">
                                              <span className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-semibold ${vehicle.batteryStatus === 'Connected' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {vehicle.batteryStatus || 'Unknown'}
                                              </span>
                                            </td>
                                            <td className="px-4 py-2 text-center text-sm text-[var(--text-primary)]">
                                              {vehicle.speed || '0'}
                                            </td>
                                            <td className="px-4 py-2 text-sm text-[var(--text-primary)]">
                                              {vehicle.lastLocation || vehicle.location || 'N/A'}
                                            </td>
                                            <td className="px-4 py-2 text-sm text-[var(--text-primary)]">
                                              {vehicle.lastUpdate || 'N/A'}
                                            </td>
                                            <td className="px-4 py-2 text-center">
                                              <Link 
                                                href={`/dashboard/features/live-tracking?vehicle=${vehicle.vehicleNumber || vehicle.vehicle_reg_no}`}
                                                className="text-[var(--primary-orange)] hover:text-[var(--primary-orange-hover)] text-xs font-semibold"
                                              >
                                                Live
                                              </Link>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-[var(--border-light)] flex items-center justify-between bg-gray-50">
          <div className="text-sm text-[var(--text-secondary)]">
            Showing <span className="font-semibold text-[var(--text-primary)]">{startIndex + 1}</span> to{' '}
            <span className="font-semibold text-[var(--text-primary)]">{Math.min(endIndex, filteredAccounts.length)}</span> out of{' '}
            <span className="font-semibold text-[var(--text-primary)]">{filteredAccounts.length}</span> accounts
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-[var(--border-light)] bg-white rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-[var(--primary-orange)] text-white rounded-lg font-semibold text-sm">
              {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-[var(--border-light)] bg-white rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}