'use strict';

const { Router } = require('express');
const store = require('../store/products');

const router = Router();

/** GET /api/v1/products */
router.get('/', (_req, res) => {
  res.json(store.getAll());
});

/** GET /api/v1/products/:id */
router.get('/:id', (req, res) => {
  const product = store.getById(Number(req.params.id));
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

/** POST /api/v1/products */
router.post('/', (req, res) => {
  const { name, description, price } = req.body;
  if (!name || typeof price !== 'number') {
    return res.status(400).json({ error: '`name` and numeric `price` are required' });
  }
  const created = store.create({ name, description, price });
  res.status(201).json(created);
});

/** PUT /api/v1/products/:id */
router.put('/:id', (req, res) => {
  const { name, description, price } = req.body;
  if (!name || typeof price !== 'number') {
    return res.status(400).json({ error: '`name` and numeric `price` are required' });
  }
  const updated = store.update(Number(req.params.id), { name, description, price });
  if (!updated) return res.status(404).json({ error: 'Product not found' });
  res.json(updated);
});

/** DELETE /api/v1/products/:id */
router.delete('/:id', (req, res) => {
  const deleted = store.remove(Number(req.params.id));
  if (!deleted) return res.status(404).json({ error: 'Product not found' });
  res.status(204).send();
});

module.exports = router;
