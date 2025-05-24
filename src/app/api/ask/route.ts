import { NextRequest, NextResponse } from 'next/server';
import { faqs } from '../../../data/faq';
import { docs } from '../../../data/docs';
import { rules } from '../../../data/rulebook';
import { escalations } from '../../../data/escalations';
import { classifyIntent } from '@/lib/classifyIntent';

// PRO FEATURE: Enhanced type definitions
type KnowledgeEntry = {
  answer: string;
  source: string;
  sourceType: 'faq' | 'doc' | 'rule' | 'escalation';
  sourceId: string;
  sourceTitle: string;
  confidence?: number; // Make confidence optional in base type
};

type KnowledgeResponse = KnowledgeEntry & {
  relatedQuestions?: string[];
  metadata?: {
    responseTime?: number;
    userSentiment?: SentimentType;
    personalized?: boolean;
    topicChain?: string[];
    aiConfidence?: number;
    conversationSummary?: string;
  };
};

// PRO FEATURE: Sentiment analysis types
type SentimentType = 'positive' | 'negative' | 'neutral' | 'frustrated' | 'confused' | 'urgent';

// PRO FEATURE: Sentiment analysis function
function analyzeSentiment(text: string): SentimentType {
  const positivePatterns = /great|good|excellent|awesome|love|like|helpful|thanks|thank you|perfect|wonderful/i;
  const negativePatterns = /bad|terrible|awful|useless|hate|dislike|unhappy|disappointed|not working|doesn't work/i;
  const frustratedPatterns = /frustrated|annoying|annoyed|tired of|fed up|can't believe|ridiculous|stupid|waste/i;
  const confusedPatterns = /confused|don't understand|not sure|unclear|what do you mean|how does|not clear|explain/i;
  const urgentPatterns = /urgent|immediately|asap|right now|emergency|critical|important|quickly|hurry|soon/i;
  
  if (frustratedPatterns.test(text)) return 'frustrated';
  if (urgentPatterns.test(text)) return 'urgent';
  if (confusedPatterns.test(text)) return 'confused';
  if (negativePatterns.test(text)) return 'negative';
  if (positivePatterns.test(text)) return 'positive';
  return 'neutral';
}

// Cache for recent queries
const responseCache = new Map<string, {
  response: KnowledgeResponse;
  timestamp: number;
}>();

// Cache expiration time (5 minutes)
const CACHE_EXPIRY_MS = 5 * 60 * 1000;

