// Authentication types
export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: {
      _id: string;
      name: string;
      email: string;
      role: string;
      createdAt: string;
      __v: number;
    };
  };
}

// Post types
export interface Post {
  _id?: string;
  id?: string;
  title: string;
  content: string;
  slug: string;
  status?: 'draft' | 'published';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePostData {
  title: string;
  content: string;
  slug: string;
}

// AI types
export interface AIGenerateRequest {
  topic?: string;
  prompt?: string;
}

export interface AIResponse {
  content: string;
  suggestions?: string[];
}

// Search types
export interface SearchRequest {
  query: string;
}

export interface SearchResult {
  id: string;
  title: string;
  snippet: string;
  score: number;
}

// Health check types
export interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version?: string;
}