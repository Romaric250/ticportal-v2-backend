# 📤 Global File Upload API

## 🎯 Simple File Upload Endpoint

### Single Route for All File Uploads

```bash
POST /api/f/upload
```

**Uses the same uploadthing setup as user/team profile uploads!**

---

## 📋 API Specification

### Request

**Endpoint:** `POST /api/f/upload`

**Content-Type:** `application/json`

**Body:**
```json
{
  "file": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA...",
  "fileName": "proposal.pdf"
}
```

### Response

**Success (200):**
```json
{
  "success": true,
  "data": {
    "url": "https://utfs.io/f/abc123xyz.pdf",
    "key": "abc123xyz.pdf",
    "name": "proposal.pdf",
    "size": 2048576
  }
}
```

**Error (400):**
```json
{
  "success": false,
  "message": "No file data provided"
}
```

**Error (500):**
```json
{
  "success": false,
  "message": "Failed to upload file"
}
```

---

## 🎨 Frontend Usage

### React Hook (Base64 Upload)

```typescript
import { useState } from 'react';

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

      // Upload to server
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
        return data.data.url; // Return the file URL
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      throw error;
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading };
};
```

### Simple Usage Example

```typescript
import { useFileUpload } from './hooks/useFileUpload';

const FileUploadComponent = () => {
  const { uploadFile, uploading } = useFileUpload();
  const [fileUrl, setFileUrl] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadFile(file);
      setFileUrl(url);
      console.log('File uploaded:', url);
      
      // Now you can use this URL anywhere
    } catch (error) {
      alert('Upload failed');
    }
  };

  return (
    <div>
      <input 
        type="file" 
        onChange={handleFileChange} 
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}
      {fileUrl && <p>Uploaded: {fileUrl}</p>}
    </div>
  );
};
```

### Deliverable Submission with Upload

```typescript
const SubmitDeliverable = ({ deliverableId, teamId }) => {
  const { uploadFile, uploading } = useFileUpload();
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) return;

    try {
      // 1. Upload file (converts to base64 internally)
      const fileUrl = await uploadFile(file);
      
      // 2. Then submit deliverable with URL
      const response = await fetch(`/api/deliverables/${deliverableId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId,
          content: fileUrl, // Use the uploaded file URL
          contentType: 'FILE',
          description: 'My submission',
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Submitted successfully!');
      }
    } catch (error) {
      alert('Failed to submit');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="file" 
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button type="submit" disabled={uploading || !file}>
        {uploading ? 'Uploading...' : 'Submit'}
      </button>
    </form>
  );
};
```

### Drag & Drop Upload

```typescript
import { useFileUpload } from './hooks/useFileUpload';

const DragDropUpload = () => {
  const { uploadFile, uploading, progress } = useFileUpload();
  const [fileUrl, setFileUrl] = useState('');
  const [dragging, setDragging] = useState(false);

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    try {
      const url = await uploadFile(file);
      setFileUrl(url);
    } catch (error) {
      alert('Upload failed');
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`upload-zone ${dragging ? 'dragging' : ''}`}
    >
      {uploading ? (
        <div>
          <p>Uploading... {progress}%</p>
          <div className="progress-bar">
            <div style={{ width: `${progress}%` }} />
          </div>
        </div>
      ) : fileUrl ? (
        <p>✅ Uploaded: {fileUrl}</p>
      ) : (
        <p>📤 Drag & drop file here or click to browse</p>
      )}
    </div>
  );
};
```

---

## 🧪 Testing

### cURL

```bash
# Upload a file
curl -X POST http://localhost:5000/api/f/upload \
  -F "file=@/path/to/file.pdf"

# Expected response:
{
  "success": true,
  "data": {
    "url": "https://uploadthing.com/f/abc123.pdf",
    "filename": "file.pdf",
    "size": 123456,
    "mimetype": "application/pdf"
  }
}
```

### Postman

1. **Method:** POST
2. **URL:** `http://localhost:5000/api/f/upload`
3. **Body:** 
   - Type: `form-data`
   - Key: `file` (type: File)
   - Value: Select your file
4. **Send**

### JavaScript Fetch

```javascript
// Select file
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];

// Create form data
const formData = new FormData();
formData.append('file', file);

// Upload
fetch('/api/f/upload', {
  method: 'POST',
  body: formData,
})
  .then(res => res.json())
  .then(data => {
    console.log('File URL:', data.data.url);
  })
  .catch(err => {
    console.error('Upload failed:', err);
  });
```