// Correctly type message history interface
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    // Extract more information for enhanced personalization
    const { question, history, userId, sessionData } = await request.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { 
          answer: "Please provide a valid question.", 
          source: "System",
          confidence: 100
        }, 
        { status: 400 }
      );
    }

    // PRO FEATURE: Track starting time for response time analytics
    const startTime = performance.now();
    
    // PRO FEATURE: Identify returning users and personalize greeting
    const isReturningUser = userId && sessionData?.previousSessions;
    const userPreferences = sessionData?.preferences || {};
    
    // Normalize the query
    const normalizedQuery = question.toLowerCase().trim();
    
    // PRO FEATURE: Sentiment analysis to detect user frustration or satisfaction
    const sentiment = analyzeSentiment(normalizedQuery);
    let adjustedConfidence = 0;
    
    // ADVANCED: Handle common inputs at the very beginning with highest priority
    
         // 1. PRO FEATURE: Enhanced personalized greeting with sentiment adjustment
    if (/^(hello|hi|hey|greetings|howdy|hola)(\s|$)/i.test(normalizedQuery)) {
      // Calculate response time for performance tracking
      const responseTime = Math.round(performance.now() - startTime);
      
      // Adjust greeting based on returning user status
      let greeting = "Hello! Welcome to our AI Support Portal.";
      if (isReturningUser) {
        greeting = "Welcome back to our AI Support Portal!";
        
        // Add personalized touch if we have product preferences
        if (userPreferences.favoriteProduct) {
          greeting += ` I remember you were interested in our ${userPreferences.favoriteProduct}. `;
        }
      }
      
      // Adjust greeting based on detected sentiment
      let sentimentResponse = "";
      if (sentiment === 'frustrated') {
        sentimentResponse = " I understand you might be having some challenges. I'm here to help resolve them quickly.";
        adjustedConfidence = 5; // Increase confidence for frustrated users to show more certainty
      } else if (sentiment === 'urgent') {
        sentimentResponse = " I'll do my best to assist you right away.";
        adjustedConfidence = 10; // High confidence for urgent matters
      }
      
      return NextResponse.json({
        answer: `${greeting}${sentimentResponse} How can I help you today? You can ask about our products, account settings, or technical support.`,
        source: "System",
        sourceType: "doc",
        sourceId: "greeting",
        sourceTitle: "Greeting",
        confidence: 98 + adjustedConfidence,
        relatedQuestions: [
          "What products do you offer?",
          "How much do your products cost?",
          "Tell me about SupportBot Pro"
        ],
        metadata: {
          responseTime,
          userSentiment: sentiment,
          personalized: !!isReturningUser,
          aiConfidence: 98 + adjustedConfidence
        }
      });
    }
    
    // 2. Direct shipping/delivery query detection
    if (/\b(deliver|shipping|ship|deliv|shipp)\b/i.test(normalizedQuery) || 
        normalizedQuery.includes('delivery') || 
        normalizedQuery.includes('shipping') ||
        /how (do|can|will) (i|we|you) (get|receive|access|download)/i.test(normalizedQuery)) {
      
      return NextResponse.json({
        answer: "Our products are software solutions delivered digitally through our secure customer portal. After purchase, you'll receive immediate access to your account where you can download and implement our tools. For Enterprise customers, we also offer dedicated implementation support with a team that will help you set up and configure the software to meet your specific needs. The implementation process typically takes 2-4 weeks depending on your requirements. Is there anything specific about our delivery process you'd like to know?",
        source: "FAQ",
        sourceType: "faq",
        sourceId: "delivery-info",
        sourceTitle: "Delivery Information",
        confidence: 95,
        relatedQuestions: [
          "How long does implementation take?",
          "Do you provide training?", 
          "What support do you offer during setup?"
        ]
      });
    }
    
    // 3. Price/cost query detection
    if (/\b(price|cost|pricing|subscription|fee|payment|(how much))\b/i.test(normalizedQuery)) {
      return NextResponse.json({
        answer: "Our pricing is as follows:\n\n1. SupportBot Pro: $499/month\n2. Knowledge Hub: $299/month\n3. Agent Assist: $199/month\n4. Analytics Dashboard: $149/month\n5. Enterprise Suite: $1499/month\n\nAll plans include standard support and regular updates. Enterprise customers also receive dedicated support and implementation assistance. Would you like more details about what's included in each plan?",
        source: "FAQ",
        sourceType: "faq",
        sourceId: "pricing-info",
        sourceTitle: "Pricing Information",
        confidence: 95,
        relatedQuestions: [
          "What's included in the Enterprise Suite?",
          "Do you offer discounts for annual billing?",
          "Can I upgrade my plan later?"
        ]
      });
    }
    
    // Check cache first
    const cacheKey = normalizedQuery;
    const cachedResponse = responseCache.get(cacheKey);
    
    if (cachedResponse && (Date.now() - cachedResponse.timestamp < CACHE_EXPIRY_MS)) {
      console.log('Cache hit for query:', normalizedQuery);
      return NextResponse.json(cachedResponse.response);
    }
    
    // IMPROVED: Special handling for product numbers and ordinal references (first, second, etc.)
    const isDirectProductNumber = /^[1-5]$/.test(normalizedQuery.trim());
    
    // Check for references like "first product", "product 2", etc.
    const ordinalMatch = normalizedQuery.match(/(first|1st|second|2nd|third|3rd|fourth|4th|fifth|5th|product ?(1|2|3|4|5))/i);
    let ordinalProductNumber = 0;
    
    if (ordinalMatch) {
      if (ordinalMatch[0].includes('first') || ordinalMatch[0].includes('1st') || ordinalMatch[0].includes('product 1')) {
        ordinalProductNumber = 1;
      } else if (ordinalMatch[0].includes('second') || ordinalMatch[0].includes('2nd') || ordinalMatch[0].includes('product 2')) {
        ordinalProductNumber = 2;
      } else if (ordinalMatch[0].includes('third') || ordinalMatch[0].includes('3rd') || ordinalMatch[0].includes('product 3')) {
        ordinalProductNumber = 3;
      } else if (ordinalMatch[0].includes('fourth') || ordinalMatch[0].includes('4th') || ordinalMatch[0].includes('product 4')) {
        ordinalProductNumber = 4;
      } else if (ordinalMatch[0].includes('fifth') || ordinalMatch[0].includes('5th') || ordinalMatch[0].includes('product 5')) {
        ordinalProductNumber = 5;
      }
    }
    
        if (isDirectProductNumber || ordinalProductNumber > 0) {
      const productNumber = isDirectProductNumber ? parseInt(normalizedQuery.trim()) : ordinalProductNumber;
      let productResponse: KnowledgeResponse | null = null;
      
      switch(productNumber) {
        case 1:
          productResponse = {
            answer: "SupportBot Pro ($499/month) is our flagship AI assistant for customer service. It features advanced natural language processing to understand customer inquiries, 24/7 availability, multilingual support in over 30 languages, seamless escalation to human agents when needed, and integration with popular CRM systems. It's ideal for businesses looking to improve their customer support while reducing costs. Would you like to know more specific features or see a demo?",
            source: "FAQ",
            sourceType: "faq" as const,
            sourceId: "supportbot-details",
            sourceTitle: "SupportBot Pro Details",
            confidence: 95,
            relatedQuestions: [
              "How does SupportBot handle complex issues?",
              "What languages does it support?",
              "How can I integrate it with my existing systems?"
            ]
          };
          break;
        case 2:
          productResponse = {
            answer: "Knowledge Hub ($299/month) is our dynamic knowledge base system that uses AI to organize and retrieve information. It features automated categorization of support content, intelligent search capabilities, content gap analysis to identify missing documentation, and analytics to track most-accessed information. It's perfect for teams wanting to maintain an always up-to-date knowledge base with minimal effort. Would you like to know more about its features?",
            source: "FAQ",
            sourceType: "faq" as const,
            sourceId: "knowledgehub-details",
            sourceTitle: "Knowledge Hub Details",
            confidence: 95,
            relatedQuestions: [
              "How does Knowledge Hub organize content?",
              "Can it import existing documentation?",
              "Does it integrate with SupportBot Pro?"
            ]
          };
          break;
        case 3:
          productResponse = {
            answer: "Agent Assist ($199/month) is designed to make human support agents more efficient. It provides real-time suggested responses, automated tagging of tickets, customer sentiment analysis, and performance coaching. This tool typically increases agent productivity by 30-40% while improving response quality. Would you like to know how it integrates with your existing support tools?",
            source: "FAQ",
            sourceType: "faq" as const,
            sourceId: "agentassist-details",
            sourceTitle: "Agent Assist Details",
            confidence: 95,
            relatedQuestions: [
              "What metrics does Agent Assist track?",
              "How does it help with agent training?",
              "Can it work with our ticketing system?"
            ]
          };
          break;
        case 4:
          productResponse = {
            answer: "Analytics Dashboard ($149/month) provides comprehensive insights into your support operations. It tracks key metrics like resolution time, customer satisfaction, common issues, and agent performance. The dashboard includes customizable reports, trend analysis, and exportable data. It's an essential tool for support managers looking to optimize their operations. Would you like to know what specific KPIs it can track?",
            source: "FAQ",
            sourceType: "faq" as const,
            sourceId: "analytics-details",
            sourceTitle: "Analytics Dashboard Details",
            confidence: 95,
            relatedQuestions: [
              "What visualizations are available?",
              "Can I create custom reports?",
              "Does it provide predictive analytics?"
            ]
          };
          break;
        case 5:
          productResponse = {
            answer: "Enterprise Suite ($1499/month) is our comprehensive solution that includes all our products (SupportBot Pro, Knowledge Hub, Agent Assist, and Analytics Dashboard) plus additional enterprise features. These include dedicated support, custom integrations, enhanced security controls, and SLA guarantees. It's designed for large organizations with complex support needs. Would you like to discuss how this could be customized for your organization?",
            source: "FAQ",
            sourceType: "faq" as const,
            sourceId: "enterprise-details",
            sourceTitle: "Enterprise Suite Details",
            confidence: 95,
            relatedQuestions: [
              "What kind of SLAs do you offer?",
              "Do you provide implementation assistance?",
              "Can you support global deployments?"
            ]
          };
          break;
        default:
          break;
      }
      
      if (productResponse) {
        // Cache this response
        responseCache.set(cacheKey, {
          response: productResponse,
          timestamp: Date.now()
        });
        
        return NextResponse.json(productResponse);
      }
    }

    // ADVANCED CONTEXT TRACKING: More sophisticated topic detection with weighted scoring
    let conversationTopic = "general";
    let lastAssistantMessage = "";
    let lastUserMessage = "";
    let recentQuestionType = ""; // Keep track of question types in recent history
    
    if (history && Array.isArray(history) && history.length > 0) {
      // Extract the most recent messages for direct context
      const recentHistory = history.slice(-6); // Look at last 6 messages
      
      // Find the last assistant and user messages for immediate context
      for (let i = recentHistory.length - 1; i >= 0; i--) {
        const msg = recentHistory[i];
        if (msg.role === 'assistant' && !lastAssistantMessage) {
          lastAssistantMessage = msg.content.toLowerCase();
        }
        if (msg.role === 'user' && !lastUserMessage && msg.content.toLowerCase() !== normalizedQuery) {
          lastUserMessage = msg.content.toLowerCase();
        }
        if (lastAssistantMessage && lastUserMessage) break;
      }
      
             // Define topic keywords and patterns with weighted importance
       interface TopicPattern {
         keywords: string[];
         phrases: string[];
         weight: number;
       }
       
       interface TopicPatterns {
         [key: string]: TopicPattern;
       }
       
       const topicPatterns: TopicPatterns = {
         products: {
           keywords: ["product", "supportbot", "knowledge hub", "agent assist", "analytics", "enterprise", 
                     "bot", "offer", "sell", "service", "solution", "feature", "capability"],
           phrases: ["what do you offer", "what products", "tell me about", "features of"],
           weight: 0
         },
         pricing: {
           keywords: ["price", "pricing", "cost", "subscription", "fee", "payment", "plan", "billing", 
                     "dollar", "money", "expensive", "cheap", "afford", "$"],
           phrases: ["how much", "what is the cost", "pricing plan"],
           weight: 0
         },
         delivery: {
           keywords: ["delivery", "shipping", "ship", "deliver", "sent", "send", "mail", "package", 
                     "receive", "download", "access", "implement", "setup", "install"],
           phrases: ["how do i get", "when will i receive", "how is it delivered"],
           weight: 0
         },
         account: {
           keywords: ["account", "login", "password", "profile", "settings", "email", "user", "admin", 
                     "permission", "role", "authentication", "security"],
           phrases: ["sign in", "log in", "my account", "reset password"],
           weight: 0
         },
         technical: {
           keywords: ["issue", "problem", "error", "bug", "broken", "crash", "fix", "help", "support", 
                     "troubleshoot", "doesn't work", "not working", "failed"],
           phrases: ["having trouble", "doesn't work", "how to fix", "need help with"],
           weight: 0
         }
       };
      
      // Analyze last assistant message to give context priority
      // If the assistant just talked about products, that's the most likely context
      if (lastAssistantMessage) {
        for (const [topic, patterns] of Object.entries(topicPatterns)) {
          // Check for topic keywords in the last assistant message with higher weight
          for (const keyword of patterns.keywords) {
            if (lastAssistantMessage.includes(keyword)) {
              topicPatterns[topic].weight += 2; // Higher weight for recent assistant context
            }
          }
          
          // Check for topic phrases
          for (const phrase of patterns.phrases) {
            if (lastAssistantMessage.includes(phrase)) {
              topicPatterns[topic].weight += 3; // Even higher for phrases
            }
          }
          
          // Special handling for product numbers in assistant message
          if (topic === 'products' && /supportbot pro|knowledge hub|agent assist|analytics dashboard|enterprise suite/i.test(lastAssistantMessage)) {
            topicPatterns.products.weight += 5; // Strong signal that we're discussing specific products
          }
        }
      }
      
      // Process all messages in recent history with decaying importance
      const messageWeights = [0.5, 0.7, 0.8, 0.9, 1.0, 1.2]; // Older to newer (most recent gets 1.2 weight)
      
      for (let i = 0; i < recentHistory.length; i++) {
        const msg = recentHistory[i];
        const messageWeight = messageWeights[i];
        const content = msg.content.toLowerCase();
        
        // Identify explicit question types
        if (content.includes("?")) {
          if (/what (is|are|do) you (have|offer|sell|provide)/i.test(content)) {
            recentQuestionType = "products";
          } else if (/how much|pricing|cost|price/i.test(content)) {
            recentQuestionType = "pricing";
          } else if (/how (do|can|will) (i|we) (get|receive|access)/i.test(content)) {
            recentQuestionType = "delivery";
          }
        }
        
        // Calculate weighted scores
        for (const [topic, patterns] of Object.entries(topicPatterns)) {
          // Check for keywords
          for (const keyword of patterns.keywords) {
            if (content.includes(keyword)) {
              topicPatterns[topic].weight += 1 * messageWeight;
            }
          }
          
          // Check for phrases (higher weight)
          for (const phrase of patterns.phrases) {
            if (content.includes(phrase)) {
              topicPatterns[topic].weight += 2 * messageWeight;
            }
          }
        }
      }
      
             // Determine the highest weighted topic
       let maxWeight = 0;
       
       for (const [topic, patterns] of Object.entries(topicPatterns)) {
         if (patterns.weight > maxWeight) {
           conversationTopic = topic;
           maxWeight = patterns.weight;
         }
       }
      
      // If a recent explicit question was asked and has a good score, prioritize it
      if (recentQuestionType && topicPatterns[recentQuestionType].weight > maxWeight * 0.7) {
        conversationTopic = recentQuestionType;
      }
      
      // Special handling for product-specific context
      if (conversationTopic === "products" && lastAssistantMessage) {
        if (lastAssistantMessage.includes("supportbot pro")) {
          conversationTopic = "product_1";
        } else if (lastAssistantMessage.includes("knowledge hub")) {
          conversationTopic = "product_2";
        } else if (lastAssistantMessage.includes("agent assist")) {
          conversationTopic = "product_3";
        } else if (lastAssistantMessage.includes("analytics dashboard")) {
          conversationTopic = "product_4";
        } else if (lastAssistantMessage.includes("enterprise suite")) {
          conversationTopic = "product_5";
        }
      }
    }
    
    console.log('Advanced topic detection result:', conversationTopic);
    
    console.log('Detected conversation topic:', conversationTopic);
    
    // ENHANCED TYPO HANDLING: Check for similar words and common typos
    const fuzzyCheck = (query: string, targetWords: string[]): boolean => {
      // Direct match
      if (targetWords.some(word => query.includes(word))) return true;
      
      // Check for typos with distance of 1-2 characters
      for (const word of targetWords) {
        // Very short words (3 chars or less) must match exactly
        if (word.length <= 3) {
          if (query.includes(word)) return true;
          continue;
        }
        
        // For longer words, allow 1-2 character typos
        if (query.split(' ').some(queryWord => {
          if (Math.abs(queryWord.length - word.length) <= 2) {
            let differences = 0;
            const minLength = Math.min(queryWord.length, word.length);
            for (let i = 0; i < minLength; i++) {
              if (queryWord[i] !== word[i]) differences++;
            }
            differences += Math.abs(queryWord.length - word.length);
            return differences <= 2;
          }
          return false;
        })) return true;
      }
      return false;
    };

    // Product-specific query detection with improved fuzzy matching
    const isProductQuery = fuzzyCheck(normalizedQuery, [
      'product', 'products', 'offer', 'service', 'services', 
      'sell', 'selling', 'show', 'list', 'catalog'
    ]);
    
    // IMPROVED: Better delivery/shipping detection with more keywords and looser matching
    const isDeliveryQuery = fuzzyCheck(normalizedQuery, [
      'delivery', 'shipping', 'ship', 'deliver', 'sent', 'send',
      'mail', 'package', 'dispatch', 'transit', 'arrival', 'receive',
      'get product', 'download', 'access', 'implement', 'setup'
    ]) || normalizedQuery.includes('deliv') || normalizedQuery.includes('shipp');
    
    // ADVANCED COMMAND RECOGNITION: Better handling of short responses and commands
    const isShortResponse = normalizedQuery.split(' ').length <= 2;
    const isNumericResponse = /^[1-5]$/.test(normalizedQuery.trim());
    const isSimpleAcknowledgment = /^(ok|okay|sure|yes|no|thanks|thank you|thx|good|great|nice|cool|got it|get|done)$/i.test(normalizedQuery);
    const isCommand = /^(show|tell|list|explain|info|details|help|about)/i.test(normalizedQuery);
    
    // ENHANCED: Handle product-specific context for short responses
    if (conversationTopic.startsWith("product_") && (isShortResponse || isCommand)) {
      const productNumber = parseInt(conversationTopic.split("_")[1]);
      if (productNumber >= 1 && productNumber <= 5) {
        // User is asking for more info about a specific product they were just discussing
        return getProductDetailResponse(productNumber);
      }
    }
    
    // Handle topic-specific commands like "tell me more" based on context
    if (isCommand) {
      if (/about|details|more|features|explain|info/i.test(normalizedQuery)) {
        if (conversationTopic === "products" || lastAssistantMessage.includes("product")) {
          return NextResponse.json({
            answer: "Our product lineup includes:\n\n1. SupportBot Pro ($499/month) - Our AI assistant for customer service with NLP capabilities\n2. Knowledge Hub ($299/month) - Knowledge management system with AI organization\n3. Agent Assist ($199/month) - Tools to make human agents more efficient\n4. Analytics Dashboard ($149/month) - Insights and reporting for support operations\n5. Enterprise Suite ($1499/month) - Comprehensive solution with all products\n\nWould you like to know more about any specific product? Just type its number (1-5).",
            source: "FAQ",
            sourceType: "faq" as const,
            sourceId: "product-lineup",
            sourceTitle: "Product Lineup",
            confidence: 98,
            relatedQuestions: [
              "What features does SupportBot Pro have?",
              "How does the Knowledge Hub work?",
              "Tell me about the Enterprise Suite"
            ]
          });
        } else if (conversationTopic === "pricing") {
          return NextResponse.json({
            answer: "Our pricing is designed to be flexible and scalable:\n\n1. SupportBot Pro: $499/month\n2. Knowledge Hub: $299/month\n3. Agent Assist: $199/month\n4. Analytics Dashboard: $149/month\n5. Enterprise Suite: $1499/month\n\nAll plans include standard support and updates. We offer a 15% discount for annual billing, and volume discounts for larger teams. Would you like to discuss which option might be best for your needs?",
            source: "FAQ",
            sourceType: "faq" as const, 
            sourceId: "pricing-details",
            sourceTitle: "Pricing Details",
            confidence: 95,
            relatedQuestions: [
              "Do you offer a free trial?",
              "What's included in the Enterprise Suite?",
              "Can I change plans later?"
            ]
          });
        } else if (conversationTopic === "delivery") {
          return NextResponse.json({
            answer: "Our implementation process is designed to be smooth and efficient. After purchase, you'll receive immediate access to your customer portal where you can download and set up our software. For Enterprise customers, we provide a dedicated implementation specialist who will guide you through the setup process, customize the solution to your needs, and provide training for your team. The typical implementation timeline is:\n\n- Basic setup: 1-3 days\n- Custom configuration: 1-2 weeks\n- Full enterprise implementation: 2-4 weeks\n\nWe also offer 24/7 support during the implementation phase.",
            source: "FAQ",
            sourceType: "faq" as const,
            sourceId: "implementation-details",
            sourceTitle: "Implementation Process",
            confidence: 95,
            relatedQuestions: [
              "What training do you provide?",
              "How do you handle data migration?",
              "What's involved in the enterprise setup?"
            ]
          });
        }
      }
    }
    
    // ENHANCED: Handle simple acknowledgments based on conversation context with better topic awareness
    if (isSimpleAcknowledgment || (isShortResponse && !isNumericResponse && normalizedQuery.length < 8)) {
      // Provide more intelligent responses based on the detected conversation topic
      
      if (conversationTopic === "products") {
        return NextResponse.json({
          answer: "I'd be happy to tell you more about our products. We offer SupportBot Pro ($499/month), Knowledge Hub ($299/month), Agent Assist ($199/month), Analytics Dashboard ($149/month), and our Enterprise Suite ($1499/month). Would you like specific details about any of these? You can type a number 1-5 to learn more about each product.",
          source: "FAQ",
          sourceType: "faq" as const,
          sourceId: "product-details",
          sourceTitle: "Product Information",
          confidence: 95,
          relatedQuestions: [
            "Tell me about SupportBot Pro",
            "What features does Knowledge Hub have?",
            "How does pricing work?"
          ]
        });
      } else if (conversationTopic === "pricing") {
        return NextResponse.json({
          answer: "Our pricing starts at $149/month for the Analytics Dashboard, with SupportBot Pro at $499/month, Knowledge Hub at $299/month, Agent Assist at $199/month, and our comprehensive Enterprise Suite at $1499/month. All plans include standard support and updates. We also offer discounts for annual billing. Would you like more details about what features are included in each plan?",
          source: "FAQ", 
          sourceType: "faq" as const,
          sourceId: "pricing-info",
          sourceTitle: "Pricing Information",
          confidence: 95,
          relatedQuestions: [
            "What's included in SupportBot Pro?",
            "Do you offer discounts for startups?",
            "Can I customize my plan?"
          ]
        });
      } else if (conversationTopic === "delivery") {
        return NextResponse.json({
          answer: "All our products are delivered digitally through our secure customer portal immediately after purchase. For the Enterprise Suite, we also offer white-glove implementation support where our team helps with setup and configuration according to your needs. The implementation process typically takes 2-4 weeks for enterprise customers, and our team provides training and support throughout the process. Would you like to know more about our implementation services?",
          source: "FAQ",
          sourceType: "faq" as const,
          sourceId: "delivery-info",
          sourceTitle: "Product Delivery Information",
          confidence: 95,
          relatedQuestions: [
            "How long does implementation take?",
            "Do you offer training?",
            "What support do you provide during setup?"
          ]
        });
      } else if (conversationTopic === "account") {
        return NextResponse.json({
          answer: "I understand you're interested in account-related information. You can manage your account settings, update your profile, change your password, and configure security options through our customer portal. We support role-based access control, two-factor authentication, and SSO integration for enterprise customers. Is there something specific about account management you'd like to know?",
          source: "FAQ",
          sourceType: "faq" as const,
          sourceId: "account-info",
          sourceTitle: "Account Management",
          confidence: 95,
          relatedQuestions: [
            "How do I reset my password?",
            "Can I add team members to my account?",
            "What security features do you offer?"
          ]
        });
      } else if (conversationTopic === "technical") {
        return NextResponse.json({
          answer: "For technical support, we offer 24/7 assistance through our customer portal. Our team can help troubleshoot any issues you're experiencing with our products, with an average response time of under 2 hours. For Enterprise customers, we provide a dedicated support line with guaranteed 30-minute response times. What specific technical issue can I help with?",
          source: "FAQ",
          sourceType: "faq" as const,
          sourceId: "tech-support",
          sourceTitle: "Technical Support",
          confidence: 95,
          relatedQuestions: [
            "How do I contact technical support?",
            "What are your support hours?",
            "Do you have a knowledge base for common issues?"
          ]
        });
      } else {
        // Default for simple acknowledgments when no clear context
        return NextResponse.json({
          answer: "Is there something specific I can help you with today? You can ask about our products, pricing, account settings, or technical support. Our most popular products include SupportBot Pro and the Knowledge Hub, which help businesses improve their customer support efficiency.",
          source: "System",
          sourceType: "doc" as const,
          sourceId: "default-followup",
          sourceTitle: "Default Follow-up",
          confidence: 90,
          relatedQuestions: [
            "What products do you offer?",
            "How much does SupportBot Pro cost?",
            "Tell me about your implementation process"
          ]
        });
      }
    }
    
    // Helper function to get detailed product information by number
    function getProductDetailResponse(productNumber: number): NextResponse {
      let productResponse: KnowledgeResponse;
      
      switch(productNumber) {
        case 1:
          productResponse = {
            answer: "SupportBot Pro ($499/month) is our flagship AI assistant for customer service. It features advanced natural language processing to understand customer inquiries, 24/7 availability, multilingual support in over 30 languages, seamless escalation to human agents when needed, and integration with popular CRM systems. It's ideal for businesses looking to improve their customer support while reducing costs. Would you like to know more specific features or see a demo?",
            source: "FAQ",
            sourceType: "faq" as const,
            sourceId: "supportbot-details",
            sourceTitle: "SupportBot Pro Details",
            confidence: 98,
            relatedQuestions: [
              "How does SupportBot handle complex issues?",
              "What languages does it support?",
              "How can I integrate it with my existing systems?"
            ]
          };
          break;
        case 2:
          productResponse = {
            answer: "Knowledge Hub ($299/month) is our dynamic knowledge base system that uses AI to organize and retrieve information. It features automated categorization of support content, intelligent search capabilities, content gap analysis to identify missing documentation, and analytics to track most-accessed information. It's perfect for teams wanting to maintain an always up-to-date knowledge base with minimal effort. Would you like to know more about its features?",
            source: "FAQ",
            sourceType: "faq" as const,
            sourceId: "knowledgehub-details",
            sourceTitle: "Knowledge Hub Details",
            confidence: 98,
            relatedQuestions: [
              "How does Knowledge Hub organize content?",
              "Can it import existing documentation?",
              "Does it integrate with SupportBot Pro?"
            ]
          };
          break;
        case 3:
          productResponse = {
            answer: "Agent Assist ($199/month) is designed to make human support agents more efficient. It provides real-time suggested responses, automated tagging of tickets, customer sentiment analysis, and performance coaching. This tool typically increases agent productivity by 30-40% while improving response quality. Would you like to know how it integrates with your existing support tools?",
            source: "FAQ",
            sourceType: "faq" as const,
            sourceId: "agentassist-details",
            sourceTitle: "Agent Assist Details",
            confidence: 98,
            relatedQuestions: [
              "What metrics does Agent Assist track?",
              "How does it help with agent training?",
              "Can it work with our ticketing system?"
            ]
          };
          break;
        case 4:
          productResponse = {
            answer: "Analytics Dashboard ($149/month) provides comprehensive insights into your support operations. It tracks key metrics like resolution time, customer satisfaction, common issues, and agent performance. The dashboard includes customizable reports, trend analysis, and exportable data. It's an essential tool for support managers looking to optimize their operations. Would you like to know what specific KPIs it can track?",
            source: "FAQ",
            sourceType: "faq" as const,
            sourceId: "analytics-details",
            sourceTitle: "Analytics Dashboard Details",
            confidence: 98,
            relatedQuestions: [
              "What visualizations are available?",
              "Can I create custom reports?",
              "Does it provide predictive analytics?"
            ]
          };
          break;
        case 5:
          productResponse = {
            answer: "Enterprise Suite ($1499/month) is our comprehensive solution that includes all our products (SupportBot Pro, Knowledge Hub, Agent Assist, and Analytics Dashboard) plus additional enterprise features. These include dedicated support, custom integrations, enhanced security controls, and SLA guarantees. It's designed for large organizations with complex support needs. Would you like to discuss how this could be customized for your organization?",
            source: "FAQ",
            sourceType: "faq" as const,
            sourceId: "enterprise-details",
            sourceTitle: "Enterprise Suite Details",
            confidence: 98,
            relatedQuestions: [
              "What kind of SLAs do you offer?",
              "Do you provide implementation assistance?",
              "Can you support global deployments?"
            ]
          };
          break;
        default:
          productResponse = {
            answer: "We offer a comprehensive suite of AI support products, including SupportBot Pro, Knowledge Hub, Agent Assist, Analytics Dashboard, and our all-in-one Enterprise Suite. Each product is designed to enhance your customer experience and streamline support operations. Would you like specific information about any of these products?",
            source: "FAQ",
            sourceType: "faq" as const,
            sourceId: "product-overview",
            sourceTitle: "Product Overview",
            confidence: 90,
            relatedQuestions: [
              "Tell me about SupportBot Pro",
              "What features does Knowledge Hub have?",
              "How much does the Enterprise Suite cost?"
            ]
          };
      }
      
      return NextResponse.json(productResponse);
    }
    
    // IMPROVED: Give higher priority to delivery/shipping queries to avoid context confusion
    if (normalizedQuery.includes('deliv') || 
        normalizedQuery.includes('shipp') || 
        normalizedQuery.includes('ship') || 
        /delivery|shipping|send|download|receive|access/i.test(normalizedQuery)) {
        
      return NextResponse.json({
        answer: "Our products are software solutions delivered digitally through our secure customer portal. After purchase, you'll receive immediate access to your account where you can download and implement our tools. For Enterprise customers, we also offer dedicated implementation support with a team that will help you set up and configure the software to meet your specific needs. The implementation process typically takes 2-4 weeks depending on your requirements. Is there anything specific about our delivery process you'd like to know?",
        source: "FAQ",
        sourceType: "faq" as const,
        sourceId: "delivery-details",
        sourceTitle: "Delivery Information",
        confidence: 95,
        relatedQuestions: [
          "How long does implementation take?",
          "Do you provide training?",
          "Is there 24/7 support during implementation?"
        ]
      });
    }
    
    // Handle delivery/shipping specific questions (fallback with fuzzy matching)
    if (isDeliveryQuery) {
      return NextResponse.json({
        answer: "Our products are software solutions delivered digitally through our secure customer portal. After purchase, you'll receive immediate access to your account where you can download and implement our tools. For Enterprise customers, we also offer dedicated implementation support with a team that will help you set up and configure the software to meet your specific needs. The implementation process typically takes 2-4 weeks depending on your requirements. Is there anything specific about our delivery process you'd like to know?",
        source: "FAQ",
        sourceType: "faq" as const,
        sourceId: "delivery-details",
        sourceTitle: "Delivery Information",
        confidence: 90,
        relatedQuestions: [
          "How long does implementation take?",
          "Do you provide training?",
          "Is there 24/7 support during implementation?"
        ]
      });
    }
    
    // IMPROVED PRODUCT NUMBER HANDLING
    // If the user enters a number 1-5, treat it as a product selection
    // regardless of previous context
    if (isNumericResponse) {
      const productNumber = parseInt(normalizedQuery.trim());
      let productResponse: KnowledgeResponse | null = null;
      
      switch(productNumber) {
        case 1:
          productResponse = {
            answer: "SupportBot Pro ($499/month) is our flagship AI assistant for customer service. It features advanced natural language processing to understand customer inquiries, 24/7 availability, multilingual support in over 30 languages, seamless escalation to human agents when needed, and integration with popular CRM systems. It's ideal for businesses looking to improve their customer support while reducing costs. Would you like to know more specific features or see a demo?",
            source: "FAQ",
            sourceType: "faq" as const,
            sourceId: "supportbot-details",
            sourceTitle: "SupportBot Pro Details",
            confidence: 95,
            relatedQuestions: [
              "How does SupportBot handle complex issues?",
              "What languages does it support?",
              "How can I integrate it with my existing systems?"
            ]
          };
          break;
        case 2:
          productResponse = {
            answer: "Knowledge Hub ($299/month) is our dynamic knowledge base system that uses AI to organize and retrieve information. It features automated categorization of support content, intelligent search capabilities, content gap analysis to identify missing documentation, and analytics to track most-accessed information. It's perfect for teams wanting to maintain an always up-to-date knowledge base with minimal effort. Would you like to know more about its features?",
            source: "FAQ",
            sourceType: "faq" as const,
            sourceId: "knowledgehub-details",
            sourceTitle: "Knowledge Hub Details",
            confidence: 95,
            relatedQuestions: [
              "How does Knowledge Hub organize content?",
              "Can it import existing documentation?",
              "Does it integrate with SupportBot Pro?"
            ]
          };
          break;
        case 3:
          productResponse = {
            answer: "Agent Assist ($199/month) is designed to make human support agents more efficient. It provides real-time suggested responses, automated tagging of tickets, customer sentiment analysis, and performance coaching. This tool typically increases agent productivity by 30-40% while improving response quality. Would you like to know how it integrates with your existing support tools?",
            source: "FAQ",
            sourceType: "faq" as const,
            sourceId: "agentassist-details",
            sourceTitle: "Agent Assist Details",
            confidence: 95,
            relatedQuestions: [
              "What metrics does Agent Assist track?",
              "How does it help with agent training?",
              "Can it work with our ticketing system?"
            ]
          };
          break;
        case 4:
          productResponse = {
            answer: "Analytics Dashboard ($149/month) provides comprehensive insights into your support operations. It tracks key metrics like resolution time, customer satisfaction, common issues, and agent performance. The dashboard includes customizable reports, trend analysis, and exportable data. It's an essential tool for support managers looking to optimize their operations. Would you like to know what specific KPIs it can track?",
            source: "FAQ",
            sourceType: "faq" as const,
            sourceId: "analytics-details",
            sourceTitle: "Analytics Dashboard Details",
            confidence: 95,
            relatedQuestions: [
              "What visualizations are available?",
              "Can I create custom reports?",
              "Does it provide predictive analytics?"
            ]
          };
          break;
        case 5:
          productResponse = {
            answer: "Enterprise Suite ($1499/month) is our comprehensive solution that includes all our products (SupportBot Pro, Knowledge Hub, Agent Assist, and Analytics Dashboard) plus additional enterprise features. These include dedicated support, custom integrations, enhanced security controls, and SLA guarantees. It's designed for large organizations with complex support needs. Would you like to discuss how this could be customized for your organization?",
            source: "FAQ",
            sourceType: "faq" as const,
            sourceId: "enterprise-details",
            sourceTitle: "Enterprise Suite Details",
            confidence: 95,
            relatedQuestions: [
              "What kind of SLAs do you offer?",
              "Do you provide implementation assistance?",
              "Can you support global deployments?"
            ]
          };
          break;
        default:
          break;
      }
      
      if (productResponse) {
        // Cache this response
        responseCache.set(cacheKey, {
          response: productResponse,
          timestamp: Date.now()
        });
        
        return NextResponse.json(productResponse);
      }
    }

    // If query is specifically about products
    if (isProductQuery) {
      // Find the product FAQ that best matches the query
      const productFAQs = faqs.filter(faq => 
        faq.id === 'faq-7' || 
        faq.id === 'faq-8' || 
        faq.id === 'faq-9' || 
        faq.id === 'faq-11'
      );
      
      // Use the most relevant product FAQ
      if (productFAQs.length > 0) {
        let bestMatch = productFAQs[0];
        
        // Try to find the best match among product FAQs
        for (const faq of productFAQs) {
          if (faq.question.toLowerCase().includes('i want to see') || 
              faq.question.toLowerCase().includes('what products')) {
            bestMatch = faq;
            break;
          }
        }
        
        const productResponse: KnowledgeResponse = {
          answer: bestMatch.answer,
          source: "FAQ",
          sourceType: "faq",
          sourceId: bestMatch.id,
          sourceTitle: bestMatch.question,
          confidence: 95,
          relatedQuestions: [
            "Tell me about SupportBot Pro",
            "What features are included in the Enterprise Suite?",
            "Do you offer a free trial?"
          ]
        };
        
        // Cache result
        responseCache.set(cacheKey, {
          response: productResponse,
          timestamp: Date.now()
        });
        
        return NextResponse.json(productResponse);
      }
    }

    // Classify intent to inform search behavior
    const intent = classifyIntent(question);
    
    // Expand query with synonyms and related terms
    const expandedQuery = expandQuery(normalizedQuery, intent.intent);

    // Search across all knowledge bases with improved matching
    let result: KnowledgeResponse | null = null;
    let highestConfidence = 0;
    const secondBestMatches: KnowledgeEntry[] = []; // Use const instead of let

    // Helper function to check if the query is related to a topic
    const isRelatedToTopic = (text: string, query: string): boolean => {
      if (!text) return false;
      
      // Direct product query handling
      if (query.includes('product') && text.toLowerCase().includes('product')) {
        return true;
      }
      
      // Split into words and check for matches
      const textWords = text.toLowerCase().split(/\s+/);
      const queryWords = query.split(/\s+/);
      
      // Consider match if any significant query word matches any text word
      return queryWords.some(word => 
        word.length > 3 && textWords.some(textWord => textWord.includes(word) || word.includes(textWord))
      );
    };

    // Search in FAQs
    for (const faq of faqs) {
      // More flexible matching - check if any significant word in the query matches
      const questionMatch = isRelatedToTopic(faq.question, expandedQuery);
      const answerMatch = isRelatedToTopic(faq.answer, expandedQuery);
      
      if (questionMatch || answerMatch) {
        const confidence = calculateEnhancedConfidence(
          normalizedQuery, 
          expandedQuery,
          faq.question, 
          faq.answer,
          'faq',
          intent.intent
        );
        
        if (confidence > highestConfidence) {
          // Move current best match to second best if it exists
          if (result) {
            secondBestMatches.push({
              ...result
            });
          }
          
          highestConfidence = confidence;
          result = {
            answer: faq.answer,
            source: "FAQ",
            sourceType: "faq",
            sourceId: faq.id,
            sourceTitle: faq.question,
            confidence
          };
        } else if (confidence > 60) {
          // Keep track of good secondary matches
          secondBestMatches.push({
            answer: faq.answer,
            source: "FAQ",
            sourceType: "faq",
            sourceId: faq.id,
            sourceTitle: faq.question
          });
        }
      }
    }

    // Search in Docs with the same improved approach
    for (const doc of docs) {
      const titleMatch = isRelatedToTopic(doc.title, expandedQuery);
      const questionMatch = isRelatedToTopic(doc.question, expandedQuery);
      const contentMatch = isRelatedToTopic(doc.content, expandedQuery);
      
      if (titleMatch || questionMatch || contentMatch) {
        const confidence = calculateEnhancedConfidence(
          normalizedQuery, 
          expandedQuery,
          doc.title + " " + doc.question, 
          doc.content,
          'doc',
          intent.intent
        );
        
        if (confidence > highestConfidence) {
          // Move current best match to second best if it exists
          if (result) {
            secondBestMatches.push({
              ...result
            });
          }
          
          highestConfidence = confidence;
          result = {
            answer: doc.content,
            source: "Docs",
            sourceType: "doc",
            sourceId: doc.id,
            sourceTitle: doc.title,
            confidence
          };
        } else if (confidence > 60) {
          // Keep track of good secondary matches
          secondBestMatches.push({
            answer: doc.content,
            source: "Docs",
            sourceType: "doc",
            sourceId: doc.id,
            sourceTitle: doc.title
          });
        }
      }
    }

    // Search in Rules with the same improved approach
    for (const rule of rules) {
      const titleMatch = isRelatedToTopic(rule.title, expandedQuery);
      const questionMatch = isRelatedToTopic(rule.question, expandedQuery);
      const descriptionMatch = isRelatedToTopic(rule.description, expandedQuery);
      
      if (titleMatch || questionMatch || descriptionMatch) {
        const confidence = calculateEnhancedConfidence(
          normalizedQuery, 
          expandedQuery,
          rule.title + " " + rule.question, 
          rule.description,
          'rule',
          intent.intent
        );
        
        if (confidence > highestConfidence) {
          // Move current best match to second best if it exists
          if (result) {
            secondBestMatches.push({
              ...result
            });
          }
          
          highestConfidence = confidence;
          result = {
            answer: rule.description,
            source: "Rulebook",
            sourceType: "rule",
            sourceId: rule.id,
            sourceTitle: rule.title,
            confidence
          };
        } else if (confidence > 60) {
          // Keep track of good secondary matches
          secondBestMatches.push({
            answer: rule.description,
            source: "Rulebook",
            sourceType: "rule",
            sourceId: rule.id,
            sourceTitle: rule.title
          });
        }
      }
    }

    // Search in Escalations with the same improved approach
    for (const escalation of escalations) {
      const titleMatch = isRelatedToTopic(escalation.title, expandedQuery);
      const questionMatch = isRelatedToTopic(escalation.question, expandedQuery);
      const responseMatch = isRelatedToTopic(escalation.response, expandedQuery);
      
      if (titleMatch || questionMatch || responseMatch) {
        const confidence = calculateEnhancedConfidence(
          normalizedQuery, 
          expandedQuery,
          escalation.title + " " + escalation.question, 
          escalation.response,
          'escalation',
          intent.intent
        );
        
        if (confidence > highestConfidence) {
          // Move current best match to second best if it exists
          if (result) {
            secondBestMatches.push({
              ...result
            });
          }
          
          highestConfidence = confidence;
          result = {
            answer: `${escalation.response}\n\nEscalation Path: ${escalation.escalationPath}`,
            source: "Escalation",
            sourceType: "escalation",
            sourceId: escalation.id,
            sourceTitle: escalation.title,
            confidence
          };
        } else if (confidence > 60) {
          // Keep track of good secondary matches
          secondBestMatches.push({
            answer: `${escalation.response}\n\nEscalation Path: ${escalation.escalationPath}`,
            source: "Escalation",
            sourceType: "escalation",
            sourceId: escalation.id,
            sourceTitle: escalation.title
          });
        }
      }
    }

    // IMPROVED: Better greeting detection with higher priority
    if (/^(hi|hello|hey|greetings|hi there|morning|evening|afternoon|howdy|hola)/i.test(normalizedQuery)) {
      return NextResponse.json({
        answer: "Hello! Welcome to our AI Support Portal. How can I help you today? You can ask about our products, account settings, or technical support.",
        source: "System",
        sourceType: "doc",
        sourceId: "greeting",
        sourceTitle: "Greeting",
        confidence: 95,
        relatedQuestions: [
          "What products do you offer?",
          "How do I reset my password?",
          "Tell me about your pricing options"
        ]
      });
    }

    // IMPROVED: Better pricing detection
    if (!result && /(cost|price|pricing|how much|subscription|fee)/i.test(normalizedQuery)) {
      return NextResponse.json({
        answer: "Our pricing is as follows:\n\n1. SupportBot Pro: $499/month\n2. Knowledge Hub: $299/month\n3. Agent Assist: $199/month\n4. Analytics Dashboard: $149/month\n5. Enterprise Suite: $1499/month\n\nAll plans include standard support and regular updates. Enterprise customers also receive dedicated support and implementation assistance. Would you like more details about what's included in each plan?",
        source: "FAQ",
        sourceType: "faq",
        sourceId: "pricing-info",
        sourceTitle: "Pricing Information",
        confidence: 90,
        relatedQuestions: [
          "What's included in the Enterprise Suite?",
          "Do you offer discounts for annual billing?",
          "Can I upgrade my plan later?"
        ]
      });
    }
    
    // If query is about products, provide product information
    if (!result && /(product|products|offer|sell|available)/i.test(normalizedQuery)) {
      result = {
        answer: "We offer a wide range of products and services including:\n\n1. AI-powered customer support solutions\n2. Knowledge base management systems\n3. Multilingual support chatbots\n4. Customer data analytics platforms\n5. Custom enterprise solutions\n\nEach product is designed to enhance your customer experience and streamline support operations. Would you like more information about any specific product?",
        source: "Docs",
        sourceType: "doc",
        sourceId: "products-overview",
        sourceTitle: "Products Overview",
        confidence: 85
      };
    }
    
    // NEW: If query is about delivery or shipping, provide delivery information
    if (!result && /(delivery|shipping|ship|deliver|mail|package|sent|send)/i.test(normalizedQuery)) {
      result = {
        answer: "All our products are software solutions delivered digitally through our secure customer portal. After purchase, you'll receive immediate access to your account where you can download and implement our tools. For Enterprise customers, we also offer dedicated implementation support with a team that will help you set up and configure the software to meet your specific needs. The implementation process typically takes 2-4 weeks depending on your requirements. Would you like to know more about our implementation services?",
        source: "FAQ",
        sourceType: "faq",
        sourceId: "delivery-info",
        sourceTitle: "Delivery Information",
        confidence: 90,
        relatedQuestions: [
          "How long does implementation take?",
          "Do you provide training?",
          "What support do you offer during setup?"
        ]
      };
    }

    // If no match was found, provide a default response
    if (!result) {
      result = {
        answer: "I apologize, but I couldn't find a specific answer to your question in our knowledge base. Please try rephrasing your question or contact a senior support agent for assistance.",
        source: "System",
        sourceType: "doc",
        sourceId: "default", 
        sourceTitle: "Default Response",
        confidence: 40
      };
    }
    
    // Enhanced: Add conversation context handling
    try {
      // IMPROVED: Extract topic from conversation history more reliably
      let conversationTopic = "general";
      
      if (history && Array.isArray(history) && history.length > 0) {
        // Analyze recent history to determine topic (looking at more messages)
        const recentHistory = history.slice(-5); // Look at last 5 messages
        
        const topicKeywords = {
          products: ["product", "supportbot", "price", "pricing", "cost", "offer", "sell", "service", "bot", "plan"],
          account: ["account", "password", "login", "signup", "profile", "settings", "email", "user"],
          technical: ["issue", "problem", "error", "bug", "broken", "doesn't work", "fix", "help"],
          delivery: ["delivery", "shipping", "ship", "deliver", "sent", "send", "mail", "package"]
        };
        
        // Check each topic by counting keyword occurrences
        const topicScores: Record<string, number> = { products: 0, account: 0, technical: 0, delivery: 0 };
        
        for (const msg of recentHistory) {
          const content = msg.content.toLowerCase();
          for (const [topic, keywords] of Object.entries(topicKeywords)) {
            if (keywords.some(keyword => content.includes(keyword))) {
              topicScores[topic] += 1;
            }
          }
        }
        
        // Find topic with highest score
        let maxScore = 0;
        for (const [topic, score] of Object.entries(topicScores)) {
          if (score > maxScore) {
            maxScore = score;
            conversationTopic = topic;
          }
        }
      }
      
      console.log('Detected conversation topic:', conversationTopic);
      
      // Check if this is a greeting or simple acknowledgment
      const isSimpleResponse = /^(ok|okay|sure|yes|no|thanks|thank you|thx|good|great|nice|cool|got it|get|done)/i.test(normalizedQuery);
      
      // IMPROVED: Check for product number queries separately
      const isProductNumber = /^[1-5]$/.test(normalizedQuery.trim());
      
      // Make short responses more conversational
      if (isSimpleResponse) {
        // Provide a contextual response based on the current topic
        if (conversationTopic === "products") {
          result = {
            answer: "I'd be happy to provide more information about our products. Our SupportBot Pro ($499/month) is our flagship AI assistant designed specifically for customer service teams. It offers 24/7 support, multilingual capabilities, and seamless escalation to human agents when needed. Would you like to know more about this or our other products?",
            source: "FAQ",
            sourceType: "faq" as const,
            sourceId: "product-detail",
            sourceTitle: "Product Details",
            confidence: 90,
            relatedQuestions: [
              "Tell me about Knowledge Hub",
              "What are the features of SupportBot Pro?",
              "How does your pricing work?"
            ]
          };
        } else if (conversationTopic === "account") {
          result = {
            answer: "I notice we were discussing account-related topics. Is there something specific about account settings or management you'd like to know more about?",
            source: "System",
            sourceType: "doc" as const,
            sourceId: "account-followup",
            sourceTitle: "Account Follow-up",
            confidence: 85,
            relatedQuestions: [
              "How do I change my password?",
              "Can I manage multiple users?",
              "What security features are available?"
            ]
          };
        } else if (conversationTopic === "technical") {
          result = {
            answer: "I see we were discussing technical matters. Is there a specific issue I can help troubleshoot for you?",
            source: "System",
            sourceType: "doc" as const,
            sourceId: "tech-followup",
            sourceTitle: "Technical Follow-up",
            confidence: 85,
            relatedQuestions: [
              "I'm having trouble logging in",
              "The dashboard isn't loading",
              "How do I contact technical support?"
            ]
          };
        } else if (conversationTopic === "delivery") {
          result = {
            answer: "Regarding delivery, all our products are digital solutions delivered immediately through our customer portal after purchase. For Enterprise customers, we also provide implementation support to help you set up and configure the software according to your needs. Is there something specific about our delivery process you'd like to know?",
            source: "FAQ",
            sourceType: "faq" as const,
            sourceId: "delivery-info",
            sourceTitle: "Delivery Information",
            confidence: 90,
            relatedQuestions: [
              "How long does implementation take?",
              "Do you provide training?",
              "What support is available during setup?"
            ]
          };
        }
      }
      
      // Handle product number references (1, 2, 3, etc.) when previous context was about products
      // isProductNumber is now defined earlier in the code
      if (isProductNumber && history && history.length > 0) {
        const lastMessages = history.slice(-3);
        const wasDiscussingProducts = lastMessages.some((msg: ChatMessage) => 
          msg.content.toLowerCase().includes("product") || 
          msg.content.toLowerCase().includes("offer") ||
          msg.content.toLowerCase().includes("supportbot")
        );
        
        if (wasDiscussingProducts) {
          const productNumber = parseInt(normalizedQuery.trim());
          let productResponse: KnowledgeResponse | null = null;
          
          switch(productNumber) {
            case 1:
              productResponse = {
                answer: "SupportBot Pro ($499/month) is our flagship AI assistant for customer service. It features advanced natural language processing to understand customer inquiries, 24/7 availability, multilingual support in over 30 languages, seamless escalation to human agents when needed, and integration with popular CRM systems. It's ideal for businesses looking to improve their customer support while reducing costs. Would you like to know more specific features or see a demo?",
                source: "FAQ",
                sourceType: "faq" as const,
                sourceId: "supportbot-details",
                sourceTitle: "SupportBot Pro Details",
                confidence: 95,
                relatedQuestions: [
                  "How does SupportBot handle complex issues?",
                  "What languages does it support?",
                  "How can I integrate it with my existing systems?"
                ]
              };
              break;
            case 2:
              productResponse = {
                answer: "Knowledge Hub ($299/month) is our dynamic knowledge base system that uses AI to organize and retrieve information. It features automated categorization of support content, intelligent search capabilities, content gap analysis to identify missing documentation, and analytics to track most-accessed information. It's perfect for teams wanting to maintain an always up-to-date knowledge base with minimal effort. Would you like to know more about its features?",
                source: "FAQ",
                sourceType: "faq" as const,
                sourceId: "knowledgehub-details",
                sourceTitle: "Knowledge Hub Details",
                confidence: 95,
                relatedQuestions: [
                  "How does Knowledge Hub organize content?",
                  "Can it import existing documentation?",
                  "Does it integrate with SupportBot Pro?"
                ]
              };
              break;
            case 3:
              productResponse = {
                answer: "Agent Assist ($199/month) is designed to make human support agents more efficient. It provides real-time suggested responses, automated tagging of tickets, customer sentiment analysis, and performance coaching. This tool typically increases agent productivity by 30-40% while improving response quality. Would you like to know how it integrates with your existing support tools?",
                source: "FAQ",
                sourceType: "faq" as const,
                sourceId: "agentassist-details",
                sourceTitle: "Agent Assist Details",
                confidence: 95,
                relatedQuestions: [
                  "What metrics does Agent Assist track?",
                  "How does it help with agent training?",
                  "Can it work with our ticketing system?"
                ]
              };
              break;
            case 4:
              productResponse = {
                answer: "Analytics Dashboard ($149/month) provides comprehensive insights into your support operations. It tracks key metrics like resolution time, customer satisfaction, common issues, and agent performance. The dashboard includes customizable reports, trend analysis, and exportable data. It's an essential tool for support managers looking to optimize their operations. Would you like to know what specific KPIs it can track?",
                source: "FAQ",
                sourceType: "faq" as const,
                sourceId: "analytics-details",
                sourceTitle: "Analytics Dashboard Details",
                confidence: 95,
                relatedQuestions: [
                  "What visualizations are available?",
                  "Can I create custom reports?",
                  "Does it provide predictive analytics?"
                ]
              };
              break;
            case 5:
              productResponse = {
                answer: "Enterprise Suite ($1499/month) is our comprehensive solution that includes all our products (SupportBot Pro, Knowledge Hub, Agent Assist, and Analytics Dashboard) plus additional enterprise features. These include dedicated support, custom integrations, enhanced security controls, and SLA guarantees. It's designed for large organizations with complex support needs. Would you like to discuss how this could be customized for your organization?",
                source: "FAQ",
                sourceType: "faq" as const,
                sourceId: "enterprise-details",
                sourceTitle: "Enterprise Suite Details",
                confidence: 95,
                relatedQuestions: [
                  "What kind of SLAs do you offer?",
                  "Do you provide implementation assistance?",
                  "Can you support global deployments?"
                ]
              };
              break;
            default:
              break;
          }
          
          if (productResponse) {
            result = productResponse;
          }
        }
      }
    } catch (error) {
      console.error('Error processing conversation context:', error);
      // Non-blocking - continue with the best result we have
    }
    
    // Add related questions if we have secondary matches
    if (secondBestMatches.length > 0) {
      // Limit to 3 related questions
      const relatedQuestions = secondBestMatches
        .slice(0, 3)
        .map(match => match.sourceTitle);
      
      result.relatedQuestions = relatedQuestions;
    }
    
    // PRO FEATURE: Advanced intelligent follow-up suggestions with typing hints
    if (result && (!result.relatedQuestions || result.relatedQuestions.length === 0)) {
      // Generate context-aware suggested questions based on multiple factors
      const suggestedQuestions: string[] = [];
      
      // Track previously mentioned products for continuity
      const mentionedProducts: Record<string, boolean> = {};
      if (history && history.length > 0) {
        for (const msg of history) {
          const content = msg.content.toLowerCase();
          if (content.includes("supportbot")) mentionedProducts.supportbot = true;
          if (content.includes("knowledge hub")) mentionedProducts.knowledgeHub = true;
          if (content.includes("agent assist")) mentionedProducts.agentAssist = true;
          if (content.includes("analytics")) mentionedProducts.analytics = true;
          if (content.includes("enterprise")) mentionedProducts.enterprise = true;
        }
      }
      
      // PRO FEATURE: Enhanced context-aware question generation
      // Based on the source type, content, and user sentiment
      if (result.source === "FAQ" && result.answer.toLowerCase().includes("product")) {
        // Check if we should focus on specific products based on history
        if (Object.keys(mentionedProducts).length > 0) {
          // Suggest questions about products not yet discussed
          if (!mentionedProducts.supportbot) {
            suggestedQuestions.push("Tell me about SupportBot Pro");
          }
          if (!mentionedProducts.knowledgeHub) {
            suggestedQuestions.push("What features does Knowledge Hub include?");
          }
          if (!mentionedProducts.enterprise) {
            suggestedQuestions.push("How much does the Enterprise Suite cost?");
          }
          if (suggestedQuestions.length < 2) {
            suggestedQuestions.push("Can I try your products before purchasing?");
          }
        } else {
          // General product questions
          suggestedQuestions.push(
            "What features does SupportBot Pro include?",
            "How much does the Enterprise Suite cost?",
            "Can I try your products before purchasing?"
          );
        }
        
        // Add a question about integration if they've shown interest in multiple products
        if (Object.keys(mentionedProducts).length > 1) {
          suggestedQuestions.push("How do your products integrate with each other?");
        }
      } else if (result.source === "FAQ" && 
                (result.answer.toLowerCase().includes("password") || 
                 result.answer.toLowerCase().includes("account"))) {
        suggestedQuestions.push(
          "How do I change my email address?",
          "Can I set up two-factor authentication?",
          "What is your data retention policy?"
        );
        
        // Add enterprise-specific questions if they've shown interest in Enterprise products
        if (mentionedProducts.enterprise) {
          suggestedQuestions.push("How does SSO work with the Enterprise Suite?");
        }
      } else if (result.sourceType === "doc") {
        // Check if the user seems confused (from sentiment analysis)
        if (sentiment === 'confused') {
          suggestedQuestions.push(
            "Can you explain that in simpler terms?",
            "What products do you offer?",
            "How do I contact a human support agent?"
          );
        } else {
          suggestedQuestions.push(
            "What products do you offer?",
            "How do I contact support?",
            "Where can I find pricing information?"
          );
        }
      } else {
        // Default suggestions with pricing emphasis for frustrated users
        if (sentiment === 'frustrated' || sentiment === 'negative') {
          suggestedQuestions.push(
            "What makes your AI support different?",
            "Do you offer any discounts?",
            "How quickly can I get started?"
          );
        } else {
          suggestedQuestions.push(
            "Tell me about your products",
            "How do your pricing plans work?",
            "What makes your AI support different?"
          );
        }
      }
      
      // Ensure we have at least 3 suggestions
      while (suggestedQuestions.length < 3) {
        const defaultOptions = [
          "What's your most popular product?",
          "Do you offer volume discounts?",
          "How long has your company been in business?",
          "What integrations do you support?"
        ];
        const randomOption = defaultOptions[Math.floor(Math.random() * defaultOptions.length)];
        if (!suggestedQuestions.includes(randomOption)) {
          suggestedQuestions.push(randomOption);
        }
      }
      
      // Limit to 3 questions for clean UI
      result.relatedQuestions = suggestedQuestions.slice(0, 3);
    }
    
    // Make the response more conversational by adding a human touch
    if (result && !result.answer.includes("Would you like") && !result.answer.includes("Can I help")) {
      const conversationalEndings = [
        "Is there anything specific about this you'd like to know?",
        "Does that help with what you were looking for?",
        "Would you like more details on any part of this?",
        "Is there anything else you'd like to know?"
      ];
      
      // Add a conversational ending if the answer doesn't already have one
      if (!result.answer.endsWith("?")) {
        const randomEnding = conversationalEndings[Math.floor(Math.random() * conversationalEndings.length)];
        result.answer = `${result.answer} ${randomEnding}`;
      }
    }
    
    // Record query for analytics
    try {
      // Create analytics data directly
      const analyticsData = {
        timestamp: Date.now(),
        query: question,
        responseSource: result.source,
        confidence: result.confidence || 0,
        intent: intent.intent,
        successful: result.confidence ? result.confidence > 60 : false
      };
      
      // In a production app, this would send to a database or analytics service
      console.log('Analytics data:', analyticsData);
      
      // Optional: send to analytics endpoint
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(analyticsData)
      }).catch(e => console.error('Error sending analytics:', e));
    } catch (error) {
      // Non-blocking - just log if analytics recording fails
      console.error('Failed to record analytics:', error);
    }
    
    // PRO FEATURE: Add product recommendations based on conversation history
    if (!result.relatedQuestions || result.relatedQuestions.length < 3) {
      result.relatedQuestions = generateSmartRecommendations(history, conversationTopic);
    }
    
    // PRO FEATURE: Add conversation summary if this was a complex interaction
    const hasComplexHistory = history && history.length > 5;
    if (hasComplexHistory) {
      const conversationSummary = generateConversationSummary(history);
      
      // Add metadata to help with continuity
      result.metadata = {
        ...result.metadata,
        conversationSummary,
        responseTime: Math.round(performance.now() - startTime),
        userSentiment: sentiment,
        topicChain: extractTopicChain(history)
      };
    } else {
      result.metadata = {
        ...result.metadata,
        responseTime: Math.round(performance.now() - startTime),
        userSentiment: sentiment
      };
    }
    
    // Store in cache
    responseCache.set(cacheKey, {
      response: result,
      timestamp: Date.now()
    });
    
    // Clean up old cache entries occasionally
    if (Math.random() < 0.1) { // 10% chance to clean on any request
      cleanCache();
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing question:', error);
    return NextResponse.json(
      { 
        answer: "Sorry, I encountered an error processing your request.", 
        source: "System", 
        confidence: 100
      }, 
      { status: 500 }
    );
  }
}

