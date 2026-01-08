# Admin API Documentation

Complete API reference for admin dashboard, user management, team management, learning paths, and team deliverables.

---

## Table of Contents

1. [Authentication](#authentication)
2. [Admin Dashboard](#admin-dashboard)
3. [User Management](#user-management)
4. [Team Management](#team-management)
5. [Team Deliverables](#team-deliverables)
6. [Learning Path Management](#learning-path-management)
7. [Error Responses](#error-responses)

---

## Authentication

All endpoints require authentication via Bearer token in the Authorization header:

```http
Authorization: Bearer {accessToken}
```

**Admin Role Required**: Most endpoints require `ADMIN` or `SUPER_ADMIN` role.

---

## Admin Dashboard

### Get Dashboard Statistics

**Endpoint:** `GET /api/admin/stats`

**Description:** Get overview statistics for the admin dashboard.

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalUsers": 1205,
    "pendingApprovals": 24,
    "mentorsAndLeads": 45,
    "unassignedJudges": 12,
    "totalUsersChange": 12
  }
}
```

---

### Get Detailed Dashboard Statistics

**Endpoint:** `GET /api/admin/dashboard-stats`

**Description:** Get detailed statistics with charts data.

**Response:**
```json
{
  "success": true,
  "data": {
    "usersByRole": [
      { "role": "STUDENT", "count": 1000 },
      { "role": "MENTOR", "count": 150 },
      { "role": "JUDGE", "count": 50 },
      { "role": "ADMIN", "count": 5 }
    ],
    "usersByStatus": [
      { "status": "ACTIVE", "count": 1100 },
      { "status": "PENDING", "count": 24 },
      { "status": "SUSPENDED", "count": 81 }
    ],
    "usersOverTime": [
      { "date": "2026-01-01", "users": 1000 },
      { "date": "2026-01-02", "users": 1050 },
      { "date": "2026-01-03", "users": 1100 }
    ],
    "teamsCount": 250,
    "activeTeams": 230
  }
}
```

---

## User Management

### Get Users

**Endpoint:** `GET /api/admin/users`

**Description:** Get users with pagination and filters.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page |
| `role` | string | - | Filter by role (STUDENT, MENTOR, JUDGE, ADMIN) |
| `jurisdiction` | string | - | Filter by region/jurisdiction |
| `status` | string | - | Filter by status (ACTIVE, PENDING, SUSPENDED, INACTIVE) |
| `search` | string | - | Search by name, email, school, or ID |

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/admin/users?page=1&limit=20&role=STUDENT&status=ACTIVE&search=john" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "id": "674a3c2e5d8f9b1234567890",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "username": "johndoe",
      "profilePhoto": "https://example.com/photo.jpg",
      "role": "STUDENT",
      "school": "Example High School",
      "region": "North Region",
      "isVerified": true,
      "status": "ACTIVE",
      "createdAt": "2026-01-01T00:00:00Z",
      "lastLogin": "2026-01-05T10:00:00Z",
      "affiliation": "Team Alpha",
      "jurisdiction": "North Region Area B"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1205,
    "totalPages": 61
  }
}
```

---

### Get Single User

**Endpoint:** `GET /api/admin/users/:userId`

**Description:** Get detailed information about a specific user.

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/admin/users/674a3c2e5d8f9b1234567890" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "674a3c2e5d8f9b1234567890",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "STUDENT",
    "status": "ACTIVE",
    "school": "Example High School",
    "region": "North Region",
    "isVerified": true,
    "createdAt": "2026-01-01T00:00:00Z",
    "lastLogin": "2026-01-05T10:00:00Z",
    "teamMembers": [
      {
        "id": "team_member_id",
        "team": {
          "id": "team_id",
          "name": "Team Alpha"
        },
        "role": "MEMBER"
      }
    ]
  }
}
```

---

### Create User

**Endpoint:** `POST /api/admin/users`

**Description:** Create a new user (admin only).

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "STUDENT",
  "school": "Example High School",
  "region": "North Region",
  "password": "optional-password"
}
```

**Example Request:**
```bash
curl -X POST "http://localhost:5000/api/admin/users" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "STUDENT",
    "school": "Example High School",
    "region": "North Region"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "674a3c2e5d8f9b1234567891",
    "email": "newuser@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "STUDENT",
    "status": "ACTIVE",
    "isVerified": true,
    "createdAt": "2026-01-07T10:00:00Z"
  }
}
```

**Notes:**
- If password is not provided, a random password is generated
- User receives a welcome email with credentials
- 10 points awarded for account creation

---

### Update User

**Endpoint:** `PUT /api/admin/users/:userId`

**Description:** Update user details (admin override).

**Request Body:**
```json
{
  "role": "MENTOR",
  "status": "ACTIVE",
  "school": "New School",
  "region": "South Region",
  "isVerified": true
}
```

**Example Request:**
```bash
curl -X PUT "http://localhost:5000/api/admin/users/674a3c2e5d8f9b1234567890" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "MENTOR",
    "status": "ACTIVE"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "674a3c2e5d8f9b1234567890",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "MENTOR",
    "status": "ACTIVE",
    "updatedAt": "2026-01-07T11:00:00Z"
  }
}
```

**Notes:**
- User receives notification about role/status change
- Activity logged

---

### Delete User

**Endpoint:** `DELETE /api/admin/users/:userId`

**Description:** Delete a user permanently.

**Example Request:**
```bash
curl -X DELETE "http://localhost:5000/api/admin/users/674a3c2e5d8f9b1234567890" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Notes:**
- Cascades to delete all user data
- Cannot be undone
- Team memberships removed

---

### Import Users from CSV

**Endpoint:** `POST /api/admin/users/import`

**Description:** Bulk import users from CSV file.

**Request:** `multipart/form-data`
- `file` (File): CSV file

**CSV Format:**
```csv
email,firstName,lastName,role,school,region
user1@example.com,John,Doe,STUDENT,School A,North
user2@example.com,Jane,Smith,STUDENT,School B,South
```

**Example Request:**
```bash
curl -X POST "http://localhost:5000/api/admin/users/import" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@users.csv"
```

**Response:**
```json
{
  "success": true,
  "imported": 50,
  "errors": 2,
  "errorDetails": [
    {
      "row": 3,
      "email": "invalid@example.com",
      "error": "Email already exists"
    }
  ]
}
```

---

## Team Management

### Get All Teams

**Endpoint:** `GET /api/admin/teams`

**Description:** Get all teams with pagination and filters.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page |
| `school` | string | - | Filter by school |
| `status` | string | - | Filter by status |
| `search` | string | - | Search by team name or project title |

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/admin/teams?page=1&limit=20&search=alpha" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "teams": [
    {
      "id": "674a3c2e5d8f9b1234567892",
      "name": "Team Alpha",
      "school": "Example High School",
      "projectTitle": "AI-Powered Learning Platform",
      "description": "Building an AI tool for education",
      "profileImage": "https://example.com/team.jpg",
      "members": [
        {
          "id": "member_id",
          "userId": "user_id",
          "role": "LEAD",
          "user": {
            "id": "user_id",
            "firstName": "John",
            "lastName": "Doe",
            "email": "john@example.com",
            "profilePhoto": "https://example.com/photo.jpg"
          }
        }
      ],
      "createdAt": "2026-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 250,
    "totalPages": 13
  }
}
```

---

### Get Team Details

**Endpoint:** `GET /api/admin/teams/:teamId`

**Description:** Get detailed information about a specific team.

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/admin/teams/674a3c2e5d8f9b1234567892" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "674a3c2e5d8f9b1234567892",
    "name": "Team Alpha",
    "school": "Example High School",
    "projectTitle": "AI-Powered Learning Platform",
    "description": "Building an AI tool for education",
    "profileImage": "https://example.com/team.jpg",
    "members": [...],
    "deliverables": [...],
    "createdAt": "2026-01-01T00:00:00Z"
  }
}
```

---

### Update Team

**Endpoint:** `PUT /api/admin/teams/:teamId`

**Description:** Update team information (admin override).

**Request Body:**
```json
{
  "name": "Updated Team Name",
  "projectTitle": "Updated Project Title",
  "description": "Updated description"
}
```

**Example Request:**
```bash
curl -X PUT "http://localhost:5000/api/admin/teams/674a3c2e5d8f9b1234567892" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Team Name",
    "projectTitle": "New Project"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "674a3c2e5d8f9b1234567892",
    "name": "Updated Team Name",
    "projectTitle": "New Project",
    "updatedAt": "2026-01-07T12:00:00Z"
  }
}
```

---

### Delete Team

**Endpoint:** `DELETE /api/admin/teams/:teamId`

**Description:** Delete a team (admin only).

**Example Request:**
```bash
curl -X DELETE "http://localhost:5000/api/admin/teams/674a3c2e5d8f9b1234567892" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "message": "Team deleted successfully"
}
```

**Notes:**
- Cannot delete teams with submissions
- All team members notified
- Team chat history preserved

---

## Team Deliverables

### Get All Deliverable Templates

**Endpoint:** `GET /api/admin/deliverable-templates`

**Description:** Get all deliverable templates (requirements created by admin).

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/admin/deliverable-templates" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "674a3c2e5d8f9b1234567893",
      "title": "Project Proposal",
      "description": "Submit your initial project proposal",
      "type": "PROPOSAL",
      "hackathonId": "hackathon_id",
      "dueDate": "2026-02-01T00:00:00Z",
      "required": true,
      "createdAt": "2026-01-01T00:00:00Z",
      "updatedAt": "2026-01-01T00:00:00Z"
    }
  ]
}
```

