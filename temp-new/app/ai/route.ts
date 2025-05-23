import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
// Import with relative paths instead of aliases to ensure compatibility
import { faqs } from '../../../data/faq';
import { docs } from '../../../data/docs';
import { rules } from '../../../data/rulebook';

// Initialize the Gemini API client with fallback for development
const API_KEY = process.env.GEMINI_API_KEY || 'dummy-key-for-dev';
const genAI = new GoogleGenerativeAI(API_KEY);

// Prepare knowledge base context
const knowledgeBase = {
  faqs,
  docs,
  rules
};

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    
    // Basic input validation
    if (!query || query.trim() === '') {
      return NextResponse.json(
        {
          answer: "I didn't receive a question. Please ask me something specific.",
          source: {
            type: 'error',
            id: 'empty-query',
            title: 'Empty Query'
          }
        },
        { status: 400 }
      );
    }
    
    // Check for matches in our knowledge base first - this doesn't require API call
    const normalizedQuery = query.toLowerCase();
    
    // Search in FAQs
    const faqMatch = faqs.find(faq => 
      faq.question.toLowerCase().includes(normalizedQuery) ||
      faq.answer.toLowerCase().includes(normalizedQuery)
    );

    if (faqMatch) {
      console.log('FAQ match found:', faqMatch.id);
      return NextResponse.json({
        answer: faqMatch.answer,
        source: {
          type: 'faq',
          id: faqMatch.id,
          title: faqMatch.question
        }
      });
    }
    
    // Handle potential API key issues with fallback to static responses
    if (API_KEY === 'dummy-key-for-dev' || API_KEY === 'your-gemini-api-key-here') {
      console.log('Using fallback responses due to missing API key');
      return NextResponse.json({
        answer: "I'm sorry, I don't have enough information to answer that question. Please try asking about passwords, payments, business hours, or account updates.",
        source: {
          type: 'ai',
          id: 'fallback-response',
          title: 'Fallback Response'
        }
      });
    }
    
    // Try to use Gemini API
    try {
      // Configure the Gemini model
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-pro",
      });
      
      // Create context-aware prompt with knowledge base information
      const systemPrompt = `You are a helpful customer support AI assistant for our company. Your goal is to provide concise, accurate, and friendly responses to customer inquiries.

Here is some information about our company that might be useful:
- Business hours: Monday through Friday, 9 AM to 6 PM EST
- Payment methods: All major credit/debit cards, PayPal, and bank transfers
- Payment portal: example.com/payments
- Password reset: Via 'Forgot Password' link on login page
- Account updates: Through 'Account Settings' section

Always be polite, direct, and avoid speculation if you don't know an answer. If the question is about a topic not covered in our knowledge base, kindly direct the user to contact customer support for more specific information.`;

      const fullPrompt = `${systemPrompt}\n\nCustomer question: ${query}\n\nYour helpful response:`;
      
      // Generate response
      const result = await model.generateContent(fullPrompt);
      const response = result.response;
      const aiMessage = response.text() || "I couldn't generate a response. Please try again.";
      
      // Return formatted response
      const aiResponse = {
        answer: aiMessage,
        source: {
          type: 'ai',
          id: 'gemini-response',
          title: 'AI Response'
        }
      };
      
      return NextResponse.json(aiResponse);
    } catch (genError) {
      console.error('Gemini API error:', genError);
      
      // Fallback to static response on Gemini API error
      return NextResponse.json({
        answer: "I'm having trouble connecting to my AI service. Let me try to answer based on what I know: Please check our FAQ section for common questions about passwords, payments, and account management.",
        source: {
          type: 'ai',
          id: 'degraded-response',
          title: 'Fallback Response'
        }
      });
    }
  } catch (error) {
    console.error('Global error in AI request:', error);
    
    // General error response
    return NextResponse.json(
      { 
        answer: "I apologize, but I encountered an error while processing your request. Please try again or contact support.",
        source: {
          type: 'error',
          id: 'error-1',
          title: 'Error Response'
        }
      },
      { status: 500 }
    );
  }
} 