// Projects.tsx - Projects page component (Mobile-First Redesign)
// 10/22/2024 - Joshua Lim

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Button, Chip, Image, Spinner } from "@nextui-org/react";
import { motion } from "framer-motion";
import { ExternalLinkIcon, GitHubLogoIcon } from '@radix-ui/react-icons';
import { fetchGitHubProjects, formatDate, getFallbackImage, GitHubProject, filterProjectsByLanguage, getAvailableLanguages } from '../utils/github';

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<GitHubProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<GitHubProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const filtered = filterProjectsByLanguage(projects, selectedLanguage);
    setFilteredProjects(filtered);
  }, [projects, selectedLanguage]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedProjects = await fetchGitHubProjects();
      setProjects(fetchedProjects);
      const languages = getAvailableLanguages(fetchedProjects);
      setAvailableLanguages(languages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'maintenance': return 'warning';
      case 'archived': return 'default';
      default: return 'default';
    }
  };



  if (loading) {
    return (
      <section id="projects-loading" className='min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800'>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Spinner size="lg" color="primary" />
          <p className="mt-6 text-gray-500 dark:text-gray-400 text-lg">Loading projects...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="projects-error" className='min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800'>
        <div className="w-full max-w-md mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-500 dark:text-red-400 mb-6 text-lg">{error}</p>
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
    <section id="projects" className='min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800'>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-12"
          >
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            My Projects
            </h1>
          <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg lg:text-xl mb-6">
            Open-source projects and contributions across different technologies
          </p>
            
          {/* Language Filter - Mobile Optimized */}
                    <div className="flex flex-wrap gap-3 justify-center mb-8 px-4">
            <Button
              variant={selectedLanguage === 'all' ? 'shadow' : 'bordered'}
              color="primary"
              onClick={() => setSelectedLanguage('all')}
              size="md"
              className="font-semibold shadow-lg hover:shadow-xl transition-shadow px-6 py-2"
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
                className="font-semibold shadow-lg hover:shadow-xl transition-shadow px-6 py-2"
              >
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </Button>
            ))}
          </div>
          </motion.div>

                {/* Projects Grid - Mobile First Design */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No projects found for the selected language.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-full"
              >
                <Card className="h-full flex flex-col bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl overflow-hidden">
                  <CardHeader className="p-0 relative">
                    <div className="relative w-full h-48 md:h-56 overflow-hidden">
                      <Image
                        src={project.image}
                        alt={project.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        fallbackSrc={getFallbackImage(project.name)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    </div>
                  </CardHeader>

                  <CardBody className="p-4 md:p-6 flex-1 flex flex-col">
                    {/* Project Header */}
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 line-clamp-2">
                      {project.name}
                    </h3>
                    <p className="text-default-600 text-sm md:text-base leading-relaxed mb-4 line-clamp-3 flex-1">
                      {project.description}
                    </p>

                                        {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.topics.slice(0, 4).map((topic) => (
                        <Chip 
                          key={topic} 
                          size="sm" 
                          variant="flat" 
                          color="primary" 
                          className="text-xs px-3 py-1"
                        >
                          {topic}
                        </Chip>
                      ))}
                      {project.language && (
                        <Chip 
                          size="sm" 
                          variant="flat" 
                          color="secondary" 
                          className="text-xs px-3 py-1"
                        >
                          {project.language}
                        </Chip>
                      )}
                    </div>

                                        {/* Stats */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <span className="flex items-center gap-1">⭐ {project.stargazers_count}</span>
                      <span className="flex items-center gap-1">🍴 {project.forks_count}</span>
                      <span className="hidden sm:block">Updated {formatDate(project.updated_at)}</span>
                    </div>
                    </CardBody>

                                    <CardFooter className="p-6 pt-0 mt-auto">
                    <div className="flex gap-3 w-full">
                      <Button
                        as="a"
                        href={project.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        color="primary"
                        variant="shadow"
                        size="md"
                        className="flex-1 font-semibold shadow-lg hover:shadow-xl transition-shadow px-4 py-2"
                        startContent={<GitHubLogoIcon className="w-4 h-4" />}
                      >
                        GitHub
                      </Button>
                      {project.homepage && (
                        <Button
                          as="a"
                          href={project.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="bordered"
                          color="primary"
                          size="md"
                          className="font-semibold shadow-lg hover:shadow-xl transition-shadow px-4 py-2"
                          startContent={<ExternalLinkIcon className="w-4 h-4" />}
                        >
                          Demo
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                  </Card>
                </motion.div>
                ))}
              </div>
        )}

        {/* Load More Button for Mobile UX */}
        {filteredProjects.length > 6 && (
          <div className="text-center mt-8">
              <Button
                color="primary"
              variant="bordered"
                size="lg"
              className="font-semibold shadow-lg hover:shadow-xl transition-shadow"
              >
              View All Projects
              </Button>
          </div>
        )}
        </div>
      </section>
  );
};

export default Projects;