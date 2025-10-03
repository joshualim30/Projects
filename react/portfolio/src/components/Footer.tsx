// Footer.tsx - Mobile-First Responsive Footer
// 10/22/2024 - Joshua Lim

import { motion } from 'framer-motion';
import { GitHubLogoIcon, LinkedInLogoIcon, EnvelopeClosedIcon } from '@radix-ui/react-icons';
import Self from '../assets/images/joshua.jpg';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    {
      icon: GitHubLogoIcon,
      href: 'https://github.com/joshualim30',
      label: 'GitHub'
    },
    {
      icon: LinkedInLogoIcon,
      href: 'https://linkedin.com/in/joshualim30',
      label: 'LinkedIn'
    },
    {
      icon: EnvelopeClosedIcon,
      href: 'mailto:hi@joshualim.me',
      label: 'Email'
    }
  ];

  return (
    <footer className='bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 py-8 md:py-12'>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6"
        >
          {/* Main Content */}
          <div className="space-y-4">
            {/* Picture */}
            <img src={Self} alt="Joshua Lim" className="w-24 h-24 rounded-full mx-auto" />

            {/* Name */}
            <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
              Joshua Lim
            </h3>

            {/* Description */}
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Software Engineer. Business Analyst. Entrepreneur.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-4">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-100 dark:bg-gray-800 hover:bg-blue-500/20 dark:hover:bg-blue-400/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                  aria-label={social.label}
                >
                  <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
                </a>
              );
            })}
          </div>

          {/* Copyright */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs md:text-sm text-gray-400 dark:text-gray-500">
              © {currentYear} Joshua Lim - Made with ❤️ in Orlando, FL
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;