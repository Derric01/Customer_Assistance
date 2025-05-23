"use client";

import { useState, useRef, useEffect } from "react";
import { FiSend, FiMessageSquare } from "react-icons/fi";
import { User, Message, Chat, ChatType } from "../types";
import { useChatService } from "../lib/chatService";
import { v4 as uuidv4 } from "uuid";

interface CustomerChatViewProps {
  user: User;
}

export default function CustomerChatView({ user }: CustomerChatViewProps) {
  const [input, setInput] = useState("");
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatService = useChatService();
  const [chats, setChats] = useState<Chat[]>([]);  // Load customer's chats
  useEffect(() => {
    const customerChats = chatService.getChats(user.id, 'customer');
    setChats(customerChats);
    
    // If no active chat but chats exist, set the first one active
    // Only executed on initial load
    if (!activeChat && customerChats.length > 0) {
      setActiveChat(customerChats[0]);
    }
  // Removed activeChat from dependencies to prevent infinite loops
  }, [user.id, chatService]);

  // Create a new chat if none exists
  useEffect(() => {
    if (chats.length === 0) {
      const newChat = chatService.createChat(
        ChatType.CustomerSupport,
        [user.id], // Customer is the only participant initially
        `Support Chat - ${new Date().toLocaleString()}`,
      );
      setChats([newChat]);
      setActiveChat(newChat);
    }
  }, [chats.length, user.id, chatService]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  const handleSendMessage = () => {
    if (!input.trim() || !activeChat) return;
    
    const message: Omit<Message, 'id' | 'timestamp'> = {
      content: input,
      senderId: user.id,
      senderRole: 'customer'
    };
    
    chatService.addMessage(activeChat.id, message);
    setInput("");
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
  };

  if (!activeChat) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Chat header */}
      <div className="bg-gray-800 p-4 shadow-md">
        <h2 className="text-xl font-semibold">Customer Support</h2>
        <p className="text-gray-400 text-sm">We typically reply within minutes</p>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeChat.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <FiMessageSquare className="h-12 w-12 text-gray-500 mb-4" />
            <h3 className="text-xl font-medium text-gray-300">Start a conversation</h3>
            <p className="text-gray-500 mt-2">
              Send a message to get help from our support team
            </p>
          </div>
        ) : (
          activeChat.messages.map((message) => (
            <div 
              key={message.id}
              className={`flex ${message.senderRole === 'customer' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-3/4 rounded-lg px-4 py-2 ${
                  message.senderRole === 'customer'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-100'
                }`}
              >
                <div className="text-sm">{message.content}</div>
                <div className={`text-xs mt-1 ${
                  message.senderRole === 'customer' ? 'text-purple-200' : 'text-gray-400'
                }`}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="bg-gray-800 p-4 border-t border-gray-700">
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type your message..."
            className="flex-1 bg-gray-700 text-white rounded-l-lg px-4 py-2 focus:outline-none"
          />          <button
            onClick={handleSendMessage}
            disabled={!input.trim()}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-r-lg px-4 py-2 disabled:opacity-50"
            title="Send message"
            aria-label="Send message"
          >
            <FiSend className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
