import rateLimit, { ipKeyGenerator } from 'express-rate-limit'

/**
 * Rate limiter for share access code verification
 * Strict protection against brute-force attacks
 * 10 attempts per 15 minutes per IP + token combination
 */
export const shareAccessLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts max
  message: {
    error: 'Trop de tentatives de vérification. Réessayez dans 15 minutes.'
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
  // Use IP + token for more granular limiting
  keyGenerator: (req) => {
    const ip = ipKeyGenerator(req)
    const token = req.params.token || 'no-token'
    return `${ip}:${token}`
  },
  // Skip successful requests from counting (only failed attempts count)
  skipSuccessfulRequests: true,
})

/**
 * Rate limiter for shared data access
 * General protection for data endpoints
 * 60 requests per minute per IP
 */
export const sharedDataLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  message: {
    error: 'Trop de requêtes. Veuillez patienter une minute.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: ipKeyGenerator,
})

/**
 * Rate limiter for authenticated share creation
 * Prevent abuse of share creation
 * 30 shares per hour per user
 */
export const shareCreationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30, // 30 shares per hour
  message: {
    error: 'Limite de création de partages atteinte. Réessayez dans une heure.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use user ID if authenticated
    const authReq = req as any
    return authReq.user?.id || ipKeyGenerator(req)
  },
})

/**
 * General API rate limiter
 * Apply to all API routes as a baseline protection
 * 100 requests per minute per IP
 */
export const generalApiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: {
    error: 'Trop de requêtes. Veuillez patienter.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})
