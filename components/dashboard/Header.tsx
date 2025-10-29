'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { LogOutIcon, PanelLeftOpen, PanelLeftClose } from 'lucide-react';


interface HeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen: boolean;
}

export default function Header({ onToggleSidebar, isSidebarOpen }: HeaderProps) {
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Generate breadcrumbs from pathname
  const getBreadcrumbs = (): string[] => {
    const paths = pathname.split('/').filter(Boolean);
    return paths.map((path, index) => {
      // Check if it's an ID (numeric or UUID pattern)
      if (index > 0 && (/^\d+$/.test(path) || /^[0-9a-f-]+$/i.test(path) && path.length > 10)) {
        return 'Edit';
      }
      
      // Special cases
      if (path === 'add') return 'Add';
      if (path === 'edit') return 'Edit';
      
      // Convert kebab-case to Title Case
      return path
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    });
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="bg-white border-b border-[var(--border-light)] sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6 lg:py-4">
        {/* Left Section - Menu Button & Breadcrumb */}
        <div className="flex items-center gap-3">
          {/* Menu Toggle Button */}
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle Sidebar"
          >
            {isSidebarOpen ? (
              <PanelLeftOpen className="w-6 h-6 text-[var(--primary-orange)]" />
            ) : (
              <PanelLeftClose className="w-6 h-6 text-[var(--primary-orange)]" />
            )}
          </button>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <span className="text-[var(--text-secondary)] text-base">/</span>
                )}
                <span
                  className={`text-base ${
                    index === breadcrumbs.length - 1
                      ? 'font-semibold text-[var(--text-primary)]'
                      : 'text-[var(--text-secondary)]'
                  }`}
                >
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* Right Section - User Profile & Logout */}
        <div className="flex items-center gap-3">

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-[var(--text-primary)] leading-tight">
                  Name of User
                </div>
                <div className="text-xs text-[var(--text-secondary)] leading-tight">
                  Designation
                </div>
              </div>
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center overflow-hidden flex-shrink-0">
                <span className="text-white font-semibold text-sm">NU</span>
              </div>
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsProfileOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-[var(--border-light)] z-20">
                  <div className="p-4 border-b border-[var(--border-light)]">
                    <div className="font-semibold text-[var(--text-primary)]">
                      Name of User
                    </div>
                    <div className="text-sm text-[var(--text-secondary)]">
                      Designation
                    </div>
                  </div>
                  <nav className="py-2">
                    <a
                      href="/profile"
                      className="block px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-gray-100 transition-colors"
                    >
                      Profile Settings
                    </a>
                    <a
                      href="/settings"
                      className="block px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-gray-100 transition-colors"
                    >
                      Settings
                    </a>
                    <a
                      href="/help"
                      className="block px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-gray-100 transition-colors"
                    >
                      Help & Support
                    </a>
                    <hr className="my-2 border-[var(--border-light)]" />
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      onClick={() => {
                        // Handle logout
                        console.log('Logout clicked');
                      }}
                    >
                      Logout
                    </button>
                  </nav>
                </div>
              </>
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={() => {
              // Handle logout
              console.log('Logout clicked');
            }}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
            aria-label="Logout"
          >
            <LogOutIcon className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-red-600 transition-colors" />
          </button>
        </div>
      </div>
    </header>
  );
}