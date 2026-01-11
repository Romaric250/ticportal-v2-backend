# 🔄 Deliverable Routes & Rejection Handling - Complete Guide

## ✅ What's Fixed

### 1. **Backward Compatible Routes**
Both old and new route formats now work:

**Old Format (Still Works):**
```
POST /api/admin/teams/deliverables/:id/approve
POST /api/admin/teams/deliverables/:id/reject
```

**New Format (Also Works):**
```
POST /api/admin/deliverables/:id/approve
POST /api/admin/deliverables/:id/reject
```

### 2. **Rejection & Resubmission Flow**
When a deliverable is rejected and team resubmits, status returns to PENDING.

---

## 🛣️ All Admin Routes (Both Formats Supported)

### New Format (Recommended)
```
GET    /api/admin/deliverables
POST   /api/admin/deliverables/:teamId
POST   /api/admin/deliverables/:deliverableId/approve
POST   /api/admin/deliverables/:deliverableId/reject
```

### Old Format (Backward Compatible)
```
GET    /api/admin/teams/deliverables
POST   /api/admin/teams/:teamId/deliverables
POST   /api/admin/teams/deliverables/:deliverableId/approve
POST   /api/admin/teams/deliverables/:deliverableId/reject
```

---

## 🔄 Rejection & Resubmission Workflow

### Complete Flow

```
1. Team submits → Status: PENDING
   ↓
2. Admin rejects → Status: REJECTED (with feedback)
   ↓
3. Team views feedback
   ↓
4. Team resubmits (before deadline) → Status: PENDING (feedback cleared)
   ↓
5. Admin reviews again → Status: APPROVED/REJECTED
```

---

## 📋 API Examples

### 1. Admin Rejects Deliverable

**Using New Format:**
```bash
POST /api/admin/deliverables/695fba71e354927bfa8087f7/reject
Content-Type: application/json

{
  "reason": "Missing technical specifications. Please add architecture diagram."
}

Response:
{
  "success": true,
  "message": "Deliverable rejected",
  "data": {
    "id": "695fba71e354927bfa8087f7",
    "status": "REJECTED",
    "feedback": "Missing technical specifications...",
    "reviewedAt": "2026-01-11T11:30:00Z",
    "reviewedBy": "admin_id"
  }
}
```

**Using Old Format (Works Too):**
```bash
POST /api/admin/teams/deliverables/695fba71e354927bfa8087f7/reject
Content-Type: application/json

{
  "reason": "Missing technical specifications. Please add architecture diagram."
}
```

### 2. Team Views Rejected Deliverable

```bash
GET /api/deliverables/695fba71e354927bfa8087f7?teamId=TEAM_ID

Response:
{
  "success": true,
  "data": {
    "id": "695fba71e354927bfa8087f7",
    "content": "https://storage.../proposal.pdf",
    "status": "REJECTED",
    "feedback": "Missing technical specifications. Please add architecture diagram.",
    "reviewedAt": "2026-01-11T11:30:00Z",
    "template": {
      "title": "Project Proposal",
      "dueDate": "2026-02-01T00:00:00Z"
    }
  }
}
```

### 3. Team Resubmits After Rejection

```bash
POST /api/deliverables/695fba71e354927bfa8087f7/submit
Content-Type: application/json

{
  "teamId": "team_id",
  "content": "https://storage.../proposal-v2.pdf",
  "contentType": "FILE",
  "description": "Updated with technical specifications and architecture diagram"
}

Response:
{
  "success": true,
  "message": "Deliverable submitted successfully",
  "data": {
    "id": "695fba71e354927bfa8087f7",
    "content": "https://storage.../proposal-v2.pdf",
    "status": "PENDING",        ← Status reset to PENDING
    "feedback": null,            ← Feedback cleared
    "reviewedAt": null,          ← Review cleared
    "reviewedBy": null,          ← Reviewer cleared
    "submittedAt": "2026-01-11T12:00:00Z"  ← New timestamp
  }
}
```

### 4. Admin Reviews Resubmission

```bash
POST /api/admin/deliverables/695fba71e354927bfa8087f7/approve

Response:
{
  "success": true,
  "message": "Deliverable approved",
  "data": {
    "id": "695fba71e354927bfa8087f7",
    "status": "APPROVED",
    "reviewedAt": "2026-01-11T13:00:00Z"
  }
}
```

