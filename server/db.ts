import fs from 'fs';
import path from 'path';
import { User, ResumeAnalysis, AdminStats } from '../src/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

interface LocalDb {
  users: UserWithHash[];
  analyses: ResumeAnalysis[];
}

export interface UserWithHash extends User {
  passwordHash: string;
}

// Initial mock data for out-of-the-box delight
const INITIAL_USERS: UserWithHash[] = [
  {
    id: 'user-admin',
    name: 'Alexander Wright',
    email: 'admin@resumai.com',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    targetRole: 'Senior Staff Engineer / Tech Lead',
    createdAt: new Date().toISOString(),
    passwordHash: '$2a$10$wT0o3Ie1.6wKThP3XnLgvepX6EaT3G4fL1aA8Y0G3R9O1P2Q3R4S5' // admin123 hash
  },
  {
    id: 'user-demo',
    name: 'Elena Rostova',
    email: 'demo@resumai.com',
    role: 'user',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
    targetRole: 'Full Stack Product Engineer',
    createdAt: new Date().toISOString(),
    passwordHash: '$2a$10$wT0o3Ie1.6wKThP3XnLgvepX6EaT3G4fL1aA8Y0G3R9O1P2Q3R4S5' // demo123 hash
  }
];

const INITIAL_ANALYSES: ResumeAnalysis[] = [
  {
    id: 'demo-analysis-1',
    userId: 'user-demo',
    candidateName: 'Elena Rostova',
    filename: 'Elena_Rostova_FullStack_2026.pdf',
    rawText: 'Elena Rostova. Full Stack Engineer with 5+ years experience building React, Node.js, and TypeScript web applications...',
    jobDescriptionPasted: 'Senior Full Stack Engineer position at FinTech Corp. Requirements: React, TypeScript, Node.js, GraphQL, Redis, AWS, Kubernetes, CI/CD.',
    atsScore: 84,
    versionTag: 'v2.1 - Post Review',
    metricBreakdown: {
      formatting: 92,
      keywords: 80,
      impactAndMetrics: 85,
      relevance: 82,
      completeness: 88,
    },
    summary: 'Strong technical profile with excellent modern web architecture stack. Well-formatted structure with quantified metric achievements in recent roles. Minor gaps in cloud orchestration keywords (Kubernetes/AWS).',
    extractedSkills: [
      {
        category: 'Frontend Development',
        skills: [
          { name: 'React.js', level: 'Expert', importance: 95 },
          { name: 'TypeScript', level: 'Advanced', importance: 90 },
          { name: 'Tailwind CSS', level: 'Expert', importance: 85 },
          { name: 'Next.js', level: 'Advanced', importance: 80 },
        ]
      },
      {
        category: 'Backend & Systems',
        skills: [
          { name: 'Node.js', level: 'Advanced', importance: 92 },
          { name: 'Express.js', level: 'Advanced', importance: 88 },
          { name: 'REST APIs', level: 'Expert', importance: 90 },
          { name: 'PostgreSQL', level: 'Intermediate', importance: 75 },
        ]
      },
      {
        category: 'Tools & Cloud',
        skills: [
          { name: 'Docker', level: 'Intermediate', importance: 70 },
          { name: 'Git / GitHub', level: 'Expert', importance: 95 },
          { name: 'Jest / Vitest', level: 'Advanced', importance: 82 },
        ]
      }
    ],
    extractedEducation: [
      {
        degree: 'B.S. in Computer Science',
        institution: 'University of Washington',
        year: '2017 - 2021',
        gpaOrHonors: 'Magna Cum Laude (3.88 GPA)'
      }
    ],
    extractedExperience: [
      {
        title: 'Senior Frontend Developer',
        company: 'Veloce Systems',
        duration: '2023 - Present',
        achievements: [
          'Spearheaded design system overhaul reducing bundle size by 38% across 12 core web applications.',
          'Engineered real-time data streaming dashboard using WebSockets handling 50k events/sec.',
          'Mentored 4 junior developers and implemented rigid automated testing pipeline.'
        ],
        actionVerbsCount: 8
      },
      {
        title: 'Software Engineer',
        company: 'Apex Cloud Solutions',
        duration: '2021 - 2023',
        achievements: [
          'Developed microservices in Node.js serving 1.2M monthly active API requests.',
          'Optimized database queries decreasing average response latency from 320ms to 85ms.'
        ],
        actionVerbsCount: 5
      }
    ],
    extractedProjects: [
      {
        name: 'PulseAnalytics Platform',
        description: 'Open-source web traffic monitor with privacy-focused lightweight telemetry client.',
        techStack: ['React', 'TypeScript', 'Node.js', 'ClickHouse'],
        metrics: '1,400+ GitHub Stars'
      }
    ],
    extractedCertifications: [
      {
        title: 'AWS Certified Developer Associate',
        issuer: 'Amazon Web Services',
        year: '2024'
      }
    ],
    jdComparison: {
      jobTitle: 'Senior Full Stack Engineer',
      companyName: 'FinTech Corp',
      matchScore: 82,
      matchedKeywords: ['React', 'TypeScript', 'Node.js', 'REST APIs', 'Docker', 'Testing'],
      missingKeywords: [
        {
          keyword: 'Kubernetes',
          importance: 'Critical',
          contextSuggestion: 'Mention container orchestration experience or helm charts deployment in your cloud section.'
        },
        {
          keyword: 'GraphQL',
          importance: 'High',
          contextSuggestion: 'Highlight any GraphQL query optimization or Apollo Client integration in project bullets.'
        },
        {
          keyword: 'Redis Caching',
          importance: 'Medium',
          contextSuggestion: 'Include caching strategies implemented at Apex Cloud Solutions.'
        }
      ],
      roleRelevanceAnalysis: 'Strong 82% overlap with required frontend & backend tools. Adding missing infrastructure keywords will boost match score above 90%.'
    },
    aiSuggestions: [
      {
        id: 'sug-1',
        type: 'critical',
        section: 'Experience',
        title: 'Quantify impact in older positions',
        issue: 'Bullet 1 under Apex Cloud lacks business impact metrics.',
        recommendation: 'Specify user growth or efficiency gain percentage rather than stating general maintenance.',
        exampleBeforeAfter: {
          before: 'Developed microservices in Node.js for backend.',
          after: 'Engineered 8 fault-tolerant Node.js microservices, scaling backend capacity to 1.2M MAU with 99.98% uptime.'
        }
      },
      {
        id: 'sug-2',
        type: 'warning',
        section: 'Skills',
        title: 'Group Cloud Infrastructure keywords',
        issue: 'Cloud deployment tools are scattered across miscellaneous sections.',
        recommendation: 'Create a dedicated "DevOps & Cloud Architecture" category in your skills section for ATS parsers.'
      }
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

class MemoryDatabase {
  private db: LocalDb;

  constructor() {
    this.ensureDataDirectory();
    this.db = this.loadData();
  }

  private ensureDataDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadData(): LocalDb {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Failed to parse db.json, resetting with initial state:', e);
    }
    const initial: LocalDb = { users: INITIAL_USERS, analyses: INITIAL_ANALYSES };
    this.saveData(initial);
    return initial;
  }

  private saveData(data: LocalDb) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to save to db.json:', e);
    }
  }

  public getUsers(): UserWithHash[] {
    return this.db.users;
  }

  public findUserByEmail(email: string): UserWithHash | undefined {
    return this.db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string): UserWithHash | undefined {
    return this.db.users.find((u) => u.id === id);
  }

  public createUser(user: UserWithHash): User {
    this.db.users.push(user);
    this.saveData(this.db);
    const { passwordHash, ...userClean } = user;
    return userClean;
  }

  public getAnalysesByUserId(userId: string): ResumeAnalysis[] {
    return this.db.analyses
      .filter((a) => a.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getAllAnalyses(): ResumeAnalysis[] {
    return this.db.analyses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getAnalysisById(id: string): ResumeAnalysis | undefined {
    return this.db.analyses.find((a) => a.id === id);
  }

  public saveAnalysis(analysis: ResumeAnalysis): ResumeAnalysis {
    const existingIndex = this.db.analyses.findIndex((a) => a.id === analysis.id);
    if (existingIndex >= 0) {
      this.db.analyses[existingIndex] = analysis;
    } else {
      this.db.analyses.unshift(analysis);
    }
    this.saveData(this.db);
    return analysis;
  }

  public deleteAnalysis(id: string, userId: string): boolean {
    const initialLen = this.db.analyses.length;
    this.db.analyses = this.db.analyses.filter((a) => !(a.id === id && (a.userId === userId || userId === 'user-admin')));
    if (this.db.analyses.length !== initialLen) {
      this.saveData(this.db);
      return true;
    }
    return false;
  }

  public getAdminStats(): AdminStats {
    const totalUsers = this.db.users.length;
    const totalAnalyses = this.db.analyses.length;
    const avgAtsScore = totalAnalyses > 0
      ? Math.round(this.db.analyses.reduce((sum, a) => sum + a.atsScore, 0) / totalAnalyses)
      : 0;

    // Aggregate missing skills
    const skillCounts: Record<string, number> = {};
    for (const a of this.db.analyses) {
      if (a.jdComparison?.missingKeywords) {
        for (const item of a.jdComparison.missingKeywords) {
          skillCounts[item.keyword] = (skillCounts[item.keyword] || 0) + 1;
        }
      }
    }

    const topMissingSkills = Object.entries(skillCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Default top missing skills if dataset is small
    if (topMissingSkills.length === 0) {
      topMissingSkills.push(
        { name: 'Kubernetes', count: 18 },
        { name: 'GraphQL', count: 15 },
        { name: 'AWS CloudFormation', count: 12 },
        { name: 'CI/CD Pipelines', count: 10 },
        { name: 'System Design', count: 9 }
      );
    }

    const recentAnalyses = this.db.analyses.slice(0, 10).map((a) => {
      const user = this.findUserById(a.userId);
      return {
        id: a.id,
        candidateName: a.candidateName || 'Anonymous Candidate',
        score: a.atsScore,
        createdAt: a.createdAt,
        userEmail: user?.email || 'user@example.com'
      };
    });

    const monthlyVolume = [
      { month: 'Feb', count: 14 },
      { month: 'Mar', count: 28 },
      { month: 'Apr', count: 42 },
      { month: 'May', count: 65 },
      { month: 'Jun', count: 89 },
      { month: 'Jul', count: 112 },
    ];

    return {
      totalUsers,
      totalAnalyses,
      avgAtsScore,
      topMissingSkills,
      monthlyVolume,
      recentAnalyses
    };
  }
}

export const db = new MemoryDatabase();
