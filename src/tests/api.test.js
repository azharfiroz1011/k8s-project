'use strict';

// Uses Node.js built-in test runner (v18+) — no extra test framework needed
const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { promisify } = require('node:util');

const app = require('../app');

let server;
let baseUrl;

before(() =>
  new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, () => {             // port 0 → OS picks a free port
      baseUrl = `http://localhost:${server.address().port}`;
      resolve();
    });
  })
);

after(() => promisify(server.close.bind(server))());

// ── Helper ──────────────────────────────────────────────────
async function request(method, path, body) {
  const url = `${baseUrl}${path}`;
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  const res = await fetch(url, { ...opts, body: body ? JSON.stringify(body) : undefined });
  const json = res.status === 204 ? null : await res.json();
  return { status: res.status, body: json };
}

// ── Tests ───────────────────────────────────────────────────
describe('GET /health', () => {
  it('returns 200 and status UP', async () => {
    const { status, body } = await request('GET', '/health');
    assert.equal(status, 200);
    assert.equal(body.status, 'UP');
  });
});

describe('GET /api/v1/products', () => {
  it('returns 200 with an array', async () => {
    const { status, body } = await request('GET', '/api/v1/products');
    assert.equal(status, 200);
    assert.ok(Array.isArray(body));
    assert.ok(body.length > 0);
  });
});

describe('GET /api/v1/products/:id', () => {
  it('returns 200 for a known id', async () => {
    const { status, body } = await request('GET', '/api/v1/products/1');
    assert.equal(status, 200);
    assert.equal(body.id, 1);
  });

  it('returns 404 for an unknown id', async () => {
    const { status } = await request('GET', '/api/v1/products/9999');
    assert.equal(status, 404);
  });
});

describe('POST /api/v1/products', () => {
  it('creates a product and returns 201', async () => {
    const { status, body } = await request('POST', '/api/v1/products', {
      name: 'Test Widget',
      description: 'Created in test',
      price: 12.99,
    });
    assert.equal(status, 201);
    assert.equal(body.name, 'Test Widget');
    assert.ok(body.id);
  });

  it('returns 400 when name is missing', async () => {
    const { status } = await request('POST', '/api/v1/products', { price: 5 });
    assert.equal(status, 400);
  });
});

describe('DELETE /api/v1/products/:id', () => {
  it('deletes a known product and returns 204', async () => {
    const { status } = await request('DELETE', '/api/v1/products/2');
    assert.equal(status, 204);
  });

  it('returns 404 when product does not exist', async () => {
    const { status } = await request('DELETE', '/api/v1/products/9999');
    assert.equal(status, 404);
  });
});
