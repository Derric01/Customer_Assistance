import { NextRequest, NextResponse } from 'next/server';
import { classifyIntent } from '@/lib/classifyIntent';
import { 
  billingEscalationExample,
  technicalEscalationExample,
  accountEscalationExample,
  urgentEscalationExample,
  defaultEscalationExample
} from './escalation';

export async function GET(request: NextRequest) {
  // Get the scenario from URL parameters
  const { searchParams } = new URL(request.url);
  const scenario = searchParams.get('scenario') || 'default';
  
  // Demonstrate various escalation scenarios
  switch (scenario) {
    case 'billing':
      return NextResponse.json(billingEscalationExample);
      
    case 'technical':
      return NextResponse.json(technicalEscalationExample);
      
    case 'account':
      return NextResponse.json(accountEscalationExample);
      
    case 'urgent':
      return NextResponse.json(urgentEscalationExample);
      
    case 'classification':
      // This will use the actual classification logic
      const message = searchParams.get('message') || "I need to speak to a manager about my billing issue urgently";
      return NextResponse.json(classifyIntent(message));
      
    default:
      return NextResponse.json(defaultEscalationExample);
  }
} 