# 🎯 Team Deliverables - Complete Student Submission System

## ✅ New Features Implemented

### 1. **Auto-Create Deliverables for All Teams**
When admin creates a template, empty deliverable entries are automatically created for ALL existing teams.

### 2. **Student Submission Routes**
Teams can now submit and update their deliverables before the deadline.

### 3. **Deadline Protection**
Teams cannot submit or update after the deadline passes.

### 4. **Update Before Deadline**
Teams can update their submissions multiple times until the deadline.

---

## 🔄 How It Works

### Admin Creates Template
```
Admin creates template → System auto-creates empty deliverables for all teams
```

### Team Workflow
```
1. Team views their deliverables
2. Team clicks on a deliverable
3. Team submits content (first time)
4. Team can update content (before deadline)
5. After deadline → No more updates allowed
6. Admin reviews and approves/rejects
```

---

## 🛣️ Complete API Routes

### Admin Routes (10 endpoints)

#### Templates Management
```
GET    /api/admin/deliverable-templates
GET    /api/admin/deliverable-templates/:templateId
POST   /api/admin/deliverable-templates         ← Auto-creates for all teams!
PUT    /api/admin/deliverable-templates/:templateId
DELETE /api/admin/deliverable-templates/:templateId
```

#### Submissions Management
```
GET    /api/admin/deliverables
POST   /api/admin/deliverables/:teamId
POST   /api/admin/deliverables/:deliverableId/approve
POST   /api/admin/deliverables/:deliverableId/reject
```

---

### Student/Team Routes (5 endpoints) ⭐ NEW!

```
# View available templates (requirements)
GET    /api/deliverable-templates

# View team's deliverables (all submissions)
GET    /api/deliverables/team/:teamId

# View single deliverable details
GET    /api/deliverables/:deliverableId

# Submit or update deliverable
POST   /api/deliverables/:deliverableId/submit

# Check if deadline passed
GET    /api/deliverables/:deliverableId/deadline
```

---

## 📋 Student API Examples

### 1. Get All Requirements (Templates)
```bash
GET /api/deliverable-templates

Response:
{
  "success": true,
  "data": [
    {
      "id": "template_id",
      "title": "Project Proposal",
      "description": "Submit your proposal",
      "type": "PROPOSAL",
      "contentType": "FILE",
      "dueDate": "2026-02-01T00:00:00Z",
      "required": true
    }
  ]
}
```

### 2. Get Team's Deliverables
```bash
GET /api/deliverables/team/TEAM_ID

Response:
{
  "success": true,
  "data": [
    {
      "id": "deliverable_id",
      "teamId": "team_id",
      "templateId": "template_id",
      "content": "",  // Empty initially
      "status": "PENDING",
      "template": {
        "title": "Project Proposal",
        "dueDate": "2026-02-01T00:00:00Z",
        "contentType": "FILE"
      }
    }
  ]
}
```

### 3. Get Single Deliverable Details
```bash
GET /api/deliverables/DELIVERABLE_ID?teamId=TEAM_ID

Response:
{
  "success": true,
  "data": {
    "id": "deliverable_id",
    "content": "",
    "status": "PENDING",
    "template": {
      "title": "Project Proposal",
      "description": "Submit your proposal document",
      "dueDate": "2026-02-01T00:00:00Z",
      "contentType": "FILE"
    },
    "feedback": null,
    "reviewedAt": null
  }
}
```

### 4. Submit Deliverable (First Time)
```bash
POST /api/deliverables/DELIVERABLE_ID/submit
Content-Type: application/json

{
  "teamId": "team_id",
  "content": "https://storage.uploadthing.com/files/proposal.pdf",
  "contentType": "FILE",
  "description": "Our initial project proposal"
}

Response:
{
  "success": true,
  "message": "Deliverable submitted successfully",
  "data": {
    "id": "deliverable_id",
    "content": "https://...",
    "status": "PENDING",
    "submittedAt": "2026-01-08T14:00:00Z"
  }
}
```

