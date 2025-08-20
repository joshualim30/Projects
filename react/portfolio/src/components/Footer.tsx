// Footer.tsx
// 10/22/2024 - Joshua Lim

import { useEffect } from 'react';

const Footer = () => {
  useEffect(() => {
    // Auto-snap back to contact section after a brief delay
    const timer = setTimeout(() => {
      const contactSection = document.getElementById('contact');
      const scrollContainer = document.querySelector('.scroll-container');
      if (contactSection && scrollContainer) {
        const containerRect = scrollContainer.getBoundingClientRect();
        const elementRect = contactSection.getBoundingClientRect();
        const scrollTop = scrollContainer.scrollTop + elementRect.top - containerRect.top;
        
        scrollContainer.scrollTo({
          top: scrollTop,
          behavior: 'smooth'
        });
      }
    }, 1500); // 1.5 seconds delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <footer className='easter-egg w-screen flex justify-center items-center bg-gray-800 text-white'>
      <p>Made with ❤️ by Joshua Lim</p>
    </footer>
  );
};

export default Footer;