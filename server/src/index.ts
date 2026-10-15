import { app } from './app.js';
import { env } from './config/env.js';
import { checkDatabaseConnection } from './db/prisma.js';

const server = app.listen(env.PORT, async () => {
  console.log(`🚀 Blood Donor Backend running on http://localhost:${env.PORT}`);
  console.log(`📡 Environment: ${env.NODE_ENV}`);
  const isConnected = await checkDatabaseConnection();
  console.log(`🗄️ PostgreSQL status: ${isConnected ? 'Connected ✅' : 'Disconnected ⚠️'}`);
});

// Graceful shutdown handling
const shutdown = () => {
  console.log('🛑 Gracefully shutting down Blood Donor API server...');
  server.close(() => {
    console.log('✅ Server stopped.');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export default app;
