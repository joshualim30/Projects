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
    <footer className='glass border-t border-white/20 dark:border-gray-700/30 py-12 relative overflow-hidden'>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center space-y-8"
        >
          {/* Main Content */}
          <div className="text-center space-y-4">
            <div className="relative inline-block group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <img src={Self} alt="Joshua Lim" className="relative w-24 h-24 rounded-full border-2 border-white dark:border-gray-800 object-cover" />
            </div>

            <h3 className="text-2xl font-TitilliumWebBold text-gray-900 dark:text-white">
              Joshua Lim
            </h3>

            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Software Engineer. Business Analyst. Entrepreneur.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-6">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-light-muted/50 dark:bg-dark-muted/50 hover:bg-light-primary hover:text-white dark:hover:bg-dark-primary transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-primary/25 group"
                  aria-label={social.label}
                >
                  <Icon className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-white transition-colors" />
                </a>
              );
            })}
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-gray-200/50 dark:border-gray-700/50 w-full text-center">
            <p className="text-sm text-gray-500 dark:text-gray-500 font-medium">
              © {currentYear} Joshua Lim - Made with <span className="text-red-500 animate-pulse">❤️</span> in Orlando, FL
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;