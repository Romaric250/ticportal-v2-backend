// Add this import with other route imports
import feedRoutes from "./modules/feed/routes";

// Then in your routes registration section, add:
app.use("/api", feedRoutes);
