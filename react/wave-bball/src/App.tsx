import './App.css'
import SiteNavbar from './components/Navbar';
import SiteFooter from './components/Footer';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
// import CoachPortal from './pages/CoachPortal'; // TODO: re-enable when portal is ready

function App() {
  return (
    <div className='w-full min-h-screen text-white flex flex-col font-sans'>
      <SiteNavbar />
      <main className='flex-grow'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='about' element={<About />} />
          <Route path='contact' element={<Contact />} />
          {/* <Route path='portal' element={<CoachPortal />} /> */}
          <Route path='*' element={<NotFound />} />
        </Routes>
      </main>
      <SiteFooter />
    </div>
  )
}

export default App
