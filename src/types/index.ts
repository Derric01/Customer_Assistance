export interface Message {
  role: string;
  id: string;
  content: string;
  source?: {
    type: 'faq' | 'doc' | 'rule' | 'escalation';
    id: string;
    title: string;
    originalSource?: string;
  };
  timestamp: Date;
}

export interface AIResponse {
  answer: string;
  source: {
    type: 'faq' | 'doc' | 'rule' | 'escalation';
    id: string;
    title: string;
    originalSource?: string;
  };
} 