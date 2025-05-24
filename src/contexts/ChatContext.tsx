"use client";

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Define the types for messages and chat state
interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system' | 'error';
  senderId: string;
  senderRole: 'customer' | 'support' | 'ai';
  timestamp: Date;
  source?: {
    type: 'faq' | 'doc' | 'rule' | 'escalation';
    id: string;
    title: string;
    originalSource?: string;
  };
  isEdited?: boolean;
}

// Context type definition
interface ChatContextType {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  currentChatId: string | null;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  isOnline: boolean;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => Message;
  sendMessage: (input: string) => Promise<void>;
}

// Create the context with a default undefined value
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Local storage keys for persistence
const STORAGE_KEYS = {
  MESSAGES: 'ai-support-messages',
  CHAT_ID: 'ai-support-chat-id',
};

export function ChatProvider({ children }: { children: ReactNode }) {
  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  
  // Refs for handling dependency arrays safely
  const isInitialized = useRef(false);
  const pathname = useRef(typeof window !== 'undefined' ? window.location.pathname : '');
  const previousPathname = useRef(pathname.current);
  const messagesRef = useRef(messages);
  const chatIdRef = useRef(currentChatId);
  
  // Update refs when state changes
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);
  
  useEffect(() => {
    chatIdRef.current = currentChatId;
  }, [currentChatId]);

  // Network connectivity detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setError(null);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setError('Network connection lost. Please check your internet connection.');
    };
    
    // Check initial state
    setIsOnline(typeof navigator !== 'undefined' ? navigator.onLine : true);
    
    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initialize chat on mount - restore from localStorage
  useEffect(() => {
    if (isInitialized.current) return;
    
    try {
      if (typeof window !== 'undefined') {
        // Try to restore chat ID
        const savedChatId = localStorage.getItem(STORAGE_KEYS.CHAT_ID);
        if (savedChatId) {
          setCurrentChatId(savedChatId);
        } else {
          // Create a new chat ID if none exists
          const newChatId = uuidv4();
          setCurrentChatId(newChatId);
          localStorage.setItem(STORAGE_KEYS.CHAT_ID, newChatId);
        }
        
        // Try to restore messages
        const savedMessages = localStorage.getItem(STORAGE_KEYS.MESSAGES);
        if (savedMessages) {
          try {
            const parsedMessages = JSON.parse(savedMessages);
            // Convert string dates back to Date objects
            const processedMessages = parsedMessages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }));
            setMessages(processedMessages);
          } catch (e) {
            console.error('Error parsing saved messages:', e);
          }
        }
      }
    } catch (e) {
      console.error('Error initializing chat:', e);
    }
    
    isInitialized.current = true;
  }, []);

  // Save chat state to localStorage when messages change
  useEffect(() => {
    if (!isInitialized.current || typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    } catch (e) {
      console.error('Error saving messages:', e);
    }
  }, [messages]);

  // Handle page navigation using URL
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleRouteChange = () => {
      const currentPath = window.location.pathname;
      if (currentPath !== pathname.current) {
        previousPathname.current = pathname.current;
        pathname.current = currentPath;
        
        // Log navigation for debugging
        console.log(`Navigation: ${previousPathname.current} -> ${pathname.current}`);
        
        // No need to manually save/restore state here as we're already 
        // saving to localStorage when messages change
      }
    };
    
    // Set up route change detection
    window.addEventListener('popstate', handleRouteChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // Add a message to the current chat
  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>): Message => {
    const newMessage: Message = {
      ...message,
      id: uuidv4(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  // Send a message to the AI API
  const sendMessage = async (input: string) => {
    if (!input.trim() || loading) return;
    
    // Check network connectivity first
    if (!isOnline) {
      setError('You are offline. Please check your internet connection.');
      return;
    }
    
    // Add user message
    const userMessage = addMessage({
      content: input.trim(),
      senderId: 'user',
      senderRole: 'customer',
      role: 'user'
    });
    
    setLoading(true);
    setError(null);
    
    try {
      // Add temporary loading message
      const loadingMessage = addMessage({
        content: "...",
        senderId: 'system',
        senderRole: 'ai',
        role: 'system'
      });
      
      console.log('Sending request to AI...');
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query: input.trim(),
          context: {
            messages: messagesRef.current.slice(-5).map(msg => ({
              role: msg.role,
              content: msg.content,
              timestamp: msg.timestamp
            }))
          }
        }),
        cache: 'no-store',
      });
      
      // Remove loading message
      setMessages(prev => prev.filter(msg => msg.id !== loadingMessage.id));
      
      if (!response.ok) {
        let errorMessage = 'Failed to get response';
        try {
          const errorData = await response.json();
          if (errorData?.error) {
            errorMessage = errorData.error;
          }
        } catch (_) {
          // Use default error message if can't parse response
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Add AI response
      addMessage({
        content: data.content || "I'm sorry, I couldn't generate a response. Please try again.",
        senderId: 'ai',
        senderRole: 'ai',
        role: 'assistant',
        source: data.source
      });
    } catch (err) {
      console.error('Error details:', err);
      let errorMsg = 'Unknown error occurred';
      
      if (err instanceof Error) {
        errorMsg = err.message;
        // Check for specific error types
        if (err.name === 'AbortError') {
          errorMsg = 'Request timed out. Please try again.';
        } else if (err.name === 'TypeError' && errorMsg.includes('Failed to fetch')) {
          errorMsg = 'Network connection error. Please check your internet connection.';
        }
      }
      
      setError(errorMsg);
      
      // Add error message for user feedback
      addMessage({
        content: `Sorry, there was an error: ${errorMsg}. Please try again.`,
        senderId: 'system',
        senderRole: 'ai',
        role: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    messages,
    setMessages,
    currentChatId,
    loading,
    setLoading,
    error,
    setError,
    isOnline,
    addMessage,
    sendMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

// Hook to use the chat context
export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}