'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import { AIGenerateRequest, AIResponse } from '@/lib/types';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { CpuChipIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';

interface GeneralFormData {
  prompt: string;
}

export default function GeneralAIPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GeneralFormData>();

  const onSubmit = async (data: GeneralFormData) => {
    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      const apiResponse = await api.post<AIResponse>('/ai/generate', {
        prompt: data.prompt,
      } as AIGenerateRequest);
      
      setResponse(apiResponse.data.content);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to generate response');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(response);
  };

  const examplePrompts = [
    'Rewrite this paragraph to be more engaging and conversational',
    'Create a compelling introduction for a blog post about sustainable living',
    'Suggest 5 ways to improve this blog post structure',
    'Help me brainstorm ideas for a tech blog series',
    'Write a conclusion that summarizes key points and includes a call-to-action',
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">General AI Assistant</h1>
        <p className="text-gray-600">Get AI assistance for any writing task</p>
      </div>

      <Card>
        <div className="flex items-center mb-6">
          <CpuChipIcon className="h-6 w-6 text-primary mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">AI Assistant</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="p-4 text-red-700 bg-red-100 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Prompt
            </label>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical min-h-[120px]"
              placeholder="Ask me anything about writing, editing, content strategy, or get help with specific text..."
              {...register('prompt', {
                required: 'Prompt is required',
                minLength: { value: 10, message: 'Prompt must be at least 10 characters' },
              })}
            />
            {errors.prompt && (
              <p className="mt-2 text-sm text-red-600">{errors.prompt.message}</p>
            )}
          </div>

          <Button
            type="submit"
            loading={isLoading}
            className="w-full md:w-auto"
          >
            Generate Response
          </Button>
        </form>
      </Card>

      {response && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">AI Response</h3>
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
              {response.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-900 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </Card>
      )}

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Example Prompts</h3>
        <div className="space-y-3">
          {examplePrompts.map((prompt, index) => (
            <div
              key={index}
              className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => {
                const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
                if (textarea) {
                  textarea.value = prompt;
                }
              }}
            >
              <p className="text-gray-700 text-sm">{prompt}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">What Can I Help With?</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Content Creation</h4>
            <p>Generate ideas, write introductions, create outlines, and develop full articles.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Editing & Improvement</h4>
            <p>Rewrite content, improve clarity, fix grammar, and enhance readability.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">SEO Optimization</h4>
            <p>Suggest keywords, create meta descriptions, and optimize content for search engines.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Content Strategy</h4>
            <p>Plan content calendars, suggest topics, and develop content series ideas.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}