---

### Create Deliverable Template

**Endpoint:** `POST /api/admin/deliverable-templates`

**Description:** Create a new deliverable template (requirement).

**Request Body:**
```json
{
  "title": "Project Proposal",
  "description": "Submit your initial project proposal",
  "type": "PROPOSAL",
  "hackathonId": "hackathon_id",
  "dueDate": "2026-02-01T00:00:00Z",
  "required": true
}
```

**Deliverable Types:**
- `PROPOSAL` - Initial project proposal
- `PROTOTYPE` - Prototype submission
- `FINAL_SUBMISSION` - Final project submission
- `DOCUMENTATION` - Project documentation

**Example Request:**
```bash
curl -X POST "http://localhost:5000/api/admin/deliverable-templates" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Project Proposal",
    "description": "Submit your initial project proposal",
    "type": "PROPOSAL",
    "dueDate": "2026-02-01T00:00:00Z",
    "required": true
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "674a3c2e5d8f9b1234567893",
    "title": "Project Proposal",
    "description": "Submit your initial project proposal",
    "type": "PROPOSAL",
    "dueDate": "2026-02-01T00:00:00Z",
    "required": true,
    "createdAt": "2026-01-07T13:00:00Z"
  }
}
```

**Notes:**
- All teams notified about new requirement
- Deadline reminders sent 3 days before

