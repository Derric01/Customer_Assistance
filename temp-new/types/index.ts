export interface Message {
  id: string;
  content: string;
  source?: {
    type: string;
    id: string;
    title: string;
  };
  timestamp: Date;
  isUser?: boolean;
}

export interface AIResponse {
  answer: string;
  source: {
    type: string;
    id: string;
    title: string;
  };
} 