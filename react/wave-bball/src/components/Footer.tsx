
import { Instagram, Twitter, Mail } from 'lucide-react';

const SiteFooter = () => (
    <footer className="w-full py-8 bg-black border-t border-white/10 mt-auto">
        <div className="container mx-auto px-4 flex flex-col items-center gap-6">
            <div className="flex space-x-6">
                <a href="https://www.instagram.com/wave.basketball/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    <span className="sr-only">Instagram</span>
                    <Instagram className="h-6 w-6" />
                </a>
                <a href="https://www.twitter.com/@wave_bball" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    <span className="sr-only">Twitter</span>
                    <Twitter className="h-6 w-6" />
                </a>
                <a href="mailto:contact@wavebasketball.com" className="text-gray-400 hover:text-white transition-colors">
                    <span className="sr-only">Email</span>
                    <Mail className="h-6 w-6" />
                </a>
            </div>
            <p className="text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} Wave Basketball. All rights reserved.
            </p>
        </div>
    </footer>
);

export default SiteFooter;
