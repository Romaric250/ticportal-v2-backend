// Add this to your main routes registration file or server.ts

import uploadRoutes from "./modules/upload/routes";

// Register upload routes
app.use("/api/f", uploadRoutes);

// This will make POST /api/f/upload available
