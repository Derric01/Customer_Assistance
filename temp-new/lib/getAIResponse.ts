import { AIResponse } from '../types';

export async function getAIResponse(query: string): Promise<AIResponse> {
  try {
    console.log('Sending request to AI API:', query);
    
    // Call the AI API route
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('API error response:', errorData || 'No error data available');
      
      if (response.status === 400) {
        return {
          answer: errorData?.answer || "Please provide a valid question.",
          source: {
            type: 'error',
            id: 'invalid-input',
            title: 'Invalid Input'
          }
        };
      }
      
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();
    console.log('Response data received');
    
    return data;
  } catch (error) {
    console.error('Error in getAIResponse:', error);
    
    // Fallback response in case of error
    return {
      answer: "I apologize, but I encountered an error while processing your request. Please try again or contact support.",
      source: {
        type: 'error',
        id: 'error-1',
        title: 'Error Response'
      }
    };
  }
} 