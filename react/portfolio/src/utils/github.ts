// github.ts - GitHub API utilities
// 10/22/2024 - Joshua Lim

export interface ProjectMeta {
  tags: string[];
  description?: string;
  liveUrl?: string;
  featured?: boolean;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  status?: 'active' | 'maintenance' | 'archived';
  technologies?: string[];
  highlights?: string[];
}

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
  meta?: ProjectMeta; // Additional metadata from meta.json
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const LOCAL_STORAGE_KEY = 'gh_projects_cache_v2'; // Updated cache key
let projectsCache: { data: GitHubProject[]; timestamp: number } | null = null;
let inFlightProjectsPromise: Promise<GitHubProject[]> | null = null;

// Generate a stable 32-bit positive integer hash for use as a unique ID
const hashStringToNumber = (input: string): number => {
  let hash = 0;
  for (let index = 0; index < input.length; index++) {
    const characterCode = input.charCodeAt(index);
    hash = ((hash << 5) - hash) + characterCode; // hash * 31 + char
    hash |= 0; // Convert to 32-bit integer
  }
  // Ensure positive number and add a large offset to reduce chance of 0
  return Math.abs(hash) + 1;
};

// Fetch and parse meta.json for a project
const fetchProjectMeta = async (username: string, langName: string, projectName: string): Promise<ProjectMeta | null> => {
  try {
    const metaResponse = await fetch(`https://api.github.com/repos/${username}/Projects/contents/${langName}/${projectName}/meta.json`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Portfolio-App'
      }
    });
    
    if (metaResponse.ok) {
      const metaData = await metaResponse.json();
      if (metaData.content) {
        // Decode base64 content and parse JSON
        const metaContent = atob(metaData.content);
        const parsedMeta = JSON.parse(metaContent) as ProjectMeta;
        
        // Validate required fields
        if (parsedMeta.tags && Array.isArray(parsedMeta.tags)) {
          return parsedMeta;
        }
      }
    }
  } catch (error) {
    console.log(`No meta.json found for ${langName}/${projectName}:`, error);
  }
  
  return null;
};

