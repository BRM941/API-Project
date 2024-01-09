const setRateLimit = require('express-rate-limit');

const rateLimitMiddleware = setRateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 15, // 15 requests per minute
    message: {error: 'Too many requests, please try again later.'},
    headers: true //Include rate limit info in headers
});

module.exports = rateLimitMiddleware;