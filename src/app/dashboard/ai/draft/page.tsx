'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import { AIGenerateRequest, AIResponse } from '@/lib/types';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Card from '@/components/Card';
import { PencilIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';

interface DraftFormData {
  topic: string;
}

export default function DraftGeneratorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DraftFormData>();

  const onSubmit = async (data: DraftFormData) => {
    setIsLoading(true);
    setError('');
    setDraft('');

    try {
      const response = await api.post<AIResponse>('/ai/generate/draft', {
        topic: data.topic,
      } as AIGenerateRequest);
      
      setDraft(response.data.content);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to generate draft');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(draft);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Draft Generator</h1>
        <p className="text-gray-600">Generate complete blog post drafts</p>
      </div>

      <Card>
        <div className="flex items-center mb-6">
          <PencilIcon className="h-6 w-6 text-primary mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Generate Draft</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="p-4 text-red-700 bg-red-100 rounded-xl">
              {error}
            </div>
          )}

          <Input
            label="Topic"
            placeholder="Enter your blog post topic (e.g., 'The future of renewable energy')"
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
            Generate Draft
          </Button>
        </form>
      </Card>

      {draft && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Generated Draft</h3>
            <button
              onClick={copyToClipboard}
              className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-primary transition-colors"
            >
              <ClipboardDocumentIcon className="h-4 w-4 mr-1" />
              Copy
            </button>
          </div>
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="prose max-w-none">
              {draft.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-900 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </Card>
      )}

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Draft Editing Tips</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Review and Edit</h4>
            <p>Always review AI-generated content and edit it to match your voice and style.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Add Personal Touch</h4>
            <p>Include your own experiences, examples, and insights to make the content unique.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Fact Check</h4>
            <p>Verify any statistics, claims, or technical information mentioned in the draft.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Optimize for SEO</h4>
            <p>Add relevant keywords and ensure the content is optimized for search engines.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}