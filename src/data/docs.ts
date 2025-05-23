export interface Doc {
  id: string;
  title: string;
  question: string;
  content: string;
  source: string;
}

export const docs: Doc[] = [
  {
    id: "doc-1",
    title: "Getting Started Guide",
    question: "How do I get started with the platform?",
    content: "Welcome to our platform! This guide will help you get started with the basic features and functionality. First, create an account and verify your email. Then, you can start exploring our services.",
    source: "Onboarding Documentation"
  },
  {
    id: "doc-2",
    title: "Security Best Practices",
    question: "What security practices should I follow?",
    content: "Always use strong passwords and enable two-factor authentication. Never share your login credentials with anyone. Regularly review your account activity and report any suspicious behavior immediately.",
    source: "Security Manual"
  },
  {
    id: "doc-3",
    title: "API Integration Guide",
    question: "How do I integrate with your API?",
    content: "Our API allows you to integrate our services into your applications. Use the provided API keys and follow the documentation for proper implementation. Rate limits apply to all API calls.",
    source: "Developer Documentation"
  },
  {
    id: "doc-4",
    title: "Data Backup Procedures",
    question: "How can I back up my data?",
    content: "We recommend performing regular data backups. Navigate to 'Settings' > 'Data Management' > 'Backup Now' to manually trigger a backup. You can also set up automated daily, weekly, or monthly backups in the same section.",
    source: "Technical Operations Manual"
  },
  {
    id: "doc-5",
    title: "Chatbot Overview",
    question: "What are the different chatbots available?",
    content: "We offer several AI-powered chatbots designed for customer support automation. Our main offerings include SupportBot Pro (enterprise solution), QuickAnswer (FAQ bot), OmniChannel Assistant (multi-platform support), LiveChat Connect (hybrid human-AI solution), InternalAssist (employee support), VoiceBot AI (voice-enabled support), and ChatBuilder Developer (custom bot toolkit).",
    source: "Product Catalog"
  },
  {
    id: "doc-6",
    title: "Chatbot Integration Guide",
    question: "How do I integrate chatbots with my existing systems?",
    content: "Our chatbots can be integrated with your existing customer support infrastructure through APIs, webhooks, or pre-built connectors. SupportBot Pro integrates with Zendesk, Freshdesk, Salesforce, and Slack. QuickAnswer works with WordPress, Shopify, and Wix. For custom integrations, use our ChatBuilder Developer toolkit with documentation available at docs.example.com/chatbot-integration.",
    source: "Integration Documentation"
  },
  {
    id: "doc-7",
    title: "Chatbot Features",
    question: "What features do your bots have?",
    content: "Our chatbots come with a range of features including: natural language understanding, sentiment analysis, intent recognition, multi-language support, knowledge base integration, ticket creation, conversation history, analytics dashboards, and seamless human agent handoff. Enterprise plans include custom training, advanced analytics, and workflow automation capabilities.",
    source: "Feature Documentation"
  },
  {
    id: "doc-8",
    title: "Bot Pricing",
    question: "How much do your bots cost?",
    content: "Our chatbot pricing ranges from $79/month for QuickAnswer (basic solution) to $1,499/month for OmniChannel Assistant (enterprise grade). SupportBot Pro is $499/month, LiveChat Connect is $299/month, InternalAssist is $399/month, VoiceBot AI is $599/month, and ChatBuilder Developer is $199/month. Enterprise plans with custom features are available with custom pricing.",
    source: "Pricing Guide"
  }
]; 