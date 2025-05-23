import { NextRequest, NextResponse } from 'next/server';
import { classifyIntent } from '@/lib/classifyIntent';

export async function POST(request: NextRequest) {
  try {
    const { user_message } = await request.json();

    if (!user_message || typeof user_message !== 'string') {
      return NextResponse.json(
        { error: "Please provide a valid user_message parameter" }, 
        { status: 400 }
      );
    }

    const classification = classifyIntent(user_message);
    return NextResponse.json(classification);
  } catch (error) {
    console.error('Error classifying intent:', error);
    return NextResponse.json(
      { error: "An error occurred while processing the request" }, 
      { status: 500 }
    );
  }
}

function classifyIntent(message: string): ClassificationResponse {
  const normalizedMessage = message.toLowerCase();
  
  // Pattern matching for different intents
  const patterns = {
    product_info: [
      'product', 'products', 'service', 'services', 'offer', 'pricing', 
      'feature', 'features', 'what do you', 'what does', 'tell me about', 
      'how does', 'subscription', 'plan', 'package'
    ],
    
    billing: [
      'bill', 'billing', 'invoice', 'payment', 'charge', 'refund', 'credit',
      'debit', 'transaction', 'receipt', 'subscription fee', 'monthly fee',
      'cancel subscription', 'update payment', 'payment method', 'price', 'cost'
    ],
    
    technical_issue: [
      'error', 'issue', 'problem', 'bug', 'glitch', 'crash', 'not working',
      'broken', 'fix', 'trouble', 'failed', 'can\'t access', 'doesn\'t work',
      'loading', 'connection', 'slow', 'performance', 'login issue', 'password reset'
    ],
    
    account_settings: [
      'account', 'profile', 'settings', 'preferences', 'update', 'change',
      'modify', 'edit', 'personal', 'information', 'email', 'password', 
      'username', 'login', 'sign in', 'sign out', 'log out', 'delete account'
    ],
    
    escalation_needed: [
      'manager', 'supervisor', 'escalate', 'speak to someone', 'human', 
      'representative', 'agent', 'unhappy', 'unsatisfied', 'complaint', 
      'dissatisfied', 'disappointed', 'frustrated', 'urgent', 'immediately',
      'not helpful', 'didn\'t solve', 'need more help'
    ]
  };
  
  // Score each intent based on keyword matches
  let scores: Record<IntentType, number> = {
    product_info: 0,
    billing: 0,
    technical_issue: 0,
    account_settings: 0,
    escalation_needed: 0
  };
  
  // Calculate scores based on keyword matches
  for (const [intent, keywords] of Object.entries(patterns)) {
    for (const keyword of keywords) {
      if (normalizedMessage.includes(keyword)) {
        scores[intent as IntentType] += 1;
      }
    }
  }
  
  // Find the highest scoring intent
  let highestScore = 0;
  let highestIntent: IntentType = 'product_info'; // Default
  
  for (const [intent, score] of Object.entries(scores)) {
    if (score > highestScore) {
      highestScore = score;
      highestIntent = intent as IntentType;
    }
  }
  
  // If no clear intent is found, default to product_info
  if (highestScore === 0) {
    highestIntent = 'product_info';
  }
  
  // Generate appropriate response based on intent
  const responses = {
    product_info: "I'd be happy to tell you about our products and services. We offer AI-powered customer support solutions, knowledge base management systems, and several other tools designed to enhance your customer experience.",
    
    billing: "It seems like you have a question about billing. I can help you with invoices, payment methods, subscription changes, and other billing-related matters.",
    
    technical_issue: "I understand you're experiencing a technical issue. Let me help you troubleshoot this problem to get everything working smoothly again.",
    
    account_settings: "For account-related questions, I can guide you through updating your profile information, changing settings, or managing your account preferences.",
    
    escalation_needed: "I apologize for any inconvenience. It seems this issue requires special attention. I'll help connect you with a support specialist who can better assist with your specific situation."
  };
  
  return {
    intent: highestIntent,
    response: responses[highestIntent]
  };
} 