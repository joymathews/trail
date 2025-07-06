const rateLimit = require('express-rate-limit');

// Lightweight IP-based limiter to block obvious floods and satisfy security scanners (e.g., CodeQL)
// This runs BEFORE authentication, so it cannot rate limit per user, only per IP.
const ipLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Higher threshold, just to block DoS/floods
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});


// Per-user rate limiter for authenticated endpoints (default)
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.id || req.ip // Prefer user.id, fallback to IP
});

// Higher rate limit for autocomplete endpoints
const autocompleteLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 120, // Allow more frequent autocomplete
  message: 'Too many autocomplete requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.id || req.ip
});

// Stricter limiter for health checks (to prevent DoS on /health)
const healthLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: 'Too many health check requests, please try again later.'
});

// Export all limiters for use in routes
module.exports = { apiLimiter, ipLimiter, healthLimiter, autocompleteLimiter };
