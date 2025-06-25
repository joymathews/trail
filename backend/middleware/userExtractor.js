const jwt = require('jsonwebtoken');
const { IS_LOCAL } = require('../config');

function userExtractor(req, res, next) {
  if (IS_LOCAL === 'true') {
    // Local: decode JWT from Authorization header (no signature verification for dev)
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decoded = jwt.decode(token, { complete: true });
        req.user = { id: decoded?.payload?.sub || 'demo-user', ...decoded?.payload };
      } catch {
        req.user = { id: 'demo-user' };
      }
    } else {
      req.user = { id: 'demo-user' };
    }
  } else {
    // Production: extract from AWS API Gateway event (via serverless-express)
    const event = req.apiGateway?.event;
    if (event?.requestContext?.authorizer?.jwt?.claims?.sub) {
      req.user = { id: event.requestContext.authorizer.jwt.claims.sub };
    } else if (event?.requestContext?.authorizer?.userId) {
      req.user = { id: event.requestContext.authorizer.userId };
    } else {
      req.user = { id: 'demo-user' };
    }
  }
  next();
}

module.exports = userExtractor;
