export type IntentType = 'product_info' | 'billing' | 'technical_issue' | 'account_settings' | 'escalation_needed';

export interface ClassificationResponse {
  intent: IntentType;
  answer: string;
  escalation_needed?: boolean;
  reason?: string;
  escalation_path?: string;
}

/**
 * Classifies user message intent and provides an appropriate response
 * @param message - The user's message to classify
 * @returns Object containing the classified intent and a suitable response
 */
export function classifyIntent(message: string): ClassificationResponse {
  const normalizedMessage = message.toLowerCase();
  
  // Pattern matching for different intents
  const patterns = {
    product_info: [
      'product', 'products', 'service', 'services', 'offer', 'pricing', 
      'feature', 'features', 'what do you', 'what does', 'tell me about', 
      'how does', 'subscription', 'plan', 'package', 'option', 'options',
      'catalog', 'want to see', 'show me', 'list', 'info about', 'information',
      'tell me more', 'available', 'details', 'what are', 'learn about', 'more about'
    ],
    
    billing: [
      'bill', 'billing', 'invoice', 'payment', 'charge', 'refund', 'credit',
      'debit', 'transaction', 'receipt', 'subscription fee', 'monthly fee',
      'cancel subscription', 'update payment', 'payment method', 'price', 'cost',
      'purchase', 'buy', 'subscribe', 'how much', 'discount', 'renewal'
    ],
    
    technical_issue: [
      'error', 'issue', 'problem', 'bug', 'glitch', 'crash', 'not working',
      'broken', 'fix', 'trouble', 'failed', 'can\'t access', 'doesn\'t work',
      'loading', 'connection', 'slow', 'performance', 'login issue', 'password reset',
      'troubleshoot', 'help with', 'support for', 'resolve', 'solution'
    ],
    
    account_settings: [
      'account', 'profile', 'settings', 'preferences', 'update', 'change',
      'modify', 'edit', 'personal', 'information', 'email', 'password', 
      'username', 'login', 'sign in', 'sign out', 'log out', 'delete account',
      'manage my', 'my account', 'user', 'details', 'contact info'
    ],
    
    escalation_needed: [
      'manager', 'supervisor', 'escalate', 'speak to someone', 'human', 
      'representative', 'agent', 'unhappy', 'unsatisfied', 'complaint', 
      'dissatisfied', 'disappointed', 'frustrated', 'urgent', 'immediately',
      'not helpful', 'didn\'t solve', 'need more help', 'wrong answer', 
      'incorrect', 'not working', 'talk to person', 'real person'
    ]
  };
  
  // Direct product request patterns
  const directProductPatterns = [
    'wanna see the products',
    'want to see the products', 
    'show me products', 
    'show products', 
    'list products', 
    'what products', 
    'your products',
    'what do you offer',
    'what do you sell'
  ];
  
  // Check for direct product requests first
  for (const pattern of directProductPatterns) {
    if (normalizedMessage.includes(pattern)) {
      return {
        intent: 'product_info',
        answer: "Our products include: SupportBot Pro ($499/month) - AI chatbot with 24/7 support capabilities, Knowledge Hub ($299/month) - Smart knowledge management system, Agent Assist ($199/month) - AI-powered tools for support teams, Analytics Dashboard ($149/month) - Real-time metrics and reporting, and Enterprise Suite ($1499/month) - Complete solution with priority support."
      };
    }
  }
  
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
        
        // Give extra weight to product-related keywords
        if (intent === 'product_info' && 
            (normalizedMessage.includes('product') || 
             normalizedMessage.includes('see') || 
             normalizedMessage.includes('show') || 
             normalizedMessage.includes('what') || 
             normalizedMessage.includes('tell'))) {
          scores[intent as IntentType] += 2;
        }
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
    product_info: "I'd be happy to tell you about our products and services. We offer SupportBot Pro ($499/month), Knowledge Hub ($299/month), Agent Assist ($199/month), Analytics Dashboard ($149/month), and Enterprise Suite ($1499/month). Each product is designed to enhance your customer support experience with AI-powered capabilities.",
    
    billing: "It seems like you have a question about billing. I can help you with invoices, payment methods, subscription changes, and other billing-related matters.",
    
    technical_issue: "I understand you're experiencing a technical issue. Let me help you troubleshoot this problem to get everything working smoothly again.",
    
    account_settings: "For account-related questions, I can guide you through updating your profile information, changing settings, or managing your account preferences.",
    
    escalation_needed: "I apologize for any inconvenience. It seems this issue requires special attention. I'll help connect you with a support specialist who can better assist with your specific situation."
  };
  
  // Create base response
  const baseResponse = {
    intent: highestIntent,
    answer: responses[highestIntent]
  };
  
  // Add escalation details if needed
  if (highestIntent === 'escalation_needed') {
    // Determine escalation reason
    let reason = "Customer satisfaction issue requiring immediate attention";
    let escalationPath = "Support Agent → Customer Success Manager";
    
    // Check for billing-related escalation
    if (scores.billing > 0) {
      reason = "Billing issue beyond support tier";
      escalationPath = "Support Agent → Billing Team → Finance Lead";
    }
    // Check for technical-related escalation
    else if (scores.technical_issue > 0) {
      reason = "Complex technical issue requiring specialist intervention";
      escalationPath = "Support Agent → Technical Support → Senior Developer";
    }
    // Check for account-related escalation
    else if (scores.account_settings > 0) {
      reason = "Account management issue requiring elevated permissions";
      escalationPath = "Support Agent → Account Management Team → Security Lead";
    }
    
    // Check for specific urgency keywords
    if (normalizedMessage.includes('urgent') || normalizedMessage.includes('immediately')) {
      reason = "Urgent issue requiring immediate resolution";
      escalationPath = "Support Agent → Incident Response Team";
    }
    
    // Add escalation details to response
    return {
      ...baseResponse,
      escalation_needed: true,
      reason,
      escalation_path: escalationPath
    };
  }
  
  // Return basic response for non-escalation intents
  return baseResponse;
} 