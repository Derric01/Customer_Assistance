export interface Rule {
  id: string;
  title: string;
  description: string;
}

export const rules: Rule[] = [
  {
    id: "rule-1",
    title: "Customer Data Protection",
    description: "All customer data must be handled according to our privacy policy. Never share customer information with unauthorized parties. Always use secure channels for data transmission."
  },
  {
    id: "rule-2",
    title: "Response Time Guidelines",
    description: "All customer inquiries must be responded to within 24 hours. Urgent matters should be addressed within 4 hours. Escalate complex issues to senior support staff when necessary."
  },
  {
    id: "rule-3",
    title: "Communication Standards",
    description: "Maintain professional and courteous communication at all times. Use clear and concise language. Always verify customer identity before discussing account details."
  }
]; 