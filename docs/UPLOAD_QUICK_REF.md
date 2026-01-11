# 📤 Global File Upload - Quick Reference

## One Endpoint, Base64 Upload (Like Team/User Profiles)

```bash
POST /api/f/upload
```

---

## 🚀 Quick Examples

### JavaScript/TypeScript
```typescript
// Convert file to base64
const reader = new FileReader();
reader.readAsDataURL(file);
reader.onload = async () => {
  const base64 = reader.result;
  
  // Upload
  const response = await fetch('/api/f/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      file: base64,
      fileName: file.name,
    }),
  });

  const { data } = await response.json();
  console.log(data.url); // Use this URL!
};
```

### React Hook
```typescript
const { uploadFile, uploading } = useFileUpload();
const url = await uploadFile(file); // Handles base64 conversion
```

### cURL (with base64 string)
```bash
curl -X POST http://localhost:5000/api/f/upload \
  -H "Content-Type: application/json" \
  -d '{"file":"data:text/plain;base64,SGVsbG8gV29ybGQ=","fileName":"test.txt"}'
```

---

## 📊 Response

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

## ✅ Use Cases

- **Deliverables:** Upload proposal, then submit with URL
- **Profiles:** Upload photo, update profile with URL
- **Teams:** Upload logo, save URL to team
- **Any Feature:** Upload anything, use URL anywhere!

---

## 🎯 Workflow

```
1. Convert file to base64 (frontend)
   ↓
2. POST /api/f/upload with base64
   ↓
3. Get URL back
   ↓
4. Use URL in your API call
   ↓
5. Done! ✅
```

---

## 📝 Notes

- **Format:** Base64 data URI (like team/user profile uploads)
- **Any File Type:** Accepted
- **URL Never Expires:** Permanent storage
- **Same as:** Team profile & user profile uploads

---

**Documentation:** `GLOBAL_FILE_UPLOAD_API.md`  
**Endpoint:** `/api/f/upload`  
**Method:** Base64 upload (like existing profile uploads) 🎉
