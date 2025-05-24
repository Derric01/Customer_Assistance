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

export interface User {
  id: string;
  name: string;
  email?: string;
}

export interface Chat {
  id: string;
  messages: Message[];
  title?: string;
  createdAt: Date;
  updatedAt: Date;
  type: ChatType;
}

export type ChatType = 'support' | 'feedback' | 'sales';

export interface AIResponse {
  answer: string;
  source: {
    type: 'faq' | 'doc' | 'rule' | 'escalation';
    id: string;
    title: string;
    originalSource?: string;
  };
}