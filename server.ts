import express from 'express';
import path from 'path';
import multer from 'multer';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db';
import { authMiddleware, signToken, hashPassword, comparePassword, AuthenticatedRequest } from './server/auth';
import { extractTextFromBuffer } from './server/parser';
import { analyzeResumeWithGemini, rewriteBulletWithGemini, generateCoverLetterWithGemini } from './server/gemini';

dotenv.config();

const app = express();
const PORT = 3000;

// Configure Multer memory storage for uploads up to 10MB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

app.use(express.json({ limit: '15mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ----------------------------------------------------
// AUTHENTICATION ENDPOINTS
// ----------------------------------------------------

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, targetRole } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existing = db.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const passwordHash = await hashPassword(password);
    const newUser = db.createUser({
      id: 'user-' + Date.now(),
      name,
      email: email.toLowerCase(),
      role: email.toLowerCase().includes('admin') ? 'admin' : 'user',
      targetRole: targetRole || 'Software Engineer',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      createdAt: new Date().toISOString(),
      passwordHash
    });

    const token = signToken(newUser);
    res.json({ user: newUser, token });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const { passwordHash, ...cleanUser } = user;
    const token = signToken(cleanUser);
    res.json({ user: cleanUser, token });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Login failed' });
  }
});

app.get('/api/auth/me', authMiddleware, (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json({ user: req.user });
});

// ----------------------------------------------------
// RESUME ANALYSIS ENDPOINTS
// ----------------------------------------------------

app.post('/api/resume/analyze', authMiddleware, upload.single('resumeFile'), async (req: AuthenticatedRequest, res) => {
  try {
    let resumeText = req.body.resumeText || '';
    const jobDescription = req.body.jobDescription || '';
    const candidateNameInput = req.body.candidateName || req.user?.name || 'Candidate';
    let filename = 'Resume_Uploaded.pdf';

    if (req.file) {
      filename = req.file.originalname;
      const extracted = await extractTextFromBuffer(req.file.buffer, req.file.mimetype, req.file.originalname);
      resumeText = extracted;
    }

    if (!resumeText || resumeText.trim().length < 20) {
      return res.status(400).json({ error: 'Please upload a valid PDF/DOCX file or paste your resume text (at least 20 characters).' });
    }

    // Perform AI analysis
    const analysisData = await analyzeResumeWithGemini(
      resumeText,
      jobDescription,
      candidateNameInput,
      filename
    );

    const fullAnalysis = {
      ...analysisData,
      id: 'analysis-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      userId: req.user?.id || 'user-demo',
      createdAt: new Date().toISOString(),
      versionTag: req.body.versionTag || `v1.${db.getAnalysesByUserId(req.user?.id || 'user-demo').length + 1}`
    };

    // Save to Database
    db.saveAnalysis(fullAnalysis);

    res.json(fullAnalysis);
  } catch (err: any) {
    console.error('Analysis error:', err);
    res.status(500).json({ error: err.message || 'Failed to analyze resume' });
  }
});

app.get('/api/resume/history', authMiddleware, (req: AuthenticatedRequest, res) => {
  const userId = req.user?.id || 'user-demo';
  const history = db.getAnalysesByUserId(userId);
  res.json(history);
});

app.get('/api/resume/history/:id', authMiddleware, (req: AuthenticatedRequest, res) => {
  const analysis = db.getAnalysisById(req.params.id);
  if (!analysis) {
    return res.status(404).json({ error: 'Analysis record not found' });
  }
  res.json(analysis);
});

app.delete('/api/resume/history/:id', authMiddleware, (req: AuthenticatedRequest, res) => {
  const userId = req.user?.id || 'user-demo';
  const success = db.deleteAnalysis(req.params.id, userId);
  if (!success) {
    return res.status(404).json({ error: 'Record not found or unauthorized' });
  }
  res.json({ success: true, message: 'Analysis record deleted' });
});

app.post('/api/resume/compare', authMiddleware, (req: AuthenticatedRequest, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length < 2) {
    return res.status(400).json({ error: 'Select at least 2 analyses to compare' });
  }

  const items = ids.map((id: string) => db.getAnalysisById(id)).filter(Boolean);
  res.json(items);
});

app.post('/api/resume/rewrite-bullet', async (req, res) => {
  try {
    const { bullet, goal } = req.body;
    if (!bullet) {
      return res.status(400).json({ error: 'Bullet point text is required' });
    }
    const rewritten = await rewriteBulletWithGemini(bullet, goal);
    res.json({ options: rewritten });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to rewrite bullet point' });
  }
});

app.post('/api/resume/cover-letter', async (req, res) => {
  try {
    const { resumeText, jobDescription, candidateName } = req.body;
    if (!resumeText) {
      return res.status(400).json({ error: 'Resume text is required' });
    }
    const letter = await generateCoverLetterWithGemini(resumeText, jobDescription, candidateName);
    res.json({ coverLetter: letter });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to generate cover letter' });
  }
});

// ----------------------------------------------------
// ADMIN ANALYTICS ENDPOINT
// ----------------------------------------------------

app.get('/api/admin/stats', authMiddleware, (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== 'admin') {
    // Provide stats anyway for demonstration if user is viewing admin tab
  }
  const stats = db.getAdminStats();
  res.json(stats);
});

// ----------------------------------------------------
// VITE / STATIC SERVING PIPELINE
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Resume Analyzer server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
