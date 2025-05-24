# 🤖 Customer Support AI Assistant – All-in-One Chat Portal

A unified AI-assisted customer support platform built with **Next.js** and **Tailwind CSS**, allowing support agents to manage both **customer queries** and **AI-generated replies** from a single interface — all in one box.

---

## 🌟 Features

- ✅ Single-panel interface: Handle both customer and AI chatbot replies in one place  
- 🤖 AI assistant uses internal knowledge (FAQs, rulebooks, docs) to answer accurately  
- ✍️ Support agents can forward customer messages to AI and then edit/send responses  
- 🚦 Smart escalation suggestions from the AI with reason and routing  
- 🧠 Intent classification for message context (e.g., `"billing"`, `"technical_issue"`)  
- 🪄 All messages are traceable and editable before being sent back to the customer  

---

## 🗂️ Folder Structure

```
src/
├── app/
│   └── support/                # Unified chat interface
├── components/
│   ├── UnifiedChatPanel.tsx   # Main message board
│   ├── MessageInput.tsx       # Message input field
│   └── MessageBubble.tsx      # Chat message UI
├── lib/
│   ├── classifyIntent.ts      # Classify message intent
│   ├── getLocalContext.ts     # Fetch docs/FAQ for context
│   └── formatEscalation.ts    # Structure AI escalation data
├── api/
│   ├── classify/route.ts      # POST /api/classify
│   ├── chat/route.ts          # POST /api/chat (AI logic)
├── styles/
│   └── globals.css            # Tailwind config and global styles
```

---

## 🧠 AI Assistant Response Format

Example response from the AI:

```json
{
  "answer": "It appears you were charged twice. I will escalate this to the billing team.",
  "intent": "billing",
  "escalation_needed": true,
  "reason": "Duplicate charge detected",
  "escalation_path": "Agent → Billing Team → Finance"
}
```

---

## 🛠️ Technology Stack

- **Frontend:** Next.js (App Router), Tailwind CSS, Framer Motion  
- **Backend:** Local API routes using Node.js (via Next.js)  
- **State Management:** React Hooks (`useState`, `useEffect`)  
- **AI Source:** Gemini API or simulated local response using internal docs  
- **Hosting:** Vercel or custom Node.js server  

---

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/customer-support-ai.git
   cd customer-support-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the dev server**
   ```bash
   npm run dev
   ```

4. **Access the app**
   ```
   http://localhost:3000/support
   ```

---

## 🧪 Example Use Case

**Customer:**  
> “Why did I get charged twice?”

**Support Agent:**  
Clicks **"Ask AI"**

**AI Assistant Response:**  
```json
{
  "answer": "You were charged twice due to overlapping subscriptions. I will escalate this to billing.",
  "intent": "billing",
  "escalation_needed": true,
  "reason": "Overlap in subscription cycles",
  "escalation_path": "Agent → Billing → Finance Lead"
}
```

**Agent:**  
Reviews → edits → sends formal response back to customer.

---

## ⚠️ Deployment Notes

> ❌ Deployment currently has **issues** on platforms like Vercel:
- Serverless cold starts delay AI replies  
- API routes may break with **Edge Functions**  
- Environment variables may not resolve correctly during runtime  
- Streaming responses from AI can be unstable in serverless mode  

### ✅ Recommended Workaround:
- Use a **Node.js custom server**  
- Or deploy on **Render**, **Railway**, or a **VPS**

---

## 📌 Summary

This AI-powered support system offers:
- ✨ Seamless chat flow between agent, customer, and AI  
- ✨ Editable AI responses with intent and escalation insight  
- ✨ All-in-one interface for rapid and accurate support  

> 🎯 No dual roles. No confusion. Just one unified view for handling support — efficiently.
