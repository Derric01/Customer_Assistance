
# AI Support Portal 🚀

An intelligent customer support platform built with **Next.js 14+**, **Tailwind CSS**, and integrated with the **Google Gemini API** to empower support agents with instant, context-aware assistance.

🔗 **Live Demo**: [https://botassistance.vercel.app](https://botassistance.vercel.app)

---

## 📖 Overview

The AI Support Portal is a modern, responsive customer support platform designed to streamline agent workflows. It leverages AI to provide real-time, context-aware responses, pulling from a hybrid knowledge base of local documentation and the Google Gemini API. The platform includes a robust analytics dashboard, an integrated chat interface, and a mobile-optimized design with dark/light theme support.

---

## 📦 Project Structure


```
ai-support-portal/
├── .env.local                 # Local environment variables (not committed)
├── .env.example               # Environment variable template
├── .eslintrc.js               # ESLint configuration
├── next.config.js             # Next.js configuration
├── package.json               # Scripts and dependencies
├── tailwind.config.js         # Tailwind CSS theme configuration
├── tsconfig.json              # TypeScript configuration
│
├── public/                    # Static assets
│   ├── favicon.ico
│   └── vercel.svg
│
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── ai/            # AI response endpoint
│   │   │   ├── analytics/     # Analytics endpoint
│   │   │   ├── ask/           # User query handling
│   │   │   ├── chat/          # Chat message handling
│   │   │   └── classify/      # Intent classification
│   │   ├── analytics/         # Analytics dashboard page
│   │   ├── chat/              # Chat interface
│   │   ├── knowledge/         # Knowledge base page
│   │   ├── test/              # Test/debug interface
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage
│   │   └── globals.css        # Global styles
│
│   ├── components/            # Reusable UI components
│   │   ├── ChatComponent.tsx       # Chat interface
│   │   ├── SupportAgentView.tsx    # AI response console
│   │   ├── CustomerChatView.tsx    # Customer message view
│   │   ├── AnalyticsCard.tsx       # Analytics stats display
│   │   ├── AnalyticsChart.tsx      # Analytics visualizations
│   │   ├── AppNavigation.tsx       # Navigation bar
│   │   ├── KnowledgeBaseManager.tsx # Documentation editor
│   │   ├── MessageList.tsx         # Chat message display
│   │   ├── SourceTag.tsx           # Reference tags
│   │   └── LoadingSpinner.tsx      # Loading spinner
│
│   ├── contexts/
│   │   └── ChatContext.tsx     # Global chat state management
│
│   ├── data/                   # Local knowledge base
│   │   ├── docs.ts             # Documentation content
│   │   ├── faq.ts              # FAQs
│   │   └── rulebook.ts         # Rules and policies
│
│   ├── lib/                    # Utility functions
│   │   ├── chatService.ts      # Chat-related logic
│   │   ├── getAIResponse.ts    # AI response generation
│   │   ├── classifyIntent.ts   # Intent classification logic
│   │   ├── analyticsService.ts # Analytics processing
│   │   └── utils.ts            # General utilities
│
│   └── types/
│       └── index.ts            # TypeScript type definitions
│
├── styles/
│   └── analytics.module.css    # Scoped styles for analytics
```

---

## 🚀 Features

- ✅ **AI-Powered Responses**  
  Real-time, context-aware replies powered by the **Google Gemini API** through custom API routes.

- 🧠 **Hybrid Knowledge Base**  
  Combines local FAQs, rules, and internal documentation with API-driven answers for dynamic responses.

- 📊 **Support Analytics Dashboard**  
  Visualizes query trends, resolution rates, and category breakdowns.

- 💬 **Integrated Chat Interface**  
  Unified panel for support agents to view customer queries, interact with AI, and send formal responses.

- 🌓 **Fully Responsive Design**  
  Optimized for mobile devices with dark/light theme support.

---

## 🛠️ Prerequisites

- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher
- **Google Gemini API Key**: Obtain from [Google Cloud Console](https://cloud.google.com)

---

## ⚙️ Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/ai-support-portal.git
   cd ai-support-portal
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**  
   Create a `.env.local` file in the root directory and add your Google Gemini API key:
   ```bash
   GOOGLE_API_KEY=your_gemini_api_key
   ```

4. **Run Locally**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

---

## 🧪 Usage Flow

1. A customer submits a query through the **Customer Chat View**.
2. The support agent views the query in the **Agent Interface**.
3. The agent clicks **"Ask AI"** to generate a response based on the knowledge base.
4. The agent reviews and sends the AI-generated response to the customer.

---

## 📹 Demo

> 📌 **Note**:  
> Initial deployment required careful configuration of API routes and environment variables.  
> Explore the live demo for a walkthrough of the interface and functionality.

🔗 **Live Project**: [https://botassistance.vercel.app](https://botassistance.vercel.app)

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

Please ensure your code follows the project's ESLint and TypeScript configurations.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

## 📬 Contact

For questions or feedback, please open an issue on the [GitHub repository](https://github.com/Derric01/ai-support-portal) or reach out via the live demo contact form.

---
