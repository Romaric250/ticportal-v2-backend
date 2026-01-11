# ✅ Upload API - Fixed to Use Uploadthing (Base64)

## 🎯 Changed to Match Existing Pattern

**Now uses the same uploadthing setup as:**
- User profile photo uploads
- Team profile image uploads

---

## 📋 What Changed

### ❌ Before (Multer - Wrong Approach)
```typescript
// Was using multer + FormData
const formData = new FormData();
formData.append('file', file);
```

### ✅ After (Uploadthing + Base64 - Correct)
```typescript
// Now uses base64 like team/user profiles
const base64 = await fileToBase64(file);
fetch('/api/f/upload', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ file: base64, fileName: file.name }),
});
```

---

## 🎨 Frontend Usage (Updated)

### React Hook
```typescript
export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File): Promise<string> => {
    setUploading(true);

    try {
      // Convert file to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Upload to server (same as team profile)
      const response = await fetch('/api/f/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file: base64,
          fileName: file.name,
        }),
      });

      const data = await response.json();
      if (data.success) {
        return data.data.url;
      } else {
        throw new Error(data.message);
      }
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading };
};
```

### Usage Example
```typescript
const { uploadFile } = useFileUpload();

// Upload file
const url = await uploadFile(file);

// Use URL for deliverable
await fetch(`/api/deliverables/${id}/submit`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    teamId,
    content: url,
    contentType: 'FILE',
  }),
});
```

---

## 🔧 Backend Implementation

### Route (`src/modules/upload/routes.ts`)
```typescript
import { Router } from "express";
import { UTApi } from "uploadthing/server";

const router = Router();
const utapi = new UTApi();

router.post("/upload", async (req, res) => {
  try {
    const { file, fileName } = req.body;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file data provided",
      });
    }

    // Upload base64 to uploadthing
    const uploadedFile = await utapi.uploadFilesFromUrl(file);

    return res.json({
      success: true,
      data: {
        url: uploadedFile.data.url,
        key: uploadedFile.data.key,
        name: uploadedFile.data.name,
        size: uploadedFile.data.size,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to upload file",
    });
  }
});

export default router;
```

---

## 📊 API Spec

### Request
```json
POST /api/f/upload
Content-Type: application/json

{
  "file": "data:application/pdf;base64,JVBERi0xLjcKCjEgMCBvYmoKPDwvVHlwZS...",
  "fileName": "proposal.pdf"
}
```

### Response
```json
{
  "success": true,
  "data": {
    "url": "https://utfs.io/f/abc123.pdf",
    "key": "abc123.pdf",
    "name": "proposal.pdf",
    "size": 123456
  }
}
```

---

## ✅ Benefits

1. **Consistent:** Same upload method as team/user profiles
2. **Already Setup:** Uses existing uploadthing config
3. **No New Dependencies:** No need for multer
4. **Proven Pattern:** Already working in production

---

## 🧪 Test It

```bash
# 1. Convert file to base64
base64_content=$(base64 -w 0 test.txt)

# 2. Upload
curl -X POST http://localhost:5000/api/f/upload \
  -H "Content-Type: application/json" \
  -d "{\"file\":\"data:text/plain;base64,$base64_content\",\"fileName\":\"test.txt\"}"
```

---

## 📖 Updated Documentation

- **GLOBAL_FILE_UPLOAD_API.md** - Updated with base64 examples
- **UPLOAD_QUICK_REF.md** - Updated with base64 pattern
- **This file** - Migration guide

---

## 🔄 Migration from Multer

If you had any code using the old multer approach, update to:

### Old (Multer)
```typescript
const formData = new FormData();
formData.append('file', file);

fetch('/api/f/upload', {
  method: 'POST',
  body: formData,
});
```

### New (Uploadthing/Base64)
```typescript
const reader = new FileReader();
reader.readAsDataURL(file);
reader.onload = () => {
  fetch('/api/f/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      file: reader.result,
      fileName: file.name,
    }),
  });
};
```

---

**Status:** ✅ Fixed to use uploadthing with base64!  
**Pattern:** Same as team/user profile uploads  
**Ready:** Production ready 🚀
