// App.tsx - Main App
// 10/22/2024 - Joshua Lim

import './App.css'
import Welcome from './pages/Welcome';
import Resume from './pages/Resume';
import Projects from './pages/Projects';
// import Live from './pages/Live';
import Contact from './pages/Contact';
import Footer from './components/Footer';
import ProgressBar from './components/ProgressBar';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <div className='min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300'>
      <ProgressBar />
      <main className='overflow-y-auto overflow-x-hidden scroll-smooth'>
        <Welcome />
        <Resume />
        <Projects />
        {/** <Live /> to be enabled later */}
        {/** <Live /> */}
        <Contact />
        <Footer />
      </main>
      <ScrollToTop />
    </div>
  )
}

export default App
