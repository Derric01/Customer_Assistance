import { faqs } from '../data/faq';
import { docs } from '../data/docs';
import { rules } from '../data/rulebook';
import { escalations } from '../data/escalations';
import { AIResponse } from '../types';

export async function getAIResponse(query: string): Promise<AIResponse> {
  // Simple string matching logic
  const normalizedQuery = query.toLowerCase();

  // Search in FAQs
  const faqMatch = faqs.find(faq => 
    faq.question.toLowerCase().includes(normalizedQuery) ||
    faq.answer.toLowerCase().includes(normalizedQuery)
  );

  if (faqMatch) {
    return {
      answer: faqMatch.answer,
      source: {
        type: 'faq',
        id: faqMatch.id,
        title: faqMatch.question,
        originalSource: faqMatch.source
      }
    };
  }

  // Search in Docs
  const docMatch = docs.find(doc =>
    doc.title.toLowerCase().includes(normalizedQuery) ||
    doc.question.toLowerCase().includes(normalizedQuery) ||
    doc.content.toLowerCase().includes(normalizedQuery)
  );

  if (docMatch) {
    return {
      answer: docMatch.content,
      source: {
        type: 'doc',
        id: docMatch.id,
        title: docMatch.title,
        originalSource: docMatch.source
      }
    };
  }

  // Search in Rules
  const ruleMatch = rules.find(rule =>
    rule.title.toLowerCase().includes(normalizedQuery) ||
    rule.question.toLowerCase().includes(normalizedQuery) ||
    rule.description.toLowerCase().includes(normalizedQuery)
  );

  if (ruleMatch) {
    return {
      answer: ruleMatch.description,
      source: {
        type: 'rule',
        id: ruleMatch.id,
        title: ruleMatch.title,
        originalSource: ruleMatch.source
      }
    };
  }

  // Search in Escalations
  const escalationMatch = escalations.find(escalation =>
    escalation.title.toLowerCase().includes(normalizedQuery) ||
    escalation.question.toLowerCase().includes(normalizedQuery) ||
    escalation.response.toLowerCase().includes(normalizedQuery)
  );

  if (escalationMatch) {
    return {
      answer: `${escalationMatch.response}\n\nEscalation Path: ${escalationMatch.escalationPath}`,
      source: {
        type: 'escalation',
        id: escalationMatch.id,
        title: escalationMatch.title,
        originalSource: escalationMatch.source
      }
    };
  }

  // Default response if no match is found
  return {
    answer: "I apologize, but I couldn't find a specific answer to your question in our knowledge base. Please try rephrasing your question or contact a senior support agent for assistance.",
    source: {
      type: 'doc',
      id: 'doc-1',
      title: 'Default Response',
      originalSource: 'System Default'
    }
  };
} 