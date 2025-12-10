import Self from "../assets/images/joshua.jpg";
import { TypeAnimation } from 'react-type-animation';
import { Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { RxDoubleArrowDown } from "react-icons/rx";

const Welcome = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const socialLinks = [
    { icon: FaGithub, href: "https://github.com/joshualim30", color: "hover:text-gray-900 dark:hover:text-white" },
    { icon: FaLinkedin, href: "https://linkedin.com/in/joshualim30", color: "hover:text-blue-600" },
    { icon: FaEnvelope, href: "mailto:hi@joshualim.me", color: "hover:text-red-500" },
  ];

  return (
    <section id="home" className='min-h-screen relative flex flex-col justify-center items-center px-4 md:px-6 pt-24 pb-12 overflow-hidden'>
      {/* Content Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="glass-card rounded-3xl p-6 md:p-12 w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-12 relative z-10"
      >
        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative group cursor-pointer"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-light-primary to-light-accent dark:from-dark-primary dark:to-dark-accent rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
          <div className="relative h-32 w-32 md:h-56 md:w-56 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl">
            <img
              src={Self}
              alt="Joshua Lim"
              className="h-full w-full object-cover transform transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        </motion.div>

        {/* Text Section */}
        <div className="text-center md:text-left flex-1 space-y-4 md:space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h1 className="font-TitilliumWebBold text-3xl md:text-6xl text-light-foreground dark:text-dark-foreground tracking-tight">
              Joshua Lim
            </h1>
            <div className="text-lg md:text-2xl mt-2 font-TitilliumWebSemiBold text-transparent bg-clip-text bg-gradient-to-r from-light-primary to-light-secondary dark:from-dark-primary dark:to-dark-secondary h-[30px] md:h-[40px]">
              <TypeAnimation
                sequence={[
                  "Software Engineer",
                  2000,
                  "Business Analyst",
                  2000,
                  "Entrepreneur",
                  2000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
                cursor={true}
              />
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-sm md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-TitilliumWebLight"
          >
            Passionate about building innovative solutions and creating impactful technology.
            Currently focusing on full-stack development and internship opportunities.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center md:justify-start pt-2"
          >
            <Button
              onClick={() => scrollToSection('projects')}
              className="bg-light-primary dark:bg-dark-primary text-white font-bold shadow-lg shadow-light-primary/30 dark:shadow-dark-primary/30"
              size="lg"
              radius="full"
            >
              View My Work
            </Button>
            <Button
              onClick={() => scrollToSection('contact')}
              variant="bordered"
              className="border-2 border-light-primary dark:border-dark-primary text-light-primary dark:text-dark-primary font-bold hover:bg-light-primary/10 dark:hover:bg-dark-primary/10"
              size="lg"
              radius="full"
            >
              Get in Touch
            </Button>
          </motion.div>

          {/* Social Icons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="flex gap-6 justify-center md:justify-start pt-2 md:pt-4"
          >
            {socialLinks.map((link, index) => (
              <motion.a
                key={index}
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                href={link.href}
                target={link.href.startsWith('http') ? "_blank" : undefined}
                rel={link.href.startsWith('http') ? "noopener noreferrer" : undefined}
                className={`text-2xl text-gray-400 transition-colors ${link.color}`}
              >
                <link.icon />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 2, duration: 2, repeat: Infinity }}
        className="absolute bottom-4 left-0 right-0 flex justify-center cursor-pointer z-20"
        onClick={() => scrollToSection('about')}
      >
        <RxDoubleArrowDown className="text-3xl text-gray-400 hover:text-light-primary dark:hover:text-dark-primary transition-colors" />
      </motion.div>
    </section>
  );
};

export default Welcome;