---

## 🎨 Frontend Implementation

### Team View - Rejected Deliverable Card

```typescript
const RejectedDeliverableCard = ({ deliverable }: { deliverable: TeamDeliverable }) => {
  const deadlinePassed = new Date(deliverable.template.dueDate) < new Date();
  
  return (
    <div className="deliverable-card rejected">
      <h3>{deliverable.template.title}</h3>
      
      {/* Status Badge */}
      <span className="badge badge-rejected">
        REJECTED
      </span>
      
      {/* Feedback Section */}
      <div className="feedback-box">
        <h4>⚠️ Reviewer Feedback</h4>
        <p>{deliverable.feedback}</p>
        <p className="text-sm">
          Reviewed on: {new Date(deliverable.reviewedAt).toLocaleDateString()}
        </p>
      </div>
      
      {/* Resubmit Button */}
      {!deadlinePassed && (
        <button 
          onClick={() => navigate(`/submit/${deliverable.id}`)}
          className="btn-primary"
        >
          🔄 Resubmit with Changes
        </button>
      )}
      
      {deadlinePassed && (
        <p className="text-red">
          Deadline passed. Cannot resubmit.
        </p>
      )}
    </div>
  );
};
```

### Resubmission Form

```typescript
const ResubmitForm = ({ deliverable }: { deliverable: any }) => {
  const [content, setContent] = useState(deliverable.content || '');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const wasRejected = deliverable.status === 'REJECTED';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/deliverables/${deliverable.id}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        teamId: deliverable.teamId,
        content,
        contentType: deliverable.template.contentType,
        description,
      }),
    });

    const data = await res.json();
    
    if (data.success) {
      alert('Resubmitted successfully! Status reset to PENDING.');
      navigate('/deliverables');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Resubmit: {deliverable.template.title}</h2>
      
      {/* Show previous feedback if rejected */}
      {wasRejected && deliverable.feedback && (
        <div className="alert alert-warning">
          <h4>Previous Feedback:</h4>
          <p>{deliverable.feedback}</p>
          <p className="text-sm">
            Make sure to address all concerns before resubmitting.
          </p>
        </div>
      )}
      
      {/* File upload or other input */}
      {deliverable.template.contentType === 'FILE' && (
        <div>
          <label>Upload Updated File</label>
          <input 
            type="file" 
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <p className="text-sm">
            Current file: {deliverable.content}
          </p>
        </div>
      )}
      
      {/* Description */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="What did you change/improve?"
        rows={4}
        required
      />
      
      <button type="submit">
        {wasRejected ? 'Resubmit for Review' : 'Update Submission'}
      </button>
    </form>
  );
};
```

### Admin Review Interface

