# 🎯 Deliverables System - Enhanced with Content Types & Custom Types

## ✅ What's New

### 1. **Content Type Support**
Templates and submissions now support three content types:
- **TEXT** - Rich text or plain text content (default)
- **FILE** - File uploads (PDF, DOC, ZIP, etc.)
- **URL** - External links (GitHub, Google Drive, etc.)

### 2. **Custom Deliverable Types**
Instead of being limited to predefined types (PROPOSAL, PROTOTYPE, etc.), admins can now create custom types by:
- Setting `type` to `CUSTOM`
- Providing a `customType` name (e.g., "Wireframe", "User Research", "Marketing Plan")

---

## 📊 Database Schema

```prisma
enum DeliverableType {
  PROPOSAL
  PROTOTYPE
  FINAL_SUBMISSION
  DOCUMENTATION
  CUSTOM              // New! Allows custom types
}

enum DeliverableContentType {
  FILE    // File upload
  URL     // External link
  TEXT    // Text content (default)
}

model DeliverableTemplate {
  id          String
  title       String
  description String
  type        DeliverableType        @default(CUSTOM)
  customType  String?                // Custom type name when type is CUSTOM
  contentType DeliverableContentType @default(TEXT)
  hackathonId String?
  dueDate     DateTime
  required    Boolean                @default(true)
  // ...
}

model TeamDeliverable {
  id           String
  teamId       String
  templateId   String
  type         DeliverableType
  customType   String?                // Custom type name when type is CUSTOM
  contentType  DeliverableContentType @default(TEXT)
  content      String                 // Can be file URL, external URL, or text content
  description  String?
  status       DeliverableStatus      @default(PENDING)
  // ...
}
```

---

## 🚀 API Usage

### Create Template with Content Type

#### Example 1: Text Deliverable (Default)
```bash
POST /api/admin/deliverable-templates
Content-Type: application/json

{
  "title": "Project Description",
  "description": "Write a detailed description of your project",
  "type": "CUSTOM",
  "customType": "Project Description",
  "contentType": "TEXT",
  "dueDate": "2026-02-01T00:00:00Z",
  "required": true
}
```

#### Example 2: File Upload Deliverable
```bash
POST /api/admin/deliverable-templates
Content-Type: application/json

{
  "title": "Project Proposal Document",
  "description": "Upload your project proposal as PDF",
  "type": "PROPOSAL",
  "contentType": "FILE",
  "dueDate": "2026-02-01T00:00:00Z",
  "required": true
}
```

#### Example 3: URL Link Deliverable
```bash
POST /api/admin/deliverable-templates
Content-Type: application/json

{
  "title": "GitHub Repository",
  "description": "Link to your project repository",
  "type": "CUSTOM",
  "customType": "Repository Link",
  "contentType": "URL",
  "dueDate": "2026-03-01T00:00:00Z",
  "required": true
}
```

#### Example 4: Custom Type with File
```bash
POST /api/admin/deliverable-templates
Content-Type: application/json

{
  "title": "UI Wireframes",
  "description": "Upload your wireframe designs",
  "type": "CUSTOM",
  "customType": "Wireframes",
  "contentType": "FILE",
  "hackathonId": "hackathon_id_here",
  "dueDate": "2026-02-15T00:00:00Z",
  "required": false
}
```

---

### Submit Deliverable

#### Submitting Text Content
```bash
POST /api/admin/teams/:teamId/deliverables
Content-Type: application/json

{
  "templateId": "template_id",
  "content": "This is our detailed project description...",
  "contentType": "TEXT",
  "description": "Initial draft"
}
```

#### Submitting File URL
```bash
POST /api/admin/teams/:teamId/deliverables
Content-Type: application/json

{
  "templateId": "template_id",
  "content": "https://storage.uploadthing.com/files/abc123.pdf",
  "contentType": "FILE",
  "description": "Final proposal document"
}
```

#### Submitting External URL
```bash
POST /api/admin/teams/:teamId/deliverables
Content-Type: application/json

{
  "templateId": "template_id",
  "content": "https://github.com/team/project",
  "contentType": "URL",
  "description": "Project repository"
}
```

---

## 🎨 Frontend Usage Examples

### Create Template Form

```tsx
interface TemplateForm {
  title: string;
  description: string;
  type: 'PROPOSAL' | 'PROTOTYPE' | 'FINAL_SUBMISSION' | 'DOCUMENTATION' | 'CUSTOM';
  customType?: string;
  contentType: 'TEXT' | 'FILE' | 'URL';
  dueDate: Date;r
  required: boolean;
}

const CreateTemplateForm = () => {
  const [form, setForm] = useState<TemplateForm>({
    title: '',
    description: '',
    type: 'CUSTOM',
    customType: '',
    contentType: 'TEXT',
    dueDate: new Date(),
    required: true,
  });

  return (
    <form>
      {/* Title & Description */}
      <input name="title" value={form.title} />
      <textarea name="description" value={form.description} />
      
      {/* Type Selection */}
      <select name="type" value={form.type}>
        <option value="PROPOSAL">Proposal</option>
        <option value="PROTOTYPE">Prototype</option>
        <option value="FINAL_SUBMISSION">Final Submission</option>
        <option value="DOCUMENTATION">Documentation</option>
        <option value="CUSTOM">Custom Type</option>
      </select>
      
      {/* Show customType input only if type is CUSTOM */}
      {form.type === 'CUSTOM' && (
        <input 
          name="customType" 
          placeholder="e.g., Wireframes, User Research"
          value={form.customType}
          required
        />
      )}
      
      {/* Content Type Selection */}
      <select name="contentType" value={form.contentType}>
        <option value="TEXT">Text Content</option>
        <option value="FILE">File Upload</option>
        <option value="URL">External Link</option>
      </select>
      
      {/* Due Date & Required */}
      <input type="datetime-local" name="dueDate" />
      <input type="checkbox" name="required" />
    </form>
  );
};
```

