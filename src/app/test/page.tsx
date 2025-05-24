// filepath: c:\Users\derric samson\ai-support-portal\src\app\test\page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useChat } from '../../contexts/ChatContext';
import LoadingSpinner from '../../components/LoadingSpinner';

// Simple test page to validate ChatContext is working properly
export default function TestPage() {
  const { 
    messages, 
    loading, 
    error, 
    isOnline,
    sendMessage,
    addMessage
  } = useChat();
  
  const [testMessage, setTestMessage] = useState('');
  const [testResults, setTestResults] = useState<string[]>([]);
  
  // Run some basic tests
  useEffect(() => {
    setTestResults(prev => [...prev, 'Starting basic tests...']);
    
    // Test 1: Check that context is available
    if (messages !== undefined && sendMessage && addMessage) {
      setTestResults(prev => [...prev, '✅ ChatContext is properly imported']);
    } else {
      setTestResults(prev => [...prev, '❌ ChatContext has missing properties']);
    }
    
    // Test 2: Check network status
    setTestResults(prev => [...prev, `Network status: ${isOnline ? 'Online ✅' : 'Offline ❌'}`]);
    
    // Test 3: Check loading state
    setTestResults(prev => [...prev, `Loading state: ${loading ? 'Active' : 'Inactive'} ✅`]);
    
    // Test 4: Error state
    setTestResults(prev => [
      ...prev, 
      `Error state: ${error ? `Error: ${error} ❌` : 'No errors ✅'}`
    ]);
    
    // Test 5: Check message count
    setTestResults(prev => [
      ...prev,
      `Current message count: ${messages.length} ✅`
    ]);
  }, []);
  
  // Handle sending a test message
  const handleSendTest = async () => {
    if (!testMessage.trim()) return;
    
    setTestResults(prev => [...prev, `Sending test message: "${testMessage}"`]);
    
    try {
      await sendMessage(testMessage);
      setTestResults(prev => [...prev, '✅ Message sent successfully']);
      setTestMessage('');
    } catch (err) {
      setTestResults(prev => [...prev, `❌ Error sending message: ${err instanceof Error ? err.message : String(err)}`]);
    }
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Chat System Test Page</h1>
      
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-2">Test Results</h2>
        <div className="space-y-1">
          {testResults.map((result, index) => (
            <div key={index} className="font-mono text-sm">
              {result}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Send Test Message</h2>
        <div className="flex space-x-2">
          <input
            type="text"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="Enter test message"
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={handleSendTest}
            disabled={loading || !testMessage.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            {loading ? <LoadingSpinner size="small" text="" /> : 'Send'}
          </button>
        </div>
      </div>
      
      <div>
        <h2 className="text-lg font-semibold mb-2">Message History</h2>
        <div className="space-y-2 p-4 bg-gray-50 rounded max-h-80 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-gray-500">No messages yet</p>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`p-3 rounded-lg ${
                  msg.role === 'user' ? 'bg-blue-100' : 
                  msg.role === 'assistant' ? 'bg-green-100' :
                  msg.role === 'error' ? 'bg-red-100' : 'bg-gray-200'
                }`}
              >
                <div className="font-semibold text-xs text-gray-600">
                  {msg.role} · {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
                <div>{msg.content}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
