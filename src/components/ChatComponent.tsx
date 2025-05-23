"use client";

import { useState, useRef, useEffect } from "react";
import { FiSend, FiCheckCircle, FiThumbsUp, FiThumbsDown, FiUser, FiArrowLeft, FiDownload, FiTrash2 } from "react-icons/fi";
import ThemeToggle from "./ThemeToggle";

// FIXED: Use stable date formatting to prevent hydration issues
function formatDate(date: Date | string) {
  // Fix hydration issues by using a fixed timestamp for server/client consistency
  if (typeof window === 'undefined') {
    // On server: Use a fixed placeholder date to avoid hydration mismatch
    return '05/22/2025, 02:08:00 AM';
  }
  
  // On client: Use the actual date
  try {
    const isoString = new Date(date).toISOString();
    return new Date(isoString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    });
  } catch {
    // Fallback for any parsing errors
    return '05/22/2025, 02:08:00 AM';
  }
}

// FIXED: Use stable time formatting to prevent hydration issues
function formatTime(date: Date | string) {
  // Fix hydration issues by using a fixed timestamp for server/client consistency
  if (typeof window === 'undefined') {
    // On server: Use a fixed placeholder time to avoid hydration mismatch
    return '02:08 AM';
  }
  
  // On client: Use the actual time
  try {
    const isoString = new Date(date).toISOString();
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    // Fallback for any parsing errors
    return '02:08 AM';
  }
}

// FIXED: Use stable date generation to prevent hydration issues
function createConsistentDate() {
  // Create a new date and immediately convert to ISO to ensure consistency
  // For hydration issues, we'll let client handle the actual date values
  if (typeof window === 'undefined') {
    // On server: Return a fixed date to avoid hydration issues
    return new Date('2025-05-22T02:08:00.000Z');
  }
  
  // On client: Use the actual current date
  const date = new Date();
  const isoString = date.toISOString();
  return new Date(isoString);
}

type Message = {
  id: number;
  sender: "agent" | "ai";
  content: string;
  source?: "FAQ" | "Docs" | "Rulebook" | "System" | "API";
  posted?: boolean;
  timestamp: Date;
  rating?: "helpful" | "unhelpful";
  confidence?: number;
};

type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
};

