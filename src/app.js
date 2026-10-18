'use strict';

const path = require('path');
const express = require('express');
const productRoutes = require('./routes/products');
const { requestLogger, notFound, errorHandler } = require('./middleware');

const app = express();

// ── Middleware ──────────────────────────────────────────────
app.use(express.json());
app.use(requestLogger);
app.use(express.static(path.join(__dirname, '..', 'public')));

// ── Routes ──────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'UP', app: 'demo-server', version: '1.0.0' });
});

app.use('/api/v1/products', productRoutes);

// ── Error handling ───────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