---

### Update Deliverable Template

**Endpoint:** `PUT /api/admin/deliverable-templates/:templateId`

**Description:** Update deliverable template.

**Request Body:**
```json
{
  "title": "Updated Title",
  "dueDate": "2026-02-15T00:00:00Z",
  "required": false
}
```

**Example Request:**
```bash
curl -X PUT "http://localhost:5000/api/admin/deliverable-templates/674a3c2e5d8f9b1234567893" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "dueDate": "2026-02-15T00:00:00Z"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "674a3c2e5d8f9b1234567893",
    "title": "Project Proposal",
    "dueDate": "2026-02-15T00:00:00Z",
    "updatedAt": "2026-01-07T14:00:00Z"
  }
}
```

---

### Delete Deliverable Template

**Endpoint:** `DELETE /api/admin/deliverable-templates/:templateId`

**Description:** Delete deliverable template.

**Example Request:**
```bash
curl -X DELETE "http://localhost:5000/api/admin/deliverable-templates/674a3c2e5d8f9b1234567893" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "message": "Template deleted successfully"
}
```

**Notes:**
- Cannot delete if submissions exist
- Teams notified about cancellation

---

### Get All Team Deliverables

**Endpoint:** `GET /api/admin/teams/deliverables`

**Description:** Get all team deliverables (submissions) with filters.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `status` | string | - | Filter by status (PENDING, APPROVED, REJECTED) |
| `hackathon` | string | - | Filter by hackathon ID |
| `search` | string | - | Search by team name or project title |

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/admin/teams/deliverables?status=PENDING" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "674a3c2e5d8f9b1234567894",
      "teamId": "team_id",
      "teamName": "Team Alpha",
      "projectTitle": "AI Learning Platform",
      "templateId": "template_id",
      "type": "PROPOSAL",
      "fileUrl": "https://storage.example.com/file.pdf",
      "description": "Our project proposal document",
      "status": "PENDING",
      "submittedAt": "2026-01-05T10:00:00Z",
      "feedback": null,
      "hackathonId": "hackathon_id"
    }
  ]
}
```

---

### Upload Deliverable for Team (Admin)

**Endpoint:** `POST /api/admin/teams/:teamId/deliverables`

**Description:** Admin uploads deliverable on behalf of a team.

**Request:** `multipart/form-data`
- `templateId` (string, required): ID of the deliverable template
- `file` (File, required): The deliverable file (PDF, DOC, DOCX, ZIP)
- `description` (string, optional): Description

**Example Request:**
```bash
curl -X POST "http://localhost:5000/api/admin/teams/674a3c2e5d8f9b1234567892/deliverables" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "templateId=674a3c2e5d8f9b1234567893" \
  -F "file=@proposal.pdf" \
  -F "description=Team proposal document"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "674a3c2e5d8f9b1234567894",
    "teamId": "674a3c2e5d8f9b1234567892",
    "templateId": "674a3c2e5d8f9b1234567893",
    "type": "PROPOSAL",
    "fileUrl": "https://storage.example.com/deliverables/file.pdf",
    "description": "Team proposal document",
    "status": "PENDING",
    "submittedAt": "2026-01-07T15:00:00Z"
  }
}
```

**File Requirements:**
- Max size: 10MB
- Allowed types: PDF, DOC, DOCX, ZIP
- Stored securely in cloud storage

---

### Approve Deliverable

**Endpoint:** `POST /api/admin/teams/deliverables/:deliverableId/approve`

**Description:** Approve a team deliverable.

**Example Request:**
```bash
curl -X POST "http://localhost:5000/api/admin/teams/deliverables/674a3c2e5d8f9b1234567894/approve" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "message": "Deliverable approved",
  "data": {
    "id": "674a3c2e5d8f9b1234567894",
    "status": "APPROVED",
    "reviewedAt": "2026-01-07T16:00:00Z",
    "reviewedBy": "admin_user_id"
  }
}
```

**Notes:**
- Team members notified
- 25 points awarded to all team members
- +10 bonus points if submitted early (>3 days before deadline)

---

### Reject Deliverable

**Endpoint:** `POST /api/admin/teams/deliverables/:deliverableId/reject`

**Description:** Reject a team deliverable with feedback.

**Request Body:**
```json
{
  "reason": "Incomplete documentation. Please include technical specifications."
}
```

**Example Request:**
```bash
curl -X POST "http://localhost:5000/api/admin/teams/deliverables/674a3c2e5d8f9b1234567894/reject" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Incomplete documentation"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Deliverable rejected",
  "data": {
    "id": "674a3c2e5d8f9b1234567894",
    "status": "REJECTED",
    "feedback": "Incomplete documentation",
    "reviewedAt": "2026-01-07T16:30:00Z",
    "reviewedBy": "admin_user_id"
  }
}
```

**Notes:**
- Team members notified with feedback
- Team can resubmit

---

### Get Deliverable Templates (Student/Team)

**Endpoint:** `GET /api/teams/deliverable-templates`

**Description:** Get available deliverable templates for teams.

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/teams/deliverable-templates" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "674a3c2e5d8f9b1234567893",
      "title": "Project Proposal",
      "description": "Submit your initial project proposal",
      "type": "PROPOSAL",
      "hackathonId": "hackathon_id",
      "dueDate": "2026-02-01T00:00:00Z",
      "required": true,
      "createdAt": "2026-01-01T00:00:00Z"
    }
  ]
}
```

