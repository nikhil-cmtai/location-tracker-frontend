export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
        Overview Dashboard
      </h1>
      
      {/* Placeholder Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Stats Cards */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-[var(--border-light)]">
          <div className="text-sm text-[var(--text-secondary)] mb-2">Total Users</div>
          <div className="text-3xl font-bold text-[var(--text-primary)]">1,234</div>
          <div className="text-xs text-green-600 mt-2">↑ 12% from last month</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-[var(--border-light)]">
          <div className="text-sm text-[var(--text-secondary)] mb-2">Active Sessions</div>
          <div className="text-3xl font-bold text-[var(--text-primary)]">567</div>
          <div className="text-xs text-green-600 mt-2">↑ 8% from last month</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-[var(--border-light)]">
          <div className="text-sm text-[var(--text-secondary)] mb-2">Revenue</div>
          <div className="text-3xl font-bold text-[var(--text-primary)]">$45.2K</div>
          <div className="text-xs text-red-600 mt-2">↓ 3% from last month</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-[var(--border-light)]">
          <div className="text-sm text-[var(--text-secondary)] mb-2">Conversion Rate</div>
          <div className="text-3xl font-bold text-[var(--text-primary)]">3.24%</div>
          <div className="text-xs text-green-600 mt-2">↑ 1.2% from last month</div>
        </div>
      </div>
      
      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm border border-[var(--border-light)] overflow-hidden">
        <div className="p-6 border-b border-[var(--border-light)]">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Recent Activity</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--navy-dark)] text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Business Account</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Moving Vehicles</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Stopped Vehicles</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Idle Vehicles</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">No Network</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Disconnected</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-light)]">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-[var(--text-primary)]">Amit Kumar Singh</td>
                <td className="px-6 py-4 text-sm text-[var(--text-primary)]">1200</td>
                <td className="px-6 py-4 text-sm text-[var(--text-primary)]">2700</td>
                <td className="px-6 py-4 text-sm text-[var(--text-primary)]">1300</td>
                <td className="px-6 py-4 text-sm text-[var(--text-primary)]">130</td>
                <td className="px-6 py-4 text-sm text-[var(--text-primary)]">15</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-[var(--text-primary)]">Veerendra Singh</td>
                <td className="px-6 py-4 text-sm text-[var(--text-primary)]">3100</td>
                <td className="px-6 py-4 text-sm text-[var(--text-primary)]">2450</td>
                <td className="px-6 py-4 text-sm text-[var(--text-primary)]">245</td>
                <td className="px-6 py-4 text-sm text-[var(--text-primary)]">35</td>
                <td className="px-6 py-4 text-sm text-[var(--text-primary)]">45</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-[var(--text-primary)]">Chandrashekhar Yadav</td>
                <td className="px-6 py-4 text-sm text-[var(--text-primary)]">2500</td>
                <td className="px-6 py-4 text-sm text-[var(--text-primary)]">1900</td>
                <td className="px-6 py-4 text-sm text-[var(--text-primary)]">155</td>
                <td className="px-6 py-4 text-sm text-[var(--text-primary)]">95</td>
                <td className="px-6 py-4 text-sm text-[var(--text-primary)]">20</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-[var(--border-light)] flex items-center justify-between">
          <div className="text-sm text-[var(--text-secondary)]">
            Showing results 3 out of 3
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 border border-[var(--border-light)] rounded-lg hover:bg-gray-50 transition-colors">
              Previous
            </button>
            <span className="px-4 py-2 bg-[var(--primary-orange)] text-white rounded-lg font-semibold">
              1
            </span>
            <button className="px-4 py-2 border border-[var(--border-light)] rounded-lg hover:bg-gray-50 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}