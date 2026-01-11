# 🔧 Upload Route Registration - Final Fix

## Files Created & Fixed

✅ `src/modules/upload/uploadthing.ts` - Uploadthing config (fixed)
✅ `src/modules/upload/routes.ts` - Upload routes  
✅ `src/middleware/upload.ts` - Upload handler

## Register Route in Your App

### Find Your Main App/Server File

Look for one of these files:
- `src/app.ts`
- `src/server.ts`  
- `src/index.ts`
- `src/main.ts`

### Add These Lines

**1. Import the upload routes:**
```typescript
import uploadRoutes from "./modules/upload/routes";
```

**2. Register the route (add with other routes):**
```typescript
// With your other routes like:
// app.use("/api/auth", authRoutes);
// app.use("/api/admin", adminRoutes);

app.use("/api/f", uploadRoutes);  // Add this line
```

### Complete Example

```typescript
import express from "express";
import authRoutes from "./modules/auth/routes";
import adminRoutes from "./modules/admin/routes";
import uploadRoutes from "./modules/upload/routes";  // 1. Import

const app = express();

// ... middleware setup ...

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/f", uploadRoutes);  // 2. Register

// ... rest of app ...

export default app;
```

## Test the Route

```bash
# After adding the route and restarting server:

# Test 1: Check route exists
curl -X POST http://localhost:5000/api/f/upload

# Should return: "No file provided" (means route works!)

# Test 2: Upload actual file
curl -X POST http://localhost:5000/api/f/upload \
  -F "file=@test.txt"

# Should return file URL
```

## Quick Debug

If route still not found:

1. **Check import path:**
   ```typescript
   // Adjust based on your folder structure
   import uploadRoutes from "./modules/upload/routes";
   // or
   import uploadRoutes from "../modules/upload/routes";
   ```

2. **Check route mounting:**
   ```typescript
   // Make sure it's BEFORE error handlers
   app.use("/api/f", uploadRoutes);
   
   // Error handlers should be AFTER routes
   app.use(errorHandler);
   ```

3. **Restart server:**
   ```bash
   # Stop and restart
   npm run dev
   ```

## Where to Add in Your Server File

```typescript
// Top of file - IMPORTS
import uploadRoutes from "./modules/upload/routes";

// Middle of file - ROUTES (with other app.use calls)
app.use("/api/f", uploadRoutes);

// End of file - ERROR HANDLERS (after routes)
app.use(errorHandler);
```

## Verify It Works

```bash
curl -X POST http://localhost:5000/api/f/upload \
  -F "file=@test.txt"
  
# Expected response:
{
  "success": true,
  "data": {
    "url": "https://uploadthing.com/f/abc123.txt",
    "filename": "test.txt",
    "size": 1234,
    "mimetype": "text/plain"
  }
}
```

---

**Need help?** Share your server/app file and I'll give you the exact lines to add!