// Enhanced confidence calculation that considers intent match
function calculateEnhancedConfidence(
  query: string, 
  expandedQuery: string,
  title: string, 
  content: string,
  sourceType: string,
  userIntent: string
): number {
  const queryWords = extractKeywords(query);
  const expandedQueryWords = extractKeywords(expandedQuery);
  const titleWords = extractKeywords(title);
  const contentWords = extractKeywords(content);
  
  // Basic similarity calculation
  const titleSimilarity = calculateJaccardSimilarity(queryWords.join(' '), titleWords.join(' '));
  const expandedTitleSimilarity = calculateJaccardSimilarity(expandedQueryWords.join(' '), titleWords.join(' '));
  const contentSimilarity = calculateJaccardSimilarity(queryWords.join(' '), contentWords.join(' '));
  const expandedContentSimilarity = calculateJaccardSimilarity(expandedQueryWords.join(' '), contentWords.join(' '));
  
  // Better scoring - use the best match between original and expanded query
  const bestTitleSimilarity = Math.max(titleSimilarity, expandedTitleSimilarity);
  const bestContentSimilarity = Math.max(contentSimilarity, expandedContentSimilarity);
  
  // Weight title matches more heavily than content matches
  let weightedScore = (bestTitleSimilarity * 0.7) + (bestContentSimilarity * 0.3);
  
  // Boost confidence based on source type matching intent
  // For example, if intent is 'billing' and source is from 'billing' section
  if (
    (userIntent === 'billing' && (title.toLowerCase().includes('payment') || title.toLowerCase().includes('billing'))) ||
    (userIntent === 'technical_issue' && (title.toLowerCase().includes('error') || title.toLowerCase().includes('problem'))) ||
    (userIntent === 'account_settings' && (title.toLowerCase().includes('account') || title.toLowerCase().includes('settings'))) ||
    (userIntent === 'escalation_needed' && sourceType === 'escalation')
  ) {
    weightedScore += 0.15; // Add 15% boost for matching intent
  }
  
  // Exact phrase match bonus
  if (title.toLowerCase().includes(query) || content.toLowerCase().includes(query)) {
    weightedScore += 0.1; // Add 10% for exact phrase match
  }
  
  // Apply minimum threshold for very short queries
  if (query.length < 5 && weightedScore > 0) {
    weightedScore = Math.max(weightedScore, 0.4); // Minimum 40% confidence for very short queries
  }
  
  // Clip to valid range [0,1]
  weightedScore = Math.min(Math.max(weightedScore, 0), 1);
  
  return Math.round(weightedScore * 100);
}

