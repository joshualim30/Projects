import { HelmetProvider } from 'react-helmet-async';
import { ChatInterface } from './components/chat/ChatInterface';
import { Sidebar } from './components/layout/Sidebar';
import { SEO } from './components/common/SEO';

function App() {
    return (
        <HelmetProvider>
            <SEO />
            <div className="fixed inset-0 flex bg-gray-50 dark:bg-[#131314] text-gray-900 dark:text-white overflow-hidden transition-colors duration-300">
                <Sidebar />

                <main className="flex-1 flex flex-col relative w-full h-full">
                    <ChatInterface />
                </main>
            </div>
        </HelmetProvider>
    );
}

export default App;
