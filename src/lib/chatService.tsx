/**
 * Chat Service - Handles client-side operations for chat functionality
 * 
 * This service provides methods for sending messages, retrieving chat history,
 * and managing chat state.
 */

// Types
interface Message {
  id: string;
  content: string;
  role?: 'user' | 'assistant' | 'system' | 'error';
  senderId: string;
  senderRole?: 'customer' | 'support' | 'ai';
  timestamp: Date;
  source?: {
    type: string;
    id: string;
    title: string;
  };
  isEdited?: boolean;
}

interface ChatHistory {
  chatId: string;
  messages: Message[];
}

interface SendMessageParams {
  message: string;
  chatId?: string;
  userId?: string;
}

interface SendMessageResponse {
  success: boolean;
  message: Message;
  chatId: string;
  chatHistory: Message[];
}

// Chat Service Implementation
export const chatService = {
  /**
   * Send a message to the chat API
   */
  async sendMessage({ message, chatId, userId }: SendMessageParams): Promise<SendMessageResponse> {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          chatId,
          userId
        }),
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Chat service error:', error);
      throw error;
    }
  },

  /**
   * Get chat history by chat ID
   */
  async getChatHistory(chatId: string): Promise<ChatHistory> {
    try {
      const response = await fetch(`/api/chat?chatId=${chatId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Chat service error:', error);
      throw error;
    }
  },

  /**
   * Format date for display in chat
   */
  formatMessageDate(date: Date): string {
    const now = new Date();
    const messageDate = new Date(date);
    
    // If the message is from today, show only the time
    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If the message is from this year, show the month and day
    if (messageDate.getFullYear() === now.getFullYear()) {
      return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' }) + 
             ' ' + messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Otherwise, show the full date
    return messageDate.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' }) +
           ' ' + messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
};

export default chatService;