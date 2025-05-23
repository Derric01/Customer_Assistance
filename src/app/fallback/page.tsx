export default function FallbackPage() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">AI Support Portal - Static Version</h1>
      
      <div className="mb-8">
        <p className="mb-4">
          Welcome to our support portal. If you're seeing this page, you may be experiencing issues with our interactive chat interface.
        </p>
        <p className="mb-4">
          Here are some common questions and answers:
        </p>
      </div>
      
      <div className="space-y-6">
        <div className="border p-4 rounded-lg">
          <h2 className="font-bold mb-2">How do I reset my password?</h2>
          <p>To reset your password, click on the 'Forgot Password' link on the login page. You'll receive an email with a password reset link. Click the link and follow the instructions to set a new password.</p>
        </div>
        
        <div className="border p-4 rounded-lg">
          <h2 className="font-bold mb-2">Where can I make payments?</h2>
          <p>You can make payments through our secure payment portal at example.com/payments. We accept credit/debit cards, PayPal, and bank transfers. For automatic recurring payments, you can set up autopay in your account settings.</p>
        </div>
        
        <div className="border p-4 rounded-lg">
          <h2 className="font-bold mb-2">What are your business hours?</h2>
          <p>Our customer support team is available Monday through Friday, 9 AM to 6 PM EST. For urgent matters outside these hours, please use our emergency support line.</p>
        </div>
        
        <div className="border p-4 rounded-lg">
          <h2 className="font-bold mb-2">How do I update my account information?</h2>
          <p>You can update your account information by logging into your account and navigating to the 'Account Settings' section. From there, you can modify your personal details, contact information, and preferences.</p>
        </div>
      </div>
      
      <div className="mt-8">
        <a href="/" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Return to home page
        </a>
      </div>
    </div>
  );
} 