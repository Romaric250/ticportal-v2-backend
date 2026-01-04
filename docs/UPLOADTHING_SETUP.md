# UploadThing Integration Guide

## Overview
Profile photo upload is properly integrated with UploadThing using their official SDK and best practices.

## Architecture

### 1. FileRouter Configuration (`src/config/uploadthing.ts`)
Defines file upload routes:
- `profilePhotoUploader`: Max 4MB, 1 file, images only

### 2. API Route (`/api/uploadthing`)
Express route handler for UploadThing uploads

### 3. Upload Utility (`src/shared/utils/uploadthing.ts`)
UTApi integration for programmatic uploads from base64

## Setup

### Installation
```bash
npm install uploadthing @uploadthing/react
```

### Environment Variables
```env
UPLOADTHING_TOKEN='eyJhcGlLZXkiOiJza19saXZl...'
```
Get your token from [UploadThing Dashboard](https://uploadthing.com/dashboard)

## API Endpoints

### 1. Base64 Upload (Current)
```http
PUT /api/users/profile-photo
Authorization: Bearer <token>
Content-Type: application/json

{
  "profilePhoto": "data:image/jpeg;base64,/9j/4AAQ..."
}
```

### 2. Direct Upload (Recommended)
```http
POST /api/uploadthing
```
Used by frontend UploadThing components

## Frontend Integration

### Method 1: Direct Upload (Recommended)

```tsx
import { generateUploadButton } from "@uploadthing/react";

const UploadButton = generateUploadButton({
  url: "http://localhost:5000/api/uploadthing",
});

export function ProfilePhotoUploader() {
  return (
    <UploadButton
      endpoint="profilePhotoUploader"
      onClientUploadComplete={async (res) => {
        // Update user profile with URL
        await fetch('/api/users/profile', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ profilePhoto: res[0].url })
        });
      }}
      onUploadError={(error) => {
        console.error("Upload error:", error);
      }}
    />
  );
}
```

### Method 2: Base64 Upload (Current)

```tsx
async function uploadPhoto(file: File) {
  const base64 = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });

  const response = await fetch('/api/users/profile-photo', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ profilePhoto: base64 })
  });

  return response.json();
}
```

## Validation

- **Format**: PNG, JPEG, GIF (validated by magic bytes)
- **Size**: Max 4MB
- **Count**: 1 file per upload

## Testing

### Test Base64 Upload

```bash
# 1. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"yourpassword"}'

# 2. Upload photo
curl -X PUT http://localhost:5000/api/users/profile-photo \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"profilePhoto":"data:image/jpeg;base64,/9j/4AAQ..."}'
```

### Test Direct Upload
Use the frontend UploadButton component or Postman with multipart/form-data

## Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Base64 string is empty" | Empty input | Select a file |
| "Invalid base64 format" | Corrupted data | Re-encode file |
| "Image size exceeds 4MB" | File too large | Compress image |
| "Invalid image format" | Wrong type | Use PNG/JPEG/GIF |
| "Upload failed" | API error | Check token & network |

## Performance Comparison

### Direct Upload ✅ (Recommended)
- Faster (direct to UploadThing)
- No server bandwidth used
- Built-in progress indicators
- Better UX

### Base64 Upload ⚠️ (Current)
- Slower (through server)
- Uses server bandwidth
- ~33% size increase from base64
- Simpler implementation

## Implementation Files

- `src/config/uploadthing.ts` - FileRouter
- `src/shared/utils/uploadthing.ts` - UTApi integration
- `src/modules/users/service.ts` - User service
- `src/modules/users/controller.ts` - Controller
- `src/app.ts` - Route registration

## Migration to Direct Upload

1. Install `@uploadthing/react` in frontend
2. Use `generateUploadButton` or `generateUploadDropzone`
3. Configure endpoint URL to backend
4. Update profile with returned URL
5. Keep base64 endpoint for backward compatibility

## Logging

All operations are logged:
```
[INFO] Starting UploadThing upload
[INFO] Image converted to buffer { size: 245678 }
[INFO] Uploading to UploadThing via UTApi { contentType: 'image/jpeg' }
[INFO] Successfully uploaded { url: 'https://utfs.io/f/...' }
```

## Next Steps

- ✅ UploadThing SDK configured
- ✅ FileRouter set up
- ✅ UTApi integration working
- 🔲 Add direct upload to frontend
- 🔲 Add image cropping/resizing
- 🔲 Add thumbnail generation
- 🔲 Delete old photo when uploading new
- 🔲 Add upload progress tracking
