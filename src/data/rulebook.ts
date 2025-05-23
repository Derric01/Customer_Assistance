export interface Rule {
  id: string;
  title: string;
  question: string;
  description: string;
  source: string;
}

export const rules: Rule[] = [
  {
    id: "rule-1",
    title: "Customer Data Protection",
    question: "How should I handle customer data?",
    description: "All customer data must be handled according to our privacy policy. Never share customer information with unauthorized parties. Always use secure channels for data transmission.",
    source: "Privacy Policy Guidelines"
  },
  {
    id: "rule-2",
    title: "Response Time Guidelines",
    question: "What are the response time requirements?",
    description: "All customer inquiries must be responded to within 24 hours. Urgent matters should be addressed within 4 hours. Escalate complex issues to senior support staff when necessary.",
    source: "Customer Service Protocol"
  },
  {
    id: "rule-3",
    title: "Communication Standards",
    question: "What standards should I follow in customer communications?",
    description: "Maintain professional and courteous communication at all times. Use clear and concise language. Always verify customer identity before discussing account details.",
    source: "Internal Communication Guidelines"
  },
  {
    id: "rule-4",
    title: "Refund Policy",
    question: "What is our refund policy?",
    description: "Customers are eligible for a full refund within 30 days of purchase if they are unsatisfied with our service. After 30 days, refunds are provided at the discretion of management and may be prorated based on usage.",
    source: "Financial Policies Handbook"
  }
]; 