# Internship Tracker

A modern, comprehensive React application for tracking internship applications with beautiful UI, smooth animations, and Supabase database integration.

![Internship Tracker](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-2.55-3ECF8E?style=for-the-badge&logo=supabase)

## ✨ Features

- **🎯 Application Management**: Add, edit, and delete internship applications with a streamlined form
- **📊 Status Tracking**: Track applications through 8 different statuses with visual indicators
- **📈 Modern Statistics Dashboard**: Interactive charts and progress bars showing application insights
- **🔍 Smart Search & Filtering**: Advanced search with field-specific queries and real-time filtering
- **📱 Responsive Design**: Beautiful UI that works seamlessly on desktop and mobile devices
- **🎨 Modern UI/UX**: Glass morphism effects, smooth animations, and dark/light mode support
- **📋 Dual View Modes**: Switch between card view and Excel-like table view
- **📤 Data Export**: Export your internship data to CSV format
- **⚡ Real-time Updates**: Instant updates with React context and state management
- **🎯 Autocomplete**: Smart form suggestions based on previously entered data

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Animations**: Framer Motion
- **Database**: Supabase (PostgreSQL)
- **State Management**: React Context API
- **Forms**: React Hook Form
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account and project

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/joshualim30/projects/react/internship_tracker.git
cd react/internship_tracker
npm install
```

### 2. Set Up Supabase Database

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to your project's SQL Editor
3. Run the SQL commands from `src/sql/INIT.sql` to create the database schema

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

To get your Supabase credentials:
1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the "Project URL" and "anon public" key
4. Paste them into your `.env` file

### 4. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📊 Database Schema

The application uses a single `internships` table with comprehensive fields:

### Core Fields
- **Basic Info**: `title`, `company_name`, `company_location`, `company_website`
- **Company Details**: `company_industry`, `company_size`, `company_description`
- **Application Details**: `application_date`, `status`, `interview_date`, `salary_range`
- **Contact Info**: `contact_person`, `contact_email`, `contact_phone`
- **Documents**: `application_url`, `resume_version`, `cover_letter_version`
- **Notes**: `position_description`, `notes`
- **Timestamps**: `created_at`, `updated_at`

## 📋 Application Statuses

The application tracks 8 different statuses with color-coded indicators:

1. **Applied** - Application submitted
2. **Interview Scheduled** - Interview has been scheduled
3. **Interview Completed** - Interview has been completed
4. **Offer Received** - Offer has been received
5. **Offer Accepted** - Offer has been accepted
6. **Offer Declined** - Offer has been declined
7. **Rejected** - Application was rejected
8. **Withdrawn** - Application was withdrawn

## 🎯 Usage Guide

### Adding a New Internship

1. Click the "Add Internship" button
2. Fill in the required fields (Position Title, Company Name, Application Date, Status)
3. Optionally fill in additional details like company information, contact details, etc.
4. Watch the progress indicator fill as you complete each section
5. Click "Add Internship" to save

### Editing an Internship

1. Click on any internship card or the "Edit" button
2. Modify the information as needed
3. Click "Update Internship" to save changes

### Smart Search & Filtering

- **Keyword Search**: Type any term to search across all major fields
- **Field-Specific Search**: Use prefixes like `company:`, `position:`, `status:` for targeted searches
- **Status Filter**: Use the dropdown to filter by application status
- **Real-time Results**: See results update as you type

### View Modes

- **Card View**: Beautiful cards with all application details
- **Table View**: Excel-like table view for data-heavy analysis
- **Toggle**: Use the view toggle button in the header to switch between modes

### Statistics Dashboard

- **Progress Bars**: Visual representation of application pipeline
- **Donut Chart**: Interactive breakdown of application statuses
- **Key Metrics**: Total applications, active applications, interview stage, offers received

### Data Export

- Click the export button in the header to download all internship data as CSV
- Export includes all major fields for external analysis

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── Layout.tsx      # Main layout with navigation
│   ├── StatsCards.tsx  # Statistics dashboard with charts
│   ├── InternshipCard.tsx # Individual internship card
│   ├── InternshipList.tsx # List with search and filtering
│   ├── InternshipForm.tsx # Add/edit form with autocomplete
│   └── Modal.tsx       # Modal component
├── context/            # React context
│   └── InternshipContext.tsx # State management
├── hooks/              # Custom hooks
│   └── useInternships.ts # Internship context hook
├── services/           # API services
│   └── internshipService.ts # Database operations
├── types/              # TypeScript types
│   └── internship.ts   # Internship interfaces
├── utils/              # Utility functions
│   └── statusUtils.ts  # Status management utilities
├── sql/                # Database schema
│   └── INIT.sql        # Database initialization
└── db.ts               # Database connection
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🎨 Design System

The application uses a custom design system built with Tailwind CSS:

### Colors
- **Pastel Palette**: Soft, eye-friendly colors for light mode
- **Dark Mode**: Comprehensive dark theme with proper contrast
- **Status Colors**: Color-coded status indicators

### Components
- **Glass Morphism**: Modern backdrop blur effects
- **Smooth Animations**: Framer Motion animations throughout
- **Responsive Grid**: Adaptive layouts for all screen sizes
- **Interactive Elements**: Hover effects and micro-interactions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use ESLint for code quality
- Maintain responsive design principles
- Add animations for better UX
- Test on multiple screen sizes

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/internship-tracker/issues) page
2. Create a new issue with detailed information
3. Include steps to reproduce the problem

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Animated with [Framer Motion](https://www.framer.com/motion/)
- Powered by [Supabase](https://supabase.com/)

---

**Made with ❤️ for students and job seekers**