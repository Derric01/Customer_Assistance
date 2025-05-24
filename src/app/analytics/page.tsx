"use client";

import { useState, useEffect } from "react";
import AppNavigation from "@/components/AppNavigation";
import { FiBarChart2, FiClock, FiUsers, FiPieChart, FiMessageSquare, FiActivity, FiCalendar } from 'react-icons/fi';

// Generate realistic data for demo purposes
function generateAnalyticsData() {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const yesterday = new Date(now.setDate(now.getDate() - 1)).toISOString().split('T')[0];
  const twoDaysAgo = new Date(now.setDate(now.getDate() - 1)).toISOString().split('T')[0];
  const threeDaysAgo = new Date(now.setDate(now.getDate() - 1)).toISOString().split('T')[0];
  const fourDaysAgo = new Date(now.setDate(now.getDate() - 1)).toISOString().split('T')[0];
  const fiveDaysAgo = new Date(now.setDate(now.getDate() - 1)).toISOString().split('T')[0];
  const sixDaysAgo = new Date(now.setDate(now.getDate() - 1)).toISOString().split('T')[0];

  // Conversations by day
  const conversationsByDay = [
    { date: sixDaysAgo, count: Math.floor(Math.random() * 500) + 3000 },
    { date: fiveDaysAgo, count: Math.floor(Math.random() * 500) + 3000 },
    { date: fourDaysAgo, count: Math.floor(Math.random() * 500) + 3000 },
    { date: threeDaysAgo, count: Math.floor(Math.random() * 500) + 3500 },
    { date: twoDaysAgo, count: Math.floor(Math.random() * 500) + 3500 },
    { date: yesterday, count: Math.floor(Math.random() * 500) + 3500 },
    { date: today, count: Math.floor(Math.random() * 400) + 3200 },
  ];

  // Calculate total conversations
  const totalConversations = conversationsByDay.reduce((sum, day) => sum + day.count, 0);
  
  // Top intents
  const topIntents = [
    { intent: "Password Reset", count: Math.floor(Math.random() * 1000) + 2000, percentage: 0 },
    { intent: "Account Issues", count: Math.floor(Math.random() * 800) + 1500, percentage: 0 },
    { intent: "Billing Questions", count: Math.floor(Math.random() * 700) + 1200, percentage: 0 },
    { intent: "Product Information", count: Math.floor(Math.random() * 600) + 1000, percentage: 0 },
    { intent: "Technical Support", count: Math.floor(Math.random() * 500) + 800, percentage: 0 },
  ];
  
  // Calculate percentages
  const totalIntents = topIntents.reduce((sum, intent) => sum + intent.count, 0);
  topIntents.forEach(intent => {
    intent.percentage = Number(((intent.count / totalIntents) * 100).toFixed(1));
  });

  return {
    totalConversations,
    averageResponseTime: (Math.random() * 0.8 + 0.8).toFixed(1), // 0.8-1.6 seconds
    resolutionRate: (Math.random() * 5 + 92).toFixed(1), // 92-97%
    escalationRate: (Math.random() * 4 + 3).toFixed(1), // 3-7%
    conversationsByDay,
    topIntents,
    knowledgeBaseUsage: Math.floor(totalConversations * (Math.random() * 0.1 + 0.7)), // 70-80% of conversations use KB
    avgMessagesPerConversation: (Math.random() * 2 + 4).toFixed(1), // 4-6 messages
    activeUsers: Math.floor(Math.random() * 200) + 800, // 800-1000 users
  };
}

