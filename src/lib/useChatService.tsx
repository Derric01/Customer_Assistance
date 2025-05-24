/**
 * Chat Service Hook - React hook for using the chat service in components
 */

import { useState, useCallback, useEffect } from 'react';
import { chatService } from './chatService';
import { v4 as uuidv4 } from 'uuid';

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system' | 'error';
  timestamp: Date;
  source?: {
    type: string;
    id: string;
    title: string;
  };
}

export function useChatService(initialChatId?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatId, setChatId] = useState<string>(initialChatId || uuidv4());
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Check online status
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }

    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load initial chat history if chatId is provided
  useEffect(() => {
    if (initialChatId) {
      loadChatHistory(initialChatId);
    }
  }, [initialChatId]);

  const loadChatHistory = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const history = await chatService.getChatHistory(id);
      setMessages(history.messages as ChatMessage[]);
      setChatId(history.chatId);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load chat history');
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Add user message to state immediately for better UX
      const userMessage: ChatMessage = {
        id: uuidv4(),
        content,
        role: 'user',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Send to API
      const response = await chatService.sendMessage({
        message: content,
        chatId,
        userId: 'current-user' // This should be replaced with actual user ID when available
      });
      
      // Update state with full response
      if (response.success) {
        setChatId(response.chatId);
        setMessages(response.chatHistory as ChatMessage[]);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (err) {
      // Add error message
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        content: err instanceof Error ? err.message : 'An error occurred while sending your message',
        role: 'error',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setLoading(false);
    }
  }, [chatId]);

  const addMessage = useCallback((message: Partial<ChatMessage>) => {
    const newMessage: ChatMessage = {
      id: message.id || uuidv4(),
      content: message.content || '',
      role: message.role || 'system',
      timestamp: message.timestamp || new Date(),
      source: message.source
    };
    
    setMessages(prev => [...prev, newMessage]);
  }, []);

  return {
    messages,
    loading,
    error,
    isOnline,
    chatId,
    sendMessage,
    addMessage,
    loadChatHistory
  };
}
