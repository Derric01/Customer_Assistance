import Link from 'next/link';
import { FiMessageSquare, FiDatabase, FiSave, FiClock, FiUsers, FiArrowRight, FiZap, FiGlobe, FiUser } from 'react-icons/fi';
import { BiBrain } from 'react-icons/bi';
import AppNavigation from '../components/AppNavigation';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
      <AppNavigation />
      
      <main className="lg:pl-64">
        {/* Hero section */}
        <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="rounded-full bg-purple-900/50 p-4">
                  <div className="rounded-full bg-purple-700 p-3">
                    <BiBrain className="h-12 w-12 text-white" />
                  </div>
                </div>
              </div>
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                AI-Powered Support Assistant
              </h2>
              <p className="mt-4 text-xl text-gray-300 max-w-2xl mx-auto">
                Your intelligent support companion with deep learning capabilities to handle any customer inquiry
              </p>
              <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                <Link 
                  href="/chat" 
                  className="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-700 hover:bg-purple-800 transition-colors"
                >
                  Chat with AI Assistant
                  <FiArrowRight className="ml-2" />
                </Link>
                <Link 
                  href="/knowledge" 
                  className="inline-flex items-center px-5 py-3 border border-gray-600 text-base font-medium rounded-md text-gray-200 bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  Manage Knowledge Base
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Assistant preview */}
        <section className="py-12 bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
              <div className="mb-8 lg:mb-0">
                <h3 className="text-lg font-semibold text-purple-400 mb-2">Meet Your AI Assistant</h3>
                <h2 className="text-2xl font-bold text-white mb-4">Intelligent Support, 24/7</h2>
                <p className="text-gray-300 mb-6">
                  Our AI assistant uses advanced natural language processing to understand customer inquiries 
                  and provide accurate, helpful responses instantly.
                </p>
                <div className="space-y-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-700">
                        <FiZap className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-white">Context-Aware Responses</h4>
                      <p className="mt-1 text-gray-400">Maintains conversation context for personalized, relevant answers.</p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-700">
                        <FiGlobe className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-white">Multilingual Support</h4>
                      <p className="mt-1 text-gray-400">Communicates fluently in multiple languages to serve global customers.</p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-700">
                        <BiBrain className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-white">Self-Improving</h4>
                      <p className="mt-1 text-gray-400">Learns from interactions to continuously enhance response quality.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-900 rounded-lg p-6 shadow-xl border border-gray-700">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="ml-2 text-gray-400 text-sm">AI Assistant</div>
                </div>
                <div className="space-y-4">
                  <div className="flex">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white mr-3 flex-shrink-0">
                      <FiUser className="w-4 h-4" />
                    </div>
                    <div className="bg-gray-700 rounded-lg p-3 text-sm text-gray-200 max-w-[80%]">
                      How do I reset my account password?
                    </div>
                  </div>
                  <div className="flex">
                    <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center text-white mr-3 flex-shrink-0">
                      AI
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 text-sm text-gray-200 max-w-[80%]">
                      To reset your password, click on the &quot;Forgot Password&quot; link on the login page. You&apos;ll receive an email with a secure link to create a new password. The link expires in 24 hours for security.
                      <div className="mt-2 flex items-center text-xs text-gray-400">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-900 text-green-300 mr-2">
                          FAQ
                        </span>
                        <span>Confidence: 98%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features section */}
        <section className="py-12 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-purple-400">Features</h3>
              <p className="mt-2 text-2xl font-bold text-white">AI Support Portal Capabilities</p>
            </div>
            
            <div className="mt-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
                  <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-300 mb-4">
                    <FiMessageSquare className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-medium text-white">Intent Classification</h4>
                  <p className="mt-2 text-gray-300">
                    The system detects the intent behind customer questions to route them to the appropriate knowledge sources.
                  </p>
                </div>
                
                <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
                  <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-300 mb-4">
                    <FiSave className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-medium text-white">Conversation Memory</h4>
                  <p className="mt-2 text-gray-300">
                    The system remembers past interactions to provide more relevant responses and maintain context throughout conversations.
                  </p>
                </div>
                
                <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
                  <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-300 mb-4">
                    <FiUsers className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-medium text-white">Escalation Management</h4>
                  <p className="mt-2 text-gray-300">
                    Smart escalation system identifies when issues need to be escalated and recommends the appropriate escalation path.
                  </p>
                </div>
                
                <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
                  <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-300 mb-4">
                    <FiClock className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-medium text-white">Real-time Responses</h4>
                  <p className="mt-2 text-gray-300">
                    Instant responses to customer inquiries with smart typing indicators to provide a natural conversation experience.
                  </p>
                </div>
                
                <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
                  <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-300 mb-4">
                    <FiDatabase className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-medium text-white">Knowledge Base Manager</h4>
                  <p className="mt-2 text-gray-300">
                    Maintain and update your support knowledge base with our easy-to-use knowledge management interface.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-purple-800 rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-12 md:py-16 md:px-12 text-center text-white">
                <h2 className="text-2xl font-bold mb-2">Ready to transform your customer support?</h2>
                <p className="text-purple-200 mb-6 max-w-2xl mx-auto">
                  Start using our AI assistant today and provide 24/7 intelligent support to your customers.
                </p>
                <Link 
                  href="/chat" 
                  className="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-purple-900 bg-white hover:bg-gray-100 transition-colors"
                >
                  Launch AI Assistant
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="bg-gray-800 py-8 border-t border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="md:flex md:items-center md:justify-between">
              <div className="text-center md:text-left">
                <p className="text-sm text-gray-300">&copy; {new Date().getFullYear()} AI Support Portal. All rights reserved.</p>
              </div>
              <div className="mt-4 md:mt-0">
                <p className="text-sm text-gray-400">
                  Powered by Next.js and AI
                </p>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
