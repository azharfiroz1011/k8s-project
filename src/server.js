'use strict';

const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀  demo-server listening on http://localhost:${PORT}`);
  console.log(`   Health  → http://localhost:${PORT}/health`);
  console.log(`   Products→ http://localhost:${PORT}/api/v1/products`);
});