---

### Get Team Deliverables (Student/Team)

**Endpoint:** `GET /api/teams/:teamId/deliverables`

**Description:** Get submitted deliverables for a specific team.

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/teams/674a3c2e5d8f9b1234567892/deliverables" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "674a3c2e5d8f9b1234567894",
      "teamId": "674a3c2e5d8f9b1234567892",
      "templateId": "674a3c2e5d8f9b1234567893",
      "type": "PROPOSAL",
      "fileUrl": "https://storage.example.com/file.pdf",
      "description": "Our proposal",
      "status": "APPROVED",
      "submittedAt": "2026-01-05T10:00:00Z",
      "reviewedAt": "2026-01-07T16:00:00Z",
      "feedback": null
    }
  ]
}
```

---

### Upload Deliverable (Student Submission)

**Endpoint:** `POST /api/teams/:teamId/deliverables`

**Description:** Upload a deliverable submission for a template requirement.

**Request:** `multipart/form-data`
- `templateId` (string, required): ID of the deliverable template
- `file` (File, required): The deliverable file
- `description` (string, optional): Description

**Example Request:**
```bash
curl -X POST "http://localhost:5000/api/teams/674a3c2e5d8f9b1234567892/deliverables" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "templateId=674a3c2e5d8f9b1234567893" \
  -F "file=@proposal.pdf" \
  -F "description=Our project proposal"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "674a3c2e5d8f9b1234567894",
    "teamId": "674a3c2e5d8f9b1234567892",
    "templateId": "674a3c2e5d8f9b1234567893",
    "type": "PROPOSAL",
    "fileUrl": "https://storage.example.com/file.pdf",
    "description": "Our project proposal",
    "status": "PENDING",
    "submittedAt": "2026-01-07T17:00:00Z"
  }
}
```

**Notes:**
- Only team leads or members can submit
- 15 points awarded on submission
- Admins/reviewers notified

---

## Learning Path Management

### Get All Learning Paths

**Endpoint:** `GET /api/admin/learning-paths`

**Description:** Get all learning paths.

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/admin/learning-paths" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "674a3c2e5d8f9b1234567895",
      "title": "Introduction to Web Development",
      "description": "Learn the basics of web development",
      "audience": "STUDENTS",
      "isCore": true,
      "modules": [
        {
          "id": "674a3c2e5d8f9b1234567896",
          "title": "HTML Basics",
          "content": "{\"type\":\"doc\",\"content\":[...]}",
          "order": 1,
          "quiz": [
            {
              "question": "What does HTML stand for?",
              "options": [
                "HyperText Markup Language",
                "HighText Markup Language",
                "HyperText Markdown Language",
                "None of the above"
              ],
              "correctAnswer": 0
            }
          ],
          "createdAt": "2026-01-01T00:00:00Z",
          "updatedAt": "2026-01-01T00:00:00Z"
        }
      ],
      "createdAt": "2026-01-01T00:00:00Z",
      "updatedAt": "2026-01-01T00:00:00Z"
    }
  ]
}
```

