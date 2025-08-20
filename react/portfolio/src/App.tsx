// App.tsx - Main App
// 10/22/2024 - Joshua Lim

import './App.css'
import EasterEgg from './components/EasterEgg';
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
    <div className='font-TitilliumWebSemiBold bg-background'>
      <div className='scroll-container'>
        <EasterEgg />
        <ProgressBar />
        <Welcome />
        <Resume />
        <Projects />
        {/** <Live /> to be enabled later */}
        {/** <Live /> */}
        <Contact />
        <Footer />
        <ScrollToTop />
      </div>
    </div>
  )
}

export default App
