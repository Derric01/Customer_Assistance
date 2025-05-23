import { NextRequest, NextResponse } from 'next/server';

// You can replace this with the actual Gemini API key
// For production, use environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ""; 

// Define message type
type Message = {
  role: string;
  content: string;
};

// Store conversation history for continuity
const conversationMemory = new Map<string, {
  lastInteraction: Date,
  messages: Message[]
}>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, conversationId, history = [] } = body;
    
    if (!question || question.trim() === '') {
      return NextResponse.json({
        answer: "I didn't receive a question. Please ask me something specific.",
        source: "System",
        confidence: 100
      }, { status: 400 });
    }

    // Check if API key is configured
    if (!GEMINI_API_KEY || GEMINI_API_KEY === "AIzaSyBXvzT050piDZF-f5vwU3DSa4sDIzuS5q0") {
      console.error("Gemini API key is not configured");
      return NextResponse.json({
        answer: "The Gemini API is not configured. Please add your API key to the .env.local file. You can get a key from https://ai.google.dev/",
        source: "System",
        confidence: 100
      });
    }

    // Initialize or update conversation memory
    if (conversationId && !conversationMemory.has(conversationId)) {
      conversationMemory.set(conversationId, {
        lastInteraction: new Date(),
        messages: []
      });
    }
    
    const conversation = conversationId ? conversationMemory.get(conversationId) : null;
    let conversationHistory: Message[] = [];
    
    // Prepare conversation history for Gemini
    if (conversation) {
      conversation.lastInteraction = new Date();
      
      // Use provided history or stored history
      if (history && history.length > 0) {
        conversationHistory = history;
      } else if (conversation.messages.length > 0) {
        conversationHistory = conversation.messages;
      }
      
      // Add current question
      conversationHistory.push({
        role: "user",
        content: question
      });
      
      // Update stored conversation
      conversation.messages = [...conversationHistory];
      
      // Limit the conversation length
      if (conversation.messages.length > 20) {
        conversation.messages = conversation.messages.slice(-20);
      }
    } else {
      // No stored conversation, just use the current question
      conversationHistory = [{
        role: "user",
        content: question
      }];
    }
    
    try {
      // Updated Gemini API endpoint for the latest version
      const geminiEndpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent";
      const url = `${geminiEndpoint}?key=${GEMINI_API_KEY}`;
      
      const systemPrompt = "You are an AI customer support assistant. Answer questions about company products, services, policies, and account management. Be helpful, concise, and friendly. Reference only factual information.";
      
      const payload = {
        contents: [
          {
            role: "user",
            parts: [{ text: systemPrompt }]
          },
          ...conversationHistory.map((msg: Message) => ({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{ text: msg.content }]
          }))
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        }
      };
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Gemini API error:", errorData);
        
        // Handle specific error cases
        if (errorData?.error?.code === 400 && errorData?.error?.message?.includes("API key not valid")) {
          return NextResponse.json({
            answer: "The Gemini API key is not valid. Please update your API key in the .env.local file. You can get a valid key from https://ai.google.dev/",
            source: "System",
            confidence: 100
          });
        } else if (errorData?.error?.code === 429) {
          return NextResponse.json({
            answer: "The Gemini API rate limit has been exceeded. Please try again later or switch to local mode.",
            source: "System",
            confidence: 100
          });
        }
        
        return NextResponse.json({
          answer: `Error from Gemini API: ${errorData?.error?.message || 'Unknown error'}. Please try again or switch to local mode.`,
          source: "System",
          confidence: 100
        });
      }
      
      const responseData = await response.json();
      
      // Extract the answer from the Gemini response (updated path)
      const aiResponse = responseData.candidates?.[0]?.content?.parts?.[0]?.text || 
                         "Sorry, I couldn't generate a response from the API.";
      
      // Store the AI response in conversation history
      if (conversation) {
        conversation.messages.push({
          role: "assistant",
          content: aiResponse
        });
      }
      
      return NextResponse.json({
        answer: aiResponse,
        source: "API",
        confidence: 90
      });
    } catch (apiError) {
      console.error("Error calling Gemini API:", apiError);
      
      // Fallback to local knowledge base
      return NextResponse.json({
        answer: "I'm having trouble connecting to the external API. Please check your API configuration or switch to the local knowledge base.",
        source: "System",
        confidence: 30
      });
    }
  } catch (error) {
    console.error('Error in /api/gemini:', error);
    return NextResponse.json(
      { 
        answer: "Sorry, an error occurred while processing your request. Please try again later.", 
        source: "System",
        confidence: 100
      },
      { status: 500 }
    );
  }
} 