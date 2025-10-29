'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { menuItems } from './menu';
import { ChevronDown } from 'lucide-react';
import { ChevronUp } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const pathname = usePathname();

  // Auto-expand parent menu if a sub-item is active
  useEffect(() => {
    menuItems.forEach((item) => {
      if (item.subItems?.some(subItem => pathname === subItem.href)) {
        setExpandedItems((prev) => 
          prev.includes(item.id) ? prev : [...prev, item.id]
        );
      }
    });
  }, [pathname]);

  const toggleExpand = (itemId: string) => {
    if (!isOpen) return; // Don't expand when collapsed
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Check if any sub-item is active for a parent menu
  const hasActiveSubItem = (item: typeof menuItems[0]) => {
    return item.subItems?.some(subItem => pathname === subItem.href || pathname.startsWith(subItem.href + '/')) || false;
  };

  // Check if parent should be highlighted
  const isParentActive = (item: typeof menuItems[0]) => {
    return pathname === item.href || hasActiveSubItem(item);
  };

  return (
    <aside
      className={`
        flex-shrink-0 h-screen bg-[var(--sidebar-bg)]
        transition-all duration-300 ease-in-out
        ${isOpen ? 'w-64' : 'w-20'}
        flex flex-col shadow-lg
      `}
    >
      {/* Logo Section */}
      <div className={`bg-[var(--primary-orange)] flex-shrink-0 transition-all duration-300 ${isOpen ? 'p-6' : 'p-4'}`}>
        <div className={`flex items-center ${isOpen ? 'gap-2' : 'justify-center'}`}>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-[var(--primary-orange)] font-bold text-xl">ES</span>
          </div>
          {isOpen && (
            <div className="text-white overflow-hidden">
              <div className="font-bold text-lg leading-tight whitespace-nowrap">EVERONIC</div>
              <div className="font-bold text-sm leading-tight whitespace-nowrap">SOLUTIONS</div>
            </div>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-2">
        {menuItems.map((item) => {
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isExpandableOnly = hasSubItems && item.id !== 'overview';
          
          return (
          <div key={item.id}>
            {isExpandableOnly ? (
              // Non-clickable expandable menu (Masters, Features, etc.)
              <button
                onClick={() => isOpen && toggleExpand(item.id)}
                className={`
                  w-full flex items-center py-3.5 rounded-lg
                  transition-all duration-200 relative group
                  ${isOpen ? 'justify-between px-6 mx-3' : 'justify-center px-0 mx-0'}
                  ${
                    isParentActive(item) && expandedItems.includes(item.id)
                      ? 'bg-[var(--primary-orange-hover)] text-white shadow-md'
                      : isParentActive(item)
                      ? 'bg-[var(--primary-orange)] text-white shadow-md'
                      : 'text-[var(--text-primary)] hover:bg-[var(--primary-orange-light)]'
                  }
                `}
                title={!isOpen ? item.label : undefined}
              >
                {isOpen ? (
                  <>
                    <div className="flex items-center gap-3 flex-1">
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium whitespace-nowrap">{item.label}</span>
                    </div>
                    {expandedItems.includes(item.id) ? (
                      <ChevronUp className="w-4 h-4 mr-4 flex-shrink-0 transition-all" />
                    ) : (
                      <ChevronDown className="w-4 h-4 mr-4 flex-shrink-0 transition-all" />
                    )}
                  </>
                ) : (
                  <item.icon className="w-5 h-5" />
                )}
                
                {/* Tooltip for collapsed state */}
                {!isOpen && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                    {item.label}
                    <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                  </div>
                )}
              </button>
            ) : (
              // Clickable menu item (Overview, etc.)
              <Link
                href={item.href}
                className={`
                  flex items-center py-3.5 rounded-lg
                  transition-all duration-200 relative group
                  ${isOpen ? 'justify-start px-6 mx-3' : 'justify-center px-0 mx-0'}
                  ${
                    isParentActive(item)
                      ? 'bg-[var(--primary-orange)] text-white shadow-md'
                      : 'text-[var(--text-primary)] hover:bg-[var(--primary-orange-light)]'
                  }
                `}
                title={!isOpen ? item.label : undefined}
              >
                {isOpen ? (
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium whitespace-nowrap">{item.label}</span>
                  </div>
                ) : (
                  <item.icon className="w-5 h-5" />
                )}
                
                {/* Tooltip for collapsed state */}
                {!isOpen && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                    {item.label}
                    <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                  </div>
                )}
              </Link>
            )}

            {/* Sub Items - Only show when expanded and parent is expanded */}
            {isOpen &&
              hasSubItems &&
              expandedItems.includes(item.id) && (
                <div className="mt-1 space-y-1">
                  {item.subItems!.map((subItem) => {
                    const isSubItemActive = pathname === subItem.href || pathname.startsWith(subItem.href + '/');
                    
                    return (
                      <Link
                        key={subItem.id}
                        href={subItem.href}
                        className={`
                          flex items-center gap-3 pl-12 pr-6 py-3.5 text-sm
                          transition-all duration-200
                          ${
                            isSubItemActive
                              ? 'bg-[var(--primary-orange)] text-white font-medium'
                              : 'text-[var(--text-primary)] hover:bg-[var(--primary-orange-light)]'
                          }
                        `}
                      >
                        <subItem.icon className="w-4 h-4 flex-shrink-0" />
                        <span>{subItem.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
          </div>
        )})}
      </nav>
    </aside>
  );
}