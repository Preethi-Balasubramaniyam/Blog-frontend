'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/utils';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Link from 'next/link';
import { 
  PencilSquareIcon,
  CpuChipIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const quickActions = [
  {
    title: 'Create New Post',
    description: 'Start writing a new blog post',
    href: '/dashboard/posts/new',
    icon: PencilSquareIcon,
    color: 'bg-purple-500',
  },
  {
    title: 'AI Tools',
    description: 'Generate titles, outlines, and drafts',
    href: '/dashboard/ai',
    icon: CpuChipIcon,
    color: 'bg-blue-500',
  },
  {
    title: 'Search Posts',
    description: 'Find posts using semantic search',
    href: '/dashboard/search',
    icon: MagnifyingGlassIcon,
    color: 'bg-green-500',
  },
  {
    title: 'Manage Posts',
    description: 'View and edit your existing posts',
    href: '/dashboard/posts',
    icon: DocumentTextIcon,
    color: 'bg-orange-500',
  },
];

export default function DashboardPage() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = isAuthenticated();
      if (!authenticated) {
        router.push('/login');
        return;
      }
      setIsAuthed(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!isAuthed) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Dashboard</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Welcome to your AI Blog Assistant dashboard. Start creating amazing content with AI-powered tools.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {quickActions.map((action) => (
          <Card key={action.title} className="hover:shadow-2xl hover:scale-105 transition-all duration-300 border-0 shadow-lg text-center">
            <div className="p-4">
              <div className={`inline-flex p-4 rounded-2xl ${action.color} mb-4 shadow-lg`}>
                <action.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{action.title}</h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">{action.description}</p>
              <Link href={action.href}>
                <Button variant="outline" size="md" className="w-full">
                  Get Started
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-0">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Getting Started</h2>
            <p className="text-gray-600">Follow these simple steps to make the most of your AI Blog Assistant</p>
          </div>
          <div className="space-y-6">
            <div className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full flex items-center justify-center text-lg font-bold">
                1
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">Create your first post</h3>
                <p className="text-gray-600">Start by creating a new blog post or use AI tools to generate content ideas and get inspiration.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center text-lg font-bold">
                2
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">Use AI assistance</h3>
                <p className="text-gray-600">Leverage AI tools to generate engaging titles, structured outlines, and complete draft content for your posts.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full flex items-center justify-center text-lg font-bold">
                3
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">Publish and search</h3>
                <p className="text-gray-600">Publish your posts and use semantic search to find content across your blog library efficiently.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}