# Test File Upload Route

## Quick Test

```bash
# Test if route is registered
curl http://localhost:5000/api/f/upload

# Should return: 405 Method Not Allowed or 400 Bad Request
# (means route exists but needs POST with file)

# Test actual upload
curl -X POST http://localhost:5000/api/f/upload \
  -F "file=@test.txt"

# Should return file URL
```

## Add Route to Server

Find where routes are registered in your `server.ts` or main routes file, and add:

```typescript
import uploadRoutes from "./modules/upload/routes";

// With other route registrations
app.use("/api/f", uploadRoutes);
```

Or add directly to server.ts:

```typescript
import { uploadSingle, handleFileUpload } from "./middleware/upload";

// Add before error handlers
app.post("/api/f/upload", uploadSingle, handleFileUpload);
```

## Files Created

1. `src/middleware/upload.ts` - Upload middleware and handler
2. `src/modules/upload/routes.ts` - Upload routes  
3. `src/modules/upload/controller.ts` - Upload controller

## Integration

The route needs to be registered in your main app. Look for where other routes like `/api/auth`, `/api/admin` are registered and add `/api/f` there.
