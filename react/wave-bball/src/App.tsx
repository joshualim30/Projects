import './App.css'
import SiteNavbar from './components/Navbar';
import SiteFooter from './components/Footer';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import OurStory from './pages/OurStory';
import Contact from './pages/Contact';
import CoachPortal from './pages/CoachPortal';
import Events from './pages/Events';
import Training from './pages/Training';
import CustomerPortal from './pages/CustomerPortal';

function App() {
  return (
    <div className='w-screen min-h-screen text-white flex flex-col font-sans selection:bg-primary selection:text-white'>
      <SiteNavbar />
      <div className='flex-grow'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='events' element={<Events />} />
          <Route path='training' element={<Training />} />
          <Route path='our-story' element={<OurStory />} />
          <Route path='contact' element={<Contact />} />
          <Route path='portal' element={<CoachPortal />} />
          <Route path='customer' element={<CustomerPortal />} />
        </Routes>
      </div>
      <SiteFooter />
    </div>
  )
}

export default App
