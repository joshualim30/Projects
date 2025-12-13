# 🏀 Wave Basketball

> The official digital platform for Wave Basketball, featuring dedicated portals for coaches and parents, advanced training management, and dynamic team content.

## 🎯 Project Overview

Wave Basketball is a modern, full-stack React application designed to streamline the operations of a premier 17u AAU basketball organization. Rebuilt in late 2024, it has evolved from a simple promotional site into a robust platform handling user authentication, player profiles, training schedules, and payments.

### Key Objectives
- **Digital Headquarters**: Central hub for team identity, news, and philosophy.
- **Coach Efficiency**: Dedicated portal for internal team management and scheduling.
- **Parent Convenience**: Customer portal for managing player profiles, tracking billing, and booking sessions.
- **Professional Standard**: High-performance, secure, and visually premium experience.

## ✨ Features

### 🏢 **Portals & Authentication**
- **Coach Portal (`/portal`)**: 
  - Restricted Google Sign-In (requires `@wavebasketball.net` workspace email).
  - Syncs profile data to `coaches` Firestore collection.
  - Internal dashboard for session management.
- **Customer Portal (`/customer`)**:
  - Secure Email/Password Authentication (Firebase Auth).
  - **Player Profile Management**: Parents can create and manage profiles for their athletes (Height, Weight, Position, etc.).
  - **Session History**: View past and upcoming training sessions.
  - **Payment Integration**: Stripe integration for seamless transaction history.

### ⚡ **Dynamic Content**
- **"Meet the Trainers"**: Dynamic page fetching real-time coach profiles from Firestore, ensuring roster changes are instantly reflected.
- **Event Scheduling**: Interactive calendar system for training sessions and clinics.
- **Global Dark Mode**: Unified "Sleek" aesthetic with radial gradients and glassmorphism UI elements.

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React 18 + Vite (Blazing fast build & HMR)
- **Language**: TypeScript (Strict type safety)
- **UI Library**: NextUI (based on Tailwind CSS) + Framer Motion (Animations)
- **Icons**: Lucide React

### **Backend & Services (Firebase)**
- **Hosting**: Global CDN hosting.
- **Authentication**: dual-flow system (Google Workspace for Staff, Email/Pass for Customers).
- **Firestore**: NoSQL database for flexible data modeling (Users, Coaches, Products, Sessions).
- **Cloud Functions**: Serverless backend logic.
- **Firebase Extensions**: 
  - `firestore-stripe-payments`: Payment processing.
  - `firestore-send-email`: Automated transactional emails.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Firebase CLI (`npm install -g firebase-tools`)

### Installation

1. **Clone & Install:**
   ```bash
   git clone https://github.com/joshualim30/wave-bball.git
   cd wave-bball
   npm install
   ```

2. **Environment Setup:**
   Create a `.env` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=wave-bball
   VITE_FIREBASE_STORAGE_BUCKET=wave-bball.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

3. **Run Locally:**
   ```bash
   npm run dev
   ```

## 📦 Deployment

The project uses a standard Vite build process deployed to Firebase Hosting.

```bash
# Production Build & Deploy
npm run deploy
```

> **Note**: This runs `tsc -b && vite build` followed by `firebase deploy`.

## 📂 Project Structure

```
src/
├── assets/         # Static images & global styles
├── components/     # Reusable UI (Navbar, Hero, Footer)
├── pages/          # Route views (Home, CoachPortal, CustomerPortal)
├── firebase.ts     # Firebase SDK initialization
├── App.tsx         # Main router & layout configuration
└── main.tsx        # Entry point
```

## 👨‍💻 Author

**Joshua Lim**  
*Developer & Lead Coach*  
Building for the future of hoops.

---
*© 2025 Wave Basketball. All rights reserved.*