export default function AnalyticsPage() {
  // Define proper type for analytics data
  interface AnalyticsData {
    totalConversations: number;
    averageResponseTime: string;
    resolutionRate: string;
    escalationRate: string;
    conversationsByDay: { date: string; count: number; }[];
    topIntents: { intent: string; count: number; percentage: number; }[];
    knowledgeBaseUsage: number;
    avgMessagesPerConversation: string;
    activeUsers: number;
  }
  
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshTime, setRefreshTime] = useState("");

  useEffect(() => {
    // Simulate loading real data
    setLoading(true);
    
    setTimeout(() => {
      const data = generateAnalyticsData();
      setAnalyticsData(data);
      setLoading(false);
      
      const now = new Date();
      setRefreshTime(`${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`);
    }, 800);
  }, []);
  // Format numbers with commas
  const formatNumber = (num: number | undefined | null): string => {
    return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";
  };

  if (loading) {
    return (
      <div className="h-screen overflow-hidden">
        <AppNavigation />
        <main className="lg:pl-64">
          <div className="min-h-screen bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
              <div className="border-b border-gray-700 pb-5">
                <h1 className="text-2xl font-bold text-purple-300">Analytics Dashboard</h1>
                <p className="mt-2 text-sm text-gray-400">Loading analytics data...</p>
              </div>
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto">
      <AppNavigation />
      <main className="lg:pl-64">
        <div className="min-h-screen bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="border-b border-gray-700 pb-5 flex flex-col sm:flex-row sm:justify-between sm:items-end">
              <div>
                <h1 className="text-2xl font-bold text-purple-300">Analytics Dashboard</h1>
                <p className="mt-2 text-sm text-gray-400">Real-time support metrics and conversation insights</p>
              </div>
              <div className="mt-4 sm:mt-0 flex items-center text-sm text-gray-500">
                <FiClock className="mr-1 h-4 w-4 text-gray-400" />
                <span>Data last updated: {refreshTime}</span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Stats cards */}
              <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FiUsers className="h-6 w-6 text-purple-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-400 truncate">Total Conversations</dt>
                        <dd>
                          <div className="text-lg font-medium text-white">{formatNumber(analyticsData?.totalConversations)}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-700 px-5 py-3">
                  <div className="text-sm">
                    <span className="font-medium text-purple-400">Last 7 days</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FiClock className="h-6 w-6 text-purple-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-400 truncate">Avg. Response Time</dt>
                        <dd>
                          <div className="text-lg font-medium text-white">{analyticsData?.averageResponseTime}s</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-700 px-5 py-3">
                  <div className="text-xs text-green-300 flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    12% faster than last week
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FiPieChart className="h-6 w-6 text-purple-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-400 truncate">Resolution Rate</dt>
                        <dd>
                          <div className="text-lg font-medium text-white">{analyticsData?.resolutionRate}%</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-700 px-5 py-3">
                  <div className="text-xs text-green-300 flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    2.3% improvement
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FiBarChart2 className="h-6 w-6 text-purple-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-400 truncate">Escalation Rate</dt>
                        <dd>
                          <div className="text-lg font-medium text-white">{analyticsData?.escalationRate}%</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-700 px-5 py-3">
                  <div className="text-xs text-green-300 flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    0.8% decrease
                  </div>
                </div>
              </div>
            </div>
            
            {/* Additional metrics */}
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FiMessageSquare className="h-6 w-6 text-purple-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-400 truncate">Avg. Messages Per Conversation</dt>
                        <dd>
                          <div className="text-lg font-medium text-white">{analyticsData?.avgMessagesPerConversation}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FiActivity className="h-6 w-6 text-purple-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-400 truncate">Knowledge Base Usage</dt>
                        <dd>
                          <div className="text-lg font-medium text-white">{formatNumber(analyticsData?.knowledgeBaseUsage)} queries</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FiUsers className="h-6 w-6 text-purple-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-400 truncate">Active Users Today</dt>
                        <dd>
                          <div className="text-lg font-medium text-white">{formatNumber(analyticsData?.activeUsers)}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Conversations by day chart */}
            <div className="mt-6">
              <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg p-6">
                <h3 className="text-lg leading-6 font-medium text-white mb-4">Conversations By Day</h3>
                <div className="h-64 relative">
                  {analyticsData?.conversationsByDay.map((day, index) => {
                    const maxCount = Math.max(...analyticsData.conversationsByDay.map(d => d.count));
                    const height = (day.count / maxCount) * 100;
                    const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
                    
                    return (
                      <div key={day.date} className="absolute bottom-0" style={{ 
                        left: `${(index / (analyticsData.conversationsByDay.length - 1)) * 100}%`, 
                        transform: 'translateX(-50%)',
                        height: `${height}%`,
                        width: '30px'
                      }}>
                        <div className="absolute bottom-0 w-full bg-purple-700 hover:bg-purple-600 transition-colors rounded-t" style={{ height: '100%' }}></div>
                        <div className="absolute bottom-0 w-full text-center text-xs text-gray-400 -mb-6">{dayName}</div>
                        <div className="absolute -top-6 w-full text-center text-xs text-gray-300">{formatNumber(day.count)}</div>
                      </div>
                    )
                  })}
                  <div className="absolute bottom-0 w-full h-px bg-gray-700"></div>
                </div>
              </div>
            </div>
            
            {/* Top Intents Table */}
            <div className="mt-6">
              <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-white">Top User Intents</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-400">Most common reasons users engaged with the AI assistant</p>
                </div>
                <div className="border-t border-gray-700">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Intent</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Count</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Percentage</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Visualization</th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                      {analyticsData?.topIntents.map((intent) => (
                        <tr key={intent.intent}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{intent.intent}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatNumber(intent.count)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{intent.percentage}%</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="w-full bg-gray-700 rounded-full h-2.5">
                              <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${intent.percentage}%` }}></div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 