// Extract keywords from text
function extractKeywords(text: string): string[] {
  if (!text) return [];
  
  const normalizedText = text.toLowerCase();
  const words = normalizedText.split(/\W+/);
  
  // Filter out common stop words and short words
  const stopWords = ['the', 'and', 'or', 'to', 'a', 'in', 'is', 'it', 'that', 'of', 'for', 'on', 'by', 'with', 'as'];
  return words.filter(word => word.length > 2 && !stopWords.includes(word));
}

// Calculate Jaccard similarity between two texts
function calculateJaccardSimilarity(text1: string, text2: string): number {
  const set1 = new Set(text1.split(/\s+/));
  const set2 = new Set(text2.split(/\s+/));
  
  if (set1.size === 0 && set2.size === 0) return 0;
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
}

// Expand query with synonyms and related terms
function expandQuery(query: string, intent: string): string {
  // Base expanded query includes the original
  let expanded = query;
  
  // Simple synonym expansion based on intent
  if (intent === 'billing') {
    expanded += ' payment invoice money cost price financial transaction';
  } else if (intent === 'technical_issue') {
    expanded += ' error bug problem issue broken not working failure crash help fix';
  } else if (intent === 'product_info') {
    expanded += ' product service feature plan offering package solution tools';
  } else if (intent === 'account_settings') {
    expanded += ' account profile settings manage change password email login security';
  }
  
  // Common support terms that might be useful for most queries
  expanded += ' help support guide how assistance information';
  
  return expanded;
}