export const fetchGitHubProjects = async (username: string = 'joshualim30'): Promise<GitHubProject[]> => {
  // Check cache first
  if (projectsCache && Date.now() - projectsCache.timestamp < CACHE_DURATION) {
    return projectsCache.data;
  }

  // Try localStorage cache (persists across page reloads)
  try {
    const cachedString = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cachedString) {
      const cached = JSON.parse(cachedString) as { data: GitHubProject[]; timestamp: number };
      if (Date.now() - cached.timestamp < CACHE_DURATION && Array.isArray(cached.data)) {
        projectsCache = cached;
        return cached.data;
      }
    }
  } catch {
    // Ignore localStorage errors (e.g., disabled)
  }

  // If a fetch is already in progress, return the same promise to avoid duplicate requests
  if (inFlightProjectsPromise) {
    return inFlightProjectsPromise;
  }
  
  inFlightProjectsPromise = (async () => {
    try {
      // First, get the contents of the projects repository
      const contentsResponse = await fetch(`https://api.github.com/repos/${username}/Projects/contents`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Portfolio-App'
        }
      });
      
      if (!contentsResponse.ok) {
        if (contentsResponse.status === 403) {
          throw new Error('GitHub API rate limit reached. Please wait a moment and try again.');
        }
        throw new Error(`Failed to fetch projects directory: ${contentsResponse.status}`);
      }
      
      const contents = await contentsResponse.json();
      console.log('Root contents:', contents);
      
      // Filter for directories (language categories)
      const languageDirectories = contents.filter((item: { type: string }) => item.type === 'dir');
      console.log('Language directories:', languageDirectories);
      
      const allProjects: GitHubProject[] = [];
      
      // For each language directory, fetch its contents
      for (const langDir of languageDirectories) {
        const langName = langDir.name;
        console.log(`Processing language directory: ${langName}`);
        
        try {
          const langContentsResponse = await fetch(`https://api.github.com/repos/${username}/Projects/contents/${langName}`, {
            headers: {
              'Accept': 'application/vnd.github.v3+json',
              'User-Agent': 'Portfolio-App'
            }
          });
          
          if (!langContentsResponse.ok) {
            console.warn(`Failed to fetch ${langName} directory contents: ${langContentsResponse.status}`);
            continue;
          }
          
          const langContents = await langContentsResponse.json();
          console.log(`${langName} contents:`, langContents);
          
          // Filter for project directories within the language directory
          const projectDirs = langContents.filter((item: { type: string }) => item.type === 'dir');
          console.log(`${langName} project directories:`, projectDirs);
          
          // For each project directory, create a project object
          for (const projectDir of projectDirs) {
            const projectName = projectDir.name;
            console.log(`Processing project: ${langName}/${projectName}`);
            
            try {
              // Try to fetch README to get description
              let description = `A ${langName} project from my portfolio`;
              try {
                const readmeResponse = await fetch(`https://api.github.com/repos/${username}/Projects/contents/${langName}/${projectName}/README.md`, {
                  headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'Portfolio-App'
                  }
                });
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
              } catch (readmeError) {
                console.log(`No README found for ${langName}/${projectName}:`, readmeError);
                // Use default description if README fetch fails
              }
              
              // Fetch project metadata (new meta.json system)
              const projectMeta = await fetchProjectMeta(username, langName, projectName);
              let projectTags = [langName];
              let liveUrl = null;
              
              if (projectMeta) {
                // Use metadata from meta.json
                projectTags = projectMeta.tags;
                liveUrl = projectMeta.liveUrl || null;
                
                // Override description if provided in meta.json
                if (projectMeta.description) {
                  description = projectMeta.description;
                }
              }
              
              const project: GitHubProject = {
                id: hashStringToNumber(`${langName}/${projectName}`),
                name: projectName,
                description: description,
                html_url: `https://github.com/${username}/Projects/tree/main/${langName}/${projectName}`,
                homepage: liveUrl,
                topics: projectTags,
                stargazers_count: 0, // Not applicable for subdirectories
                forks_count: 0, // Not applicable for subdirectories
                language: langName.charAt(0).toUpperCase() + langName.slice(1),
                updated_at: new Date().toISOString(),
                image: `https://raw.githubusercontent.com/${username}/Projects/main/${langName}/${projectName}/screenshot.jpg`,
                category: langName,
                meta: projectMeta || undefined
              };
              
              console.log(`Added project:`, project);
              allProjects.push(project);
            } catch (error) {
              console.warn(`Failed to process project ${projectName}:`, error);
            }
          }
        } catch (error) {
          console.warn(`Failed to fetch contents for ${langName} directory:`, error);
        }
      }
      
      console.log(`Total projects found: ${allProjects.length}`);
      
      // If no projects found, throw an error
      if (allProjects.length === 0) {
        throw new Error('No projects found in the repository.');
      }
      
      // Deduplicate by path (lang/name) in case of API anomalies
      const seen = new Set<string>();
      const uniqueProjects = allProjects.filter((p) => {
        const key = `${p.category}/${p.name}`.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      // Sort projects by featured status first, then by updated date
      uniqueProjects.sort((a, b) => {
        const aFeatured = a.meta?.featured || false;
        const bFeatured = b.meta?.featured || false;
        
        if (aFeatured && !bFeatured) return -1;
        if (!aFeatured && bFeatured) return 1;
        
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      });
      
      // Cache the results
      projectsCache = {
        data: uniqueProjects,
        timestamp: Date.now()
      };
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projectsCache));
      } catch {
        // Ignore storage errors
      }

      return uniqueProjects;
    } catch (error) {
      console.error('Error fetching GitHub projects:', error);
      
      // Return cached data if available, even if expired
      if (projectsCache) {
        return projectsCache.data;
      }
      
      // Re-throw the error to be handled by the UI
      throw error;
    } finally {
      // Clear in-flight promise on completion
      inFlightProjectsPromise = null;
    }
  })();

  return inFlightProjectsPromise;
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
    // Only use category to avoid duplicates since both language and category contain the same value
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
  return `https://raw.githubusercontent.com/${username}/${repoName}/main/screenshot.jpg`;
};

export const getFallbackImage = (projectName: string): string => {
  // Use a more reliable placeholder service
  return `https://placehold.co/400x300/6366f1/ffffff?text=${encodeURIComponent(projectName)}`;
};
