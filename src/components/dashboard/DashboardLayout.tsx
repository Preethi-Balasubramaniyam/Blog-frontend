'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/utils';
import { 
  Bars3Icon, 
  XMarkIcon,
  HomeIcon,
  PencilSquareIcon,
  CpuChipIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  { name: 'AI Tools', href: '/dashboard/ai', icon: CpuChipIcon },
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'Create Post', href: '/dashboard/posts/new', icon: PencilSquareIcon },
  { name: 'Posts', href: '/dashboard/posts', icon: DocumentTextIcon },
  { name: 'Search', href: '/dashboard/search', icon: MagnifyingGlassIcon },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:relative lg:flex-shrink-0
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-primary">AI Blog</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-2">
            {navigationItems.map((item, index) => (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    index === 0 
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105' 
                      : 'hover-purple'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${index === 0 ? 'text-white' : ''}`} />
                  {item.name}
                  {index === 0 && (
                    <span className="ml-auto text-xs bg-white/20 px-2 py-1 rounded-full">✨</span>
                  )}
                </Link>
                {index === 0 && (
                  <div className="my-3 border-t border-gray-200"></div>
                )}
              </div>
            ))}
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:flex lg:flex-col">
        {/* Top navbar */}
        <header className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between h-16">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md hover:bg-gray-100"
                >
                  <Bars3Icon className="h-6 w-6" />
                </button>

                <div className="flex items-center space-x-6 ml-auto">
                  <div className="hidden sm:block">
                    <span className="text-sm text-gray-600">Welcome back!</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}