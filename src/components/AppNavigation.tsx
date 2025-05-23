"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiMessageSquare, FiDatabase, FiBarChart2, FiSettings, FiMenu, FiX } from 'react-icons/fi';

export default function AppNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Chat', href: '/chat', icon: FiMessageSquare },
    { name: 'Knowledge Base', href: '/knowledge', icon: FiDatabase },
    { name: 'Analytics', href: '/analytics', icon: FiBarChart2 },
    { name: 'Settings', href: '/settings', icon: FiSettings },
  ];

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <>
      {/* Mobile menu */}
      <div className="lg:hidden">
        <button
          type="button"
          className="p-2 text-gray-400 hover:text-gray-300 focus:outline-none"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open navigation menu"
        >
          <FiMenu className="h-6 w-6" />
        </button>

        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-gray-900/80 backdrop-blur-sm">
            <div className="fixed inset-y-0 left-0 z-50 w-full overflow-y-auto bg-gray-900 px-6 py-4 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
              <div className="flex items-center justify-between">
                <Link href="/" className="text-lg font-semibold text-purple-300">
                  AI Support Portal
                </Link>
                <button
                  type="button"
                  className="p-2 text-gray-400 hover:text-gray-300 focus:outline-none"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close navigation menu"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>
              
              <div className="mt-6">
                <div className="-my-6 divide-y divide-gray-700">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                          isActive(item.href) 
                            ? 'bg-purple-900/30 text-purple-300' 
                            : 'text-gray-300 hover:bg-gray-800'
                        }`}
                        aria-current={isActive(item.href) ? 'page' : undefined}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Desktop menu */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex h-full flex-col border-r border-gray-700 bg-gray-800 shadow-sm">
          <div className="flex flex-1 flex-col overflow-y-auto">
            <div className="flex flex-shrink-0 items-center px-4 py-5">
              <Link href="/" className="text-lg font-semibold text-purple-300">
                AI Support Portal
              </Link>
            </div>
            
            <div className="mt-4 px-3">
              <nav className="space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                      isActive(item.href) 
                        ? 'bg-purple-900/30 text-purple-300' 
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
          
          <div className="flex flex-shrink-0 border-t border-gray-700 p-4">
            <div className="flex items-center">
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-300">Support Agent</p>
                <p className="text-xs text-gray-400">Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 