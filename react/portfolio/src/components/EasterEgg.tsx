// EasterEgg.tsx - Navigation Easter Egg
// 10/22/2024 - Joshua Lim

import { useEffect } from 'react';

const EasterEgg = () => {
  useEffect(() => {
    // Auto-snap back to welcome section after a brief delay
    const timer = setTimeout(() => {
      const welcomeSection = document.getElementById('home');
      const scrollContainer = document.querySelector('.scroll-container');
      if (welcomeSection && scrollContainer) {
        const containerRect = scrollContainer.getBoundingClientRect();
        const elementRect = welcomeSection.getBoundingClientRect();
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
    <nav className='easter-egg w-screen flex justify-center items-center bg-gray-800 text-white'>
      <p>All the good stuff is below ;)</p>
    </nav>
  );
};

export default EasterEgg;