### 5. Update Deliverable (Before Deadline)
```bash
POST /api/deliverables/DELIVERABLE_ID/submit
Content-Type: application/json

{
  "teamId": "team_id",
  "content": "https://storage.uploadthing.com/files/proposal-v2.pdf",
  "contentType": "FILE",
  "description": "Updated proposal with feedback incorporated"
}

Response:
{
  "success": true,
  "message": "Deliverable submitted successfully",
  "data": {
    "id": "deliverable_id",
    "content": "https://...",
    "status": "PENDING",
    "submittedAt": "2026-01-10T10:00:00Z"  // New timestamp
  }
}
```

### 6. Try to Update After Deadline
```bash
POST /api/deliverables/DELIVERABLE_ID/submit

Response (400 Bad Request):
{
  "success": false,
  "message": "Deadline has passed. Cannot submit or update."
}
```

### 7. Check Deadline Status
```bash
GET /api/deliverables/DELIVERABLE_ID/deadline

Response:
{
  "success": true,
  "data": {
    "passed": false,
    "dueDate": "2026-02-01T00:00:00Z",
    "timeRemaining": "23 days 10 hours"
  }
}
```

---

## 🎨 Frontend Implementation

### Student Dashboard - View Deliverables

```typescript
interface TeamDeliverable {
  id: string;
  content: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  template: {
    title: string;
    description: string;
    dueDate: string;
    contentType: 'FILE' | 'URL' | 'TEXT';
    required: boolean;
  };
  submittedAt: string;
  feedback?: string;
}

const TeamDeliverablesView = ({ teamId }: { teamId: string }) => {
  const [deliverables, setDeliverables] = useState<TeamDeliverable[]>([]);

  useEffect(() => {
    // Fetch team's deliverables
    fetch(`/api/deliverables/team/${teamId}`)
      .then(res => res.json())
      .then(data => setDeliverables(data.data));
  }, [teamId]);

  return (
    <div>
      <h2>Our Deliverables</h2>
      {deliverables.map(d => (
        <DeliverableCard 
          key={d.id} 
          deliverable={d}
        />
      ))}
    </div>
  );
};
```

### Deliverable Card Component

```typescript
const DeliverableCard = ({ deliverable }: { deliverable: TeamDeliverable }) => {
  const dueDate = new Date(deliverable.template.dueDate);
  const now = new Date();
  const deadlinePassed = dueDate < now;
  
  const isSubmitted = deliverable.content && deliverable.content.length > 0;
  
  return (
    <div className="deliverable-card">
      <h3>{deliverable.template.title}</h3>
      <p>{deliverable.template.description}</p>
      
      {/* Status Badge */}
      <span className={`badge ${deliverable.status.toLowerCase()}`}>
        {deliverable.status}
      </span>
      
      {/* Due Date */}
      <p className={deadlinePassed ? 'text-red' : 'text-green'}>
        Due: {dueDate.toLocaleDateString()}
        {deadlinePassed && ' (Deadline passed)'}
      </p>
      
      {/* Content Type */}
      <p>Format: {deliverable.template.contentType}</p>
      
      {/* Submission Status */}
      {!isSubmitted && (
        <button 
          onClick={() => navigate(`/submit/${deliverable.id}`)}
          disabled={deadlinePassed}
        >
          Submit Now
        </button>
      )}
      
      {isSubmitted && !deadlinePassed && (
        <button onClick={() => navigate(`/submit/${deliverable.id}`)}>
          Update Submission
        </button>
      )}
      
      {isSubmitted && (
        <p>Submitted: {new Date(deliverable.submittedAt).toLocaleString()}</p>
      )}
      
      {/* Feedback */}
      {deliverable.feedback && (
        <div className="feedback">
          <h4>Reviewer Feedback:</h4>
          <p>{deliverable.feedback}</p>
        </div>
      )}
    </div>
  );
};
```

### Submit/Update Form

