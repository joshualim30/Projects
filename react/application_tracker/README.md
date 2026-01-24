# Application Tracker

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

A premium job application tracker designed to streamline your job search process. Built with modern web technologies, it features integration with Firebase and Supabase to securely manage your application data.

## Features

-   **Application Tracking**: Keep a detailed log of all your job applications, including status, dates, and notes.
-   **Cloud Sync**: Data is synced across devices using Firebase and Supabase.
-   **Desktop Experience**: Packaged with Electron for a native desktop application experience.
-   **Modern UI**: Built with TailwindCSS and Framer Motion for a smooth and responsive user interface.
-   **PDF Handling**: Integrated PDF viewing capabilities for managing resumes and cover letters.
-   **AI Integration**: Utilizes Google Generative AI for enhanced features (e.g., resume analysis or suggestions).

## Tech Stack

-   **Frontend**: React, TypeScript, Vite
-   **Styling**: TailwindCSS, Framer Motion, clsx
-   **Backend / Auth**: Firebase, Supabase
-   **Desktop Wrapper**: Electron
-   **AI**: Google Generative AI SDK

## Getting Started

### Prerequisites

-   Node.js (Latest LTS recommended)
-   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/joshualim30/application_tracker.git
    cd application_tracker
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up environment variables:
    - Create a `.env` file based on the required configuration for Firebase and Supabase.

### Running the App

**Development Mode (Web)**:
```bash
npm run dev
```

**Development Mode (Electron)**:
*(Note: Ensure your `dev` script or a separate script supports Electron dev launch if applicable, otherwise use the build command for a production-like test)*  
The project is configured with `vite-plugin-electron`. Usually, `npm run dev` handles the dev server.

**Build for Production**:
```bash
npm run build
```
This command compiles the TypeScript code, builds the Vite app, and packages it with electron-builder.

**Linting**:
```bash
npm run lint
```

