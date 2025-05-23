import { NextRequest, NextResponse } from 'next/server';

// In-memory analytics storage - in a production app, this would be a database
interface QueryRecord {
  timestamp: number;
  query: string;
  responseSource: string;
  confidence: number;
  intent: string;
  successful: boolean;
}

interface IntentStats {
  count: number;
  avgConfidence: number;
  successRate: number;
}

// Store the last 1000 queries
const queryHistory: QueryRecord[] = [];
const MAX_HISTORY_SIZE = 1000;

// Add a query to the analytics store
export function recordQuery(record: QueryRecord) {
  queryHistory.unshift(record);
  if (queryHistory.length > MAX_HISTORY_SIZE) {
    queryHistory.pop();
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeFrame = searchParams.get('timeFrame') || '24h';
    const auth = request.headers.get('Authorization');
    
    // Simple API key check - in production, use a proper auth system
    if (!auth || auth !== `Bearer ${process.env.ANALYTICS_API_KEY || 'admin-key'}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Convert timeframe to milliseconds
    let timeframeMs = 24 * 60 * 60 * 1000; // Default 24 hours
    if (timeFrame === '7d') timeframeMs = 7 * 24 * 60 * 60 * 1000;
    if (timeFrame === '30d') timeframeMs = 30 * 24 * 60 * 60 * 1000;
    if (timeFrame === 'all') timeframeMs = Number.MAX_SAFE_INTEGER;
    
    // Filter queries by timeframe
    const cutoffTime = Date.now() - timeframeMs;
    const filteredQueries = queryHistory.filter(q => q.timestamp >= cutoffTime);
    
    // Calculate basic stats
    const totalQueries = filteredQueries.length;
    const successfulQueries = filteredQueries.filter(q => q.successful).length;
    const successRate = totalQueries > 0 ? (successfulQueries / totalQueries) * 100 : 0;
    const avgConfidence = filteredQueries.length > 0 
      ? filteredQueries.reduce((sum, q) => sum + q.confidence, 0) / filteredQueries.length 
      : 0;
    
    // Group by source
    const sourceStats = filteredQueries.reduce((acc, query) => {
      const source = query.responseSource;
      if (!acc[source]) {
        acc[source] = { count: 0, successful: 0 };
      }
      acc[source].count++;
      if (query.successful) acc[source].successful++;
      return acc;
    }, {} as Record<string, { count: number, successful: number }>);
    
    // Group by intent
    const intentStats: Record<string, IntentStats> = {};
    filteredQueries.forEach(query => {
      if (!intentStats[query.intent]) {
        intentStats[query.intent] = { count: 0, avgConfidence: 0, successRate: 0 };
      }
      intentStats[query.intent].count++;
      intentStats[query.intent].avgConfidence += query.confidence;
    });
    
    // Calculate averages for each intent
    Object.keys(intentStats).forEach(intent => {
      const stats = intentStats[intent];
      stats.avgConfidence = stats.avgConfidence / stats.count;
      
      // Count successful queries for this intent
      const successfulForIntent = filteredQueries.filter(
        q => q.intent === intent && q.successful
      ).length;
      
      stats.successRate = (successfulForIntent / stats.count) * 100;
    });
    
    // Find top queries
    const queryFrequency: Record<string, number> = {};
    filteredQueries.forEach(record => {
      const normalizedQuery = record.query.toLowerCase().trim();
      queryFrequency[normalizedQuery] = (queryFrequency[normalizedQuery] || 0) + 1;
    });
    
    const topQueries = Object.entries(queryFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([query, count]) => ({ query, count }));
    
    return NextResponse.json({
      timeFrame,
      totalQueries,
      successRate,
      avgConfidence,
      sourceStats,
      intentStats,
      topQueries,
      recentQueries: filteredQueries.slice(0, 10).map(q => ({
        timestamp: new Date(q.timestamp).toISOString(),
        query: q.query,
        source: q.responseSource,
        confidence: q.confidence,
        intent: q.intent
      }))
    });
  } catch (error) {
    console.error('Error generating analytics:', error);
    return NextResponse.json({ error: 'Failed to generate analytics' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { query, responseSource, confidence, intent, successful } = await request.json();
    
    if (!query || !responseSource || confidence === undefined || !intent) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const record: QueryRecord = {
      timestamp: Date.now(),
      query,
      responseSource,
      confidence,
      intent,
      successful: !!successful
    };
    
    recordQuery(record);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recording analytics:', error);
    return NextResponse.json({ error: 'Failed to record analytics' }, { status: 500 });
  }
} 