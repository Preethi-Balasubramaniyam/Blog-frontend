'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Card from '@/components/Card';
import { DocumentTextIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';

interface OutlineFormData {
  title: string;
}

interface OutlineResponse {
  title: string;
  outline: string[];
}

export default function OutlineGeneratorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [outline, setOutline] = useState<OutlineResponse | null>(null);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OutlineFormData>();

  const onSubmit = async (data: OutlineFormData) => {
    setIsLoading(true);
    setError('');
    setOutline(null);

    try {
      const response = await api.post('/ai/generate/outline', {
        title: data.title,
      });
      
      console.log('API Response:', response.data);
      
      // Handle your API response format
      if (response.data.success && response.data.data) {
        console.log('Setting outline:', response.data.data);
        setOutline(response.data.data);
      } else if (response.data.content) {
        // Fallback for old format
        console.log('Using fallback format');
        setOutline({ title: data.title, outline: [response.data.content] });
      } else {
        console.error('Invalid response format:', response.data);
        throw new Error('Invalid response format');
      }
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to generate outline');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (outline) {
      const outlineText = `${outline.title}\n\n${outline.outline.map((item, index) => `${index + 1}. ${item}`).join('\n')}`;
      navigator.clipboard.writeText(outlineText);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Outline Generator</h1>
        <p className="text-gray-600">Create structured outlines for your content</p>
      </div>

      <Card>
        <div className="flex items-center mb-6">
          <DocumentTextIcon className="h-6 w-6 text-primary mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Generate Outline</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="p-4 text-red-700 bg-red-100 rounded-xl">
              {error}
            </div>
          )}

          <Input
            label="Title"
            placeholder="Enter your blog post title (e.g., 'Getting Started with Machine Learning')"
            {...register('title', {
              required: 'Title is required',
              minLength: { value: 3, message: 'Title must be at least 3 characters' },
            })}
            error={errors.title?.message}
          />

          <div className="flex gap-4">
            <Button
              type="submit"
              loading={isLoading}
              className="flex-1 md:flex-initial"
            >
              Generate Outline
            </Button>
            
            {process.env.NODE_ENV === 'development' && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOutline({
                    title: "Test Title: Machine Learning Explained",
                    outline: [
                      "Introduction to Artificial Intelligence",
                      "Types and Categories of AI",
                      "Machine Learning Fundamentals",
                      "Real-World AI Applications",
                      "Tools and Technologies"
                    ]
                  });
                }}
                className="md:w-auto"
              >
                Test UI
              </Button>
            )}
          </div>
        </form>
      </Card>

      {outline && outline.outline && outline.outline.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Generated Outline</h3>
            <button
              onClick={copyToClipboard}
              className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-primary transition-colors"
            >
              <ClipboardDocumentIcon className="h-4 w-4 mr-1" />
              Copy
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Generated Title */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Generated Title</h4>
              <h2 className="text-2xl font-bold text-gray-900">{outline.title}</h2>
            </div>
            
            {/* Outline Points */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="text-sm font-medium text-gray-600 mb-4">Outline Structure</h4>
              <div className="space-y-3">
                {outline.outline && Array.isArray(outline.outline) ? 
                  outline.outline.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg shadow-sm">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <p className="text-gray-900 font-medium leading-relaxed">{item}</p>
                    </div>
                  )) : (
                    <div className="text-red-500">Error: Invalid outline format</div>
                  )
                }
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Outline Structure Tips</h3>
        <div className="space-y-4 text-sm text-gray-600">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Introduction</h4>
            <p>Hook your readers with an engaging opening that introduces the topic and previews what they&apos;ll learn.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Main Points</h4>
            <p>Break your content into 3-5 main sections, each focusing on a specific aspect of your topic.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Supporting Details</h4>
            <p>Under each main point, include bullet points with examples, statistics, or explanations.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Conclusion</h4>
            <p>Summarize key points and provide a clear call-to-action or next steps for readers.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}