import { User, AuthResponse, ResumeAnalysis, AdminStats } from '../types';

const TOKEN_KEY = 'resumai_jwt_token';

export const authStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),
};

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = authStorage.getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, { ...options, headers });
    const contentType = response.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { error: text || `HTTP ${response.status} ${response.statusText}` };
    }

    if (!response.ok) {
      throw new Error(data.error || 'API Request failed');
    }

    return data;
  } catch (err: any) {
    if (err.name === 'TypeError' || err.message?.includes('fetch') || err.message?.includes('NetworkError')) {
      throw new Error('Network error: Unable to connect to server. Please verify dev server is active.');
    }
    throw err;
  }
}

export const api = {
  async register(data: { name: string; email: string; password: string; targetRole?: string }): Promise<AuthResponse> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Registration failed');
    authStorage.setToken(result.token);
    return result;
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Login failed');
    authStorage.setToken(result.token);
    return result;
  },

  async getMe(): Promise<User> {
    const result = await fetchWithAuth('/api/auth/me');
    return result.user;
  },

  async analyzeResume(formData: FormData): Promise<ResumeAnalysis> {
    return await fetchWithAuth('/api/resume/analyze', {
      method: 'POST',
      body: formData,
    });
  },

  async getHistory(): Promise<ResumeAnalysis[]> {
    return await fetchWithAuth('/api/resume/history');
  },

  async getAnalysisById(id: string): Promise<ResumeAnalysis> {
    return await fetchWithAuth(`/api/resume/history/${id}`);
  },

  async deleteAnalysis(id: string): Promise<void> {
    await fetchWithAuth(`/api/resume/history/${id}`, {
      method: 'DELETE',
    });
  },

  async compareAnalyses(ids: string[]): Promise<ResumeAnalysis[]> {
    return await fetchWithAuth('/api/resume/compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });
  },

  async rewriteBullet(bullet: string, goal: string): Promise<string[]> {
    const res = await fetchWithAuth('/api/resume/rewrite-bullet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bullet, goal }),
    });
    return res.options || [];
  },

  async generateCoverLetter(data: { resumeText: string; jobDescription?: string; candidateName?: string }): Promise<string> {
    const res = await fetchWithAuth('/api/resume/cover-letter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.coverLetter || '';
  },

  async getAdminStats(): Promise<AdminStats> {
    return await fetchWithAuth('/api/admin/stats');
  },
};
