'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Post } from '@/lib/types';
import { formatDate, truncateText } from '@/lib/utils';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { 
  PencilSquareIcon, 
  EyeIcon, 
  GlobeAltIcon,
  CalendarDaysIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get<Post[]>('/posts');
      setPosts(response.data);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to fetch posts');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async (postId: string) => {
    try {
      await api.post(`/posts/${postId}/publish`);
      // Show success message (you could use a toast library here)
      alert('Post published and embeddings generated!');
      fetchPosts(); // Refresh the list
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(error.response?.data?.message || 'Failed to publish post');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-gray-500">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Posts</h1>
          <p className="text-gray-600">Manage your blog posts</p>
        </div>
        <Link href="/dashboard/posts/new">
          <Button>
            <PencilSquareIcon className="h-5 w-5 mr-2" />
            Create New Post
          </Button>
        </Link>
      </div>

      {error && (
        <div className="p-4 text-red-700 bg-red-100 rounded-xl">
          {error}
        </div>
      )}

      {posts.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600 mb-6">
              Get started by creating your first blog post
            </p>
            <Link href="/dashboard/posts/new">
              <Button>Create Your First Post</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => (
            <Card key={post._id || post.id} className="hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {post.title}
                    </h3>
                    {post.slug && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-mono">
                        /{post.slug}
                      </span>
                    )}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        post.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {post.status || 'draft'}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4">
                    {truncateText(post.content, 200)}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    {post.createdAt && (
                      <div className="flex items-center">
                        <CalendarDaysIcon className="h-4 w-4 mr-1" />
                        Created {formatDate(post.createdAt)}
                      </div>
                    )}
                    {post.updatedAt && post.updatedAt !== post.createdAt && (
                      <div className="flex items-center">
                        <CalendarDaysIcon className="h-4 w-4 mr-1" />
                        Updated {formatDate(post.updatedAt)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2 ml-6">
                  <Link href={`/dashboard/posts/${post.id}`}>
                    <Button variant="outline" size="sm">
                      <EyeIcon className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </Link>
                  
                  <Link href={`/dashboard/posts/${post.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <PencilSquareIcon className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </Link>

                  {post.status === 'draft' && (post._id || post.id) && (
                    <Button
                      size="sm"
                      onClick={() => handlePublish(post._id || post.id!)}
                    >
                      <GlobeAltIcon className="h-4 w-4 mr-1" />
                      Publish
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}