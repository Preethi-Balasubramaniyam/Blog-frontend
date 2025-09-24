'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Card from '@/components/Card';
import { SparklesIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';

interface TitleFormData {
  topic: string;
}

export default function TitleGeneratorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [titles, setTitles] = useState<string[]>([]);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TitleFormData>();

  const onSubmit = async (data: TitleFormData) => {
    setIsLoading(true);
    setError('');
    setTitles([]);

    try {
      const response = await api.post('/ai/generate/title', {
        topic: data.topic,
      });
      
      // Handle your API response format: { success: true, data: { topic: "...", suggestions: [...] } }
      if (response.data.success && response.data.data && response.data.data.suggestions) {
        setTitles(response.data.data.suggestions);
      } else if (response.data.suggestions) {
        // Fallback for direct suggestions array
        setTitles(response.data.suggestions);
      } else if (response.data.content) {
        // Fallback for content string
        const titleList = response.data.content.split('\n').filter((title: string) => title.trim());
        setTitles(titleList);
      }
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to generate titles');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (title: string) => {
    navigator.clipboard.writeText(title);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Title Generator</h1>
        <p className="text-gray-600">Generate catchy titles for your blog posts</p>
      </div>

      <Card>
        <div className="flex items-center mb-6">
          <SparklesIcon className="h-6 w-6 text-primary mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Generate Titles</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="p-4 text-red-700 bg-red-100 rounded-xl">
              {error}
            </div>
          )}

          <Input
            label="Topic"
            placeholder="Enter your blog post topic (e.g., 'AI in healthcare', 'sustainable living tips')"
            {...register('topic', {
              required: 'Topic is required',
              minLength: { value: 3, message: 'Topic must be at least 3 characters' },
            })}
            error={errors.topic?.message}
          />

          <Button
            type="submit"
            loading={isLoading}
            className="w-full md:w-auto"
          >
            Generate Titles
          </Button>
        </form>
      </Card>

      {titles.length > 0 && (
        <Card>
          <div className="flex items-center mb-6">
            <SparklesIcon className="h-5 w-5 text-primary mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Generated Title Suggestions</h3>
            <span className="ml-2 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
              {titles.length} suggestions
            </span>
          </div>
          <div className="space-y-3">
            {titles.map((title, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-purple-50 hover:to-blue-50 transition-all duration-200 border border-gray-200 hover:border-primary/20"
              >
                <div className="flex items-center flex-1">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-white text-xs rounded-full flex items-center justify-center mr-3 font-medium">
                    {index + 1}
                  </span>
                  <p className="flex-1 text-gray-900 font-medium">{title}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(title)}
                  className="ml-4 p-2 text-gray-500 hover:text-primary hover:bg-white rounded-lg transition-all duration-200"
                  title="Copy to clipboard"
                >
                  <ClipboardDocumentIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              💡 <strong>Tip:</strong> Click the copy icon to copy any title to your clipboard, then use it when creating a new post!
            </p>
          </div>
        </Card>
      )}

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tips for Better Titles</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Be Specific</h4>
            <p>Include specific keywords and details about your topic for more targeted title suggestions.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Consider Your Audience</h4>
            <p>Think about who will read your post and what would catch their attention.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Use Numbers</h4>
            <p>Titles with numbers often perform better (e.g., &ldquo;5 Ways to...&rdquo;, &ldquo;Top 10...&rdquo;).</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Create Urgency</h4>
            <p>Words like &ldquo;now&rdquo;, &ldquo;today&rdquo;, &ldquo;essential&rdquo; can make titles more compelling.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}