// Clean expired entries from cache
function cleanCache() {
  const now = Date.now();
  for (const [key, entry] of responseCache.entries()) {
    if (now - entry.timestamp > CACHE_EXPIRY_MS) {
      responseCache.delete(key);
    }
  }
}

// PRO FEATURE: Generate intelligent follow-up recommendations based on context
function generateSmartRecommendations(history: ChatMessage[] | undefined, topic: string): string[] {
  // Default recommendations
  const defaultRecommendations = [
    "What products do you offer?",
    "Tell me about your pricing",
    "How does the implementation process work?"
  ];
  
  if (!history || history.length < 2) {
    return defaultRecommendations;
  }
  
  // Topic-specific recommendations
  const topicRecommendations: Record<string, string[]> = {
    products: [
      "What makes SupportBot Pro different from competitors?",
      "Can I upgrade or downgrade my plan later?",
      "Do you offer any product bundles or discounts?"
    ],
    product_1: [
      "What languages does SupportBot Pro support?",
      "How does SupportBot Pro handle complex queries?",
      "Can SupportBot Pro integrate with our existing CRM?"
    ],
    product_2: [
      "How does Knowledge Hub organize our content?",
      "Can Knowledge Hub import our existing documentation?",
      "How does the AI search in Knowledge Hub work?"
    ],
    product_3: [
      "How does Agent Assist improve agent efficiency?",
      "What metrics does Agent Assist track?",
      "How does the AI suggest responses in Agent Assist?"
    ],
    product_4: [
      "What dashboards are included in Analytics?",
      "Can we create custom reports in the Analytics Dashboard?",
      "How does the Analytics Dashboard help identify trends?"
    ],
    product_5: [
      "What additional features come with the Enterprise Suite?",
      "What kind of dedicated support is included?",
      "Can the Enterprise Suite be customized for our needs?"
    ],
    pricing: [
      "Do you offer annual billing discounts?",
      "Are there any hidden fees or charges?",
      "Do you have special pricing for startups or non-profits?"
    ],
    delivery: [
      "What training do you provide during implementation?",
      "How long does the typical implementation take?",
      "Do you offer ongoing support after implementation?"
    ],
    technical: [
      "What hours is your support team available?",
      "Do you have a knowledge base for common issues?",
      "What's your guaranteed response time for critical issues?"
    ],
    account: [
      "How do I add team members to my account?",
      "What security features do you offer?",
      "Can we set up single sign-on (SSO) with our system?"
    ]
  };
  
  // Return topic recommendations or default if none match
  return topicRecommendations[topic] || defaultRecommendations;
}

