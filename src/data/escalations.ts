export interface Escalation {
  id: string;
  title: string;
  question: string;
  response: string;
  escalationPath: string;
  source: string;
}

export const escalations: Escalation[] = [
  {
    id: "esc-1",
    title: "Billing Dispute",
    question: "I was charged incorrectly for my subscription. What should I do?",
    response: "I understand your concern about the incorrect charge. This requires attention from our billing department. I'll need to escalate this to our financial team who can review your account and process any necessary adjustments.",
    escalationPath: "Support Agent → Billing Department → Financial Manager",
    source: "Billing Resolution Guidelines"
  },
  {
    id: "esc-2",
    title: "Account Security Breach",
    question: "I think my account has been hacked. What should I do?",
    response: "I'm sorry to hear about this security concern. For potential account breaches, we need to take immediate action. I'll escalate this to our security team who will lock your account, investigate any suspicious activity, and help you restore secure access.",
    escalationPath: "Support Agent → Security Team → Security Operations Manager",
    source: "Security Incident Response Protocol"
  },
  {
    id: "esc-3",
    title: "Product Defect",
    question: "The product I received is defective. How do I get a replacement?",
    response: "I apologize for the inconvenience caused by the defective product. This matter needs to be handled by our product quality team. I'll escalate this to ensure you receive a proper inspection and replacement as quickly as possible.",
    escalationPath: "Support Agent → Quality Assurance → Product Manager",
    source: "Product Returns Handbook"
  },
  {
    id: "esc-4",
    title: "Service Outage",
    question: "Your service has been down for hours. When will it be fixed?",
    response: "I sincerely apologize for the service disruption you're experiencing. This is a critical issue that requires immediate attention from our technical operations team. I'll escalate this to our on-call engineers who will prioritize resolving the outage.",
    escalationPath: "Support Agent → Technical Operations → Senior DevOps Engineer",
    source: "Service Reliability Playbook"
  }
]; 