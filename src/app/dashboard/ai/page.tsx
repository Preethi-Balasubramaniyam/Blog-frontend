'use client';

import Link from 'next/link';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { 
  PencilIcon,
  DocumentTextIcon,
  CpuChipIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const aiTools = [
  {
    title: 'Title Generator',
    description: 'Generate catchy titles for your blog posts',
    href: '/dashboard/ai/title',
    icon: SparklesIcon,
    color: 'bg-purple-500',
  },
  {
    title: 'Outline Generator',
    description: 'Create structured outlines for your content',
    href: '/dashboard/ai/outline',
    icon: DocumentTextIcon,
    color: 'bg-blue-500',
  },
  {
    title: 'Draft Generator',
    description: 'Generate complete blog post drafts',
    href: '/dashboard/ai/draft',
    icon: PencilIcon,
    color: 'bg-green-500',
  },
  {
    title: 'General AI',
    description: 'Get AI assistance for any writing task',
    href: '/dashboard/ai/general',
    icon: CpuChipIcon,
    color: 'bg-orange-500',
  },
];

export default function AIToolsPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Tools</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Enhance your writing with AI-powered tools designed to help you create amazing content</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {aiTools.map((tool) => (
          <Card key={tool.title} className="hover:shadow-2xl hover:scale-105 transition-all duration-300 border-0 shadow-lg">
            <div className="text-center p-6">
              <div className={`inline-flex p-6 rounded-2xl ${tool.color} mb-6 shadow-lg`}>
                <tool.icon className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{tool.title}</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">{tool.description}</p>
              <Link href={tool.href}>
                <Button className="w-full py-4 text-lg font-semibold">
                  Try {tool.title}
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      <div className="max-w-6xl mx-auto">
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-0">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">How AI Tools Work</h2>
            <p className="text-gray-600">Each tool is specifically designed to help you with different aspects of content creation</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4">
              <div className="bg-purple-500 p-3 rounded-xl inline-block mb-4">
                <SparklesIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Title Generator</h3>
              <p className="text-gray-600 text-sm">Enter your topic and get multiple engaging title suggestions optimized for readability and SEO.</p>
            </div>
            <div className="text-center p-4">
              <div className="bg-blue-500 p-3 rounded-xl inline-block mb-4">
                <DocumentTextIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Outline Generator</h3>
              <p className="text-gray-600 text-sm">Provide a topic and receive a structured outline with main points and subheadings.</p>
            </div>
            <div className="text-center p-4">
              <div className="bg-green-500 p-3 rounded-xl inline-block mb-4">
                <PencilIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Draft Generator</h3>
              <p className="text-gray-600 text-sm">Generate complete blog post drafts based on your topic with introduction, body, and conclusion.</p>
            </div>
            <div className="text-center p-4">
              <div className="bg-orange-500 p-3 rounded-xl inline-block mb-4">
                <CpuChipIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">General AI</h3>
              <p className="text-gray-600 text-sm">Get assistance with any writing task - editing, brainstorming, or content improvement.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}