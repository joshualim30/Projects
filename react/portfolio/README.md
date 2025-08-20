# 🎨 Personal Portfolio Website

> A modern, responsive portfolio website showcasing my skills and projects with smooth animations and interactive elements

## ✨ Features

- 🎨 **Modern UI** - Built with NextUI components for a sleek, professional look
- 🎭 **Smooth Animations** - Framer Motion powered transitions and micro-interactions
- 🎯 **Interactive Elements** - Custom cursor with hover effects and dynamic interactions
- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop devices
- 🌙 **Dark/Light Mode** - Theme switching with persistent preferences
- 📊 **Progress Indicators** - Scroll progress bar and smooth scroll-to-top functionality
- 🎯 **Project Showcase** - Interactive project gallery with detailed information
- 📝 **Dynamic Resume** - Downloadable resume with professional formatting
- 📧 **Contact Integration** - EmailJS powered contact form with validation
- 🎨 **Custom Design** - Tailored color scheme and typography using Titillium Web fonts

## 🛠️ Technologies Used

### **Frontend Framework**
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development for better code quality
- **Vite** - Fast build tool and development server

### **UI & Styling**
- **NextUI** - Beautiful, accessible UI components
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library for smooth transitions

### **Routing & Navigation**
- **React Router DOM** - Client-side routing
- **React Icons** - Comprehensive icon library

### **External Services**
- **EmailJS** - Email integration for contact forms
- **Firebase** - Backend services and hosting

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser and visit:** `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── Navbar.tsx     # Navigation component
│   ├── Footer.tsx     # Footer component
│   ├── ProgressBar.tsx # Scroll progress indicator
│   └── ScrollToTop.tsx # Scroll to top button
├── pages/             # Page components
│   ├── Welcome.tsx    # Landing page
│   ├── About.tsx      # About section
│   ├── Projects.tsx   # Project showcase
│   ├── Resume.tsx     # Resume section
│   └── Contact.tsx    # Contact form
├── assets/            # Static assets
│   ├── images/        # Project images and icons
│   └── fonts/         # Custom fonts (Titillium Web)
├── styles/            # Global styles
└── App.tsx            # Main application component
```

## 🎨 Customization

### **Colors and Theme**

The website uses a custom color scheme defined in `tailwind.config.js`. You can modify the colors by updating the theme configuration:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: '#7C3AED',
        foreground: '#FFFFFF',
      },
      // ... other colors
    }
  }
}
```

### **Content Updates**

- **Personal Information** - Update details in respective page components
- **Project Details** - Modify project information in `src/pages/Projects.tsx`
- **Resume Content** - Update resume in `src/pages/Resume.tsx`
- **Contact Form** - Customize contact form in `src/pages/Contact.tsx`

## 🚀 Deployment

The website is configured for easy deployment on Firebase:

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to Firebase:**
   ```bash
   firebase deploy
   ```

### **Alternative Deployment Options**

- **Vercel** - Connect repository and deploy automatically
- **Netlify** - Drag and drop the `dist` folder
- **GitHub Pages** - Configure for static site hosting

## 📈 Development

### **Available Scripts**

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### **Code Quality**

- **ESLint** - Code linting and formatting
- **TypeScript** - Type checking and IntelliSense
- **Prettier** - Code formatting (if configured)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [NextUI](https://nextui.org/) - Beautiful UI components
- [Framer Motion](https://www.framer.com/motion/) - Smooth animations
- [React Icons](https://react-icons.github.io/react-icons/) - Icon library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [EmailJS](https://www.emailjs.com/) - Email integration service

---

*Built with ❤️ by Joshua Lim*
