# 🔄 Deliverables Enhancement - Quick Setup

## What Changed

### ✅ Schema Updates
1. Added `DeliverableContentType` enum (FILE, URL, TEXT)
2. Added `customType` field to `DeliverableTemplate`
3. Added `customType` field to `TeamDeliverable`
4. Added `contentType` field to both models
5. Changed `fileUrl` to `content` in `TeamDeliverable`
6. Set default `type` to `CUSTOM` in `DeliverableTemplate`
7. Set default `contentType` to `TEXT` in both models

### ✅ Service Updates
1. `createTemplate()` - Now accepts `customType` and `contentType`
2. `uploadDeliverable()` - Changed `fileUrl` to `content`, added `contentType`

### ✅ Controller Updates
1. Template creation validates `customType` when type is `CUSTOM`
2. Upload accepts `content` instead of `fileUrl`
3. Content type defaults to `TEXT` if not specified

---

## 🚀 Setup Instructions

### Step 1: Generate Prisma Client
```bash
npx prisma generate
```

### Step 2: Push Schema to Database
```bash
npx prisma db push
```

### Step 3: Restart Server
```bash
npm run dev
```

---

## 🧪 Test the New Features

### Test 1: Create Text Template
```bash
curl -X POST http://localhost:5000/api/admin/deliverable-templates \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Project Description",
    "description": "Write your project description",
    "type": "CUSTOM",
    "customType": "Description",
    "contentType": "TEXT",
    "dueDate": "2026-02-01T00:00:00Z"
  }'
```

### Test 2: Create File Upload Template
```bash
curl -X POST http://localhost:5000/api/admin/deliverable-templates \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Proposal Document",
    "description": "Upload PDF proposal",
    "type": "PROPOSAL",
    "contentType": "FILE",
    "dueDate": "2026-02-01T00:00:00Z"
  }'
```

### Test 3: Create URL Template
```bash
curl -X POST http://localhost:5000/api/admin/deliverable-templates \
  -H "Content-Type: application/json" \
  -d '{
    "title": "GitHub Repository",
    "description": "Link to your repo",
    "type": "CUSTOM",
    "customType": "Repository",
    "contentType": "URL",
    "dueDate": "2026-03-01T00:00:00Z"
  }'
```

### Test 4: Submit Text Content
```bash
curl -X POST http://localhost:5000/api/admin/teams/TEAM_ID/deliverables \
  -H "Content-Type: application/json" \
  -d '{
    "templateId": "TEMPLATE_ID",
    "content": "This is our project description...",
    "contentType": "TEXT"
  }'
```

### Test 5: Submit File URL
```bash
curl -X POST http://localhost:5000/api/admin/teams/TEAM_ID/deliverables \
  -H "Content-Type: application/json" \
  -d '{
    "templateId": "TEMPLATE_ID",
    "content": "https://storage.example.com/file.pdf",
    "contentType": "FILE"
  }'
```

### Test 6: Submit External Link
```bash
curl -X POST http://localhost:5000/api/admin/teams/TEAM_ID/deliverables \
  -H "Content-Type: application/json" \
  -d '{
    "templateId": "TEMPLATE_ID",
    "content": "https://github.com/team/project",
    "contentType": "URL"
  }'
```

---

## 📋 Content Types Guide

| Type | Use Case | Example Content |
|------|----------|-----------------|
| **TEXT** | Written content, descriptions | "Our project aims to..." |
| **FILE** | Uploaded documents, files | "https://storage.../doc.pdf" |
| **URL** | External links, repos | "https://github.com/..." |

---

## 🎯 Custom Types Examples

Instead of using built-in types (PROPOSAL, PROTOTYPE, etc.), create custom ones:

```json
{
  "type": "CUSTOM",
  "customType": "Wireframes"
}

{
  "type": "CUSTOM",
  "customType": "User Research"
}

{
  "type": "CUSTOM",
  "customType": "Marketing Plan"
}

{
  "type": "CUSTOM",
  "customType": "Technical Architecture"
}
```

---

## ✅ Validation

### When Creating Template:
- If `type` is `CUSTOM`, then `customType` is **required**
- `contentType` defaults to `TEXT` if not provided
- `type` defaults to `CUSTOM` if not provided

### When Submitting Deliverable:
- `content` is **required** (can be text, file URL, or external URL)
- `contentType` inherits from template if not specified
- Content format should match the specified `contentType`

---

## 🔍 Breaking Changes

### Old API → New API

**Before:**
```json
{
  "fileUrl": "https://..."
}
```

**After:**
```json
{
  "content": "https://...",  // or text, or URL
  "contentType": "FILE"      // or TEXT, or URL
}
```

### Migration for Existing Data
If you have existing deliverables with `fileUrl`:
1. The old `fileUrl` field no longer exists
2. Use `content` field instead
3. Set `contentType` to `FILE` for file URLs

---

## 📊 Database Impact

### New Fields Added:
- `DeliverableTemplate.customType` (nullable)
- `DeliverableTemplate.contentType` (default: TEXT)
- `TeamDeliverable.customType` (nullable)
- `TeamDeliverable.contentType` (default: TEXT)

### Fields Changed:
- `TeamDeliverable.fileUrl` → `TeamDeliverable.content`

### Enums Added:
- `DeliverableContentType` (FILE, URL, TEXT)
- `DeliverableType.CUSTOM` added to existing enum

---

## 🎉 What You Can Do Now

### As Admin:
✅ Create templates with specific content types
✅ Use custom deliverable type names
✅ Specify whether teams should upload files, link URLs, or write text
✅ Mix different content types for different deliverables

### As Team:
✅ Know exactly what format to submit
✅ Submit text directly in the form
✅ Upload files and get URL automatically
✅ Link to external resources (GitHub, Drive, etc.)

---

## 📖 Full Documentation

See `docs/DELIVERABLES_ENHANCED.md` for:
- Complete API examples
- Frontend integration code
- All use cases
- Response formats

---

**Status:** ✅ Ready to Use  
**Run:** `npx prisma generate && npx prisma db push && npm run dev`
