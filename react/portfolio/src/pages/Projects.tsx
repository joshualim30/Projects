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

  if (loading) {
    return (
      <section id="projects-loading" className='min-h-[50vh] flex items-center justify-center'>
        <div className="text-center">
          <Spinner size="lg" color="primary" />
          <p className="mt-4 text-gray-500 dark:text-gray-400">Loading projects...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="projects-error" className='min-h-[50vh] flex items-center justify-center'>
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchProjects} color="primary" variant="shadow">Retry</Button>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className='py-20 relative'>
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-TitilliumWebBold mb-4">
            My <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Open-source contributions and personal projects exploring new technologies.
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {['all', ...availableLanguages].map((lang) => (
            <Button
              key={lang}
              variant={selectedLanguage === lang ? 'solid' : 'bordered'}
              className={`capitalize ${selectedLanguage === lang ? 'bg-light-primary dark:bg-dark-primary text-white' : 'border-light-primary/50 dark:border-dark-primary/50 text-light-primary dark:text-dark-primary'}`}
              onClick={() => setSelectedLanguage(lang)}
              radius="full"
              size="sm"
            >
              {lang}
            </Button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="glass-card mb-4 h-full hover:scale-[1.02] transition-transform duration-300">
                <CardHeader className="p-0 z-0">
                  <div className="relative w-full h-48 overflow-hidden">
                    <Image
                      removeWrapper
                      alt={project.name}
                      className="z-0 w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                      src={project.image}
                      fallbackSrc={getFallbackImage(project.name)}
                    />
                    <div className="absolute inset-0 bg-black/40" />
                  </div>
                </CardHeader>
                <CardBody className="p-8">
                  <h3 className="text-2xl font-bold mb-3 text-light-foreground dark:text-dark-foreground line-clamp-1">
                    {project.name}
                  </h3>
                  <p className="text-base text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 min-h-[72px]">
                    {project.description || "No description available."}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.language && (
                      <Chip size="sm" variant="dot" color="primary" className="p-2 text-black dark:text-white">
                        {/* Spacer */}
                        &nbsp;
                        {project.language}
                      </Chip>
                    )}
                    {project.topics.slice(0, 3).map(topic => (
                      <Chip key={topic} size="sm" variant="flat" className="text-xs p-2 text-white dark:text-black bg-gray-800 dark:bg-gray-200">
                        {topic}
                      </Chip>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-auto">
                    <span>⭐ {project.stargazers_count}</span>
                    <span>Updated {formatDate(project.updated_at)}</span>
                  </div>
                </CardBody>
                <CardFooter className="px-8 pb-8 pt-0 gap-3">
                  <Button
                    as="a"
                    href={project.html_url}
                    target="_blank"
                    className="flex-1 bg-dark-surface hover:bg-dark-muted dark:hover:bg-dark-muted shadow-sm font-semibold"
                    size="sm"
                    startContent={<GitHubLogoIcon />}
                  >
                    Code
                  </Button>
                  {project.homepage && (
                    <Button
                      as="a"
                      href={project.homepage}
                      target="_blank"
                      className="flex-1 bg-light-primary dark:bg-dark-primary text-white shadow-md font-semibold"
                      size="sm"
                      startContent={<ExternalLinkIcon />}
                    >
                      Demo
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <p className="text-center text-gray-500 mt-8">No projects found for this category.</p>
        )}
      </div>
    </section>
  );
};

export default Projects;