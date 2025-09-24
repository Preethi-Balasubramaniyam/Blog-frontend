'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import { CreatePostData } from '@/lib/types';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Card from '@/components/Card';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

export default function NewPostPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePostData>();

  const onSubmit = async (data: CreatePostData) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/posts', data);
      setSuccess('Post created successfully!');
      
      // Redirect to posts list after a short delay
      setTimeout(() => {
        router.push('/dashboard/posts');
      }, 1500);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Post</h1>
        <p className="text-gray-600">Write a new blog post</p>
      </div>

      <Card>
        <div className="flex items-center mb-6">
          <PencilSquareIcon className="h-6 w-6 text-primary mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Post Details</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="p-4 text-red-700 bg-red-100 rounded-xl">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 text-green-700 bg-green-100 rounded-xl">
              {success}
            </div>
          )}

          <Input
            label="Title"
            placeholder="Enter your blog post title"
            {...register('title', {
              required: 'Title is required',
              minLength: { value: 5, message: 'Title must be at least 5 characters' },
              maxLength: { value: 200, message: 'Title must be less than 200 characters' },
            })}
            error={errors.title?.message}
          />

          <Input
            label="Slug"
            placeholder="url-friendly-slug (e.g., intro-to-neural-networks)"
            {...register('slug', {
              required: 'Slug is required',
              pattern: {
                value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                message: 'Slug must contain only lowercase letters, numbers, and hyphens'
              },
              minLength: { value: 3, message: 'Slug must be at least 3 characters' },
              maxLength: { value: 100, message: 'Slug must be less than 100 characters' },
            })}
            error={errors.slug?.message}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical min-h-[400px]"
              placeholder="Write your blog post content here... (Markdown supported)"
              {...register('content', {
                required: 'Content is required',
                minLength: { value: 50, message: 'Content must be at least 50 characters' },
              })}
            />
            {errors.content && (
              <p className="mt-2 text-sm text-red-600">{errors.content.message}</p>
            )}
          </div>

          <div className="flex space-x-4">
            <Button
              type="submit"
              loading={isLoading}
            >
              Create Post
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard/posts')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Writing Tips</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Engaging Titles</h4>
            <p>Create titles that are descriptive, benefit-focused, and include keywords your audience searches for.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Structure Your Content</h4>
            <p>Use headings, subheadings, and bullet points to make your content easy to scan and read.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Add Value</h4>
            <p>Focus on providing actionable insights, solutions, or entertainment value to your readers.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Use AI Tools</h4>
            <p>Try our AI tools to generate titles, outlines, or drafts to help kickstart your writing process.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}