---

## 📊 File Specifications

### Size Limit
- **Maximum:** 10MB per file
- **Recommended:** Under 5MB for optimal performance

### Supported File Types
All file types are accepted:
- Documents: PDF, DOC, DOCX, PPT, PPTX
- Images: JPG, PNG, GIF, SVG
- Archives: ZIP, RAR, 7Z
- Videos: MP4, AVI, MOV
- Code: JS, TS, PY, etc.

### Response
- **URL:** Permanent public URL
- **Format:** `https://uploadthing.com/f/{unique_id}.{ext}`
- **Expiry:** Never expires

---

## 🔄 Complete Workflow

### Step 1: Upload File
```bash
POST /api/f/upload
Body: file

Response: { url: "https://..." }
```

### Step 2: Use URL
```bash
# Save URL to deliverable
POST /api/deliverables/:id/submit
Body: {
  content: "https://uploadthing.com/f/abc123.pdf",
  contentType: "FILE"
}

# Or save to profile
PUT /api/users/:id
Body: {
  profilePhoto: "https://uploadthing.com/f/photo.jpg"
}

# Or save to team
PUT /api/teams/:id
Body: {
  profileImage: "https://uploadthing.com/f/logo.png"
}
```

---

## ✅ Use Cases

### 1. Deliverable Submissions
```typescript
// Upload file
const fileUrl = await uploadFile(proposalFile);

// Submit deliverable
await submitDeliverable({
  content: fileUrl,
  contentType: 'FILE',
});
```

### 2. Profile Photos
```typescript
// Upload photo
const photoUrl = await uploadFile(photoFile);

// Update profile
await updateProfile({
  profilePhoto: photoUrl,
});
```

### 3. Team Logos
```typescript
// Upload logo
const logoUrl = await uploadFile(logoFile);

// Update team
await updateTeam({
  profileImage: logoUrl,
});
```

### 4. Project Files
```typescript
// Upload multiple files
const urls = await Promise.all(
  files.map(file => uploadFile(file))
);

// Save all URLs
await saveProjectFiles(urls);
```

---

## 🎯 Benefits

### Simple API
✅ One endpoint for everything  
✅ No complex configuration  
✅ Easy to remember: `/api/f/upload`

### Frontend Friendly
✅ Works with FormData  
✅ Works with fetch/axios  
✅ No special headers needed

### Flexible
✅ Use URL anywhere in your app  
✅ Works with any model  
✅ Reusable for any feature

### Secure
✅ 10MB file size limit  
✅ Validation built-in  
✅ Error handling included

---

## 🚀 Quick Start

### 1. Frontend Component
```typescript
import { useFileUpload } from './hooks/useFileUpload';

function MyComponent() {
  const { uploadFile, uploading } = useFileUpload();

  const handleUpload = async (file: File) => {
    const url = await uploadFile(file);
    console.log('Uploaded:', url);
    // Use the URL!
  };

  return <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />;
}
```

### 2. Direct Fetch
```typescript
const formData = new FormData();
formData.append('file', file);

const response = await fetch('/api/f/upload', {
  method: 'POST',
  body: formData,
});

const { data } = await response.json();
console.log(data.url); // Use this URL!
```

---

## 📖 Integration Examples

### With React Query
```typescript
import { useMutation } from '@tanstack/react-query';

const useUploadFile = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/f/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      return data.data.url;
    },
  });
};

// Usage
const { mutateAsync: uploadFile, isPending } = useUploadFile();

const handleUpload = async (file: File) => {
  const url = await uploadFile(file);
  // Use URL
};
```

### With Axios
```typescript
import axios from 'axios';

const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post('/api/f/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.data.url;
};
```

---

## 🔒 Security Notes

1. **File Size:** Limited to 10MB
2. **Validation:** Server validates file presence
3. **Storage:** Files stored securely on uploadthing
4. **URLs:** Public but unguessable (random IDs)

---

## 📊 Response Schema

```typescript
interface UploadResponse {
  success: boolean;
  data: {
    url: string;        // Public file URL
    filename: string;   // Original filename
    size: number;       // File size in bytes
    mimetype: string;   // MIME type (e.g., "application/pdf")
  };
}

interface UploadError {
  success: false;
  message: string;
}
```

---

**Endpoint:** `POST /api/f/upload`  
**Simple:** Upload file, get URL  
**Universal:** Use URL anywhere in your app  
**Ready:** Production-ready file upload API 🚀
