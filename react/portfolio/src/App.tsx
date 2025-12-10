import { useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Welcome from './pages/Welcome';
import Resume from './pages/Resume';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

function App() {
  // Ensure dark mode is default on load
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className='min-h-screen bg-light-background dark:bg-dark-background text-light-foreground dark:text-dark-foreground transition-colors duration-300 font-TitilliumWebRegular selection:bg-light-primary dark:selection:bg-dark-primary selection:text-white'>
      <Navbar />

      <main className='relative overflow-hidden'>
        {/* Background Gradients */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-light-primary/20 dark:bg-dark-primary/10 rounded-full blur-[120px] animate-blob" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-light-secondary/20 dark:bg-dark-secondary/10 rounded-full blur-[120px] animate-blob animation-delay-2000" />
          <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-light-accent/20 dark:bg-dark-accent/10 rounded-full blur-[120px] animate-blob animation-delay-4000" />
        </div>

        <div className="relative z-10">
          <Welcome />
          <div id="about">
            <Resume />
          </div>
          <div id="projects">
            <Projects />
          </div>
          <div id="contact">
            <Contact />
          </div>
        </div>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default App;
