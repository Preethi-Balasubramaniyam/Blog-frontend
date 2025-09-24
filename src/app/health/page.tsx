'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { HealthStatus } from '@/lib/types';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ArrowPathIcon,
  ServerIcon
} from '@heroicons/react/24/outline';

export default function HealthCheckPage() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.get<HealthStatus>('http://localhost:5000/health');
      setHealthStatus(response.data);
    } catch {
      setError('API is down or unreachable');
      setHealthStatus(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (isLoading) {
      return <ArrowPathIcon className="h-8 w-8 text-gray-500 animate-spin" />;
    }
    
    if (healthStatus?.status === 'healthy') {
      return <CheckCircleIcon className="h-8 w-8 text-green-500" />;
    }
    
    return <XCircleIcon className="h-8 w-8 text-red-500" />;
  };

  const getStatusColor = () => {
    if (healthStatus?.status === 'healthy') {
      return 'text-green-600 bg-green-100';
    }
    return 'text-red-600 bg-red-100';
  };

  const getStatusText = () => {
    if (isLoading) return 'Checking...';
    if (healthStatus?.status === 'healthy') return 'Healthy';
    return 'Unhealthy';
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">API Health Check</h1>
          <p className="text-gray-600">Monitor the status of your AI Blog API backend</p>
        </div>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <ServerIcon className="h-6 w-6 text-primary mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">API Status</h2>
            </div>
            <Button
              onClick={checkHealth}
              loading={isLoading}
              variant="outline"
              size="sm"
            >
              <ArrowPathIcon className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            {getStatusIcon()}
            <div>
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  http://localhost:5000
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}
                >
                  {getStatusText()}
                </span>
              </div>
              {healthStatus?.timestamp && (
                <p className="text-gray-500 text-sm mt-1">
                  Last checked: {new Date(healthStatus.timestamp).toLocaleString()}
                </p>
              )}
            </div>
          </div>

          {error && (
            <div className="p-4 text-red-700 bg-red-100 rounded-xl mb-6">
              <p className="font-medium">Connection Error</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          {healthStatus && (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Status Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={healthStatus.status === 'healthy' ? 'text-green-600' : 'text-red-600'}>
                      {healthStatus.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Timestamp:</span>
                    <span className="text-gray-900">
                      {new Date(healthStatus.timestamp).toLocaleString()}
                    </span>
                  </div>
                  {healthStatus.version && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Version:</span>
                      <span className="text-gray-900">{healthStatus.version}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Available Endpoints</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>• POST /api/auth/signup</div>
                  <div>• POST /api/auth/login</div>
                  <div>• GET /api/posts</div>
                  <div>• POST /api/posts</div>
                  <div>• POST /api/posts/:id/publish</div>
                  <div>• POST /api/ai/generate/title</div>
                  <div>• POST /api/ai/generate/outline</div>
                  <div>• POST /api/ai/generate/draft</div>
                  <div>• POST /api/ai/generate</div>
                  <div>• POST /api/ai/search</div>
                </div>
              </div>
            </div>
          )}
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Troubleshooting</h3>
          <div className="space-y-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">API is Down</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Make sure the backend server is running on port 5000</li>
                <li>Check if there are any firewall or network restrictions</li>
                <li>Verify the API URL in your configuration</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Connection Issues</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Ensure CORS is properly configured on the backend</li>
                <li>Check browser console for any network errors</li>
                <li>Try accessing the health endpoint directly: http://localhost:5000/health</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}