export default function ChatComponent() {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    // Create a default conversation to start with
    return [createNewConversation()];
  });
  
  const [activeConversationId, setActiveConversationId] = useState<string>("");
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [useExternalApi, setUseExternalApi] = useState<boolean>(false);
  const [compareMode, setCompareMode] = useState<boolean>(false);

  // Initialize state from localStorage after component mounts (client-side only)
  useEffect(() => {
    try {
      const savedConversations = localStorage.getItem('support-conversations');
      const savedActiveId = localStorage.getItem('active-conversation-id');
      
      if (savedConversations) {
        const parsedConversations = JSON.parse(savedConversations);
        setConversations(parsedConversations);
        
        // Set active conversation ID from storage or use the first conversation
        if (savedActiveId && parsedConversations.find((c: Conversation) => c.id === savedActiveId)) {
          setActiveConversationId(savedActiveId);
        } else if (parsedConversations.length > 0) {
          setActiveConversationId(parsedConversations[0].id);
        }
      } else {
        // If no saved conversations, set the default one as active
        setActiveConversationId(conversations[0].id);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      // If there's an error, ensure we have an active conversation
      setActiveConversationId(conversations[0].id);
    }
  }, []);

  const activeConversation = conversations.find(c => c.id === activeConversationId) || conversations[0];
  const messages = activeConversation?.messages || [];

  // Save to localStorage when conversations or active ID changes
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('support-conversations', JSON.stringify(conversations));
        if (activeConversationId) {
          localStorage.setItem('active-conversation-id', activeConversationId);
        }
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [conversations, activeConversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [input]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  function createNewConversation(): Conversation {
    return {
      id: `conv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: "New Conversation",
      messages: [],
      createdAt: createConsistentDate(),
      updatedAt: createConsistentDate()
    };
  }

  const startNewConversation = () => {
    const newConversation = createNewConversation();
    setConversations(prev => [...prev, newConversation]);
    setActiveConversationId(newConversation.id);
    setInput("");
  };

  const updateConversationTitle = (content: string) => {
    // Generate a title from first user message
    const title = content.length > 30 ? content.substring(0, 30) + "..." : content;
    
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === activeConversationId 
          ? { ...conv, title, updatedAt: createConsistentDate() } 
          : conv
      )
    );
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now(),
      sender: "agent",
      content: input,
      timestamp: createConsistentDate(),
    };
    
    // Update the conversation
    setConversations(prevConversations =>
      prevConversations.map(conv =>
        conv.id === activeConversationId
          ? { 
              ...conv, 
              messages: [...conv.messages, userMessage],
              updatedAt: createConsistentDate() 
            }
          : conv
      )
    );

    // If first message, use it to set conversation title
    if (messages.length === 0) {
      updateConversationTitle(input);
    }
    
    setInput("");
    setLoading(true);

    try {
      // Always use local knowledge base
      const endpoint = "/api/ask";
      
      console.log(`Sending request to ${endpoint}`);
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          question: userMessage.content,
          conversationId: activeConversationId, 
          history: messages.map(msg => ({
            role: msg.sender === 'agent' ? 'user' : 'assistant',
            content: msg.content
          }))
        }),
      });
      
      if (!res.ok) {
        throw new Error(`API returned status: ${res.status}`);
      }
      
      const data = await res.json();
      
      // Simulate typing indicator
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, Math.min(1000, data.answer.length * 5)));
      setIsTyping(false);
      
      const source = data.source || "Local KB";
      
      const aiMessage: Message = {
        id: Date.now() + 1,
        sender: "ai",
        content: data.answer || "Sorry, I couldn't generate a proper response.",
        source: source,
        confidence: data.confidence || (data.source === "System" ? 40 : 75),
        posted: false,
        timestamp: createConsistentDate(),
      };

      setConversations(prevConversations =>
        prevConversations.map(conv =>
          conv.id === activeConversationId
            ? { 
                ...conv, 
                messages: [...conv.messages, aiMessage],
                updatedAt: createConsistentDate() 
              }
            : conv
        )
      );
    } catch (err) {
      console.error("Error fetching AI response:", err);
      // Show error message
      const errorMessage: Message = {
        id: Date.now() + 1,
        sender: "ai",
        content: "Sorry, I couldn't process your request. Please try again later.",
        source: "System",
        confidence: 100, // System message is certain
        timestamp: createConsistentDate(),
      };
      
      setConversations(prevConversations =>
        prevConversations.map(conv =>
          conv.id === activeConversationId
            ? { 
                ...conv, 
                messages: [...conv.messages, errorMessage],
                updatedAt: createConsistentDate() 
              }
            : conv
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePostAnswer = (messageId: number) => {
    setConversations(prevConversations =>
      prevConversations.map(conv =>
        conv.id === activeConversationId
          ? { 
              ...conv, 
              messages: conv.messages.map(msg =>
                msg.id === messageId ? { ...msg, posted: true } : msg
              )
            }
          : conv
      )
    );
    // Here you could also send this to a database or API
  };

  const handleRateAnswer = (messageId: number, rating: "helpful" | "unhelpful") => {
    setConversations(prevConversations =>
      prevConversations.map(conv =>
        conv.id === activeConversationId
          ? { 
              ...conv, 
              messages: conv.messages.map(msg =>
                msg.id === messageId ? { ...msg, rating } : msg
              )
            }
          : conv
      )
    );
    // You could also send this feedback to your API
  };

  const deleteConversation = (id: string) => {
    // If deleting the active conversation, select another one
    if (id === activeConversationId) {
      const remainingConversations = conversations.filter(c => c.id !== id);
      if (remainingConversations.length > 0) {
        setActiveConversationId(remainingConversations[0].id);
      } else {
        // Create a new conversation if there are no others
        const newConversation = createNewConversation();
        setConversations([newConversation]);
        setActiveConversationId(newConversation.id);
      }
    }
    
    setConversations(prev => prev.filter(c => c.id !== id));
  };

  const exportConversation = (id: string) => {
    const conversation = conversations.find(c => c.id === id);
    if (!conversation) return;
    
    const conversationData = JSON.stringify(conversation, null, 2);
    const blob = new Blob([conversationData], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = href;
    link.download = `${conversation.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 ${showSidebar ? 'w-64' : 'w-0'} flex-shrink-0 transition-all duration-300 overflow-hidden flex flex-col`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-purple-50 dark:bg-purple-900/30">
          <h2 className="font-semibold text-purple-800 dark:text-purple-300">Conversations</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conversation) => (
            <div 
              key={conversation.id}
              className={`p-3 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20 flex justify-between items-center ${
                conversation.id === activeConversationId ? 'bg-purple-100 dark:bg-purple-900/30 border-l-4 border-l-purple-500' : ''
              }`}
              onClick={() => setActiveConversationId(conversation.id)}
            >
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{conversation.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {formatDate(conversation.updatedAt)}
                </p>
              </div>
              <div className="flex space-x-1">
                <button 
                  onClick={(e) => { e.stopPropagation(); exportConversation(conversation.id); }}
                  className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Export conversation"
                  title="Export conversation"
                >
                  <FiDownload className="h-3.5 w-3.5" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteConversation(conversation.id); }}
                  className="p-1 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Delete conversation"
                  title="Delete conversation"
                >
                  <FiTrash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-purple-50 dark:bg-purple-900/30">
          <button 
            onClick={startNewConversation}
            className="w-full py-2 px-3 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white text-sm font-medium rounded-md shadow-sm transition-colors"
          >
            New Conversation
          </button>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 md:px-8 flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setShowSidebar(prev => !prev)}
                className="mr-3 p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label="Toggle sidebar"
              >
                <FiArrowLeft className={`w-5 h-5 transition-transform duration-300 ${!showSidebar ? 'rotate-180' : ''}`} />
              </button>
              <h1 className="text-lg font-semibold text-purple-800 dark:text-purple-300">Customer Support Portal</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                {/* Theme toggle */}
                <ThemeToggle />
                
                {/* Source toggle */}
                <div className="flex items-center">
                  <span className={`text-sm mr-2 ${useExternalApi ? 'text-gray-400 dark:text-gray-500' : 'text-purple-600 dark:text-purple-400 font-medium'}`}>
                    Local
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      value="" 
                      className="sr-only peer"
                      checked={useExternalApi}
                      onChange={() => {
                        setUseExternalApi(prev => !prev);
                        if (compareMode) setCompareMode(false);
                      }}
                      aria-label="Toggle between local knowledge base and external API"
                      disabled={compareMode}
                    />
                    <div className={`w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 dark:peer-checked:bg-purple-500 ${compareMode ? 'opacity-50' : ''}`}></div>
                  </label>
                  <span className={`text-sm ml-2 ${useExternalApi ? 'text-purple-600 dark:text-purple-400 font-medium' : 'text-gray-400 dark:text-gray-500'}`}>
                    API
                  </span>
                </div>
                
                {/* Compare mode toggle */}
                <div className="flex items-center">
                  <label className="relative inline-flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={compareMode}
                      onChange={() => setCompareMode(prev => !prev)}
                      aria-label="Toggle compare mode to show responses from both sources"
                    />
                    <div className="w-9 h-5 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-600 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600 dark:peer-checked:bg-purple-500"></div>
                    <span className={`text-xs ${compareMode ? 'text-purple-600 dark:text-purple-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>Compare</span>
                  </label>
                </div>
              </div>
              
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {activeConversation?.messages.length || 0} messages
              </div>
            </div>
          </div>
        </div>
        
        <div 
          ref={messageContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 max-w-7xl w-full mx-auto"
        >
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
              <div className="bg-purple-50 dark:bg-purple-900/30 rounded-full p-4 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-500 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-purple-800 dark:text-purple-300 mb-2">Welcome to Customer Support</h2>
              <p className="text-center text-gray-500 dark:text-gray-400 max-w-md">
                How can we help you today? Ask a question about our products, services, or policies.
              </p>
            </div>
          )}
          
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "agent" ? "justify-end" : "justify-start"} w-full`}
            >
              {msg.sender === "ai" && (
                <div className="flex-shrink-0 mr-2 mt-1">
                  <div className="w-8 h-8 rounded-full bg-purple-600 dark:bg-purple-700 flex items-center justify-center text-white">
                    AI
                  </div>
                </div>
              )}
              
              <div
                className={`max-w-[80%] sm:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                  msg.sender === "agent"
                    ? "bg-purple-600 dark:bg-purple-700 text-white"
                    : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                }`}
              >
                {msg.sender === "agent" && (
                  <div className="flex items-center justify-end mb-1.5 text-xs text-purple-200">
                    <FiUser className="w-3 h-3 mr-1" />
                    <span>You</span>
                  </div>
                )}
                
                <p className={`text-sm ${msg.sender === "agent" ? "text-white" : "text-gray-800 dark:text-gray-200"}`}>
                  {msg.content}
                </p>
                
                <div className="mt-1.5 flex justify-between items-center">
                  <span className={`text-xs text-opacity-75 ${msg.sender === 'agent' ? 'text-purple-100' : 'text-gray-400 dark:text-gray-500'}`}>
                    {formatTime(msg.timestamp)}
                  </span>
                  
                  {msg.sender === "ai" && (
                    <div className="flex items-center space-x-2">
                      {msg.source && (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          msg.source === "FAQ" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                          msg.source === "Docs" ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" :
                          msg.source === "Rulebook" ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300" :
                          msg.source === "API" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" :
                          "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                        }`}>
                          {msg.source}
                        </span>
                      )}
                      {msg.confidence !== undefined && (
                        <div className="flex items-center">
                          <div className="h-1.5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                msg.confidence > 80 ? "bg-green-500 dark:bg-green-400" : 
                                msg.confidence > 60 ? "bg-purple-500 dark:bg-purple-400" : 
                                msg.confidence > 40 ? "bg-yellow-500 dark:bg-yellow-400" : 
                                "bg-red-500 dark:bg-red-400"
                              }`}
                              style={{ width: `${msg.confidence}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {!msg.posted && msg.source !== "System" && (
                        <div className="flex items-center space-x-1">
                          <button 
                            onClick={() => handleRateAnswer(msg.id, "helpful")}
                            className={`p-1 rounded-full ${
                              msg.rating === "helpful" 
                                ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" 
                                : "text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400"
                            }`}
                            title="Mark as helpful"
                          >
                            <FiThumbsUp className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={() => handleRateAnswer(msg.id, "unhelpful")}
                            className={`p-1 rounded-full ${
                              msg.rating === "unhelpful" 
                                ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" 
                                : "text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400"
                            }`}
                            title="Mark as unhelpful"
                          >
                            <FiThumbsDown className="w-3 h-3" />
                          </button>
                          
                          {msg.rating && !msg.posted && (
                            <button 
                              onClick={() => handlePostAnswer(msg.id)}
                              className="ml-1 p-1 text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 rounded-full"
                              title="Submit feedback"
                            >
                              <FiCheckCircle className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {msg.posted && (
                  <div className="mt-1 flex items-center justify-end">
                    <span className="text-xs text-green-600 dark:text-green-400 flex items-center">
                      <FiCheckCircle className="w-3 h-3 mr-1" />
                      Feedback submitted
                    </span>
                  </div>
                )}
              </div>
              
              {msg.sender === "agent" && (
                <div className="flex-shrink-0 ml-2 mt-1">
                  <div className="w-8 h-8 rounded-full bg-purple-600 dark:bg-purple-700 flex items-center justify-center text-white">
                    <FiUser className="w-4 h-4" />
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-2 max-w-[80%]">
                <div className="flex space-x-1 items-center h-6">
                  <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">AI is typing...</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Invisible element to scroll to */}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat input */}
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <div className="max-w-7xl mx-auto">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-end gap-2"
            >
              <div className="flex-1 min-h-[44px]">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="w-full border border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500 dark:focus:border-purple-400 dark:focus:ring-purple-400 rounded-lg px-3 py-2 outline-none resize-none overflow-hidden min-h-[44px] max-h-32 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white rounded-lg p-2.5 flex-shrink-0 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || !input.trim()}
                aria-label="Send message"
              >
                <FiSend className="h-5 w-5" />
              </button>
            </form>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
              {compareMode 
                ? "Compare mode will show responses from both local and API sources" 
                : useExternalApi 
                  ? "Using external API for responses" 
                  : "Using local knowledge base for responses"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 