### Submit Deliverable Form

```tsx
const SubmitDeliverableForm = ({ template }: { template: DeliverableTemplate }) => {
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const renderContentInput = () => {
    switch (template.contentType) {
      case 'TEXT':
        return (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your text content here..."
          />
        );
      
      case 'FILE':
        return (
          <div>
            <input 
              type="file" 
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            {/* After upload, set content to the file URL */}
            <button onClick={handleUpload}>Upload File</button>
          </div>
        );
      
      case 'URL':
        return (
          <input
            type="url"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="https://github.com/your-repo"
          />
        );
    }
  };

  return (
    <form>
      <h3>{template.title}</h3>
      <p>{template.description}</p>
      <p>Type: {template.customType || template.type}</p>
      <p>Content Type: {template.contentType}</p>
      
      {renderContentInput()}
      
      <textarea 
        placeholder="Additional notes (optional)"
        name="description"
      />
      
      <button type="submit">Submit</button>
    </form>
  );
};
```

---

## 📋 Use Cases

### 1. Text Content
**Examples:**
- Project description
- Executive summary
- Team reflection
- Progress reports

**Best for:** Written content that can be edited inline

### 2. File Upload
**Examples:**
- PDF documents
- PowerPoint presentations
- Design files (Figma, Sketch)
- ZIP archives

**Best for:** Formatted documents, designs, multi-file deliverables

### 3. External URL
**Examples:**
- GitHub repositories
- Google Drive folders
- Figma prototypes
- YouTube demos
- Live websites

**Best for:** Hosted content, collaborative tools, live demos

---

## 🎯 Custom Deliverable Types

### Built-in Types
- `PROPOSAL` - Project proposals
- `PROTOTYPE` - Working prototypes
- `FINAL_SUBMISSION` - Final projects
- `DOCUMENTATION` - Documentation files

### Custom Types (Examples)
Set `type: "CUSTOM"` and provide `customType`:
- "Wireframes"
- "User Research"
- "Marketing Plan"
- "Financial Projections"
- "Technical Architecture"
- "Test Results"
- "Demo Video"
- "Pitch Deck"
- "Logo Design"
- "User Manual"

---

## ✅ Validation Rules

### Template Creation
- ✅ `title` - Required
- ✅ `description` - Required
- ✅ `dueDate` - Required
- ✅ `type` - Defaults to `CUSTOM` if not provided
- ✅ `customType` - Required when `type` is `CUSTOM`
- ✅ `contentType` - Defaults to `TEXT` if not provided

### Deliverable Submission
- ✅ `templateId` - Required
- ✅ `content` - Required (file URL, external URL, or text)
- ✅ `contentType` - Defaults to template's contentType
- ✅ `description` - Optional

---

## 🔄 Migration Steps

### 1. Update Schema
```bash
# Already done! Schema includes:
# - DeliverableContentType enum (FILE, URL, TEXT)
# - customType field in both models
# - content field (replaces fileUrl)
```

### 2. Generate Prisma Client
```bash
npx prisma generate
```

### 3. Push to Database
```bash
npx prisma db push
```

### 4. Restart Server
```bash
npm run dev
```

---

## 📊 Response Examples

### Template Response
```json
{
  "success": true,
  "data": {
    "id": "template_id",
    "title": "UI Wireframes",
    "description": "Upload your wireframe designs",
    "type": "CUSTOM",
    "customType": "Wireframes",
    "contentType": "FILE",
    "dueDate": "2026-02-15T00:00:00Z",
    "required": false,
    "hackathonId": "hackathon_id",
    "createdAt": "2026-01-08T00:00:00Z"
  }
}
```

### Deliverable Response
```json
{
  "success": true,
  "data": {
    "id": "deliverable_id",
    "teamId": "team_id",
    "templateId": "template_id",
    "type": "CUSTOM",
    "customType": "Wireframes",
    "contentType": "FILE",
    "content": "https://storage.uploadthing.com/files/wireframes.pdf",
    "description": "Initial wireframe designs",
    "status": "PENDING",
    "submittedAt": "2026-01-09T00:00:00Z",
    "team": {
      "id": "team_id",
      "name": "Team Alpha"
    }
  }
}
```

---

## 🎉 Benefits

### For Admins
✅ Flexible deliverable types
✅ Support multiple content formats
✅ Create custom requirements per hackathon
✅ Clear content type expectations

### For Teams
✅ Know exactly what format to submit
✅ Choose appropriate submission method
✅ Simple text input for descriptions
✅ File uploads for documents
✅ Links for hosted content

---

**Status:** ✅ Enhanced & Ready!  
**Version:** 2.1.0  
**Last Updated:** January 8, 2026