// PRO FEATURE: Generate a brief summary of the conversation
function generateConversationSummary(history: ChatMessage[]): string {
  if (!history || history.length < 3) {
    return "Initial conversation";
  }
  
  const userMessages = history
    .filter(msg => msg.role === 'user')
    .map(msg => msg.content.toLowerCase());
  
  // Look for key topics discussed
  const productMentions = userMessages.filter(msg => 
    /product|supportbot|knowledge hub|agent assist|analytics|enterprise/i.test(msg)
  ).length;
  
  const pricingMentions = userMessages.filter(msg => 
    /price|cost|pricing|fee|subscription|payment/i.test(msg)
  ).length;
  
  const implementationMentions = userMessages.filter(msg => 
    /implementation|setup|install|integrate|delivery|training/i.test(msg)
  ).length;
  
  const accountMentions = userMessages.filter(msg => 
    /account|login|password|security|user|setting/i.test(msg)
  ).length;
  
  // Create a simple summary based on topics discussed
  const topics = [];
  if (productMentions > 0) topics.push("products");
  if (pricingMentions > 0) topics.push("pricing");
  if (implementationMentions > 0) topics.push("implementation");
  if (accountMentions > 0) topics.push("account settings");
  
  if (topics.length === 0) {
    return "General information discussion";
  }
  
  return `Conversation about ${topics.join(", ")}`;
}

// PRO FEATURE: Extract the chain of topics discussed throughout the conversation
function extractTopicChain(history: ChatMessage[] | undefined): string[] {
  if (!history || history.length < 2) {
    return ["general"];
  }
  
  const topicChain: string[] = ["initial"];
  const recentMessages = history.slice(-10); // Look at last 10 messages
  
  for (const msg of recentMessages) {
    if (msg.role === 'user') {
      const content = msg.content.toLowerCase();
      
      if (/product|supportbot|knowledge hub|agent|analytics|enterprise/i.test(content)) {
        topicChain.push("products");
      } else if (/price|cost|pricing|fee|subscription|payment/i.test(content)) {
        topicChain.push("pricing");
      } else if (/delivery|implementation|setup|install/i.test(content)) {
        topicChain.push("implementation");
      } else if (/account|login|password|security/i.test(content)) {
        topicChain.push("account");
      } else if (/help|support|issue|problem|error/i.test(content)) {
        topicChain.push("support");
      }
    }
  }
  
  // Remove duplicates (same topic in sequence)
  return topicChain.filter((topic, index, array) => 
    index === 0 || topic !== array[index - 1]
  );
}