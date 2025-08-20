// Projects.tsx - Projects page component
// 10/22/2024 - Joshua Lim

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Button, Chip, Image, Spinner } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { fetchGitHubProjects, formatDate, getFallbackImage, GitHubProject, filterProjectsByLanguage, getAvailableLanguages } from '../utils/github';

// Live projects moved to pages/Live.tsx

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<GitHubProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<GitHubProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
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
      console.log('Fetched projects:', fetchedProjects);
      setProjects(fetchedProjects);
      const languages = getAvailableLanguages(fetchedProjects);
      console.log('Available languages:', languages);
      setAvailableLanguages(languages);
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

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'maintenance': return 'warning';
      case 'archived': return 'default';
      default: return 'default';
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'danger';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <section id="projects-loading" className='min-h-screen w-full flex items-center justify-center px-6 py-16 bg-gradient-to-br from-background to-default-50'>
        <div className="text-center">
          <Spinner size="lg" color="primary" />
          <p className="mt-6 text-default-500 text-lg">Loading projects...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="projects-error" className='min-h-screen w-full flex items-center justify-center px-6 py-16 bg-gradient-to-br from-background to-default-50'>
        <div className="text-center max-w-md">
          <p className="text-danger mb-6 text-lg">Error loading projects: {error}</p>
          <Button 
            color="primary" 
            variant="shadow" 
            size="lg" 
            onClick={fetchProjects} 
            className="font-semibold shadow-xl hover:shadow-2xl transition-shadow"
          >
            Retry
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className='min-h-screen w-full flex flex-col px-6 py-12 bg-gradient-to-br from-background to-default-50'>
      <div className="flex-1 w-full max-w-4xl mx-auto flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            GitHub Projects
          </h1>
          <p className="text-default-500 text-lg md:text-xl mb-6">My open-source projects and contributions</p>
          
          {/* Language Filter */}
          <div className="flex justify-center mb-8">
            <div className="flex gap-2 md:gap-3 flex-wrap justify-center">
              <Button
                variant={selectedLanguage === 'all' ? 'shadow' : 'bordered'}
                color="primary"
                onClick={() => setSelectedLanguage('all')}
                size="md"
                className="font-semibold shadow-lg hover:shadow-xl transition-shadow border-2"
              >
                All
              </Button>
              {availableLanguages.map((lang) => (
                <Button
                  key={lang}
                  variant={selectedLanguage === lang ? 'shadow' : 'bordered'}
                  color="primary"
                  onClick={() => setSelectedLanguage(lang)}
                  size="md"
                  className="font-semibold shadow-lg hover:shadow-xl transition-shadow border-2"
                >
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-default-500 text-lg">No projects found for the selected language.</p>
          </div>
        ) : (
          <>
            {/* Project Carousel */}
            <div className="flex-1 relative overflow-hidden mb-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex justify-center"
                >
                  <Card className="w-full max-w-2xl bg-background/80 backdrop-blur-md flex flex-col rounded-2xl shadow-xl border border-default-200 overflow-hidden">
                    <CardHeader className="p-0 flex-shrink-0">
                      <div className="relative w-full h-64 md:h-80 overflow-hidden">
                        <Image
                          src={filteredProjects[currentIndex]?.image}
                          alt={filteredProjects[currentIndex]?.name}
                          className="w-full h-full object-cover"
                          fallbackSrc={getFallbackImage(filteredProjects[currentIndex]?.name || 'Project')}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center gap-2 mb-2">
                            {filteredProjects[currentIndex]?.meta?.featured && (
                              <Chip size="sm" color="warning" variant="flat" className="text-xs">
                                Featured
                              </Chip>
                            )}
                            {filteredProjects[currentIndex]?.meta?.status && (
                              <Chip 
                                size="sm" 
                                color={getStatusColor(filteredProjects[currentIndex]?.meta?.status) as 'success' | 'warning' | 'default'} 
                                variant="flat" 
                                className="text-xs"
                              >
                                {filteredProjects[currentIndex]?.meta?.status}
                              </Chip>
                            )}
                            {filteredProjects[currentIndex]?.meta?.difficulty && (
                              <Chip 
                                size="sm" 
                                color={getDifficultyColor(filteredProjects[currentIndex]?.meta?.difficulty) as 'success' | 'warning' | 'danger'} 
                                variant="flat" 
                                className="text-xs"
                              >
                                {filteredProjects[currentIndex]?.meta?.difficulty}
                              </Chip>
                            )}
                          </div>
                          <h3 className="text-xl md:text-2xl font-bold text-white line-clamp-2 drop-shadow-lg">
                            {filteredProjects[currentIndex]?.name}
                          </h3>
                        </div>
                      </div>
                    </CardHeader>
                    <CardBody className="p-6 flex-1 flex flex-col">
                      <p className="text-default-600 mb-4 line-clamp-3 text-sm md:text-base leading-relaxed">
                        {filteredProjects[currentIndex]?.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {filteredProjects[currentIndex]?.topics.slice(0, 5).map((topic) => (
                          <Chip 
                            key={topic} 
                            size="sm" 
                            variant="flat" 
                            color="primary" 
                            className="shadow-sm text-xs font-medium"
                          >
                            {topic}
                          </Chip>
                        ))}
                        {filteredProjects[currentIndex]?.language && (
                          <Chip 
                            size="sm" 
                            variant="flat" 
                            color="secondary" 
                            className="shadow-sm text-xs font-medium"
                          >
                            {filteredProjects[currentIndex]?.language}
                          </Chip>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs md:text-sm text-default-500 mt-auto pt-4 border-t border-default-200">
                        <span className="flex items-center gap-1">⭐ {filteredProjects[currentIndex]?.stargazers_count}</span>
                        <span className="flex items-center gap-1">🍴 {filteredProjects[currentIndex]?.forks_count}</span>
                        <span className="flex items-center gap-1">Updated {formatDate(filteredProjects[currentIndex]?.updated_at || '')}</span>
                      </div>
                    </CardBody>
                    <CardFooter className="p-6 bg-default-50/50 border-t border-default-200">
                      <div className="flex gap-2 w-full">
                        <Button
                          as="a"
                          href={filteredProjects[currentIndex]?.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          color="primary"
                          variant="shadow"
                          size="md"
                          className="flex-1 font-semibold shadow-xl hover:shadow-2xl transition-shadow"
                        >
                          View on GitHub
                        </Button>
                        {filteredProjects[currentIndex]?.homepage && (
                          <Button
                            as="a"
                            href={filteredProjects[currentIndex]?.homepage}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="bordered"
                            color="primary"
                            size="md"
                            className="font-semibold shadow-lg hover:shadow-xl transition-shadow border-2"
                          >
                            Live Demo
                          </Button>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-center space-x-6 py-6">
              <button
                onClick={prevSlide}
                className="p-3 rounded-full bg-background/80 backdrop-blur-sm shadow-xl hover:bg-background/90 transition-all duration-300 hover:scale-110"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>

              {/* Navigation Dots */}
              <div className="flex space-x-3">
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

              <button
                onClick={nextSlide}
                className="p-3 rounded-full bg-background/80 backdrop-blur-sm shadow-xl hover:bg-background/90 transition-all duration-300 hover:scale-110"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Projects;