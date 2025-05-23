'use client';

import { useState, useEffect } from 'react';

export default function DebugPage() {
  const [status, setStatus] = useState<string>('Loading...');
  const [apiTest, setApiTest] = useState<string>('Not tested');
  const [envVars, setEnvVars] = useState<string>('Checking...');

  useEffect(() => {
    // Check if the page is working
    setStatus('Debug page loaded successfully');
    
    // Check environment variables
    fetch('/api/debug')
      .then(res => res.json())
      .then(data => {
        setEnvVars(JSON.stringify(data, null, 2));
      })
      .catch(err => {
        setEnvVars(`Error checking env vars: ${err.message}`);
      });
  }, []);

  const testApi = async () => {
    setApiTest('Testing...');
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: 'Test query' }),
      });
      
      const data = await response.json();
      setApiTest(`API test success: ${JSON.stringify(data, null, 2)}`);
    } catch (err: any) {
      setApiTest(`API test failed: ${err.message}`);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Debug Page</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Page Status</h2>
        <div className="p-4 bg-gray-100 rounded">{status}</div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">API Test</h2>
        <button 
          onClick={testApi}
          className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Test AI API
        </button>
        <pre className="p-4 bg-gray-100 rounded whitespace-pre-wrap">{apiTest}</pre>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Environment Info</h2>
        <pre className="p-4 bg-gray-100 rounded whitespace-pre-wrap">{envVars}</pre>
      </div>
    </div>
  );
} 