**Audience Types:**
- `STUDENTS` - Only visible to students
- `MENTORS` - Only visible to mentors
- `EVERYONE` - Visible to all users

---

### Get Learning Path by ID

**Endpoint:** `GET /api/admin/learning-paths/:pathId`

**Description:** Get a single learning path with all modules.

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/admin/learning-paths/674a3c2e5d8f9b1234567895" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "674a3c2e5d8f9b1234567895",
    "title": "Introduction to Web Development",
    "description": "Learn the basics of web development",
    "audience": "STUDENTS",
    "isCore": true,
    "modules": [...],
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  }
}
```

---

### Create Learning Path

**Endpoint:** `POST /api/admin/learning-paths`

**Description:** Create a new learning path.

**Request Body:**
```json
{
  "title": "Introduction to Web Development",
  "description": "Learn the basics of web development",
  "audience": "STUDENTS",
  "isCore": true
}
```

**Example Request:**
```bash
curl -X POST "http://localhost:5000/api/admin/learning-paths" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Introduction to Web Development",
    "description": "Learn the basics",
    "audience": "STUDENTS",
    "isCore": true
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "674a3c2e5d8f9b1234567895",
    "title": "Introduction to Web Development",
    "description": "Learn the basics",
    "audience": "STUDENTS",
    "isCore": true,
    "createdAt": "2026-01-07T18:00:00Z"
  }
}
```

**Notes:**
- If `isCore` is true, automatically assigned to all students
- Students notified about new course

---

### Update Learning Path

**Endpoint:** `PUT /api/admin/learning-paths/:pathId`

**Description:** Update learning path details.

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "audience": "EVERYONE",
  "isCore": false
}
```

