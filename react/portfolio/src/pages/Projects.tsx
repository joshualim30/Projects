// Projects.tsx - Projects page component
// 10/22/2024 - Joshua Lim

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Button, Chip, Image, Spinner } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon, ExternalLinkIcon } from '@radix-ui/react-icons';
import { fetchGitHubProjects, formatDate, getFallbackImage, GitHubProject, filterProjectsByLanguage, getAvailableLanguages } from '../utils/github';

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

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<GitHubProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<GitHubProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentLiveIndex, setCurrentLiveIndex] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const filtered = filterProjectsByLanguage(projects, selectedLanguage);
    setFilteredProjects(filtered);
    setCurrentIndex(0); // Reset to first project when filter changes
  }, [projects, selectedLanguage]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedProjects = await fetchGitHubProjects();
      setProjects(fetchedProjects);
      setAvailableLanguages(getAvailableLanguages(fetchedProjects));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredProjects.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + filteredProjects.length) % filteredProjects.length);
  };

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

  if (loading) {
    return (
      <section id="projects" className='min-h-screen w-full flex items-center justify-center px-6 py-16 bg-gradient-to-br from-background to-default-50'>
        <div className="text-center">
          <Spinner size="lg" color="primary" />
          <p className="mt-6 text-default-500 text-lg">Loading projects...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="projects" className='min-h-screen w-full flex items-center justify-center px-6 py-16 bg-gradient-to-br from-background to-default-50'>
        <div className="text-center max-w-md">
          <p className="text-danger mb-6 text-lg">Error loading projects: {error}</p>
          <Button color="primary" size="lg" onClick={fetchProjects} className="shadow-lg">
            Retry
          </Button>
        </div>
      </section>
    );
  }

  return (
    <div className='min-h-screen w-full'>
      {/* GitHub Projects Section */}
      <section id="projects" className='min-h-screen w-full flex flex-col px-6 py-16 bg-gradient-to-br from-background to-default-50'>
        <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold text-foreground mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              GitHub Projects
            </h1>
            <p className="text-default-500 text-xl mb-8">My open-source projects and contributions</p>
            
            {/* Language Filter */}
            <div className="flex justify-center mb-8">
              <div className="flex gap-3 flex-wrap justify-center">
                <Button
                  variant={selectedLanguage === 'all' ? 'flat' : 'bordered'}
                  color="primary"
                  onClick={() => setSelectedLanguage('all')}
                  className="shadow-lg"
                >
                  All
                </Button>
                {availableLanguages.map((lang) => (
                  <Button
                    key={lang}
                    variant={selectedLanguage === lang ? 'flat' : 'bordered'}
                    color="primary"
                    onClick={() => setSelectedLanguage(lang)}
                    className="shadow-lg"
                  >
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>

          {filteredProjects.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-default-500 text-lg">No projects found for the selected language.</p>
            </div>
          ) : (
            <>
              {/* Desktop Carousel */}
              <div className="hidden lg:block">
                <div className="relative max-w-6xl mx-auto">
                  <div className="flex items-center gap-6">
                    <Button
                      isIconOnly
                      variant="flat"
                      color="primary"
                      onClick={prevSlide}
                      className="bg-background/80 backdrop-blur-sm shadow-xl z-10 hover:scale-110 transition-transform"
                      isDisabled={filteredProjects.length <= 2}
                      size="lg"
                    >
                      <ChevronLeftIcon />
                    </Button>
                    
                    <div className="flex-1 overflow-hidden">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentIndex}
                          initial={{ opacity: 0, x: 100 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          transition={{ duration: 0.3 }}
                          className="grid grid-cols-2 gap-8"
                        >
                          {filteredProjects.slice(currentIndex, currentIndex + 2).map((project) => (
                            <Card key={project.id} className="w-full h-full flex flex-col shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 bg-background/80 backdrop-blur-sm border border-default-200">
                              <CardHeader className="p-0">
                                <div className="relative w-full h-56 overflow-hidden">
                                  <Image
                                    src={project.image}
                                    alt={project.name}
                                    className="w-full h-full object-cover"
                                    fallbackSrc={getFallbackImage(project.name)}
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                </div>
                              </CardHeader>
                              <CardBody className="p-6 flex-1 flex flex-col">
                                <div className="flex-1">
                                  <h3 className="text-2xl font-bold text-foreground mb-3">{project.name}</h3>
                                  <p className="text-default-500 mb-6 line-clamp-3 text-base leading-relaxed">{project.description}</p>
                                  <div className="flex flex-wrap gap-2 mb-6">
                                    {project.topics.slice(0, 4).map((topic) => (
                                      <Chip key={topic} size="sm" variant="flat" color="primary" className="shadow-md">
                                        {topic}
                                      </Chip>
                                    ))}
                                    {project.language && (
                                      <Chip size="sm" variant="flat" color="secondary" className="shadow-md">
                                        {project.language}
                                      </Chip>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-6 text-sm text-default-500">
                                    <span className="flex items-center gap-1">⭐ {project.stargazers_count}</span>
                                    <span className="flex items-center gap-1">🍴 {project.forks_count}</span>
                                    <span className="flex items-center gap-1">Updated {formatDate(project.updated_at)}</span>
                                  </div>
                                </div>
                              </CardBody>
                              <CardFooter className="p-6 bg-default-100/50">
                                <Button
                                  as="a"
                                  href={project.html_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  variant="flat"
                                  color="primary"
                                  className="w-full shadow-lg hover:shadow-xl transition-shadow"
                                  size="lg"
                                >
                                  View on GitHub
                                </Button>
                              </CardFooter>
                            </Card>
                          ))}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    <Button
                      isIconOnly
                      variant="flat"
                      color="primary"
                      onClick={nextSlide}
                      className="bg-background/80 backdrop-blur-sm shadow-xl z-10 hover:scale-110 transition-transform"
                      isDisabled={filteredProjects.length <= 2}
                      size="lg"
                    >
                      <ChevronRightIcon />
                    </Button>
                  </div>

                  {/* Desktop Navigation Dots */}
                  {filteredProjects.length > 2 && (
                    <div className="flex justify-center gap-3 mt-8">
                      {Array.from({ length: Math.ceil(filteredProjects.length / 2) }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentIndex(index * 2)}
                          className={`w-4 h-4 rounded-full transition-all duration-300 shadow-lg ${
                            Math.floor(currentIndex / 2) === index ? 'bg-primary w-8 shadow-primary/50' : 'bg-default-300 hover:bg-default-400'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Carousel */}
              <div className="lg:hidden">
                <div className="relative h-[600px] max-w-md mx-auto">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentIndex}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0"
                    >
                      <Card className="w-full h-full bg-background/80 backdrop-blur-sm flex flex-col shadow-2xl border border-default-200">
                        <CardHeader className="p-0">
                          <div className="relative w-full h-56 overflow-hidden">
                            <Image
                              src={filteredProjects[currentIndex]?.image}
                              alt={filteredProjects[currentIndex]?.name}
                              className="w-full h-full object-cover"
                              fallbackSrc={getFallbackImage(filteredProjects[currentIndex]?.name || 'Project')}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                          </div>
                        </CardHeader>
                        <CardBody className="p-6 flex-1 flex flex-col">
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-foreground mb-3">{filteredProjects[currentIndex]?.name}</h3>
                            <p className="text-default-500 mb-6 text-base leading-relaxed">{filteredProjects[currentIndex]?.description}</p>
                            <div className="flex flex-wrap gap-2 mb-6">
                              {filteredProjects[currentIndex]?.topics.slice(0, 3).map((topic) => (
                                <Chip key={topic} size="sm" variant="flat" color="primary" className="shadow-md">
                                  {topic}
                                </Chip>
                              ))}
                              {filteredProjects[currentIndex]?.language && (
                                <Chip size="sm" variant="flat" color="secondary" className="shadow-md">
                                  {filteredProjects[currentIndex]?.language}
                                </Chip>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-default-500">
                              <span className="flex items-center gap-1">⭐ {filteredProjects[currentIndex]?.stargazers_count}</span>
                              <span className="flex items-center gap-1">🍴 {filteredProjects[currentIndex]?.forks_count}</span>
                            </div>
                          </div>
                        </CardBody>
                        <CardFooter className="p-6 bg-default-100/50">
                          <Button
                            as="a"
                            href={filteredProjects[currentIndex]?.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="flat"
                            color="primary"
                            className="w-full shadow-lg"
                            size="lg"
                          >
                            View on GitHub
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Mobile Navigation Controls */}
                <div className="flex items-center justify-center gap-6 mt-8">
                  <Button
                    isIconOnly
                    variant="flat"
                    color="primary"
                    onClick={prevSlide}
                    className="bg-background/80 backdrop-blur-sm shadow-xl hover:scale-110 transition-transform"
                    isDisabled={filteredProjects.length <= 1}
                    size="lg"
                  >
                    <ChevronLeftIcon />
                  </Button>
                  <div className="flex gap-3">
                    {filteredProjects.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 shadow-lg ${
                          currentIndex === index ? 'bg-primary w-6 shadow-primary/50' : 'bg-default-300 hover:bg-default-400'
                        }`}
                      />
                    ))}
                  </div>
                  <Button
                    isIconOnly
                    variant="flat"
                    color="primary"
                    onClick={nextSlide}
                    className="bg-background/80 backdrop-blur-sm shadow-xl hover:scale-110 transition-transform"
                    isDisabled={filteredProjects.length <= 1}
                    size="lg"
                  >
                    <ChevronRightIcon />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Live Projects Section */}
      <section id="live-projects" className='min-h-screen w-full flex flex-col px-6 py-16 bg-gradient-to-br from-default-50 to-background'>
        <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold text-foreground mb-6 bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              Live Projects
            </h1>
            <p className="text-default-500 text-xl">Production applications and client work</p>
          </motion.div>

          {/* Desktop Live Projects Grid */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {liveProjects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="w-full h-full flex flex-col shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 bg-background/80 backdrop-blur-sm border border-default-200">
                  <CardHeader className="p-0">
                    <div className="relative w-full h-56 overflow-hidden">
                      <Image
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        fallbackSrc="https://via.placeholder.com/400x300?text=Live+Project"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      <div className="absolute top-4 right-4">
                        <Chip
                          size="sm"
                          color={getStatusColor(project.status) as 'success' | 'warning' | 'default'}
                          variant="flat"
                          className="shadow-lg"
                        >
                          {project.status}
                        </Chip>
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody className="p-6 flex-1 flex flex-col">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-foreground mb-3">{project.title}</h3>
                      <p className="text-default-500 mb-6 text-base leading-relaxed">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                          <Chip key={tech} size="sm" variant="flat" color="primary" className="shadow-md">
                            {tech}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  </CardBody>
                  <CardFooter className="p-6 bg-default-100/50">
                    <Button
                      as="a"
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="flat"
                      color="primary"
                      className="w-full shadow-lg hover:shadow-xl transition-shadow"
                      size="lg"
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
          <div className="lg:hidden">
            <div className="relative h-[600px] max-w-md mx-auto">
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
                    <CardHeader className="p-0">
                      <div className="relative w-full h-56 overflow-hidden">
                        <Image
                          src={liveProjects[currentLiveIndex].image}
                          alt={liveProjects[currentLiveIndex].title}
                          className="w-full h-full object-cover"
                          fallbackSrc="https://via.placeholder.com/400x300?text=Live+Project"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        <div className="absolute top-4 right-4">
                          <Chip
                            size="sm"
                            color={getStatusColor(liveProjects[currentLiveIndex].status) as 'success' | 'warning' | 'default'}
                            variant="flat"
                            className="shadow-lg"
                          >
                            {liveProjects[currentLiveIndex].status}
                          </Chip>
                        </div>
                      </div>
                    </CardHeader>
                    <CardBody className="p-6 flex-1 flex flex-col">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-foreground mb-3">{liveProjects[currentLiveIndex].title}</h3>
                        <p className="text-default-500 mb-6 text-base leading-relaxed">{liveProjects[currentLiveIndex].description}</p>
                        <div className="flex flex-wrap gap-2">
                          {liveProjects[currentLiveIndex].technologies.map((tech) => (
                            <Chip key={tech} size="sm" variant="flat" color="primary" className="shadow-md">
                              {tech}
                            </Chip>
                          ))}
                        </div>
                      </div>
                    </CardBody>
                    <CardFooter className="p-6 bg-default-100/50">
                      <Button
                        as="a"
                        href={liveProjects[currentLiveIndex].liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="flat"
                        color="primary"
                        className="w-full shadow-lg"
                        size="lg"
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
            <div className="flex items-center justify-center gap-6 mt-8">
              <Button
                isIconOnly
                variant="flat"
                color="primary"
                onClick={prevLiveSlide}
                className="bg-background/80 backdrop-blur-sm shadow-xl hover:scale-110 transition-transform"
                isDisabled={liveProjects.length <= 1}
                size="lg"
              >
                <ChevronLeftIcon />
              </Button>
              <div className="flex gap-3">
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
                variant="flat"
                color="primary"
                onClick={nextLiveSlide}
                className="bg-background/80 backdrop-blur-sm shadow-xl hover:scale-110 transition-transform"
                isDisabled={liveProjects.length <= 1}
                size="lg"
              >
                <ChevronRightIcon />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;