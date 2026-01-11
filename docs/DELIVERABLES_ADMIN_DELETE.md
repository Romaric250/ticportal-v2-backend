# 🗑️ Delete Approved Deliverables - Admin Power

## ✅ Updated Delete Permissions

### Admin Can Now Delete Approved Deliverables

**Previous Behavior:**
- ❌ Admin cannot delete approved deliverables
- Error: "Cannot delete approved deliverable"

**New Behavior:**
- ✅ Admin can delete ANY deliverable (including approved)
- ✅ Students still cannot delete approved deliverables
- ✅ Students still cannot delete after deadline

---

## 🔒 Delete Rules

### For Students/Teams
- ✅ Can delete their own submissions
- ✅ Only before deadline
- ❌ **Cannot delete approved deliverables**
- ❌ Cannot delete other team's submissions
- ✅ Resets to empty state

### For Admins
- ✅ Can delete any team's submission
- ✅ Can delete even after deadline
- ✅ **Can delete approved deliverables** ← NEW!
- ✅ Can delete rejected/pending deliverables
- ✅ Resets to empty state

---

## 🎯 Use Cases for Deleting Approved Deliverables

### When Admin Needs to Delete Approved Submissions

1. **Mistake in Approval**
   - Admin approved wrong deliverable
   - Need to reset and have team resubmit

2. **Content Issues**
   - Approved content violates rules
   - Need to remove immediately

3. **Team Request**
   - Team wants to change approach
   - Admin agrees to reset

4. **Testing/Demo**
   - Need to reset for demonstration
   - Clean slate for testing

---

## 📋 API Examples

### Admin Deletes Approved Deliverable

```bash
DELETE /api/admin/deliverables/69639085df11670edc742946

Response (Success):
{
  "success": true,
  "message": "Submission deleted successfully",
  "data": {
    "id": "69639085df11670edc742946",
    "content": "",              ← Reset to empty
    "status": "PENDING",        ← Reset from APPROVED
    "feedback": null,           ← Cleared
    "reviewedAt": null,         ← Cleared
    "reviewedBy": null,         ← Cleared
    "team": {
      "id": "team_id",
      "name": "Team Alpha"
    }
  }
}
```

### Student Tries to Delete Approved Deliverable

```bash
DELETE /api/deliverables/DELIVERABLE_ID
Body: { "teamId": "team_id" }

Response (Error - 400):
{
  "success": false,
  "message": "Cannot delete approved deliverable"
}
```

### Admin Deletes Using Old Route Format

```bash
# Both formats work
DELETE /api/admin/deliverables/DELIVERABLE_ID
DELETE /api/admin/teams/deliverables/DELIVERABLE_ID

# ✅ Both will delete approved deliverables
```

---

## 🔄 What Happens When Deleting Approved

### Before Delete
```json
{
  "id": "deliverable_id",
  "content": "https://storage.../proposal.pdf",
  "status": "APPROVED",
  "feedback": "Excellent work!",
  "reviewedAt": "2026-01-10T14:00:00Z",
  "reviewedBy": "admin_id"
}
```

### After Delete (Admin)
```json
{
  "id": "deliverable_id",
  "content": "",                ← Empty
  "status": "PENDING",          ← Reset
  "feedback": null,             ← Cleared
  "reviewedAt": null,           ← Cleared
  "reviewedBy": null,           ← Cleared
  "submittedAt": "2026-01-11T12:20:00Z"  ← Updated
}
```

**Result:** Team can now submit fresh content

---

## ⚠️ Important Notes

### Admin Responsibility
- **Use Carefully:** Deleting approved deliverables removes the approval status
- **Communication:** Inform the team why their approved work was reset
- **Documentation:** Keep notes on why deletion was necessary

### What Gets Reset
- ✅ Content → Empty string
- ✅ Status → PENDING
- ✅ Feedback → Null
- ✅ Review data → Cleared
- ✅ Description → Null
- ❌ Team assignment → Kept
- ❌ Template link → Kept

### What Doesn't Change
- Team can still see the deliverable requirement
- Deadline remains the same
- Template properties unchanged
- Team-deliverable relationship preserved

---

## 🧪 Testing

### Test 1: Admin Deletes Approved Deliverable

