import { NextResponse } from 'next/server';

export async function GET() {
  // Return sanitized environment info (don't expose actual API keys)
  return NextResponse.json({
    nodeEnv: process.env.NODE_ENV,
    geminiApiKeyExists: !!process.env.GEMINI_API_KEY,
    nextVersion: process.env.NEXT_VERSION || 'unknown',
    buildTarget: process.env.VERCEL_ENV || 'local',
    time: new Date().toISOString(),
  });
} 