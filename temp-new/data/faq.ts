export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export const faqs: FAQ[] = [
  {
    id: "faq-1",
    question: "How do I reset my password?",
    answer: "To reset your password, click on the 'Forgot Password' link on the login page. You'll receive an email with a password reset link. Click the link and follow the instructions to set a new password."
  },
  {
    id: "faq-2",
    question: "What are your business hours?",
    answer: "Our customer support team is available Monday through Friday, 9 AM to 6 PM EST. For urgent matters outside these hours, please use our emergency support line."
  },
  {
    id: "faq-3",
    question: "How do I update my account information?",
    answer: "You can update your account information by logging into your account and navigating to the 'Account Settings' section. From there, you can modify your personal details, contact information, and preferences."
  },
  {
    id: "faq-4",
    question: "Where can I make payments?",
    answer: "You can make payments through our secure payment portal at example.com/payments. We accept credit/debit cards, PayPal, and bank transfers. For automatic recurring payments, you can set up autopay in your account settings."
  },
  {
    id: "faq-5",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit and debit cards (Visa, Mastercard, American Express), PayPal, and direct bank transfers. For enterprise customers, we also support invoicing with net-30 payment terms."
  }
]; 