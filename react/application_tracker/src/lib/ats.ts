
export interface ATSResult {
    totalScore: number;
    details: {
        keywords: { score: number; found: string[]; missing: string[] };
        impact: { score: number; feedback: string; metricsFound: string[] };
        formatting: { score: number; missingSections: string[] };
        actionVerbs: { score: number; count: number };
    };
    feedback: string;
    reasoning?: string;
    suggestions?: {
        title: string;
        explanation: string;
        importance: 'high' | 'medium' | 'low';
    }[];
}

const ACTION_VERBS = new Set([
    'architected', 'engineered', 'deployed', 'spearheaded', 'optimized', 'scaled',
    'led', 'managed', 'developed', 'created', 'designed', 'implemented', 'reduced',
    'increased', 'generated', 'improved', 'accelerated', 'transformed', 'built',
    'launched', 'mentored', 'orchestrated', 'pioneered', 'streamlined', 'delivered'
]);

const CRITICAL_SECTIONS = ['experience', 'education', 'skills'];

export const analyzeResume = (resumeText: string, jobDescription: string): ATSResult => {
    const resumeLower = resumeText.toLowerCase();
    const jobLower = jobDescription.toLowerCase();

    // 1. Dynamic Keyword Extraction
    // We look for capitalized words in JD (potential technologies/tools) + common tech terms
    // Simple heuristic: split by non-word chars, filter for words > 3 chars
    // Ideally we'd use NLP, but for client-side TS:

    // Extract likely keywords from JD (capitalized words that aren't common stop words, plus technical dictionary)
    // This is a simplified "Dynamic" approach.
    const jdWords = jobDescription.match(/\b[A-Z][a-zA-Z]+\b/g) || [];
    const uniqueJDKeywords = Array.from(new Set(jdWords.map(w => w.toLowerCase())
        .filter(w => !['The', 'And', 'For', 'With', 'That', 'This', 'From', 'Have', 'Work', 'Team'].includes(w.charAt(0).toUpperCase() + w.slice(1)))
    ));

    // Role-Specific Dictionaries
    const sweKeywords = [
        'system design', 'distributed systems', 'microservices', 'ci/cd', 'tdd', 'algorithms',
        'data structures', 'latency', 'throughput', 'scalability', 'refactoring', 'code review',
        'api design', 'database schema', 'optimization'
    ];

    const dataKeywords = [
        'sql', 'tableau', 'powerbi', 'excel', 'pandas', 'numpy', 'a/b testing', 'statistical analysis',
        'forecasting', 'visualization', 'stakeholder management', 'requirements gathering', 'etl',
        'data modeling', 'business intelligence'
    ];

    // Detect Job Type context from JD
    const isSWE = sweKeywords.some(k => jobLower.includes(k)) || jobLower.includes('software') || jobLower.includes('developer') || jobLower.includes('engineer');
    const isData = dataKeywords.some(k => jobLower.includes(k)) || jobLower.includes('analyst') || jobLower.includes('data');

    // Add role-specific keywords to the mandatory check list if the job seems to match
    if (isSWE) {
        sweKeywords.forEach(k => {
            if (jobLower.includes(k) && !uniqueJDKeywords.includes(k)) uniqueJDKeywords.push(k);
        });
    }
    if (isData) {
        dataKeywords.forEach(k => {
            if (jobLower.includes(k) && !uniqueJDKeywords.includes(k)) uniqueJDKeywords.push(k);
        });
    }

    const techStack = [
        'react', 'typescript', 'javascript', 'node', 'python', 'java', 'c++', 'go', 'rust', 'ruby',
        'sql', 'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'rest', 'graphql', 'grpc',
        'git', 'agile', 'scrum', 'jira', 'ci/cd', 'linux', 'bash', 'redis', 'kafka', 'elasticsearch',
        'postgres', 'mongodb', 'mysql', 'firebase', 'supabase', 'next.js', 'vue', 'angular',
        'html', 'css', 'tailwind', 'redux', 'jest', 'cypress', 'selenium', 'pytorch', 'tensorflow'
    ];

    techStack.forEach(tech => {
        if (jobLower.includes(tech) && !uniqueJDKeywords.includes(tech)) {
            uniqueJDKeywords.push(tech);
        }
    });

    const foundKeywords = uniqueJDKeywords.filter(k => resumeLower.includes(k));
    const missingKeywords = uniqueJDKeywords.filter(k => !resumeLower.includes(k));

    // Keyword Score (Weighted 45%) - Increased weight for technical roles
    const keywordRatio = uniqueJDKeywords.length > 0 ? foundKeywords.length / uniqueJDKeywords.length : 1;
    const keywordScore = Math.round(keywordRatio * 45);

    // 2. Impact Analysis (Quantifiable Metrics & Technical Scale) (25% max)
    // For SWE: Look for "latency", "uptime", "users", "requests", "data volume" context
    const metricRegex = /(\d+%|\$\d+|\d+\+)/g;
    const metricsFound = resumeText.match(metricRegex) || [];

    let technicalImpactBonus = 0;
    if (isSWE) {
        if (resumeLower.includes('latency')) technicalImpactBonus += 5;
        if (resumeLower.includes('throughput') || resumeLower.includes('requests')) technicalImpactBonus += 5;
        if (resumeLower.includes('uptime') || resumeLower.includes('availability')) technicalImpactBonus += 5;
    }

    // Cap at 25 points (Metrics count + Bonus)
    const impactBaseScore = Math.min(20, metricsFound.length * 4);
    const impactScore = Math.min(25, impactBaseScore + (technicalImpactBonus > 0 ? 5 : 0)); // Bonus gives extra edge

    const impactFeedback = metricsFound.length > 3
        ? (isSWE && technicalImpactBonus > 0
            ? "Excellent! You included both numbers and technical impact metrics (latency/scale)."
            : "Good usage of numbers. For engineering roles, also mention 'latency', 'uptime', or 'requests/sec' if applicable.")
        : "Critical: Add metrics. Engineers need to see 'Reduced build time by 20%', 'Handled 10k RPS', etc.";

    // 3. Action Verbs (20 points max)
    // Count distinct strong action verbs
    const resumeWordsArr = resumeLower.match(/\b\w+\b/g) || [];
    const foundVerbs = resumeWordsArr.filter(w => ACTION_VERBS.has(w));
    const uniqueVerbs = new Set(foundVerbs);
    const verbScore = Math.min(20, uniqueVerbs.size * 4); // Need 5 unique verbs for max

    // 4. Formatting/Sections (20 points max)
    const missingSections = CRITICAL_SECTIONS.filter(s => !resumeLower.includes(s));
    const formattingScore = Math.round(((3 - missingSections.length) / 3) * 20);

    // Total Calculation
    const totalScore = keywordScore + impactScore + verbScore + formattingScore;

    let overallFeedback = "";
    if (totalScore >= 90) overallFeedback = "Elite. This resume is ready for FAANG.";
    else if (totalScore >= 75) overallFeedback = "Strong. Just a few tweaks needed.";
    else if (totalScore >= 50) overallFeedback = "Good foundation, but needs more impact and keywords.";
    else overallFeedback = "Needs work. Focus on matching keywords and adding metrics.";

    return {
        totalScore,
        details: {
            keywords: { score: keywordScore, found: foundKeywords, missing: missingKeywords },
            impact: { score: impactScore, feedback: impactFeedback, metricsFound: metricsFound },
            formatting: { score: formattingScore, missingSections },
            actionVerbs: { score: verbScore, count: uniqueVerbs.size }
        },
        feedback: overallFeedback,
        reasoning: "Score calculated based on basic keyword matching, formatting checks, and impact metric detection. Enable AI for deeper analysis.",
        suggestions: missingKeywords.length > 0 ? [{
            title: "Add Missing Keywords",
            explanation: `Consider adding the following keywords: ${missingKeywords.slice(0, 5).join(', ')}`,
            importance: 'high'
        }] : []
    };
};
