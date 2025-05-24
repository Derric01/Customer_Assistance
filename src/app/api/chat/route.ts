import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Message persistence (in-memory for demo, would use a database in production)
const chatSessions: Record<string, any[]> = {};

export async function POST(request: Request) {
  try {
    const { message, chatId, userId = 'anonymous' } = await request.json();
    
    // Validate required fields
    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      );
    }
    
    // Create or retrieve chat session
    const sessionId = chatId || uuidv4();
    if (!chatSessions[sessionId]) {
      chatSessions[sessionId] = [];
    }
    
    // Add message to chat session
    const timestamp = new Date();
    const newMessage = {
      id: uuidv4(),
      content: message.trim(),
      userId,
      timestamp,
      chatId: sessionId
    };
    
    chatSessions[sessionId].push(newMessage);
    
    // Get chat history (for context)
    const chatHistory = chatSessions[sessionId].slice(-10); // Last 10 messages
    
    // In a real implementation, this would:
    // 1. Save the message to a database
    // 2. Potentially trigger webhooks or other integrations
    // 3. Forward to the AI service if needed
    
    return NextResponse.json({
      success: true,
      message: newMessage,
      chatId: sessionId,
      chatHistory
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  // Parse URL to get query parameters
  const url = new URL(request.url);
  const chatId = url.searchParams.get('chatId');
  
  if (!chatId) {
    return NextResponse.json(
      { error: 'Chat ID is required' },
      { status: 400 }
    );
  }
  
  // Get chat history
  const chatHistory = chatSessions[chatId] || [];
  
  return NextResponse.json({
    success: true,
    chatId,
    messages: chatHistory
  });
}