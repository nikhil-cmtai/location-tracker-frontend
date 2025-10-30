'use client';

import { 
  Users, 
  Car, 
  Activity, 
  AlertCircle, 
  TrendingUp, 
  MapPin,
  Navigation,
  PauseCircle,
  WifiOff,
  Power,
  Shield,
  Clock,
  BarChart3,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="p-6 bg-[var(--content-bg)] min-h-screen">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
          Welcome to Vehicle Tracking Dashboard
        </h1>
        <p className="text-[var(--text-secondary)]">
          Monitor and manage your fleet in real-time
        </p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Total Vehicles */}
        <div className="dashboard-card bg-gradient-to-br from-blue-500 to-blue-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Car className="w-8 h-8 text-white" />
            </div>
            <span className="text-sm font-medium text-white/80">Total Vehicles</span>
          </div>
          <div className="text-4xl font-bold text-white mb-2">5,345</div>
          <div className="flex items-center text-white/90 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>↑ 12% from last month</span>
          </div>
        </div>

        {/* Moving Vehicles */}
        <div className="dashboard-card bg-gradient-to-br from-green-500 to-green-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Navigation className="w-8 h-8 text-white" />
            </div>
            <span className="text-sm font-medium text-white/80">Moving</span>
          </div>
          <div className="text-4xl font-bold text-white mb-2">4,800</div>
          <div className="flex items-center text-white/90 text-sm">
            <Activity className="w-4 h-4 mr-1" />
            <span>89.8% Active</span>
          </div>
        </div>

        {/* Stopped Vehicles */}
        <div className="dashboard-card bg-gradient-to-br from-orange-500 to-orange-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <PauseCircle className="w-8 h-8 text-white" />
            </div>
            <span className="text-sm font-medium text-white/80">Stopped</span>
          </div>
          <div className="text-4xl font-bold text-white mb-2">5,350</div>
          <div className="flex items-center text-white/90 text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            <span>Multiple Locations</span>
          </div>
        </div>

        {/* Alerts */}
        <div className="dashboard-card bg-gradient-to-br from-red-500 to-red-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <span className="text-sm font-medium text-white/80">Alerts</span>
          </div>
          <div className="text-4xl font-bold text-white mb-2">180</div>
          <div className="flex items-center text-white/90 text-sm">
            <Clock className="w-4 h-4 mr-1" />
            <span>Requires Attention</span>
          </div>
        </div>
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {/* Idle Vehicles */}
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[var(--text-secondary)] text-sm mb-1">Idle Vehicles</div>
              <div className="text-2xl font-bold text-[var(--text-primary)]">1,545</div>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* No Network */}
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[var(--text-secondary)] text-sm mb-1">No Network</div>
              <div className="text-2xl font-bold text-[var(--text-primary)]">165</div>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <WifiOff className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>

        {/* Disconnected */}
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[var(--text-secondary)] text-sm mb-1">Disconnected</div>
              <div className="text-2xl font-bold text-[var(--text-primary)]">65</div>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <Power className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        {/* Active Users */}
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[var(--text-secondary)] text-sm mb-1">Active Users</div>
              <div className="text-2xl font-bold text-[var(--text-primary)]">892</div>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions and System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-[var(--border-light)] p-6">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-[var(--primary-orange)]" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Link 
              href="/dashboard/features/live-tracking"
              className="quick-action-btn"
            >
              <MapPin className="w-8 h-8 mb-3 text-[var(--primary-orange)]" />
              <span className="font-semibold">Live Tracking</span>
            </Link>
            
            <Link 
              href="/dashboard/features/history-replay"
              className="quick-action-btn"
            >
              <Activity className="w-8 h-8 mb-3 text-[var(--primary-orange)]" />
              <span className="font-semibold">History Replay</span>
            </Link>
            
            <Link 
              href="/dashboard/masters/vehicles"
              className="quick-action-btn"
            >
              <Car className="w-8 h-8 mb-3 text-[var(--primary-orange)]" />
              <span className="font-semibold">Vehicles</span>
            </Link>
            
            <Link 
              href="/dashboard/reports/journey-history"
              className="quick-action-btn"
            >
              <BarChart3 className="w-8 h-8 mb-3 text-[var(--primary-orange)]" />
              <span className="font-semibold">Reports</span>
            </Link>
            
            <Link 
              href="/dashboard/masters/geo-fences"
              className="quick-action-btn"
            >
              <Shield className="w-8 h-8 mb-3 text-[var(--primary-orange)]" />
              <span className="font-semibold">Geo Fences</span>
            </Link>
            
            <Link 
              href="/dashboard/features/events"
              className="quick-action-btn"
            >
              <AlertCircle className="w-8 h-8 mb-3 text-[var(--primary-orange)]" />
              <span className="font-semibold">Events</span>
            </Link>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl shadow-sm border border-[var(--border-light)] p-6">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">System Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--text-secondary)]">Server Status</span>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                <span className="text-sm font-semibold text-green-600">Online</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--text-secondary)]">GPS Accuracy</span>
              <span className="text-sm font-semibold text-[var(--text-primary)]">98.5%</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--text-secondary)]">Data Updates</span>
              <span className="text-sm font-semibold text-[var(--text-primary)]">Real-time</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--text-secondary)]">API Response</span>
              <span className="text-sm font-semibold text-green-600">145ms</span>
            </div>

            <div className="pt-4 border-t border-[var(--border-light)]">
              <div className="text-sm text-[var(--text-secondary)] mb-2">Storage Usage</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-[var(--primary-orange)] h-2 rounded-full" style={{ width: '68%' }}></div>
              </div>
              <div className="text-xs text-[var(--text-secondary)] mt-1">68% Used (6.8GB of 10GB)</div>
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
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--text-primary)]">Amit Kumar Singh</div>
                      <div className="text-xs text-[var(--text-secondary)]">Premium Account</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                    1,200
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold bg-orange-100 text-orange-700">
                    2,700
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-700">
                    1,300
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-700">
                    130
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700">
                    15
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm font-bold text-[var(--text-primary)]">5,345</span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--text-primary)]">Veerendra Singh</div>
                      <div className="text-xs text-[var(--text-secondary)]">Enterprise Account</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                    3,100
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold bg-orange-100 text-orange-700">
                    2,450
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-700">
                    245
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-700">
                    35
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700">
                    45
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm font-bold text-[var(--text-primary)]">5,875</span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                      <Users className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--text-primary)]">Chandrashekhar Yadav</div>
                      <div className="text-xs text-[var(--text-secondary)]">Standard Account</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                    2,500
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold bg-orange-100 text-orange-700">
                    1,900
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-700">
                    155
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-700">
                    95
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700">
                    20
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm font-bold text-[var(--text-primary)]">4,670</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-[var(--border-light)] flex items-center justify-between bg-gray-50">
          <div className="text-sm text-[var(--text-secondary)]">
            Showing <span className="font-semibold text-[var(--text-primary)]">3</span> out of <span className="font-semibold text-[var(--text-primary)]">3</span> accounts
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 border border-[var(--border-light)] bg-white rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed" disabled>
              Previous
            </button>
            <span className="px-4 py-2 bg-[var(--primary-orange)] text-white rounded-lg font-semibold text-sm">
              1
            </span>
            <button className="px-4 py-2 border border-[var(--border-light)] bg-white rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed" disabled>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}