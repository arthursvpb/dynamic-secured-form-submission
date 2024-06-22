import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="text-4xl font-bold text-reap-green">⚡ reap</div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              Dynamic Form Builder
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Create secure, dynamic forms for collecting resident information. 
              Build forms with custom sections and fields, then share them via secure URLs.
            </p>
          </div>

          <div className="max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:inline-flex">
              <Link
                href="/admin"
                className="btn-primary w-full sm:w-auto"
              >
                Admin Dashboard
              </Link>
              <div className="text-sm text-gray-500 sm:mt-2">
                Use credentials: admin / password123
              </div>
            </div>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-reap-green text-2xl mb-4">🏗️</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Dynamic Form Builder
                </h3>
                <p className="text-gray-500">
                  Create forms with custom sections and fields. Support for text and number inputs.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-reap-green text-2xl mb-4">🔒</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Secure URLs
                </h3>
                <p className="text-gray-500">
                  Generate cryptographically secure, unique URLs for each form using strong tokens.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-reap-green text-2xl mb-4">📝</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Easy Submission
                </h3>
                <p className="text-gray-500">
                  Public users can access and submit forms without authentication. Clean confirmation flow.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 