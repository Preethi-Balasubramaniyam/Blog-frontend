'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import api from '@/lib/api';
import { SearchRequest, SearchResult } from '@/lib/types';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Card from '@/components/Card';
import { MagnifyingGlassIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

interface SearchFormData {
  query: string;
}

export default function SearchPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormData>();

  const onSubmit = async (data: SearchFormData) => {
    setIsLoading(true);
    setError('');
    setResults([]);
    setSearchPerformed(false);

    try {
      const response = await api.post<SearchResult[]>('/ai/search', {
        query: data.query,
      } as SearchRequest);
      
      setResults(response.data);
      setSearchPerformed(true);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Search failed');
      setSearchPerformed(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Semantic Search</h1>
        <p className="text-gray-600">Find relevant content across your blog posts using AI-powered search</p>
      </div>

      <Card>
        <div className="flex items-center mb-6">
          <MagnifyingGlassIcon className="h-6 w-6 text-primary mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Search Your Content</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="p-4 text-red-700 bg-red-100 rounded-xl">
              {error}
            </div>
          )}

          <Input
            label="Search Query"
            placeholder="Enter your search query (e.g., 'machine learning basics', 'productivity tips')"
            {...register('query', {
              required: 'Search query is required',
              minLength: { value: 3, message: 'Search query must be at least 3 characters' },
            })}
            error={errors.query?.message}
          />

          <Button
            type="submit"
            loading={isLoading}
            className="w-full md:w-auto"
          >
            <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
            Search Posts
          </Button>
        </form>
      </Card>

      {searchPerformed && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Search Results ({results.length} found)
          </h3>
          
          {results.length === 0 ? (
            <div className="text-center py-8">
              <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No matching posts found. Try different search terms.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="p-4 border border-gray-200 rounded-xl hover:border-primary hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        {result.title}
                      </h4>
                      <p className="text-gray-600 mb-3">
                        {result.snippet}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Relevance: {(result.score * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <Link href={`/dashboard/posts/${result.id}`}>
                        <Button variant="outline" size="sm">
                          View Post
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">How Semantic Search Works</h3>
        <div className="space-y-4 text-sm text-gray-600">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Understanding Context</h4>
            <p>Semantic search understands the meaning and context of your query, not just exact keyword matches.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Natural Language</h4>
            <p>You can search using natural language questions like &ldquo;How to improve productivity?&rdquo; or &ldquo;Best practices for remote work&rdquo;.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Similarity Scoring</h4>
            <p>Results are ranked by semantic similarity to your query, with relevance scores to help you find the most relevant content.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}