// github.ts - GitHub API utilities
// 10/22/2024 - Joshua Lim

export interface GitHubProject {
  id: number;
  name: string;
  description: string;
  html_url: string;
  homepage: string | null;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  image?: string;
  category?: string; // react, python, flutter, swift, etc.
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let projectsCache: { data: GitHubProject[]; timestamp: number } | null = null;

export const fetchGitHubProjects = async (username: string = 'joshualim30'): Promise<GitHubProject[]> => {
  // Check cache first
  if (projectsCache && Date.now() - projectsCache.timestamp < CACHE_DURATION) {
    return projectsCache.data;
  }

  try {
    // First, get the contents of the projects repository
    const contentsResponse = await fetch(`https://api.github.com/repos/${username}/projects/contents`);
    
    if (!contentsResponse.ok) {
      throw new Error(`Failed to fetch projects directory: ${contentsResponse.status}`);
    }
    
    const contents = await contentsResponse.json();
    
    // Filter for directories (language categories)
    const languageDirectories = contents.filter((item: { type: string }) => item.type === 'dir');
    
    const allProjects: GitHubProject[] = [];
    
    // For each language directory, fetch its contents
    for (const langDir of languageDirectories) {
      const langName = langDir.name;
      
      try {
        const langContentsResponse = await fetch(`https://api.github.com/repos/${username}/projects/contents/${langName}`);
        
        if (!langContentsResponse.ok) {
          console.warn(`Failed to fetch ${langName} directory contents`);
          continue;
        }
        
        const langContents = await langContentsResponse.json();
        
        // Filter for project directories within the language directory
        const projectDirs = langContents.filter((item: { type: string }) => item.type === 'dir');
        
        // For each project directory, create a project object
        for (const projectDir of projectDirs) {
          const projectName = projectDir.name;
          
          try {
            // Try to fetch README to get description
            let description = `A ${langName} project from my portfolio`;
            try {
              const readmeResponse = await fetch(`https://api.github.com/repos/${username}/projects/contents/${langName}/${projectName}/README.md`);
              if (readmeResponse.ok) {
                const readmeData = await readmeResponse.json();
                if (readmeData.content) {
                  // Decode base64 content and extract first line as description
                  const content = atob(readmeData.content).split('\n')[0];
                  if (content && content.length > 10) {
                    description = content.replace(/^#\s*/, '').trim(); // Remove markdown header
                  }
                }
              }
            } catch {
              // Use default description if README fetch fails
            }
            
            const project: GitHubProject = {
              id: Math.floor(Math.random() * 1000000), // Generate unique ID
              name: projectName,
              description: description,
              html_url: `https://github.com/${username}/projects/tree/main/${langName}/${projectName}`,
              homepage: null, // Can be set manually for projects with live demos
              topics: [langName],
              stargazers_count: 0, // Not applicable for subdirectories
              forks_count: 0, // Not applicable for subdirectories
              language: langName.charAt(0).toUpperCase() + langName.slice(1),
              updated_at: new Date().toISOString(),
              image: `https://raw.githubusercontent.com/${username}/projects/main/${langName}/${projectName}/project_example.jpg`,
              category: langName
            };
            
            allProjects.push(project);
          } catch (error) {
            console.warn(`Failed to process project ${projectName}:`, error);
          }
        }
      } catch (error) {
        console.warn(`Failed to fetch contents for ${langName} directory:`, error);
      }
    }
    
    // Sort projects by updated date (most recent first)
    allProjects.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    
    // Cache the results
    projectsCache = {
      data: allProjects,
      timestamp: Date.now()
    };

    return allProjects;
  } catch (error) {
    console.error('Error fetching GitHub projects:', error);
    
    // Return cached data if available, even if expired
    if (projectsCache) {
      return projectsCache.data;
    }
    
    throw error;
  }
};

export const filterProjectsByLanguage = (projects: GitHubProject[], language: string | null): GitHubProject[] => {
  if (!language || language === 'all') {
    return projects;
  }
  
  return projects.filter(project => {
    const projectLanguage = project.language?.toLowerCase() || project.category?.toLowerCase();
    return projectLanguage === language.toLowerCase();
  });
};

export const getAvailableLanguages = (projects: GitHubProject[]): string[] => {
  const languages = new Set<string>();
  
  projects.forEach(project => {
    if (project.language) {
      languages.add(project.language);
    }
    if (project.category) {
      languages.add(project.category);
    }
  });
  
  return Array.from(languages).sort();
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const getProjectImage = (username: string, repoName: string): string => {
  return `https://raw.githubusercontent.com/${username}/${repoName}/main/project_example.jpg`;
};

export const getFallbackImage = (projectName: string): string => {
  return `https://via.placeholder.com/400x300/6366f1/ffffff?text=${encodeURIComponent(projectName)}`;
};
