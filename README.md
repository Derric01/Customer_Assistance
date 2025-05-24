```markdown
# 🤖 AI Support Portal

An intelligent customer support platform built with **Next.js 14+, Tailwind CSS**, and integrated with **Google Gemini API** to empower agents with instant, context-aware assistance.

🔗 **Live Demo**: [botassistaance.vercel.app](https://botassistaance.vercel.app)

---

## 📦 Project Structure

```

ai-support-portal/
├── .env.local                 # Local environment variables
├── .env                       # Env template (no secrets)
├── .eslintrc.js               # ESLint config
├── next.config.js             # Next.js config
├── package.json               # Scripts & dependencies
├── tailwind.config.js         # Tailwind theme config
├── tsconfig.json              # TypeScript config
│
├── public/                    # Static assets
│   └── favicon.ico, vercel.svg
│
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── ai/            # AI response
│   │   │   ├── analytics/     # Analytics endpoint
│   │   │   ├── ask/           # Handle user queries
│   │   │   ├── chat/          # Chat messages
│   │   │   └── classify/      # Intent classification
│   │   ├── analytics/         # Dashboard page
│   │   ├── chat/              # Chat UI
│   │   ├── knowledge/         # Knowledge base
│   │   ├── test/              # Test/debug UI
│   │   ├── layout.tsx         # App layout
│   │   ├── page.tsx           # Homepage
│   │   └── globals.css        # Global styles
│
│   ├── components/            # Reusable UI blocks
│   │   ├── ChatComponent.tsx       # Chat UI
│   │   ├── SupportAgentView\.tsx   # AI response console
│   │   ├── CustomerChatView\.tsx   # Customer messages
│   │   ├── AnalyticsCard.tsx      # Analytics stats
│   │   ├── AnalyticsChart.tsx     # Analytics graphs
│   │   ├── AppNavigation.tsx      # Navbar
│   │   ├── KnowledgeBaseManager.tsx # Docs editor
│   │   ├── MessageList.tsx        # Chat display
│   │   ├── SourceTag.tsx          # Reference tag
│   │   └── LoadingSpinner.tsx     # Spinner
│
│   ├── contexts/
│   │   └── ChatContext.tsx     # Global state for chat
│
│   ├── data/                   # Local knowledge base
│   │   ├── docs.ts             # Docs content
│   │   ├── faq.ts              # FAQs
│   │   └── rulebook.ts         # Rules & policies
│
│   ├── lib/                    # Helper logic
│   │   ├── chatService.tsx
│   │   ├── getAIResponse.ts
│   │   ├── classifyIntent.ts
│   │   ├── analyticsService.ts
│   │   └── utils.ts
│
│   └── types/
│       └── index.ts            # TypeScript types

├── styles/
│   └── analytics.module.css   # Scoped styles

````

---

## 🚀 Features

- ✅ **AI-Powered Responses**  
  Real-time intelligent replies powered by **Google Gemini**, routed via custom API.

- 🧠 **Local + API Knowledge Base**  
  Dynamically pulls answers from FAQs, rules, and internal docs.

- 📊 **Support Analytics Dashboard**  
  Tracks queries, resolutions, and category breakdowns.

- 💬 **Integrated Chat Panel**  
  Single-pane UI for support agents to view customer chats, forward to AI, and send formal replies.

- 🌓 **Fully Responsive**  
  Mobile-optimized, with dark/light theme toggle.

---

## ⚙️ Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/ai-support-portal.git
   cd ai-support-portal
````

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Add environment variables**

   Create a `.env.local` file:

   ```bash
   GOOGLE_API_KEY=your_gemini_api_key
   ```

4. **Run locally**

   ```bash
   npm run dev
   ```

---

## 🧪 Usage Flow

1. Customer sends a query via the **customer chat view**.
2. Support agent sees the query in the **agent interface**.
3. Agent clicks **"Ask AI"** to get a response based on your documentation.
4. Agent forwards the AI-generated message formally to the customer.

---

## 📹 Demo Note

> 📌 **Note**:
> Deploying this project initially posed some configuration challenges, especially with API routes and environment setup.
> To help understand the interface and working, I’ve included a short demo walkthrough.

🔗 **Live Project**: [https://botassistaance.vercel.app](https://botassistaance.vercel.app)

---

```
```
