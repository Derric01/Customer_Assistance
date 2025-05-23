import AppNavigation from "@/components/AppNavigation";
import { FiSave, FiUser, FiLock, FiGlobe, FiBell, FiDatabase } from 'react-icons/fi';
import ThemeToggle from "@/components/ThemeToggle";

export default function SettingsPage() {
  return (
    <div className="h-screen overflow-hidden">
      <AppNavigation />
      <main className="lg:pl-64">
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="border-b border-gray-200 dark:border-gray-700 pb-5">
              <h1 className="text-2xl font-bold text-purple-800 dark:text-purple-300">Settings</h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Manage your AI support portal configuration</p>
            </div>
            
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-4">
              {/* Sidebar navigation */}
              <div className="md:col-span-1">
                <div className="bg-white dark:bg-gray-800 px-4 py-5 shadow sm:rounded-lg sm:p-6">
                  <nav className="space-y-2" aria-label="Settings navigation">
                    <a
                      href="#account"
                      className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                    >
                      <FiUser className="h-4 w-4 mr-3" />
                      Account
                    </a>
                    <a
                      href="#notifications"
                      className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FiBell className="h-4 w-4 mr-3" />
                      Notifications
                    </a>
                    <a
                      href="#security"
                      className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FiLock className="h-4 w-4 mr-3" />
                      Security
                    </a>
                    <a
                      href="#ai-settings"
                      className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FiDatabase className="h-4 w-4 mr-3" />
                      AI Configuration
                    </a>
                    <a
                      href="#appearance"
                      className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FiGlobe className="h-4 w-4 mr-3" />
                      Appearance
                    </a>
                  </nav>
                </div>
              </div>
              
              {/* Main content */}
              <div className="md:col-span-3">
                <div id="account" className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="md:flex md:items-center md:justify-between">
                      <div>
                        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Account Settings</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Update your account information and preferences.</p>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <div className="space-y-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="name"
                              id="name"
                              defaultValue="Support Agent"
                              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:focus:border-purple-400 dark:focus:ring-purple-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
                          <div className="mt-1">
                            <input
                              type="email"
                              name="email"
                              id="email"
                              defaultValue="agent@example.com"
                              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:focus:border-purple-400 dark:focus:ring-purple-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                          </div>
                        </div>
                        
                        <div id="appearance">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Theme</label>
                          <div className="mt-2 flex items-center">
                            <ThemeToggle />
                            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Toggle between light and dark mode</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                          >
                            <FiSave className="h-4 w-4 mr-1.5" />
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div id="ai-settings" className="mt-6 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">AI Configuration</h3>
                    <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400">
                      <p>Configure how the AI responds to customer queries.</p>
                    </div>
                    
                    <div className="mt-5">
                      <div className="space-y-6">
                        <div>
                          <label htmlFor="confidence-threshold" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Confidence Threshold
                          </label>
                          <div className="mt-1">
                            <input
                              type="range"
                              name="confidence-threshold"
                              id="confidence-threshold"
                              min="0"
                              max="100"
                              defaultValue="75"
                              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                              <span>Low (0%)</span>
                              <span>Medium (50%)</span>
                              <span>High (100%)</span>
                            </div>
                          </div>
                          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Minimum confidence level required before providing an answer (currently 75%)
                          </p>
                        </div>
                        
                        <div>
                          <label htmlFor="max-context" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Context Window
                          </label>
                          <select
                            id="max-context"
                            name="max-context"
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:focus:border-purple-400 dark:focus:ring-purple-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            defaultValue="5"
                          >
                            <option>3</option>
                            <option>5</option>
                            <option>10</option>
                            <option>15</option>
                          </select>
                          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Number of previous messages to include when calculating a response
                          </p>
                        </div>
                        
                        <div className="flex justify-end">
                          <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                          >
                            <FiSave className="h-4 w-4 mr-1.5" />
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 