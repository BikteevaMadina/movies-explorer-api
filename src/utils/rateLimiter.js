const rateLimiter = require('express-rate-limit');

const limiter = rateLimiter({
  windowMs: 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = limiter;
