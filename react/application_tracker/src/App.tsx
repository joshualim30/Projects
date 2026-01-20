import { useState, useEffect } from 'react'
import { Application } from './types'
import { AppLayout } from './components/Layout.tsx'
import { Dashboard } from './components/Dashboard.tsx'
import { Settings } from './components/Settings.tsx'
import { ApplicationList } from './components/ApplicationList.tsx'
import { Emails } from './components/Emails.tsx'
import { Discovery } from './components/Discovery.tsx'

import { ResumeLab } from './components/ResumeLab.tsx'
import { Profile } from './components/Profile.tsx'
import './index.css'

function App(): JSX.Element {
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    const handleTabChange = (e: CustomEvent<string>) => {
      console.log('App: Tab change event received:', e.detail);
      if (e.detail) setActiveTab(e.detail);
    };

    const handleTrackJob = (e: CustomEvent<Partial<Application>>) => {
      console.log('App: trackJob event received:', e.detail);
      setActiveTab('applications');
    };

    window.addEventListener('changeTab', handleTabChange as EventListener);
    window.addEventListener('trackJob', handleTrackJob as EventListener);
    return () => {
      window.removeEventListener('changeTab', handleTabChange as EventListener);
      window.removeEventListener('trackJob', handleTrackJob as EventListener);
    };
  }, []);

  const renderContent = () => {
    console.log('App: Rendering content for tab:', activeTab);
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'applications':
        return <ApplicationList />
      case 'emails':
        return <Emails />
      case 'discovery':
        return <Discovery />
      case 'resume':
        return <ResumeLab />
      case 'settings':
        return <Settings />
      case 'profile':
        return <Profile />
      default:
        console.warn('App: Unknown tab requested:', activeTab);
        return <Dashboard />
    }
  }

  return (
    <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="max-w-7xl mx-auto">
        {renderContent()}
      </div>
    </AppLayout>
  )
}

export default App