**Example Request:**
```bash
curl -X PUT "http://localhost:5000/api/admin/learning-paths/674a3c2e5d8f9b1234567895" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "674a3c2e5d8f9b1234567895",
    "title": "Updated Title",
    "updatedAt": "2026-01-07T19:00:00Z"
  }
}
```

---

### Delete Learning Path

**Endpoint:** `DELETE /api/admin/learning-paths/:pathId`

**Description:** Delete a learning path.

**Example Request:**
```bash
curl -X DELETE "http://localhost:5000/api/admin/learning-paths/674a3c2e5d8f9b1234567895" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "message": "Learning path deleted successfully"
}
```

**Notes:**
- Cascades to delete all modules
- User progress preserved

---

### Add Module to Learning Path

**Endpoint:** `POST /api/admin/learning-paths/:pathId/modules`

**Description:** Add a module to a learning path.

**Request Body:**
```json
{
  "title": "HTML Basics",
  "content": "{\"type\":\"doc\",\"content\":[...]}",
  "order": 1,
  "quiz": [
    {
      "question": "What does HTML stand for?",
      "options": [
        "HyperText Markup Language",
        "HighText Markup Language",
        "HyperText Markdown Language",
        "None of the above"
      ],
      "correctAnswer": 0
    }
  ]
}
```

**Content Format:**
The `content` field stores JSON from novel.sh editor (TipTap/ProseMirror format):
```json
{
  "type": "doc",
  "content": [
    {
      "type": "heading",
      "attrs": { "level": 1 },
      "content": [{ "type": "text", "text": "HTML Basics" }]
    },
    {
      "type": "paragraph",
      "content": [{ "type": "text", "text": "HTML is..." }]
    }
  ]
}
```

**Example Request:**
```bash
curl -X POST "http://localhost:5000/api/admin/learning-paths/674a3c2e5d8f9b1234567895/modules" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "HTML Basics",
    "content": "{...}",
    "order": 1,
    "quiz": [...]
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "674a3c2e5d8f9b1234567896",
    "pathId": "674a3c2e5d8f9b1234567895",
    "title": "HTML Basics",
    "content": "{...}",
    "order": 1,
    "quiz": [...],
    "createdAt": "2026-01-07T20:00:00Z"
  }
}
```

---

### Update Module

**Endpoint:** `PUT /api/admin/learning-paths/:pathId/modules/:moduleId`

**Description:** Update a module.

**Request Body:**
```json
{
  "title": "Updated Module Title",
  "content": "{...}",
  "order": 2,
  "quiz": [...]
}
```

**Example Request:**
```bash
curl -X PUT "http://localhost:5000/api/admin/learning-paths/674a3c2e5d8f9b1234567895/modules/674a3c2e5d8f9b1234567896" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "674a3c2e5d8f9b1234567896",
    "title": "Updated Title",
    "updatedAt": "2026-01-07T21:00:00Z"
  }
}
```

---

### Delete Module

**Endpoint:** `DELETE /api/admin/learning-paths/:pathId/modules/:moduleId`

**Description:** Delete a module from a learning path.

**Example Request:**
```bash
curl -X DELETE "http://localhost:5000/api/admin/learning-paths/674a3c2e5d8f9b1234567895/modules/674a3c2e5d8f9b1234567896" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "message": "Module deleted successfully"
}
```

---

### Get Learning Paths (Student)

**Endpoint:** `GET /api/learning-paths`

**Description:** Get available learning paths for the current user.

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/learning-paths" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "674a3c2e5d8f9b1234567895",
      "title": "Introduction to Web Development",
      "description": "Learn the basics",
      "audience": "STUDENTS",
      "isCore": true,
      "modules": [...],
      "userProgress": {
        "completedModules": 2,
        "totalModules": 5,
        "progress": 40
      }
    }
  ]
}
```

---

### Get User Progress

**Endpoint:** `GET /api/learning-paths/:pathId/progress`

**Description:** Get user's progress in a learning path.

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/learning-paths/674a3c2e5d8f9b1234567895/progress" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "user_id",
    "pathId": "674a3c2e5d8f9b1234567895",
    "completedModules": 2,
    "totalModules": 5,
    "progress": 40,
    "startedAt": "2026-01-05T00:00:00Z",
    "completedAt": null
  }
}
```

---

### Complete Module

**Endpoint:** `POST /api/learning-paths/:pathId/modules/:moduleId/complete`

