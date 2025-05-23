/**
 * Examples of the enhanced intent classification responses with escalation details
 */

// Example 1: Billing escalation
export const billingEscalationExample = {
  "intent": "escalation_needed",
  "answer": "I apologize for any inconvenience. It seems this issue requires special attention. I'll help connect you with a support specialist who can better assist with your specific situation.",
  "escalation_needed": true,
  "reason": "Billing issue beyond support tier",
  "escalation_path": "Support Agent → Billing Team → Finance Lead"
};

// Example 2: Technical escalation
export const technicalEscalationExample = {
  "intent": "escalation_needed",
  "answer": "I apologize for any inconvenience. It seems this issue requires special attention. I'll help connect you with a support specialist who can better assist with your specific situation.",
  "escalation_needed": true,
  "reason": "Complex technical issue requiring specialist intervention",
  "escalation_path": "Support Agent → Technical Support → Senior Developer"
};

// Example 3: Account escalation
export const accountEscalationExample = {
  "intent": "escalation_needed",
  "answer": "I apologize for any inconvenience. It seems this issue requires special attention. I'll help connect you with a support specialist who can better assist with your specific situation.",
  "escalation_needed": true,
  "reason": "Account management issue requiring elevated permissions",
  "escalation_path": "Support Agent → Account Management Team → Security Lead"
};

// Example 4: Urgent escalation
export const urgentEscalationExample = {
  "intent": "escalation_needed",
  "answer": "I apologize for any inconvenience. It seems this issue requires special attention. I'll help connect you with a support specialist who can better assist with your specific situation.",
  "escalation_needed": true,
  "reason": "Urgent issue requiring immediate resolution",
  "escalation_path": "Support Agent → Incident Response Team"
};

// Example 5: Customer satisfaction escalation (default)
export const defaultEscalationExample = {
  "intent": "escalation_needed",
  "answer": "I apologize for any inconvenience. It seems this issue requires special attention. I'll help connect you with a support specialist who can better assist with your specific situation.",
  "escalation_needed": true,
  "reason": "Customer satisfaction issue requiring immediate attention",
  "escalation_path": "Support Agent → Customer Success Manager"
};

// Example of mixed intent (billing + escalation)
export const mixedIntentExample = {
  "intent": "escalation_needed",
  "answer": "I apologize for any inconvenience. It seems this issue requires special attention. I'll help connect you with a support specialist who can better assist with your specific situation.",
  "escalation_needed": true,
  "reason": "Billing issue beyond support tier",
  "escalation_path": "Support Agent → Billing Team → Finance Lead"
};

// Example of non-escalation response
export const nonEscalationExample = {
  "intent": "billing",
  "answer": "It seems like you have a question about billing. I can help you with invoices, payment methods, subscription changes, and other billing-related matters."
}; 