// Resume.tsx - Resume page component (Mobile-First Redesign)
// 10/22/2024 - Joshua Lim

import { useState } from 'react';
import { motion } from "framer-motion";
import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import { DownloadIcon, PersonIcon, BackpackIcon, StarIcon } from '@radix-ui/react-icons';

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
          <p className="text-base md:text-lg text-default-600 leading-relaxed">
            Passionate Software Developer and Startup Founder with a proven track record of delivering innovative solutions. Successfully launched a social media app on the Apple App Store in 2016, demonstrating early entrepreneurial spirit and technical expertise. Currently pursuing Business Analytics with a Computer Science minor at UCF.
          </p>
          <p className="text-base md:text-lg text-default-600 leading-relaxed">
            As Founder of Creating Real LLC, I've led cross-functional teams, secured funding through pitch competitions, and built extensive industry networks. Skilled in full-stack development with expertise in mobile, web, and backend technologies. Committed to leveraging technology to solve real-world problems and drive meaningful impact.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 p-4 bg-default-50/50 rounded-xl">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Contact Information</h4>
              <div className="space-y-1 text-sm">
                <p className="text-default-500">hi@joshualim.me</p>
                <p className="text-default-500">+1 (937) 707-3022</p>
                <p className="text-default-500">Orlando, FL 32817</p>
                <a href="https://www.joshualim.me" className="text-primary hover:text-primary-600 transition-colors">www.joshualim.me</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Interests</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">Innovation</span>
                <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">Leadership</span>
                <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">Startups</span>
                <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">Technology</span>
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
        <div className="space-y-6">
          <Card className="bg-default-50/50 shadow-lg border-l-4 border-l-primary">
            <CardBody className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                <h3 className="text-lg md:text-xl font-semibold text-foreground">Creating Real LLC</h3>
                <span className="text-sm text-default-500 bg-primary/10 px-3 py-1 rounded-full">October 2022 - Present</span>
              </div>
              <p className="text-default-500 mb-4">Startup Founder • Orlando, FL</p>
              <ul className="space-y-2 text-sm md:text-base">
                <li className="flex items-start">
                  <span className="text-primary mr-3 text-lg">•</span>
                  <span className="text-default-600">Founded and scaled a technology startup, leading a team of 10+ staff members and managing day-to-day operations.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 text-lg">•</span>
                  <span className="text-default-600">Secured funding through successful pitch competitions, demonstrating strong business acumen and presentation skills.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 text-lg">•</span>
                  <span className="text-default-600">Conducted comprehensive market research and competitive analysis to identify growth opportunities and strategic advantages.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 text-lg">•</span>
                  <span className="text-default-600">Built extensive industry networks and partnerships, facilitating collaboration and resource sharing across the tech ecosystem.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 text-lg">•</span>
                  <span className="text-default-600">Led software development initiatives, improving system efficiency and implementing best practices for code quality and deployment.</span>
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
          <Card className="bg-default-50/50 shadow-lg">
            <CardBody className="p-6">
              <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">University of Central Florida</h3>
              <p className="text-default-500 mb-1">Bachelor of Business Administration</p>
              <p className="text-sm text-default-400 mb-3">August 2022 - December 2026 • Orlando, FL</p>
              <p className="text-default-600">Major: Business Analytics • Minor: Computer Science</p>
              <div className="mt-3">
                <p className="text-sm font-medium text-default-700 mb-1">Relevant Coursework:</p>
                <p className="text-sm text-default-500">Business Analytics, Computer Science I & II</p>
              </div>
            </CardBody>
          </Card>
          
          <Card className="bg-default-50/50 shadow-lg">
            <CardBody className="p-6">
              <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">Mechanicsburg High School</h3>
              <p className="text-default-500 mb-1">Honors High School Diploma (Cont.)</p>
              <p className="text-sm text-default-400 mb-3">August 2020 - May 2022 • Mechanicsburg, OH</p>
            </CardBody>
          </Card>
          
          <Card className="bg-default-50/50 shadow-lg">
            <CardBody className="p-6">
              <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">Marysville Early College High School</h3>
              <p className="text-default-500 mb-1">Honors High School Diploma</p>
              <p className="text-sm text-default-400 mb-3">August 2018 - May 2020 • Marysville, OH</p>
            </CardBody>
          </Card>
        </div>
      )
    },
    {
      id: 'skills',
      title: "Skills & Accomplishments",
      icon: StarIcon,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-default-50/50 shadow-lg">
              <CardHeader className="pb-2">
                <h3 className="text-lg font-semibold text-foreground">Technical Skills</h3>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <p className="font-medium text-sm text-default-700 mb-1">Mobile Development</p>
                    <p className="text-xs text-default-500">Flutter, Swift/SwiftUI, UIKit, Android Development</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-default-700 mb-1">Frontend Development</p>
                    <p className="text-xs text-default-500">React, TypeScript, Vite, Tailwind CSS, HTML5/CSS3</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-default-700 mb-1">Backend Development</p>
                    <p className="text-xs text-default-500">Node.js, Python, Golang, C#, Express.js, RESTful APIs</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-default-700 mb-1">Database & Analytics</p>
                    <p className="text-xs text-default-500">MongoDB, SQL, PostgreSQL, Data Visualization, Business Intelligence</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-default-700 mb-1">Cloud & DevOps</p>
                    <p className="text-xs text-default-500">AWS, GCP, Firebase, Azure, Docker, CI/CD</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-default-700 mb-1">Development Tools</p>
                    <p className="text-xs text-default-500">Git, GitHub, VS Code, Xcode, Android Studio, Slack, ClickUp, Linear</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-default-50/50 shadow-lg">
              <CardHeader className="pb-2">
                <h3 className="text-lg font-semibold text-foreground">Accomplishments</h3>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="text-primary mr-2 text-sm">🏆</span>
                    <span className="text-sm text-default-600">Founded and led technology startup with 10+ team members</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-primary mr-2 text-sm">💰</span>
                    <span className="text-sm text-default-600">Secured funding through successful pitch competitions</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-primary mr-2 text-sm">💻</span>
                    <span className="text-sm text-default-600">Lead Software Developer managing cross-functional teams</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-primary mr-2 text-sm">👥</span>
                    <span className="text-sm text-default-600">Mentored team members and facilitated internship opportunities</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-primary mr-2 text-sm">📱</span>
                    <span className="text-sm text-default-600">Published social media app on Apple App Store (2016)</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-primary mr-2 text-sm">🌐</span>
                    <span className="text-sm text-default-600">Built extensive industry networks and partnerships</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-primary mr-2 text-sm">📊</span>
                    <span className="text-sm text-default-600">Conducted comprehensive market research and competitive analysis</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          <Card className="bg-default-50/50 shadow-lg">
            <CardHeader className="pb-2">
              <h3 className="text-lg font-semibold text-foreground">Soft Skills</h3>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full">Strategic Thinking</span>
                <span className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full">Adaptability</span>
                <span className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full">Visionary Leadership</span>
                <span className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full">Problem Solving</span>
                <span className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full">Team Collaboration</span>
                <span className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full">Innovation</span>
                <span className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full">Communication</span>
                <span className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full">Project Management</span>
                <span className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full">Mentoring</span>
                <span className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full">Analytical Thinking</span>
                <span className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full">Networking</span>
                <span className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full">Presentation Skills</span>
              </div>
            </CardBody>
          </Card>
        </div>
      )
    }
  ];

  return (
    <section id="resume" className='min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900'>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-12"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            Resume
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-gray-500 dark:text-gray-400 mb-6">
            Download my full resume or explore my background below
          </p>

          {/* Download Button */}
          <Button
            onClick={handleDownload}
            color="primary"
            variant="shadow"
            size="lg"
            className="font-semibold shadow-xl hover:shadow-2xl transition-shadow"
            startContent={<DownloadIcon className="w-5 h-5" />}
          >
            Download Resume
          </Button>
        </motion.div>

        {/* Mobile-First Tab Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center px-4">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? 'shadow' : 'bordered'}
                  color="primary"
                  onClick={() => setActiveSection(section.id)}
                  size="md"
                  className="font-semibold shadow-lg hover:shadow-xl transition-shadow px-6 py-2"
                  startContent={<Icon className="w-4 h-4" />}
                >
                  <span className="hidden sm:inline">{section.title}</span>
                  <span className="sm:hidden">{section.title.split(' ')[0]}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            {(() => {
              const section = sections.find(s => s.id === activeSection);
              const Icon = section?.icon || PersonIcon;
              return (
                <>
                  <Icon className="w-6 h-6 text-primary" />
                  {section?.title}
                </>
              );
            })()}
          </h2>
          {sections.find(s => s.id === activeSection)?.content}
        </motion.div>
      </div>
    </section>
  );
};

export default Resume;