```typescript
const SubmitDeliverableForm = ({ 
  deliverableId, 
  teamId 
}: { 
  deliverableId: string;
  teamId: string;
}) => {
  const [deliverable, setDeliverable] = useState<any>(null);
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch deliverable details
    fetch(`/api/deliverables/${deliverableId}?teamId=${teamId}`)
      .then(res => res.json())
      .then(data => {
        setDeliverable(data.data);
        setContent(data.data.content || '');
        setDescription(data.data.description || '');
      });
  }, [deliverableId, teamId]);

  const handleFileUpload = async () => {
    if (!file) return;
    
    // Upload to UploadThing or your storage
    const formData = new FormData();
    formData.append('file', file);
    
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    const data = await res.json();
    setContent(data.url); // Set file URL as content
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/deliverables/${deliverableId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId,
          content,
          contentType: deliverable.template.contentType,
          description,
        }),
      });

      const data = await res.json();
      
      if (data.success) {
        alert('Submitted successfully!');
        navigate(`/team/${teamId}/deliverables`);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  if (!deliverable) return <div>Loading...</div>;

  const deadlinePassed = new Date(deliverable.template.dueDate) < new Date();

  return (
    <form onSubmit={handleSubmit}>
      <h2>{deliverable.template.title}</h2>
      <p>{deliverable.template.description}</p>
      
      <p>Due: {new Date(deliverable.template.dueDate).toLocaleDateString()}</p>
      
      {deadlinePassed && (
        <div className="alert alert-error">
          Deadline has passed. You cannot submit or update.
        </div>
      )}
      
      {/* Content Input Based on Type */}
      {deliverable.template.contentType === 'FILE' && (
        <div>
          <input 
            type="file" 
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            disabled={deadlinePassed}
          />
          <button 
            type="button" 
            onClick={handleFileUpload}
            disabled={!file || deadlinePassed}
          >
            Upload File
          </button>
          {content && <p>File uploaded: {content}</p>}
        </div>
      )}
      
      {deliverable.template.contentType === 'URL' && (
        <input
          type="url"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="https://github.com/your-repo"
          disabled={deadlinePassed}
        />
      )}
      
      {deliverable.template.contentType === 'TEXT' && (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter your text content..."
          rows={10}
          disabled={deadlinePassed}
        />
      )}
      
      {/* Description */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Additional notes (optional)"
        rows={3}
        disabled={deadlinePassed}
      />
      
      <button 
        type="submit" 
        disabled={loading || !content || deadlinePassed}
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};
```

---

## ✅ Validation & Rules

### Submission Rules
- ✅ Content is **required**
- ✅ TeamId must match deliverable's team
- ✅ Cannot submit after deadline
- ✅ Cannot update approved deliverables
- ✅ Can update multiple times before deadline
- ✅ Submission resets status to PENDING

### Deadline Rules
- ✅ Calculated in real-time
- ✅ Shows time remaining (days + hours)
- ✅ Blocks submission after deadline
- ✅ Blocks updates after deadline

### Update Behavior
When team updates a deliverable:
- ✅ Content is updated
- ✅ Status reset to `PENDING`
- ✅ `submittedAt` updated to current time
- ✅ Previous review cleared (`reviewedAt`, `reviewedBy`, `feedback` = null)
- ✅ Admin needs to review again

---

## 🔄 Complete Workflow

### 1. Admin Creates Template
```bash
POST /api/admin/deliverable-templates
{
  "title": "Project Proposal",
  "description": "Submit your proposal",
  "type": "PROPOSAL",
  "contentType": "FILE",
  "dueDate": "2026-02-01T00:00:00Z"
}

✅ Template created
✅ Empty deliverables auto-created for ALL teams
✅ Teams notified (TODO)
```

### 2. Team Views Requirements
```bash
GET /api/deliverable-templates
✅ Sees "Project Proposal" requirement
✅ Knows it needs to be a FILE
✅ Sees deadline: Feb 1, 2026
```

### 3. Team Views Their Deliverables
```bash
GET /api/deliverables/team/TEAM_ID
✅ Sees empty deliverable entry
✅ Status: PENDING
✅ Content: "" (empty)
```

### 4. Team Submits
```bash
POST /api/deliverables/DELIVERABLE_ID/submit
{
  "teamId": "team_id",
  "content": "https://..../proposal.pdf"
}

✅ Content saved
✅ submittedAt = now
✅ Status = PENDING
```

