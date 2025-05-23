export interface Doc {
  id: string;
  title: string;
  content: string;
}

export const docs: Doc[] = [
  {
    id: "doc-1",
    title: "Getting Started Guide",
    content: "Welcome to our platform! This guide will help you get started with the basic features and functionality. First, create an account and verify your email. Then, you can start exploring our services."
  },
  {
    id: "doc-2",
    title: "Security Best Practices",
    content: "Always use strong passwords and enable two-factor authentication. Never share your login credentials with anyone. Regularly review your account activity and report any suspicious behavior immediately."
  },
  {
    id: "doc-3",
    title: "API Integration Guide",
    content: "Our API allows you to integrate our services into your applications. Use the provided API keys and follow the documentation for proper implementation. Rate limits apply to all API calls."
  }
]; 