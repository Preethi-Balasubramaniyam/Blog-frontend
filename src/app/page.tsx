import Link from 'next/link';
import Button from '@/components/Button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">AI Blog Assistant</h1>
            </div>
            <div className="flex space-x-4">
              <Link href="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Create Amazing Blog Content with{' '}
            <span className="text-primary">AI Assistance</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Leverage the power of artificial intelligence to generate engaging titles,
            structured outlines, and complete blog posts. Manage your content with ease
            and discover insights through semantic search.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Start Writing Today
              </Button>
            </Link>
            <Link href="/health">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Check API Status
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">AI Blog Assistant</h3>
            <p className="text-gray-400 mb-6">
              Empowering content creators with AI-powered writing tools.
            </p>
            <div className="flex justify-center space-x-6">
              <Link href="/login" className="text-gray-400 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link href="/signup" className="text-gray-400 hover:text-white transition-colors">
                Sign Up
              </Link>
              <Link href="/health" className="text-gray-400 hover:text-white transition-colors">
                API Status
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
