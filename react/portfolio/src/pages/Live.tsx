// Live.tsx - Live Projects section (currently not used; will be enabled later)
// 10/22/2024 - Joshua Lim

import React, { useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Button, Chip, Image } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon, ExternalLinkIcon } from '@radix-ui/react-icons';

interface LiveProject {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  liveLink: string;
  status: 'active' | 'maintenance' | 'archived';
}

const liveProjects: LiveProject[] = [
  {
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce platform with payment processing, inventory management, and admin dashboard.",
    image: "/api/placeholder/400/300",
    technologies: ["React", "Node.js", "PostgreSQL", "Stripe", "AWS"],
    liveLink: "https://example-store.com",
    status: 'active'
  },
  {
    title: "Task Management App",
    description: "A collaborative task management application with real-time updates and team collaboration features.",
    image: "/api/placeholder/400/300",
    technologies: ["Vue.js", "Firebase", "TypeScript", "Tailwind CSS"],
    liveLink: "https://taskmanager-app.com",
    status: 'active'
  },
  {
    title: "Weather Dashboard",
    description: "A weather dashboard with real-time data, forecasts, and interactive maps for multiple locations.",
    image: "/api/placeholder/400/300",
    technologies: ["React", "OpenWeather API", "Chart.js", "Mapbox"],
    liveLink: "https://weather-dashboard.com",
    status: 'maintenance'
  }
];

const Live: React.FC = () => {
  const [currentLiveIndex, setCurrentLiveIndex] = useState(0);

  const nextLiveSlide = () => {
    setCurrentLiveIndex((prevIndex) => (prevIndex + 1) % liveProjects.length);
  };

  const prevLiveSlide = () => {
    setCurrentLiveIndex((prevIndex) => (prevIndex - 1 + liveProjects.length) % liveProjects.length);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'maintenance': return 'warning';
      case 'archived': return 'default';
      default: return 'default';
    }
  };

  return (
    <section id="live-projects" className='min-h-screen w-full flex flex-col px-6 py-8 bg-gradient-to-br from-default-50 to-background'>
      <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
            Live Projects
          </h1>
          <p className="text-default-500 text-lg md:text-xl">Production applications and client work</p>
        </motion.div>

        {/* Desktop Live Projects Grid */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto flex-1">
          {liveProjects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full"
            >
              <Card className="w-full h-full flex flex-col shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 bg-background/80 backdrop-blur-sm border border-default-200">
                <CardHeader className="p-0 flex-shrink-0">
                  <div className="relative w-full h-48 overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      fallbackSrc="https://via.placeholder.com/400x300?text=Live+Project"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute top-3 right-3">
                      <Chip
                        size="sm"
                        color={getStatusColor(project.status) as 'success' | 'warning' | 'default'}
                        variant="flat"
                        className="shadow-lg text-xs"
                      >
                        {project.status}
                      </Chip>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="p-4 md:p-6 flex-1 flex flex-col">
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2 md:mb-3 line-clamp-2">{project.title}</h3>
                    <p className="text-default-500 mb-4 md:mb-6 text-sm md:text-base leading-relaxed flex-1 line-clamp-3">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <Chip key={tech} size="sm" variant="flat" color="primary" className="shadow-md text-xs px-3 py-1">
                          {tech}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </CardBody>
                <CardFooter className="p-4 md:p-6 bg-default-100/50 flex-shrink-0">
                  <Button
                    as="a"
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    color="primary"
                    variant="shadow"
                    className="w-full font-semibold shadow-xl hover:shadow-2xl transition-shadow"
                    size="md"
                    startContent={<ExternalLinkIcon />}
                  >
                    Visit Site
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Mobile Live Projects Carousel */}
        <div className="lg:hidden flex-1">
          <div className="relative h-[70vh] max-w-md mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentLiveIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <Card className="w-full h-full bg-background/80 backdrop-blur-sm flex flex-col shadow-2xl border border-default-200">
                  <CardHeader className="p-0 flex-shrink-0">
                    <div className="relative w-full h-48 overflow-hidden">
                      <Image
                        src={liveProjects[currentLiveIndex].image}
                        alt={liveProjects[currentLiveIndex].title}
                        className="w-full h-full object-cover"
                        fallbackSrc="https://via.placeholder.com/400x300?text=Live+Project"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      <div className="absolute top-3 right-3">
                        <Chip
                          size="sm"
                          color={getStatusColor(liveProjects[currentLiveIndex].status) as 'success' | 'warning' | 'default'}
                          variant="flat"
                          className="shadow-lg text-xs"
                        >
                          {liveProjects[currentLiveIndex].status}
                        </Chip>
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody className="p-4 flex-1 flex flex-col">
                    <div className="flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">{liveProjects[currentLiveIndex].title}</h3>
                      <p className="text-default-500 mb-4 text-sm leading-relaxed flex-1 line-clamp-4">{liveProjects[currentLiveIndex].description}</p>
                      <div className="flex flex-wrap gap-2 mt-auto">
                        {liveProjects[currentLiveIndex].technologies.slice(0, 3).map((tech) => (
                          <Chip key={tech} size="sm" variant="flat" color="primary" className="shadow-md text-xs px-3 py-1">
                            {tech}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  </CardBody>
                  <CardFooter className="p-4 bg-default-100/50 flex-shrink-0">
                    <Button
                      as="a"
                      href={liveProjects[currentLiveIndex].liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      color="primary"
                      variant="shadow"
                      className="w-full font-semibold shadow-xl hover:shadow-2xl transition-shadow"
                      size="md"
                      startContent={<ExternalLinkIcon />}
                    >
                      Visit Site
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mobile Live Projects Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              isIconOnly
              variant="bordered"
              color="primary"
              onClick={prevLiveSlide}
              className="font-semibold shadow-lg hover:shadow-xl transition-shadow border-2"
              isDisabled={liveProjects.length <= 1}
              size="md"
            >
              <ChevronLeftIcon />
            </Button>
            <div className="flex gap-2">
              {liveProjects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentLiveIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 shadow-lg ${
                    currentLiveIndex === index ? 'bg-primary w-6 shadow-primary/50' : 'bg-default-300 hover:bg-default-400'
                  }`}
                />
              ))}
            </div>
            <Button
              isIconOnly
              variant="bordered"
              color="primary"
              onClick={nextLiveSlide}
              className="font-semibold shadow-lg hover:shadow-xl transition-shadow border-2"
              isDisabled={liveProjects.length <= 1}
              size="md"
            >
              <ChevronRightIcon />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Live;

