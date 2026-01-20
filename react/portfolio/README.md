# Joshua Lim's AI Portfolio

> A next-generation portfolio website featuring an interactive AI chatbot powered by Google's Gemini API.

## ✨ Features

- 🤖 **AI-Powered Personality** - A conversational interface powered by **Google Gemini**, capable of answering questions about my background, skills, and experience.
- 💬 **Interactive Chat** - A sleek chat interface familiar to users of modern LLMs, featuring streaming responses and rich UI elements.
- 📱 **Mobile-First Design** - Fully responsive layout with an adaptive sidebar and mobile-optimized input areas.
- ⚡ **Real-time Streaming** - Serverless backend using Firebase Functions to stream AI responses directly to the client.
- 🎨 **Modern Aesthetics** - Built with Tailwind CSS for a clean, professional, and dark-mode-friendly look.
- 📁 **Dynamic Project Showcase** - Rich project cards and details integrated directly into the chat flow.

## 🛠️ Tech Stack

### **Frontend**
- **React 18** - Component-based UI architecture
- **TypeScript** - Type safety and developer ergonomics
- **Tailwind CSS** - Utility-first styling with dark mode support
- **Framer Motion** - Smooth animations for message bubbles and transitions
- **Vite** - High-performance build tooling

### **Backend & AI**
- **Firebase Functions** - Serverless compute for secure API handling
- **Google Gemini API** - The intelligence behind the chatbot persona
- **Firebase Hosting** - Fast and secure global content delivery

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/joshualim30/portfolio.git
   cd portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:** Visit `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/
│   ├── chat/          # Chat interface, message list, input area
│   │   ├── actions/   # Rich UI widgets (Project cards, etc.)
│   └── layout/        # Sidebar, main layout containers
├── services/          # API integrations (Gemini, Firebase)
├── styles/           # Tailwind and global styles
└── types/            # TypeScript definitions
functions/            # Firebase Cloud Functions (Backend)
```

## 🚀 Deployment

This project is deployed using Firebase Hosting.

```bash
npm run deploy
```

This command builds the React application and deploys it along with the Cloud Functions to Firebase.

## 📄 License

This project is licensed under the MIT License.

---

*Built with ❤️ by Joshua Lim*