**Description:** Mark a module as completed.

**Request Body (optional):**
```json
{
  "quizScore": 85
}
```

**Example Request:**
```bash
curl -X POST "http://localhost:5000/api/learning-paths/674a3c2e5d8f9b1234567895/modules/674a3c2e5d8f9b1234567896/complete" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "quizScore": 85
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "moduleId": "674a3c2e5d8f9b1234567896",
    "completed": true,
    "quizScore": 85,
    "completedAt": "2026-01-07T22:00:00Z",
    "pointsAwarded": 15
  }
}
```

**Points Awarded:**
- Complete module: **10 points**
- Pass quiz (>80%): **+5 bonus points**
- Complete entire path: **+50 points**
- Complete core path: **+25 additional bonus points**

**Notifications:**
- Module completed notification
- Quiz passed notification (if score >80%)
- Path completed notification (if all modules done)

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "message": "Error message",
  "error": {
    "code": "ERROR_CODE",
    "message": "Detailed error message"
  }
}
```

### Common Error Codes:

| Code | Status | Description |
|------|--------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `DUPLICATE_ERROR` | 409 | Resource already exists |
| `FILE_TOO_LARGE` | 413 | File exceeds size limit |
| `INTERNAL_ERROR` | 500 | Server error |

### Example Error Response:

```json
{
  "success": false,
  "message": "User not found",
  "error": {
    "code": "NOT_FOUND",
    "message": "No user found with ID: 674a3c2e5d8f9b1234567890"
  }
}
```

---

## Rate Limiting

- **Rate Limit:** 100 requests per minute per user
- **Exceeded Response:**
```json
{
  "success": false,
  "message": "Rate limit exceeded",
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "retryAfter": 60
  }
}
```

---

## Pagination

All list endpoints support pagination:

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20, max: 100)

**Response Format:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1205,
    "totalPages": 61
  }
}
```

---

## File Upload

**Supported Formats:**
- PDF (.pdf)
- Word (.doc, .docx)
- ZIP (.zip)

**Size Limits:**
- Max file size: 10MB

**Storage:**
- Files stored securely in cloud storage (UploadThing)
- Secure URLs generated for access
- URLs expire after 7 days (for deliverables)

---

## Testing

### Using cURL:

```bash
# Login first
TOKEN=$(curl -X POST "http://localhost:5000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}' \
  | jq -r '.accessToken')

# Test admin stats
curl -X GET "http://localhost:5000/api/admin/stats" \
  -H "Authorization: Bearer $TOKEN"

# Test get users
curl -X GET "http://localhost:5000/api/admin/users?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"

# Test create user
curl -X POST "http://localhost:5000/api/admin/users" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "firstName": "Jane",
    "lastName": "Doe",
    "role": "STUDENT"
  }'
```

### Using Postman:

1. Import collection from `docs/postman/admin-api.json`
2. Set environment variable `token` with your JWT
3. Run collection tests

---

## Notifications Summary

### Automatically Triggered:

1. **User Created** → Welcome notification
2. **Role Updated** → Role change notification
3. **Deliverable Submitted** → Admin notified
4. **Deliverable Approved** → Team notified + 25 points
5. **Deliverable Rejected** → Team notified with feedback
6. **Deadline Approaching** → 3-day reminder
7. **Module Completed** → Congratulations + 10 points
8. **Quiz Passed** → Success notification + 5 points
9. **Path Completed** → Achievement + 50 points
10. **New Course Assigned** → Core path notification

---

## Points Summary

### Automatically Awarded:

1. **Account Created** - 10 points
2. **Submit Deliverable (on time)** - 15 points
3. **Early Submission (>3 days)** - +10 bonus
4. **Deliverable Approved** - 25 points
5. **Complete Module** - 10 points
6. **Pass Quiz (>80%)** - +5 bonus
7. **Complete Path** - 50 points
8. **Complete Core Path** - +25 bonus
9. **Daily Login** - 2 points
10. **Profile Completed** - 10 points (one-time)

---

## Support

For issues or questions:
- **Email:** support@ticportal.com
- **Documentation:** https://docs.ticportal.com
- **GitHub:** https://github.com/ticportal/api

---

**Version:** 2.0.0  
**Last Updated:** January 7, 2026
