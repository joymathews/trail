const jwt = require('jsonwebtoken');
const { IS_LOCAL } = require('../config');

function extractUserFromAuthHeader(authHeader) {
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const decoded = jwt.decode(token, { complete: true });
      return decoded?.payload?.sub ? { id: decoded.payload.sub, ...decoded.payload } : null;
    } catch {
      return null;
    }
  }
  return null;
}

function userExtractor(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const user = extractUserFromAuthHeader(authHeader);

  if (user || IS_LOCAL) {
    req.user = user || { id: 'demo-user' };
    return next();
  }

  // Production: handle missing or invalid auth
  const errorMsg = !authHeader ? 'No Authorization header' : 'Invalid JWT';
  return res.status(401).json({ error: `Unauthorized: ${errorMsg}` });
}

module.exports = userExtractor;
