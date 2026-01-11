# 📤 Global File Upload - Quick Reference

## One Endpoint to Rule Them All

```bash
POST /api/f/upload
```

---

## 🚀 Quick Examples

### JavaScript/TypeScript
```typescript
const formData = new FormData();
formData.append('file', fileObject);

const response = await fetch('/api/f/upload', {
  method: 'POST',
  body: formData,
});

const { data } = await response.json();
console.log(data.url); // Use this URL!
```

### React Hook
```typescript
const { uploadFile, uploading } = useFileUpload();
const url = await uploadFile(file);
```

### cURL
```bash
curl -X POST http://localhost:5000/api/f/upload \
  -F "file=@proposal.pdf"
```

---

## 📊 Response

```json
{
  "success": true,
  "data": {
    "url": "https://uploadthing.com/f/abc123.pdf",
    "filename": "proposal.pdf",
    "size": 123456,
    "mimetype": "application/pdf"
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
1. POST /api/f/upload (with file)
   ↓
2. Get URL back
   ↓
3. Use URL in your API call
   ↓
4. Done! ✅
```

---

## 📝 Notes

- **Max Size:** 10MB
- **Any File Type:** Accepted
- **URL Never Expires:** Permanent storage
- **No Auth Required:** Public endpoint

---

**Documentation:** `GLOBAL_FILE_UPLOAD_API.md`  
**Endpoint:** `/api/f/upload`  
**Simple:** Upload → Get URL → Use Anywhere 🎉
