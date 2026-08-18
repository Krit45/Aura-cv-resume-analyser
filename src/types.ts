export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  targetRole?: string;
  createdAt: string;
}

export interface SkillCategory {
  category: string;
  skills: {
    name: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    importance: number; // 1-100
  }[];
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
  gpaOrHonors?: string;
}

export interface Experience {
  title: string;
  company: string;
  duration: string;
  achievements: string[];
  actionVerbsCount: number;
}

export interface Project {
  name: string;
  description: string;
  techStack: string[];
  metrics?: string;
}

export interface Certification {
  title: string;
  issuer: string;
  year?: string;
}

export interface MetricBreakdown {
  formatting: number; // 0-100
  keywords: number; // 0-100
  impactAndMetrics: number; // 0-100
  relevance: number; // 0-100
  completeness: number; // 0-100
}

export interface JdComparison {
  jobTitle?: string;
  companyName?: string;
  matchScore: number; // 0-100
  matchedKeywords: string[];
  missingKeywords: {
    keyword: string;
    importance: 'Critical' | 'High' | 'Medium';
    contextSuggestion: string;
  }[];
  roleRelevanceAnalysis: string;
}

export interface AiSuggestion {
  id: string;
  type: 'critical' | 'warning' | 'enhancement';
  section: 'Formatting' | 'Experience' | 'Skills' | 'Impact Metrics' | 'Summary';
  title: string;
  issue: string;
  recommendation: string;
  exampleBeforeAfter?: {
    before: string;
    after: string;
  };
}

export interface ResumeAnalysis {
  id: string;
  userId: string;
  candidateName: string;
  filename: string;
  rawText: string;
  jobDescriptionPasted?: string;
  atsScore: number;
  metricBreakdown: MetricBreakdown;
  summary: string;
  extractedSkills: SkillCategory[];
  extractedEducation: Education[];
  extractedExperience: Experience[];
  extractedProjects: Project[];
  extractedCertifications: Certification[];
  jdComparison?: JdComparison;
  aiSuggestions: AiSuggestion[];
  createdAt: string;
  versionTag?: string;
}

export interface AdminStats {
  totalUsers: number;
  totalAnalyses: number;
  avgAtsScore: number;
  topMissingSkills: { name: string; count: number }[];
  monthlyVolume: { month: string; count: number }[];
  recentAnalyses: {
    id: string;
    candidateName: string;
    score: number;
    createdAt: string;
    userEmail: string;
  }[];
}

export interface AuthResponse {
  user: User;
  token: string;
}
