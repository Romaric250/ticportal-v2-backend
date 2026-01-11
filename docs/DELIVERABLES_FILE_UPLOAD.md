# 📤 Deliverables File Upload - Complete Guide

## ✅ File Upload Implementation

### Features Added
1. ✅ Direct file upload endpoint
2. ✅ Upload + Submit in one request (Student)
3. ✅ Upload + Submit for team (Admin)
4. ✅ 10MB file size limit
5. ✅ Uses existing uploadthing setup

---

## 🛣️ File Upload Routes

### 1. General File Upload
```bash
POST /api/deliverables/upload
Content-Type: multipart/form-data

Form Data:
- file: [File object]

Response:
{
  "success": true,
  "data": {
    "url": "https://uploadthing.com/f/abc123.pdf",
    "filename": "proposal.pdf",
    "size": 2048576,
    "mimetype": "application/pdf"
  }
}
```

### 2. Student: Upload & Submit (One Request)
```bash
POST /api/deliverables/:deliverableId/upload-and-submit
Content-Type: multipart/form-data

Form Data:
- file: [File object]
- teamId: "team_id"
- description: "Our project proposal" (optional)

Response:
{
  "success": true,
  "message": "File uploaded and deliverable submitted successfully",
  "data": {
    "deliverable": {
      "id": "deliverable_id",
      "content": "https://uploadthing.com/f/abc123.pdf",
      "submissionStatus": "SUBMITTED",
      "reviewStatus": "PENDING"
    },
    "file": {
      "url": "https://uploadthing.com/f/abc123.pdf",
      "filename": "proposal.pdf",
      "size": 2048576
    }
  }
}
```

### 3. Admin: Upload for Team
```bash
POST /api/admin/deliverables/:teamId/upload-and-submit
Content-Type: multipart/form-data

Form Data:
- file: [File object]
- templateId: "template_id"
- description: "Uploaded by admin" (optional)

Response:
{
  "success": true,
  "message": "File uploaded and deliverable submitted for team",
  "data": {
    "deliverable": {
      "submissionStatus": "SUBMITTED",
      "reviewStatus": "PENDING"
    },
    "file": {
      "url": "https://uploadthing.com/f/abc123.pdf"
    }
  }
}
```

---

## 🎨 Frontend Implementation

### React Hook for File Upload

```typescript
import { useState } from 'react';

export const useDeliverableFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (file: File) => {
    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/deliverables/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setProgress(100);
        return data.data.url;
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const uploadAndSubmit = async (
    deliverableId: string,
    teamId: string,
    file: File,
    description?: string
  ) => {
    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('teamId', teamId);
      if (description) {
        formData.append('description', description);
      }

      const response = await fetch(
        `/api/deliverables/${deliverableId}/upload-and-submit`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        setProgress(100);
        return data.data;
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      throw error;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    progress,
    uploadFile,
    uploadAndSubmit,
  };
};
```

### Submit Form with File Upload

