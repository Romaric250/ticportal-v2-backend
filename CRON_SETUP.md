// In your server startup file (index.ts or server.ts)
import { startCronJobs } from "./config/cron";

// After server starts listening
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Start all cron jobs
  startCronJobs();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  const { stopCronJobs } = require('./config/cron');
  stopCronJobs();
  server.close(() => {
    console.log('HTTP server closed');
  });
});
