import { motion } from 'framer-motion';
import { Project } from '../../../types';
import { ExternalLink } from 'lucide-react';

const SAMPLE_PROJECTS: Project[] = [
    {
        id: '1',
        title: 'Portfolio Chatbot',
        description: 'This very website! A generative AI persona of myself for potential employers and recruiters!',
        technologies: ['React.js', 'Firebase', 'Gemini API'],
        link: 'https://www.joshualim.me',
    },
    {
        id: '2',
        title: 'Hidden Intelligence',
        description: 'A multi-platform game leveraging Generative AI for "masking prompts" to simulate natural user behavior.',
        technologies: ['React.js', 'Firebase', 'Gemini API', 'Flutter'],
        link: 'https://www.hiddeniqgame.com',
    },
    {
        id: '3',
        title: 'Momeant',
        description: "World's first social interactionplatform with user-first design and security features.",
        technologies: ['Flutter', 'Golang', 'GCP', 'Redis', 'MongoDB'],
        link: 'https://www.momeant.app',
    },
    {
        id: '4',
        title: 'Hybrid',
        description: 'Flexible code for flexible environments. My ongoing open-source interpreted language!',
        technologies: ['Rust', 'Python', 'JavaScript'],
        link: 'https://github.com/Creating-Real/hybrid',
    },
];

export const ProjectsView = () => {
    return (
        <div className="w-full mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SAMPLE_PROJECTS.map((project, index) => (
                <motion.div
                    key={project.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-[#1E1F20] border border-gray-200 dark:border-[#444746] rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-[#2D2E2F] transition-colors flex flex-col shadow-sm dark:shadow-none"
                >
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-[#E3E3E3]">{project.title}</h3>
                        {project.link && (
                            <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-[#A8C7FA] hover:text-blue-800 dark:hover:text-blue-300">
                                <ExternalLink size={18} />
                            </a>
                        )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-[#C4C7C5] mb-4 flex-1">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                        {project.technologies.map(tech => (
                            <span key={tech} className="text-xs bg-gray-100 dark:bg-[#131314] text-gray-700 dark:text-[#E3E3E3] px-2 py-1 rounded-md border border-gray-200 dark:border-[#444746]">
                                {tech}
                            </span>
                        ))}
                    </div>
                </motion.div>
            ))}
        </div>
    );
};