```typescript
const AdminReviewPanel = ({ deliverable }: { deliverable: any }) => {
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    
    // Using new format
    const res = await fetch(`/api/admin/deliverables/${deliverable.id}/approve`, {
      method: 'POST',
    });
    
    if (res.ok) {
      alert('Approved!');
      window.location.reload();
    }
    
    setLoading(false);
  };

  const handleReject = async () => {
    if (!feedback.trim()) {
      alert('Please provide feedback');
      return;
    }
    
    setLoading(true);
    
    // Using new format (or old format - both work!)
    const res = await fetch(`/api/admin/deliverables/${deliverable.id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: feedback }),
    });
    
    if (res.ok) {
      alert('Rejected with feedback');
      window.location.reload();
    }
    
    setLoading(false);
  };

  return (
    <div className="review-panel">
      <h3>Review: {deliverable.team.name}</h3>
      
      {/* Deliverable Content */}
      <div>
        <p><strong>Content:</strong></p>
        {deliverable.contentType === 'FILE' && (
          <a href={deliverable.content} target="_blank">
            📄 View File
          </a>
        )}
        {deliverable.contentType === 'URL' && (
          <a href={deliverable.content} target="_blank">
            🔗 {deliverable.content}
          </a>
        )}
        {deliverable.contentType === 'TEXT' && (
          <pre>{deliverable.content}</pre>
        )}
      </div>
      
      {/* Description */}
      {deliverable.description && (
        <p><strong>Team Notes:</strong> {deliverable.description}</p>
      )}
      
      {/* Feedback Input */}
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Provide feedback (required for rejection)"
        rows={4}
      />
      
      {/* Action Buttons */}
      <div className="actions">
        <button 
          onClick={handleApprove}
          disabled={loading}
          className="btn-success"
        >
          ✅ Approve
        </button>
        
        <button 
          onClick={handleReject}
          disabled={loading || !feedback.trim()}
          className="btn-danger"
        >
          ❌ Reject
        </button>
      </div>
    </div>
  );
};
```

---

## ✅ Status Transitions

### PENDING → APPROVED
```
Team submits → Admin approves
No further changes allowed
```

### PENDING → REJECTED
```
Team submits → Admin rejects with feedback
Team can resubmit (if before deadline)
```

### REJECTED → PENDING
```
Team resubmits with improvements
Admin must review again
Previous feedback cleared
```

### Special Cases
- ✅ **APPROVED** → Cannot be changed by team
- ✅ **REJECTED** → Can be resubmitted (before deadline)
- ✅ **PENDING** → Can be updated by team (before deadline)

---

## 🎯 Update Behavior

When team updates a deliverable:

| Original Status | New Status | Feedback | Review Data |
|----------------|------------|----------|-------------|
| PENDING | PENDING | Cleared | Cleared |
| REJECTED | PENDING | **Cleared** | **Cleared** |
| APPROVED | **Error** | - | - |

---

## 📊 Database State Changes

### Before Rejection
```json
{
  "status": "PENDING",
  "feedback": null,
  "reviewedAt": null,
  "reviewedBy": null
}
```

### After Rejection
```json
{
  "status": "REJECTED",
  "feedback": "Missing technical specs",
  "reviewedAt": "2026-01-11T11:30:00Z",
  "reviewedBy": "admin_id"
}
```

### After Resubmission
```json
{
  "status": "PENDING",          ← Reset
  "feedback": null,             ← Cleared
  "reviewedAt": null,           ← Cleared
  "reviewedBy": null,           ← Cleared
  "submittedAt": "2026-01-11T12:00:00Z"  ← Updated
}
```

---

## 🧪 Testing

### Test Rejection Flow

```bash
# 1. Admin rejects (old format)
curl -X POST http://localhost:5000/api/admin/teams/deliverables/DELIVERABLE_ID/reject \
  -H "Content-Type: application/json" \
  -d '{"reason": "Missing details"}'

# 2. Team views feedback
curl http://localhost:5000/api/deliverables/DELIVERABLE_ID?teamId=TEAM_ID

# 3. Team resubmits
curl -X POST http://localhost:5000/api/deliverables/DELIVERABLE_ID/submit \
  -H "Content-Type: application/json" \
  -d '{
    "teamId": "TEAM_ID",
    "content": "https://updated-file.pdf",
    "description": "Added missing details"
  }'

# 4. Verify status is PENDING
curl http://localhost:5000/api/deliverables/DELIVERABLE_ID?teamId=TEAM_ID
```

### Test New Format

```bash
# Using new format (shorter URLs)
curl -X POST http://localhost:5000/api/admin/deliverables/DELIVERABLE_ID/reject \
  -H "Content-Type: application/json" \
  -d '{"reason": "Needs improvement"}'
```

---

## 🎉 Benefits

### For Admins
✅ Both old and new route formats work
✅ No need to update frontend immediately
✅ Can provide constructive feedback
✅ Teams can improve before deadline

### For Teams
✅ Clear feedback on rejections
✅ Can resubmit improved work
✅ Status clearly shows PENDING after resubmission
✅ Know that admin will review again

---

## 📝 Important Notes

1. **Route Compatibility**: Both `/api/admin/deliverables/*` and `/api/admin/teams/deliverables/*` work
2. **Rejection Feedback**: Always cleared when team resubmits
3. **Status Reset**: Always PENDING after resubmission (even if was REJECTED)
4. **Deadline Check**: Still enforced - cannot resubmit after deadline
5. **Approved Protection**: Cannot update approved deliverables

---

**Status:** ✅ Routes Fixed & Rejection Flow Complete!  
**Backward Compatible:** ✅ Yes  
**Resubmission:** ✅ Supported  
**Version:** 2.2.1