```bash
# 1. Approve a deliverable
curl -X POST http://localhost:5000/api/admin/deliverables/DELIVERABLE_ID/approve

# 2. Delete it (should work now!)
curl -X DELETE http://localhost:5000/api/admin/deliverables/DELIVERABLE_ID

# ✅ Should succeed: "Submission deleted successfully"
```

### Test 2: Student Cannot Delete Approved

```bash
# 1. Team's deliverable is approved
# Status: APPROVED

# 2. Team tries to delete
curl -X DELETE http://localhost:5000/api/deliverables/DELIVERABLE_ID \
  -H "Content-Type: application/json" \
  -d '{"teamId": "TEAM_ID"}'

# ❌ Should fail: "Cannot delete approved deliverable"
```

### Test 3: Admin Deletes After Deadline

```bash
# Deadline has passed, but admin can still delete
curl -X DELETE http://localhost:5000/api/admin/deliverables/DELIVERABLE_ID

# ✅ Should succeed (admin has override power)
```

---

## 📊 Permission Matrix

| Action | Student (Before Deadline) | Student (After Deadline) | Admin |
|--------|--------------------------|-------------------------|-------|
| Delete PENDING | ✅ | ❌ | ✅ |
| Delete REJECTED | ✅ | ❌ | ✅ |
| Delete APPROVED | ❌ | ❌ | ✅ |
| Delete After Deadline | ❌ | ❌ | ✅ |

---

## 🔄 Complete Flow After Admin Deletion

```
1. Team submits content
   Status: PENDING

2. Admin approves
   Status: APPROVED

3. Admin realizes mistake and deletes
   Status: PENDING, Content: "" (empty)

4. Team receives notification (TODO)
   "Your submission was reset by admin"

5. Team resubmits fresh content
   Status: PENDING

6. Admin reviews and approves again
   Status: APPROVED
```

---

## 🎨 Frontend Implementation

### Admin Delete Button (Works for Approved)

```typescript
const AdminDeliverableRow = ({ deliverable }: { deliverable: any }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirmMsg = deliverable.status === 'APPROVED' 
      ? `⚠️ This deliverable is APPROVED. Are you sure you want to reset it?`
      : `Delete ${deliverable.team.name}'s submission?`;
    
    if (!confirm(confirmMsg)) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/admin/deliverables/${deliverable.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.success) {
        alert('Submission deleted and reset to empty!');
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
      <td>
        <span className={`badge ${deliverable.status.toLowerCase()}`}>
          {deliverable.status}
        </span>
      </td>
      <td>
        {/* Show warning if approved */}
        <button 
          onClick={handleDelete}
          disabled={loading}
          className={`btn-danger ${deliverable.status === 'APPROVED' ? 'btn-warning' : ''}`}
        >
          {deliverable.status === 'APPROVED' ? '⚠️ Reset Approved' : '🗑️ Delete'}
        </button>
      </td>
    </tr>
  );
};
```

---

## ✅ Updated Routes Summary

### Admin Delete (All Formats)
```bash
# New format
DELETE /api/admin/deliverables/:id
# ✅ Can delete approved

# Old format
DELETE /api/admin/teams/deliverables/:id
# ✅ Can delete approved
```

### Student Delete
```bash
DELETE /api/deliverables/:id
Body: { "teamId": "team_id" }
# ❌ Cannot delete approved
```

---

## 🎯 Best Practices

### When to Delete Approved Deliverables

**Good Reasons:**
- ✅ Approved by mistake
- ✅ Content violates policies
- ✅ Team made formal request
- ✅ Need to reset for resubmission

**Think Twice:**
- ⚠️ Just for testing (use test data instead)
- ⚠️ Minor content issues (rejection with feedback is better)
- ⚠️ Without team communication

### After Deletion

1. **Notify the Team:** Explain why their approved work was reset
2. **Set Clear Expectations:** Tell them what needs to be resubmitted
3. **Extend Deadline (if needed):** Give them time to redo work
4. **Document the Reason:** Keep admin notes for reference

---

**Status:** ✅ Admin Can Delete Approved Deliverables!  
**Student Protection:** ✅ Students still cannot delete approved  
**Admin Power:** ✅ Full delete permissions  
**Version:** 2.3.3
