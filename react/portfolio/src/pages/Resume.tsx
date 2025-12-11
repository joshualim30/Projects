
import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardBody, Button } from "@nextui-org/react";
import {
  DownloadIcon,
  PersonIcon,
  BackpackIcon, // Used for Experience and Education
  StarIcon
} from '@radix-ui/react-icons';

const Resume = () => {
  const [activeSection, setActiveSection] = useState<string>('about');

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.download = 'Joshua_Lim_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sections = [
    {
      id: 'about',
      title: "About Me",
      icon: PersonIcon,
      content: (
        <div className="space-y-4">
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Passionate Software Developer and Startup Founder with a proven track record of delivering innovative solutions. Successfully launched a social media app on the Apple App Store in 2016, demonstrating early entrepreneurial spirit and technical expertise. Currently pursuing Business Analytics with a Computer Science minor at UCF.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 p-6 md:p-8 rounded-2xl border border-light-border dark:border-dark-border bg-light-muted/30 dark:bg-dark-muted/30">
            <div>
              <h4 className="font-bold text-lg text-light-foreground dark:text-dark-foreground mb-4">Contact Information</h4>
              <div className="space-y-2 text-base text-gray-500 dark:text-gray-400">
                <p>hi@joshualim.me</p>
                <p>+1 (937) 707-3022</p>
                <p>Orlando, FL 32817</p>
                <a href="https://joshualim.me" className="text-light-primary dark:text-dark-primary hover:underline">https://joshualim.me</a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg text-light-foreground dark:text-dark-foreground mb-4">Interests</h4>
              <div className="flex flex-wrap gap-3">
                {["Innovation", "Leadership", "Startups", "Technology"].map((item) => (
                  <span key={item} className="px-3 py-1.5 bg-light-primary/10 dark:bg-dark-primary/10 text-light-primary dark:text-dark-primary text-sm font-medium rounded-full">{item}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'experience',
      title: "Experience",
      icon: BackpackIcon,
      content: (
        <div className="space-y-8">
          <Card className="glass-card shadow-none bg-transparent">
            <CardBody className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                <h3 className="text-lg md:text-xl font-semibold text-light-foreground dark:text-dark-foreground">Creating Real LLC</h3>
                <span className="text-sm text-light-primary dark:text-dark-primary bg-light-primary/10 dark:bg-dark-primary/10 px-3 py-1 rounded-full">October 2022 - Present</span>
              </div>
              <p className="text-gray-500 mb-6 font-TitilliumWebSemiBold">Startup Founder • Orlando, FL</p>
              <ul className="space-y-4 text-base text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-light-primary dark:text-dark-primary mt-1">•</span>
                  <span>Founded and scaled a technology startup, leading a team of 10+ staff members and managing day-to-day operations.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-light-primary dark:text-dark-primary mt-1">•</span>
                  <span>Secured funding through successful pitch competitions, demonstrating strong business acumen.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-light-primary dark:text-dark-primary mt-1">•</span>
                  <span>Built extensive industry networks and partnerships, facilitating collaboration and resource sharing.</span>
                </li>
              </ul>
            </CardBody>
          </Card>
        </div>
      )
    },
    {
      id: 'education',
      title: "Education",
      icon: BackpackIcon,
      content: (
        <div className="space-y-4">
          <Card className="glass-card bg-transparent shadow-none">
            <CardBody className="p-6 md:p-8">
              <h3 className="text-lg md:text-xl font-semibold text-light-foreground dark:text-dark-foreground mb-1">University of Central Florida</h3>
              <p className="text-gray-500 mb-1">Bachelor of Business Administration</p>
              <p className="text-base text-gray-400 mb-4">August 2022 - December 2026 • Orlando, FL</p>
              <div className="mt-4 p-4 bg-light-muted/30 dark:bg-dark-muted/30 rounded-xl text-light-foreground dark:text-dark-foreground">
                <p className="font-semibold mb-2">Relevant Coursework</p>
                <p className="text-gray-500 leading-relaxed">Business Analytics, Computer Science I & II</p>
              </div>
            </CardBody>
          </Card>
        </div>
      )
    },
    {
      id: 'skills',
      title: "Skills",
      icon: StarIcon,
      content: (
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-4">
            {[
              { cat: "Mobile", tools: "Flutter, Swift/SwiftUI, UIKit, Android" },
              { cat: "Frontend", tools: "React, TypeScript, Vite, Tailwind CSS" },
              { cat: "Backend", tools: "Node.js, Python, Golang, C#, Express.js" },
              { cat: "Cloud", tools: "AWS, GCP, Firebase, Azure, Docker" },
            ].map((skill) => (
              <div key={skill.cat}>
                <h4 className="font-semibold text-sm text-gray-500 uppercase tracking-wider mb-2">{skill.cat}</h4>
                <div className="flex flex-wrap gap-2">
                  {skill.tools.split(', ').map(t => (
                    <span key={t} className="px-3 py-1 rounded-md bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-sm">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }
  ];

  return (
    <section id="about" className='py-20 relative'>
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-TitilliumWebBold mb-4">
            My <span className="text-gradient">Resume</span>
          </h2>
          <Button
            onClick={handleDownload}
            className="bg-light-primary dark:bg-dark-primary text-white font-semibold shadow-lg"
            startContent={<DownloadIcon />}
            radius="full"
          >
            Download PDF
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {/* Navigation - Vertical on Desktop */}
          <div className="lg:col-span-1 flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2 pb-4 lg:pb-0 scrollbar-hide">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${activeSection === section.id
                    ? 'bg-light-primary dark:bg-dark-primary text-white shadow-md'
                    : 'hover:bg-light-muted dark:hover:bg-dark-muted text-gray-500 dark:text-gray-400'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-semibold">{section.title}</span>
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="glass-card p-6 md:p-8 rounded-3xl min-h-[400px]">
                  <div className="flex items-center gap-3 mb-6">
                    {(() => {
                      const s = sections.find(sec => sec.id === activeSection);
                      const I = s?.icon || PersonIcon;
                      return <I className="w-6 h-6 text-light-primary dark:text-dark-primary" />
                    })()}
                    <h3 className="text-2xl font-bold">{sections.find(s => s.id === activeSection)?.title}</h3>
                  </div>
                  {sections.find(s => s.id === activeSection)?.content}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Resume;