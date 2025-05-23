export interface FAQ {
  id: string;
  question: string;
  answer: string;
  source: string;
}

export const faqs: FAQ[] = [
  {
    id: "faq-1",
    question: "How do I reset my password?",
    answer: "To reset your password, click on the 'Forgot Password' link on the login page. You'll receive an email with a password reset link. Click the link and follow the instructions to set a new password.",
    source: "Account Management Guide"
  },
  {
    id: "faq-2",
    question: "What are your business hours?",
    answer: "Our customer support team is available Monday through Friday, 9 AM to 6 PM EST. For urgent matters outside these hours, please use our emergency support line.",
    source: "Company Information Page"
  },
  {
    id: "faq-3",
    question: "How do I update my account information?",
    answer: "You can update your account information by logging into your account and navigating to the 'Account Settings' section. From there, you can modify your personal details, contact information, and preferences.",
    source: "User Account Manual"
  },
  {
    id: "faq-4",
    question: "Where can I make payments?",
    answer: "You can make payments through our secure payment portal at example.com/payments. We accept credit/debit cards, PayPal, and bank transfers. For automatic recurring payments, you can set up autopay in your account settings.",
    source: "Payment Documentation"
  },
  {
    id: "faq-5",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit and debit cards (Visa, Mastercard, American Express), PayPal, and direct bank transfers. For enterprise customers, we also support invoicing with net-30 payment terms.",
    source: "Payment Methods Page"
  },
  {
    id: "faq-6",
    question: "How can I change my subscription plan?",
    answer: "To change your subscription plan, go to 'Account Settings' > 'Subscription Management'. From there, you can view available plans and select 'Change Plan' to upgrade or downgrade your subscription. Changes will be applied at the start of your next billing cycle.",
    source: "Billing Documentation"
  },
  {
    id: "faq-7",
    question: "What products do you offer?",
    answer: "We offer a comprehensive suite of AI support products: 1) SupportBot Pro ($499/month) - Our flagship AI assistant for customer service, 2) Knowledge Hub ($299/month) - Advanced knowledge base with AI search, 3) Agent Assist ($199/month) - Tool for augmenting human agents, 4) Analytics Dashboard ($149/month) - For tracking support metrics, and 5) Enterprise Suite ($1499/month) - Our all-in-one solution for large organizations.",
    source: "Product Catalog"
  },
  {
    id: "faq-8",
    question: "Tell me about your products",
    answer: "Our product lineup includes: 1) SupportBot Pro - An intelligent chatbot for 24/7 customer support with multilingual capabilities, 2) Knowledge Hub - A dynamic knowledge base system with AI-powered search and organization, 3) Agent Assist - Tools to make human agents more efficient with AI suggestions, 4) Analytics Dashboard - Real-time insights into customer support performance, and 5) Enterprise Suite - Comprehensive solution with all products plus dedicated support.",
    source: "Product Information Page"
  },
  {
    id: "faq-9", 
    question: "I want to see the products",
    answer: "Our products include: SupportBot Pro ($499/month) - AI chatbot with 24/7 support capabilities, Knowledge Hub ($299/month) - Smart knowledge management system, Agent Assist ($199/month) - AI-powered tools for support teams, Analytics Dashboard ($149/month) - Real-time metrics and reporting, and Enterprise Suite ($1499/month) - Complete solution with priority support. Would you like more specific information about any of these products?",
    source: "Product Listings"
  },
  {
    id: "faq-10",
    question: "How do your AI assistants handle complex customer issues?",
    answer: "Our AI assistants handle complex issues using advanced NLP for accurate intent recognition. They attempt to resolve issues automatically using the knowledge base first. For complex issues, they offer seamless escalation to human agents with full conversation context. Enterprise plans include custom decision trees and workflows for specialized issue handling.",
    source: "Technical Documentation"
  },
  {
    id: "faq-11",
    question: "What are the features of your products?",
    answer: "Our products include these key features: 1) SupportBot Pro - 24/7 availability, multilingual support, intent recognition, and seamless escalation, 2) Knowledge Hub - AI-powered search, automated categorization, content suggestions, and analytics, 3) Agent Assist - Real-time suggestions, automated responses, and performance coaching, 4) Analytics Dashboard - Custom reports, real-time metrics, trend analysis, and exportable data, 5) Enterprise Suite - All features plus custom integrations and dedicated support.",
    source: "Features Guide"
  },
  {
    id: "faq-12",
    question: "Can I customize your products?",
    answer: "Yes, all our products offer extensive customization. You can personalize the interface, create custom workflows, integrate with your existing systems, and train the AI with your specific knowledge base. Enterprise customers receive additional customization options including custom machine learning models and dedicated development resources.",
    source: "Customization Documentation"
  }
]; 