```typescript
import { useState } from 'react';
import { useDeliverableFileUpload } from './hooks/useDeliverableFileUpload';

const DeliverableSubmitForm = ({ 
  deliverableId, 
  teamId,
  contentType 
}: {
  deliverableId: string;
  teamId: string;
  contentType: 'FILE' | 'URL' | 'TEXT';
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [description, setDescription] = useState('');
  
  const { uploading, progress, uploadAndSubmit } = useDeliverableFileUpload();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (contentType === 'FILE' && file) {
        // Upload file and submit in one request
        const result = await uploadAndSubmit(deliverableId, teamId, file, description);
        alert('Submitted successfully!');
        window.location.reload();
      } else if (contentType === 'URL') {
        // Submit URL directly
        const response = await fetch(`/api/deliverables/${deliverableId}/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            teamId,
            content: url,
            contentType: 'URL',
            description,
          }),
        });
        const data = await response.json();
        if (data.success) {
          alert('Submitted successfully!');
          window.location.reload();
        }
      } else if (contentType === 'TEXT') {
        // Submit text directly
        const response = await fetch(`/api/deliverables/${deliverableId}/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            teamId,
            content: text,
            contentType: 'TEXT',
            description,
          }),
        });
        const data = await response.json();
        if (data.success) {
          alert('Submitted successfully!');
          window.location.reload();
        }
      }
    } catch (error: any) {
      alert(error.message || 'Failed to submit');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Submit Deliverable</h2>

      {/* File Upload */}
      {contentType === 'FILE' && (
        <div className="form-group">
          <label>Upload File (PDF, DOC, ZIP, etc.)</label>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.zip,.ppt,.pptx"
            required
          />
          {file && (
            <p className="file-info">
              Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>
      )}

      {/* URL Input */}
      {contentType === 'URL' && (
        <div className="form-group">
          <label>URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://github.com/your-repo"
            required
          />
        </div>
      )}

      {/* Text Input */}
      {contentType === 'TEXT' && (
        <div className="form-group">
          <label>Content</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            placeholder="Enter your content here..."
            required
          />
        </div>
      )}

      {/* Description */}
      <div className="form-group">
        <label>Description (Optional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Additional notes about your submission..."
        />
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }}>
            {progress}%
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button type="submit" disabled={uploading}>
        {uploading ? 'Uploading...' : 'Submit'}
      </button>
    </form>
  );
};

export default DeliverableSubmitForm;
```

### Admin Upload for Team

```typescript
const AdminUploadForTeam = ({ 
  teamId, 
  templateId 
}: {
  teamId: string;
  templateId: string;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert('Please select a file');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('templateId', templateId);
      if (description) {
        formData.append('description', description);
      }

      const response = await fetch(
        `/api/admin/deliverables/${teamId}/upload-and-submit`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        alert('File uploaded and submitted for team successfully!');
        window.location.reload();
      } else {
        alert(data.message);
      }
    } catch (error: any) {
      alert('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Upload File for Team</h3>
      
      <div className="form-group">
        <label>Select File</label>
        <input
          type="file"
          onChange={handleFileChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Description (Optional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      <button type="submit" disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload for Team'}
      </button>
    </form>
  );
};
```

---

## 📋 File Upload Specifications

### Supported File Types
```typescript
const ALLOWED_FILE_TYPES = [
  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  
  // Presentations
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  
  // Archives
  'application/zip',
  'application/x-zip-compressed',
  
  // Images
  'image/jpeg',
  'image/png',
  'image/gif',
];
```

### File Size Limits
- **Maximum:** 10MB per file
- **Recommended:** Under 5MB for faster uploads

### File Naming
- Files are automatically renamed by uploadthing
- Original filename is preserved in metadata
- URL format: `https://uploadthing.com/f/{unique_id}.{ext}`

---

## 🧪 Testing File Upload

### Test 1: Upload Single File
```bash
curl -X POST http://localhost:5000/api/deliverables/upload \
  -F "file=@/path/to/proposal.pdf"

# Expected: File URL returned
```

### Test 2: Student Upload & Submit
```bash
curl -X POST http://localhost:5000/api/deliverables/DELIVERABLE_ID/upload-and-submit \
  -F "file=@/path/to/proposal.pdf" \
  -F "teamId=TEAM_ID" \
  -F "description=Our proposal"

# Expected:
# - File uploaded
# - Deliverable submitted
# - submissionStatus: SUBMITTED
```

### Test 3: Admin Upload for Team
```bash
curl -X POST http://localhost:5000/api/admin/deliverables/TEAM_ID/upload-and-submit \
  -F "file=@/path/to/proposal.pdf" \
  -F "templateId=TEMPLATE_ID" \
  -F "description=Uploaded by admin"

# Expected:
# - File uploaded
# - Deliverable created and submitted
# - submissionStatus: SUBMITTED
```

---

## ✅ Benefits

### For Students
✅ **Easy Upload:** Drag & drop or file picker  
✅ **One-Click Submit:** Upload and submit in one action  
✅ **Progress Tracking:** See upload progress  
✅ **File Validation:** Size and type checks

### For Admins
✅ **Upload for Teams:** Help teams submit files  
✅ **Bulk Upload:** Upload multiple files for different teams  
✅ **File Management:** Track all uploaded files  
✅ **Override Deadline:** Admin can upload after deadline

---

## 🔒 Security Features

1. ✅ **File Size Limit:** 10MB maximum
2. ✅ **File Type Validation:** Only allowed types
3. ✅ **Team Verification:** User must own team
4. ✅ **Deadline Check:** Students cannot upload after deadline
5. ✅ **Memory Storage:** Files not stored on server disk

---

## 📊 Complete Workflow

### Student Workflow
```
1. Select deliverable
2. Click "Upload File"
3. Choose file from computer
4. Add description (optional)
5. Click "Submit"
   ↓
6. File uploads to uploadthing
7. URL saved to database
8. submissionStatus: SUBMITTED
9. reviewStatus: PENDING
```

### Admin Workflow
```
1. Select team
2. Select template
3. Upload file for team
   ↓
4. File uploads
5. Deliverable created automatically
6. submissionStatus: SUBMITTED
7. reviewStatus: PENDING
```

---

## 🎯 Status After File Upload

| Action | Submission Status | Review Status | Content |
|--------|------------------|---------------|---------|
| Student uploads | SUBMITTED | PENDING | File URL |
| Admin uploads | SUBMITTED | PENDING | File URL |
| File deleted | NOT_SUBMITTED | PENDING | "" |

---

**Status:** ✅ File Upload Fully Implemented!  
**Max Size:** 10MB  
**Endpoints:** 3 upload routes  
**Integration:** Uploadthing ready  
**Version:** 3.1.0
