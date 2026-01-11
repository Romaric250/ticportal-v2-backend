# 🗑️ Delete Deliverable Submissions - Complete Guide

## ✅ New Feature: Delete Submission

Teams and admins can now delete deliverable submissions (reset to empty state).

**Important:** This doesn't delete the deliverable record, it just resets the content to empty.

---

## 🛣️ Delete Routes

### Admin Delete (2 formats)
```bash
# New format
DELETE /api/admin/deliverables/:deliverableId

# Old format (backward compatible)
DELETE /api/admin/teams/deliverables/:deliverableId
```

### Student/Team Delete
```bash
DELETE /api/deliverables/:deliverableId
Body: { "teamId": "team_id" }
```

---

## 📋 API Examples

### 1. Student Deletes Submission

```bash
DELETE /api/deliverables/DELIVERABLE_ID
Content-Type: application/json

{
  "teamId": "team_id"
}

Response:
{
  "success": true,
  "message": "Submission deleted successfully",
  "data": {
    "id": "deliverable_id",
    "content": "",              ← Reset to empty
    "description": null,        ← Cleared
    "status": "PENDING",        ← Reset
    "feedback": null,           ← Cleared
    "reviewedAt": null,         ← Cleared
    "reviewedBy": null,         ← Cleared
    "submittedAt": "2026-01-11T14:00:00Z"  ← Updated
  }
}
```

### 2. Admin Deletes Submission

```bash
DELETE /api/admin/deliverables/DELIVERABLE_ID

Response:
{
  "success": true,
  "message": "Submission deleted successfully",
  "data": {
    "id": "deliverable_id",
    "content": "",
    "status": "PENDING"
  }
}
```

### 3. Try to Delete After Deadline (Student)

```bash
DELETE /api/deliverables/DELIVERABLE_ID
Body: { "teamId": "team_id" }

Response (400 Bad Request):
{
  "success": false,
  "message": "Deadline has passed. Cannot delete submission."
}
```

### 4. Try to Delete Approved Deliverable

```bash
DELETE /api/deliverables/DELIVERABLE_ID
Body: { "teamId": "team_id" }

Response (400 Bad Request):
{
  "success": false,
  "message": "Cannot delete approved deliverable"
}
```

---

## ✅ Delete Rules

### For Students/Teams
- ✅ Can delete their own submissions
- ✅ Only before deadline
- ✅ Cannot delete approved deliverables
- ✅ Cannot delete other team's submissions
- ✅ Resets to empty state (not actual deletion)

### For Admins
- ✅ Can delete any team's submission
- ✅ Can delete even after deadline
- ✅ Cannot delete approved deliverables
- ✅ Resets to empty state (not actual deletion)

---

## 🔄 What Happens When Deleted

The deliverable is **reset to empty state**, not actually deleted:

| Field | Before | After Delete |
|-------|--------|--------------|
| `content` | "https://file.pdf" | "" (empty) |
| `description` | "Our proposal" | `null` |
| `status` | PENDING/REJECTED | PENDING |
| `feedback` | "Needs work" | `null` |
| `reviewedAt` | timestamp | `null` |
| `reviewedBy` | admin_id | `null` |
| `submittedAt` | old timestamp | new timestamp |

**Why reset instead of delete?**
- Keeps the deliverable requirement for the team
- Maintains data integrity
- Allows team to resubmit
- Preserves the template-team relationship

---

## 🎨 Frontend Implementation

### Delete Button in Deliverable Card

