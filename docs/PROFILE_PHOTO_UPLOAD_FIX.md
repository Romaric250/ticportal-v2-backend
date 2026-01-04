# Profile Photo Upload - UploadThing Setup

## Overview
Profile photo upload is now properly integrated with UploadThing using their official SDK and best practices.

## Architecture

### 1. UploadThing FileRouter (`src/config/uploadthing.ts`)
Defines the file upload routes and configurations:
- `profilePhotoUploader`: Handles profile photo uploads
- Max file size: 4MB
- Max file count: 1
- Allowed formats: Images (PNG, JPEG, GIF)

### 2. UploadThing API Route (`/api/uploadthing`)
Express route handler that processes uploads via UploadThing SDK.

### 3. Upload Utility (`src/shared/utils/uploadthing.ts`)
Uses UTApi to upload files programmatically from base64 data.

## Setup

### Environment Variables
```env
UPLOADTHING_TOKEN='eyJhcGlLZXkiOiJza19saXZl...'
```

### Installation
```bash
npm install uploadthing
```

## How It Works

### Backend Flow:
1. Client sends base64 image to `/api/users/profile-photo`
2. Server validates the image (format, size, magic bytes)
3. UTApi converts buffer to File and uploads to UploadThing
4. UploadThing returns the uploaded file URL
5. Server saves URL to user's profile in database
6. Server returns updated user profile to client

### Direct Upload Flow (Recommended for Frontend):
For better performance, the frontend can upload directly to UploadThing:
1. Frontend generates upload button/dropzone using `@uploadthing/react`
2. User selects file
3. File uploads directly to `/api/uploadthing` endpoint
4. Frontend receives URL from UploadThing
5. Frontend sends URL to `/api/users/profile` to update user profile

## API Endpoints

### 1. Update Profile Photo (Current Method)
```http
PUT /api/users/profile-photo
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "profilePhoto": "data:image/jpeg;base64,/9j/4AAQ..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "profilePhoto": "https://utfs.io/f/...",
    ...
  }
}
```

### 2. UploadThing Endpoint (Direct Upload)
```http
POST /api/uploadthing
```
Used by frontend UploadThing components for direct uploads.

## Issue Fixed

### Previous Problem:
- Used browser APIs (`FormData`, `Blob`) in Node.js
- Manual multipart/form-data construction
- Direct API calls without SDK
- Resulted in 500 errors

### Current Solution:
- Uses UploadThing SDK (`UTApi`)
- Proper server-side File creation
- Leverages official upload methods
- Reliable and maintainable

### Using cURL:

```bash
# First, get your auth token by logging in
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"yourpassword"}'

# Then upload a profile photo (replace YOUR_TOKEN with the access token from login)
curl -X PUT http://localhost:5000/api/users/profile/photo \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "profilePhoto": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/..."
  }'
```

### Using Postman/Thunder Client:

1. **Login** (POST `/api/auth/login`)
   - Body: `{ "email": "user@example.com", "password": "yourpassword" }`
   - Save the `accessToken` from response

2. **Upload Profile Photo** (PUT `/api/users/profile/photo`)
   - Headers: `Authorization: Bearer YOUR_ACCESS_TOKEN`
   - Body (JSON):
   ```json
   {
     "profilePhoto": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/..."
   }
   ```

### Getting Base64 Image:

**From a file:**
```javascript
// Node.js
const fs = require('fs');
const imageBuffer = fs.readFileSync('path/to/image.jpg');
const base64Image = imageBuffer.toString('base64');
const dataUrl = `data:image/jpeg;base64,${base64Image}`;
```

**From browser:**
```javascript
// Frontend
const fileInput = document.querySelector('input[type="file"]');
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (event) => {
    const base64String = event.target.result;
    console.log(base64String); // This is what you send to the API
  };
  reader.readAsDataURL(file);
});
```

## Validation Rules

The upload endpoint validates:

1. **Image format**: Only PNG, JPEG, and GIF allowed
2. **File size**: Maximum 4MB
3. **Base64 format**: Must be valid base64 string
4. **Magic bytes**: Verifies actual image data matches format

## Response Format

### Success (200):
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "profilePhoto": "https://utfs.io/f/profile-user_id-timestamp.jpg",
    ...
  }
}
```

### Error (400):
```json
{
  "success": false,
  "message": "Invalid image format. Only PNG, JPEG, and GIF are allowed"
}
```

## Technical Details

### Multipart Form Data Structure

The fix constructs a multipart/form-data request with the following structure:

```
------WebKitFormBoundary[timestamp][random]
Content-Disposition: form-data; name="file"; filename="profile-user_id-timestamp.jpg"
Content-Type: image/jpeg

[binary image data]
------WebKitFormBoundary[timestamp][random]--
```

### UploadThing API

- **Endpoint**: `https://api.uploadthing.com/v6/upload`
- **Method**: POST
- **Headers**:
  - `X-Uploadthing-Api-Key`: Your UploadThing API key
  - `Content-Type`: `multipart/form-data; boundary=[boundary]`
  - `Content-Length`: Size of the request body in bytes

## Logging

The upload process is fully logged for debugging:

1. Start of upload with filename
2. Image conversion to buffer with size
3. Upload attempt with API URL and content type
4. Response status
5. Parsed response with URL
6. Success or error details

Check your application logs for detailed information about upload attempts.

## Environment Variables

Ensure `UPLOADTHING_TOKEN` is set in your `.env` file:

```env
UPLOADTHING_TOKEN='eyJhcGlLZXkiOiJza19saXZl...'
```

## Related Files

- `src/shared/utils/uploadthing.ts` - Upload utility (fixed)
- `src/modules/users/service.ts` - User service with photo upload logic
- `src/modules/users/controller.ts` - Controller with error handling
- `src/modules/users/routes.ts` - API routes
- `docs/USER_PROFILE_API.md` - Full API documentation

## Next Steps

1. Test the upload with a real image
2. Verify the image appears at the returned URL
3. Test file size validation (try uploading >4MB image)
4. Test invalid formats (try uploading PDF, etc.)
5. Test profile photo deletion endpoint

## Common Issues

### "FormData is not defined" or "Blob is not defined"
- **Fixed**: These browser APIs are no longer used

### "Upload failed: 401 Unauthorized"
- Check that `UPLOADTHING_TOKEN` is correctly set in `.env`
- Verify the token is valid and not expired

### "Image size exceeds 4MB limit"
- Resize or compress the image before uploading
- Frontend should validate file size before converting to base64

### "Invalid image format"
- Ensure you're uploading PNG, JPEG, or GIF
- Check that the base64 string includes the correct data URL prefix
