'use strict';

/** Logs every incoming request: METHOD  /path  → status  Xms */
const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(`${req.method.padEnd(7)} ${req.path.padEnd(30)} → ${res.statusCode}  ${ms}ms`);
  });
  next();
};

/** 404 catch-all */
const notFound = (_req, res) => {
  res.status(404).json({ error: 'Route not found' });
};

/** Central error handler */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
};

module.exports = { requestLogger, notFound, errorHandler };