```typescript
const DeliverableCard = ({ deliverable, teamId }: { deliverable: any; teamId: string }) => {
  const [loading, setLoading] = useState(false);
  
  const isSubmitted = deliverable.content && deliverable.content.length > 0;
  const deadlinePassed = new Date(deliverable.template.dueDate) < new Date();
  const canDelete = isSubmitted && !deadlinePassed && deliverable.status !== 'APPROVED';

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this submission? This will reset it to empty.')) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/deliverables/${deliverable.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId }),
      });

      const data = await res.json();

      if (data.success) {
        alert('Submission deleted successfully!');
        window.location.reload();
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Failed to delete submission');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="deliverable-card">
      <h3>{deliverable.template.title}</h3>
      
      {/* Status Badge */}
      <span className={`badge ${deliverable.status.toLowerCase()}`}>
        {deliverable.status}
      </span>
      
      {/* Content */}
      {isSubmitted && (
        <div>
          <p>📄 Submitted: {deliverable.content}</p>
          <p className="text-sm">
            {new Date(deliverable.submittedAt).toLocaleString()}
          </p>
        </div>
      )}
      
      {/* Actions */}
      <div className="actions">
        {!isSubmitted && !deadlinePassed && (
          <button onClick={() => navigate(`/submit/${deliverable.id}`)}>
            Submit Now
          </button>
        )}
        
        {isSubmitted && !deadlinePassed && deliverable.status !== 'APPROVED' && (
          <>
            <button onClick={() => navigate(`/submit/${deliverable.id}`)}>
              Update Submission
            </button>
            
            {canDelete && (
              <button 
                onClick={handleDelete}
                disabled={loading}
                className="btn-danger"
              >
                {loading ? 'Deleting...' : '🗑️ Delete'}
              </button>
            )}
          </>
        )}
      </div>
      
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

### Admin Delete Button

```typescript
const AdminDeliverableRow = ({ deliverable }: { deliverable: any }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete ${deliverable.team.name}'s submission?`)) {
      return;
    }

    setLoading(true);

    try {
      // Using new format
      const res = await fetch(`/api/admin/deliverables/${deliverable.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.success) {
        alert('Submission deleted successfully!');
        window.location.reload();
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Failed to delete submission');
    } finally {
      setLoading(false);
    }
  };

  return (
    <tr>
      <td>{deliverable.team.name}</td>
      <td>{deliverable.template.title}</td>
      <td>
        <span className={`badge ${deliverable.status.toLowerCase()}`}>
          {deliverable.status}
        </span>
      </td>
      <td>{deliverable.content || '(Empty)'}</td>
      <td>
        <button onClick={handleApprove}>✅ Approve</button>
        <button onClick={handleReject}>❌ Reject</button>
        {deliverable.status !== 'APPROVED' && (
          <button 
            onClick={handleDelete}
            disabled={loading}
            className="btn-danger"
          >
            🗑️ Delete
          </button>
        )}
      </td>
    </tr>
  );
};
```

---

## 🔄 Complete Flow with Delete

### Workflow 1: Student Submits then Deletes

```
1. Team submits
   Status: PENDING, Content: "file.pdf"

2. Team realizes mistake
   Team clicks "Delete"

3. Submission deleted
   Status: PENDING, Content: "" (empty)

4. Team can resubmit
   Fresh start
```

### Workflow 2: Rejected then Deleted

```
1. Team submits
   Status: PENDING

2. Admin rejects
   Status: REJECTED, Feedback: "Missing info"

3. Team deletes instead of updating
   Status: PENDING, Content: "" (empty), Feedback: null

4. Team starts fresh
   Can submit new content
```

### Workflow 3: Admin Deletes Team's Submission

```
1. Team submits wrong content
   Team contacts admin

2. Admin deletes submission
   Status: PENDING, Content: "" (empty)

3. Team can resubmit
   Fresh start
```

---

## 📊 Response Comparison

### Before Delete
```json
{
  "id": "deliverable_id",
  "teamId": "team_id",
  "content": "https://storage.../file.pdf",
  "description": "Our proposal",
  "status": "PENDING",
  "feedback": null,
  "submittedAt": "2026-01-10T10:00:00Z"
}
```

### After Delete
```json
{
  "id": "deliverable_id",
  "teamId": "team_id",
  "content": "",                    ← Empty
  "description": null,              ← Cleared
  "status": "PENDING",              ← Reset
  "feedback": null,                 ← Cleared
  "submittedAt": "2026-01-11T14:00:00Z"  ← Updated
}
```

---

## 🧪 Testing

```bash
# 1. Student submits
curl -X POST http://localhost:5000/api/deliverables/DELIVERABLE_ID/submit \
  -H "Content-Type: application/json" \
  -d '{
    "teamId": "TEAM_ID",
    "content": "https://file.pdf"
  }'

# 2. Student deletes
curl -X DELETE http://localhost:5000/api/deliverables/DELIVERABLE_ID \
  -H "Content-Type: application/json" \
  -d '{"teamId": "TEAM_ID"}'

# 3. Verify it's empty
curl http://localhost:5000/api/deliverables/DELIVERABLE_ID?teamId=TEAM_ID

# 4. Admin deletes any submission
curl -X DELETE http://localhost:5000/api/admin/deliverables/DELIVERABLE_ID

# 5. Try to delete after deadline (should fail)
curl -X DELETE http://localhost:5000/api/deliverables/DELIVERABLE_ID \
  -H "Content-Type: application/json" \
  -d '{"teamId": "TEAM_ID"}'
```

---

## ✅ All Deliverable Routes (Updated)

### Admin Routes (12 endpoints)

**Templates:**
```
GET    /api/admin/deliverable-templates
GET    /api/admin/deliverable-templates/:id
POST   /api/admin/deliverable-templates
PUT    /api/admin/deliverable-templates/:id
DELETE /api/admin/deliverable-templates/:id
```

**Submissions (New Format):**
```
GET    /api/admin/deliverables
POST   /api/admin/deliverables/:teamId
POST   /api/admin/deliverables/:id/approve
POST   /api/admin/deliverables/:id/reject
DELETE /api/admin/deliverables/:id              ← NEW!
```

**Submissions (Old Format):**
```
GET    /api/admin/teams/deliverables
POST   /api/admin/teams/:teamId/deliverables
POST   /api/admin/teams/deliverables/:id/approve
POST   /api/admin/teams/deliverables/:id/reject
DELETE /api/admin/teams/deliverables/:id        ← NEW!
```

### Student Routes (6 endpoints)

```
GET    /api/deliverable-templates
GET    /api/deliverables/team/:teamId
GET    /api/deliverables/:id
POST   /api/deliverables/:id/submit
DELETE /api/deliverables/:id                    ← NEW!
GET    /api/deliverables/:id/deadline
```

---

## 🎯 Use Cases

### When to Delete

**Students:**
- Uploaded wrong file
- Want to start fresh after rejection
- Accidentally submitted incomplete work
- Need to completely redo the deliverable

**Admins:**
- Team requested to reset their submission
- Submission contains inappropriate content
- Want to give team a clean slate
- Need to remove problematic submission

---

## 📝 Important Notes

1. **Not Actual Deletion:** Resets content to empty, keeps the record
2. **Deadline Check:** Students cannot delete after deadline, admins can
3. **Approved Protection:** Cannot delete approved deliverables (even admin)
4. **Team Verification:** Students can only delete their own team's submissions
5. **Status Reset:** Always resets to PENDING
6. **Feedback Cleared:** All review data is removed

---

## 🎉 Benefits

### For Students
✅ Can fix mistakes quickly
✅ Start fresh instead of updating
✅ Remove wrong submissions
✅ Clean slate after rejection

### For Admins
✅ Help teams reset submissions
✅ Remove problematic content
✅ Maintain data integrity
✅ Override deadline restrictions

---

**Status:** ✅ Delete Feature Complete!  
**Total Routes:** 18 (12 admin + 6 student)  
**Safety:** ✅ Deadline checks, authorization, approved protection  
**Version:** 2.3.0
