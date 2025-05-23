import { classifyIntent } from '../lib/classifyIntent';

// Sample messages to test
const testMessages = [
  "What products do you offer?",
  "I have a question about my bill",
  "My app is not working properly",
  "How do I change my account settings?",
  "I want to speak to a manager right now!",
  "Tell me about your pricing plans",
  "I can't log into my account",
  "I need a refund for my subscription",
  "The system is very slow today",
  "This is the worst customer service ever",
  "I need immediate help with my billing issue and want to speak to a manager!",
  "My account is locked and I need urgent assistance from a human!",
  "The app keeps crashing and I'm extremely frustrated - get me a technical expert NOW!"
];

// Run classification for each test message
console.log('Intent Classification Test\n');
console.log('='.repeat(60));

testMessages.forEach(message => {
  const result = classifyIntent(message);
  console.log(`Message: "${message}"`);
  console.log(`Intent: ${result.intent}`);
  console.log(`Answer: ${result.answer}`);
  
  // Display escalation details if present
  if (result.escalation_needed) {
    console.log(`Escalation Needed: ${result.escalation_needed}`);
    console.log(`Reason: ${result.reason}`);
    console.log(`Escalation Path: ${result.escalation_path}`);
  }
  
  console.log('-'.repeat(60));
});

// Test with a custom message if provided as command line argument
if (process.argv.length > 2) {
  const customMessage = process.argv.slice(2).join(' ');
  console.log(`\nTesting custom message: "${customMessage}"`);
  const result = classifyIntent(customMessage);
  console.log(`Intent: ${result.intent}`);
  console.log(`Answer: ${result.answer}`);
  
  // Display escalation details if present
  if (result.escalation_needed) {
    console.log(`Escalation Needed: ${result.escalation_needed}`);
    console.log(`Reason: ${result.reason}`);
    console.log(`Escalation Path: ${result.escalation_path}`);
  }
}

/**
 * To run this script:
 * 1. Build the TypeScript files with your build command (e.g., npm run build)
 * 2. Run with Node.js:
 *    node dist/scripts/test-intent-classifier.js [optional custom message]
 */ 