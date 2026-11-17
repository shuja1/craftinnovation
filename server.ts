import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

// Ephemeral runtime secret if CSRF_SECRET is not provided in environment
const CSRF_SECRET = process.env.CSRF_SECRET || crypto.randomBytes(32).toString('hex');

interface InquiryRecord {
  referenceId: string;
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  division: string;
  engagementType: string;
  preferredDate: string;
  preferredSlot: string;
  manpowerSummary?: string;
  projectNotes: string;
  submittedAt: string;
}

const DEFAULT_SLOTS = ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'] as const;
const bookedSlotsByDate = new Map<string, Set<string>>();
const submittedInquiries: InquiryRecord[] = [];

// Sliding-window rate limiter per IP for inquiry submissions
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 12;

function sanitizeText(input: unknown, maxLen = 500): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .trim()
    .slice(0, maxLen);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/[^\d]/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

function issueCsrfToken(): string {
  const issuedAt = Date.now().toString();
  const nonce = crypto.randomBytes(12).toString('hex');
  const payload = `${issuedAt}.${nonce}`;
  const signature = crypto
    .createHmac('sha256', CSRF_SECRET)
    .update(payload)
    .digest('hex');
  return `${payload}.${signature}`;
}

function verifyCsrfToken(token: string | undefined): boolean {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [issuedAtStr, nonce, signature] = parts;
  if (!issuedAtStr || !nonce || !signature) return false;

  const issuedAt = Number(issuedAtStr);
  if (!Number.isFinite(issuedAt)) return false;
  const ageMs = Date.now() - issuedAt;
  if (ageMs < 0 || ageMs > 2 * 60 * 60 * 1000) return false;

  const expectedSig = crypto
    .createHmac('sha256', CSRF_SECRET)
    .update(`${issuedAtStr}.${nonce}`)
    .digest('hex');

  const sigBuf = Buffer.from(signature, 'utf8');
  const expectedBuf = Buffer.from(expectedSig, 'utf8');
  if (sigBuf.length !== expectedBuf.length) return false;
  return crypto.timingSafeEqual(sigBuf, expectedBuf);
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const recent = (rateLimitMap.get(ip) || []).filter(
    (ts) => now - ts < RATE_LIMIT_WINDOW_MS,
  );
  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    rateLimitMap.set(ip, recent);
    return false;
  }
  recent.push(now);
  rateLimitMap.set(ip, recent);
  return true;
}

async function createServer() {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  // Web security headers middleware (compatible with preview iframe)
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=(), payment=()',
    );
    res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
    res.setHeader('Origin-Agent-Cluster', '?1');
    if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
      res.setHeader(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains',
      );
    }
    const cspDirectives = [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      "img-src 'self' data: blob:",
      "font-src 'self' https://fonts.gstatic.com data:",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      IS_PROD
        ? "script-src 'self'"
        : "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "connect-src 'self' ws: wss:",
    ];
    res.setHeader('Content-Security-Policy', cspDirectives.join('; '));
    next();
  });

  app.use(express.json({ limit: '32kb' }));

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true });
  });

  app.get('/craft-innovation-cpanel.zip', (_req: Request, res: Response) => {
    const zipPath = path.resolve(__dirname, 'craft-innovation-cpanel.zip');
    if (fs.existsSync(zipPath)) {
      res.download(zipPath, 'craft-innovation-cpanel.zip');
    } else {
      res.status(404).json({ error: 'cPanel archive not found.' });
    }
  });

  app.get('/api/security-token', (_req: Request, res: Response) => {
    res.setHeader('Cache-Control', 'no-store');
    res.json({ csrfToken: issueCsrfToken() });
  });

  app.get('/api/bookings/slots', (req: Request, res: Response) => {
    const dateParam = sanitizeText(req.query.date, 20);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
      res.status(400).json({ error: 'Please provide a valid date in YYYY-MM-DD format.' });
      return;
    }

    const booked = bookedSlotsByDate.get(dateParam) || new Set<string>();
    const slots = DEFAULT_SLOTS.map((time) => ({
      time,
      available: !booked.has(time),
    }));

    res.setHeader('Cache-Control', 'no-store');
    res.json({ date: dateParam, slots });
  });

  app.post('/api/inquiries', (req: Request, res: Response) => {
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    if (!checkRateLimit(clientIp)) {
      res.status(429).json({
        error: 'Too many requests submitted recently. Please wait a few minutes before trying again.',
      });
      return;
    }

    const csrfHeader = req.header('x-csrf-token');
    if (!verifyCsrfToken(csrfHeader)) {
      res.status(403).json({
        error: 'Security verification expired. Please refresh the form token and try again.',
      });
      return;
    }

    const body = req.body || {};

    // Honeypot anti-spam trap: legitimate users leave website_url blank
    if (typeof body.website_url === 'string' && body.website_url.trim().length > 0) {
      res.status(400).json({ error: 'Submission rejected by spam validation.' });
      return;
    }

    const fullName = sanitizeText(body.fullName, 100);
    const companyName = sanitizeText(body.companyName, 120);
    const email = sanitizeText(body.email, 120).toLowerCase();
    const phone = sanitizeText(body.phone, 30);
    const division = sanitizeText(body.division, 100);
    const engagementType = sanitizeText(body.engagementType, 80);
    const preferredDate = sanitizeText(body.preferredDate, 20);
    const preferredSlot = sanitizeText(body.preferredSlot, 20);
    const manpowerSummary = sanitizeText(body.manpowerSummary, 400);
    const projectNotes = sanitizeText(body.projectNotes, 1500);

    if (fullName.length < 2) {
      res.status(400).json({ error: 'Please enter your full name.' });
      return;
    }
    if (!isValidEmail(email)) {
      res.status(400).json({ error: 'Please enter a valid business email address.' });
      return;
    }
    if (!isValidPhone(phone)) {
      res.status(400).json({ error: 'Please enter a valid contact phone number.' });
      return;
    }
    if (!division) {
      res.status(400).json({ error: 'Please select a service division.' });
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(preferredDate)) {
      res.status(400).json({ error: 'Please select a preferred consultation date.' });
      return;
    }
    if (!DEFAULT_SLOTS.includes(preferredSlot as (typeof DEFAULT_SLOTS)[number])) {
      res.status(400).json({ error: 'Please select an available consultation time window.' });
      return;
    }

    const bookedForDate = bookedSlotsByDate.get(preferredDate) || new Set<string>();
    if (bookedForDate.has(preferredSlot)) {
      res.status(409).json({
        error: 'That consultation slot was just reserved. Please pick another time window.',
      });
      return;
    }

    bookedForDate.add(preferredSlot);
    bookedSlotsByDate.set(preferredDate, bookedForDate);

    const referenceId = `CIC-${new Date().getFullYear()}-${crypto.randomInt(1000, 9999)}`;
    const record: InquiryRecord = {
      referenceId,
      fullName,
      companyName: companyName || 'Direct Client',
      email,
      phone,
      division,
      engagementType: engagementType || 'Site Survey & Proposal',
      preferredDate,
      preferredSlot,
      manpowerSummary: manpowerSummary || undefined,
      projectNotes,
      submittedAt: new Date().toISOString(),
    };

    submittedInquiries.push(record);

    res.status(201).json({
      referenceId: record.referenceId,
      preferredDate: record.preferredDate,
      preferredSlot: record.preferredSlot,
      division: record.division,
      message: 'Your inquiry and site consultation request have been logged.',
    });
  });

  if (!IS_PROD) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      const indexPath = path.join(distDir, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send('Build output not found.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Craft Innovation Contracting server running on http://0.0.0.0:${PORT}`);
  });
}

createServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