### 5. Team Updates (Before Deadline)
```bash
POST /api/deliverables/DELIVERABLE_ID/submit
{
  "teamId": "team_id",
  "content": "https://..../proposal-v2.pdf"
}

✅ Content updated
✅ submittedAt = now (updated)
✅ Status = PENDING (reset)
✅ Previous review cleared
```

### 6. Deadline Passes
```bash
POST /api/deliverables/DELIVERABLE_ID/submit
❌ Error: "Deadline has passed. Cannot submit or update."
```

### 7. Admin Reviews
```bash
POST /api/admin/deliverables/DELIVERABLE_ID/approve
✅ Status = APPROVED
✅ reviewedAt = now
✅ reviewedBy = admin_id
```

### 8. Team Tries to Update Approved
```bash
POST /api/deliverables/DELIVERABLE_ID/submit
❌ Error: "Cannot update approved deliverable"
```

---

## 📊 Response Examples

### Get Team Deliverables
```json
{
  "success": true,
  "data": [
    {
      "id": "deliverable_id_1",
      "teamId": "team_id",
      "content": "https://storage.../proposal.pdf",
      "contentType": "FILE",
      "description": "Our proposal",
      "status": "APPROVED",
      "submittedAt": "2026-01-15T10:00:00Z",
      "reviewedAt": "2026-01-16T14:00:00Z",
      "feedback": "Great work!",
      "template": {
        "title": "Project Proposal",
        "dueDate": "2026-02-01T00:00:00Z",
        "contentType": "FILE"
      },
      "reviewer": {
        "firstName": "John",
        "lastName": "Admin"
      }
    },
    {
      "id": "deliverable_id_2",
      "teamId": "team_id",
      "content": "",
      "contentType": "FILE",
      "status": "PENDING",
      "template": {
        "title": "Prototype Demo",
        "dueDate": "2026-03-01T00:00:00Z",
        "contentType": "URL"
      }
    }
  ]
}
```

### Check Deadline
```json
{
  "success": true,
  "data": {
    "passed": false,
    "dueDate": "2026-02-01T00:00:00Z",
    "timeRemaining": "23 days 10 hours"
  }
}
```

---

## 🎉 Benefits

### For Admins
✅ Create template once → automatically assigned to all teams
✅ Track submission status for all teams
✅ Review and provide feedback
✅ Teams can improve before deadline

### For Teams
✅ See all requirements in one place
✅ Know exactly what format to submit
✅ Submit early and update later
✅ Get feedback from reviewers
✅ Clear deadline warnings

---

## 🚀 Testing

```bash
# 1. Admin creates template (auto-creates for all teams)
curl -X POST http://localhost:5000/api/admin/deliverable-templates \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Project Proposal",
    "description": "Submit your proposal",
    "type": "PROPOSAL",
    "contentType": "FILE",
    "dueDate": "2026-02-01T00:00:00Z"
  }'

# 2. Team views their deliverables
curl http://localhost:5000/api/deliverables/team/TEAM_ID

# 3. Team submits
curl -X POST http://localhost:5000/api/deliverables/DELIVERABLE_ID/submit \
  -H "Content-Type: application/json" \
  -d '{
    "teamId": "TEAM_ID",
    "content": "https://example.com/file.pdf",
    "contentType": "FILE",
    "description": "Our proposal"
  }'

# 4. Team updates
curl -X POST http://localhost:5000/api/deliverables/DELIVERABLE_ID/submit \
  -H "Content-Type: application/json" \
  -d '{
    "teamId": "TEAM_ID",
    "content": "https://example.com/file-v2.pdf",
    "description": "Updated proposal"
  }'

# 5. Check deadline
curl http://localhost:5000/api/deliverables/DELIVERABLE_ID/deadline
```

---

**Status:** ✅ Complete Student Submission System Ready!  
**Total Routes:** 15 (10 admin + 5 student)  
**Auto-Creation:** ✅ Enabled  
**Update Support:** ✅ Before deadline only  
**Version:** 2.2.0
