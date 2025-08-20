// Welcome.tsx - Welcome page component
// 10/22/2024 - Joshua Lim

import Self from "../assets/images/joshua.jpg";
import { TypeAnimation } from 'react-type-animation';
import { Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const Welcome = () => {
  const scrollToSection = (sectionId: string) => {
    // Add a small delay to ensure DOM is updated
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      const scrollContainer = document.querySelector('.scroll-container');
      if (element && scrollContainer) {
        // Get the exact position of the target section
        const elementTop = element.offsetTop;
        
        // Scroll to the exact position of the section
        scrollContainer.scrollTo({
          top: elementTop,
          behavior: 'smooth'
        });
      }
    }, 50);
  };

  return (
    <section id="home" className='min-h-screen w-full flex flex-col justify-center items-center px-6 py-12 bg-gradient-to-br from-background to-default-50'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center w-full max-w-4xl mx-auto"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative inline-block mb-8"
        >
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
          <img
            src={Self}
            alt="Joshua Lim"
            className="relative rounded-full h-32 w-32 md:h-48 md:w-48 object-cover border-4 border-primary/50 shadow-2xl"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h1 className="font-TitilliumWebBold text-3xl md:text-4xl lg:text-5xl mb-4">
            Joshua Lim
          </h1>
          <div className="text-lg md:text-xl text-gray-400 mb-6">
            <TypeAnimation
              sequence={[
                "Software Engineer",
                2500,
                "College Student",
                2500,
                "Entrepreneur",
                2500,
              ]}
              wrapper="span"
              speed={30}
              repeat={Infinity}
              className="font-medium"
            />
          </div>

          <p className="text-base md:text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Passionate about building innovative solutions and creating impactful technology.
            Currently focusing on full-stack development and internship opportunities.
          </p>

          <div className="flex justify-center gap-4 mb-8">
            <Button
              onClick={() => scrollToSection('projects')}
              color="primary"
              variant="shadow"
              size="lg"
              className="font-semibold shadow-xl hover:shadow-2xl transition-shadow"
            >
              View My Work
            </Button>
            <Button
              onClick={() => scrollToSection('contact')}
              variant="bordered"
              size="lg"
              className="font-semibold shadow-lg hover:shadow-xl transition-shadow border-2"
            >
              Get in Touch
            </Button>
          </div>

          <div className="flex justify-center gap-6">
            <motion.a
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              href="https://github.com/joshualim30"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl text-gray-400 hover:text-primary transition-colors"
            >
              <FaGithub />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              href="https://linkedin.com/in/joshualim30"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl text-gray-400 hover:text-primary transition-colors"
            >
              <FaLinkedin />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              href="mailto:hi@joshualim.me"
              className="text-2xl text-gray-400 hover:text-primary transition-colors"
            >
              <FaEnvelope />
            </motion.a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Welcome;