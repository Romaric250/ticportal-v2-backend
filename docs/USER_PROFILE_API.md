# User Profile API

User profile management with profile photo upload.

> 📖 **Full OpenAPI/Swagger docs**: See `docs/swagger/user-profile.yaml` for complete API specification

---

## Profile Fields

| Field | Type | Description |
|-------|------|-------------|
| `username` | string | Unique username (3-30 chars) |
| `bio` | string | Biography (max 500 chars) |
| `school` | string | School name |
| `grade` | string | Grade/Year |
| `country` | string | Country |
| `region` | string | Region |
| `gradDate` | DateTime | Graduation date |
| `profilePhoto` | string | Profile photo URL |

All fields are **optional**.

---

## Endpoints

### Get Profile
```http
GET /api/users/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "...",
  "email": "user@example.com",
  "username": "johndoe",
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Software developer",
  "profilePhoto": "https://utfs.io/f/...",
  "school": "Tech University",
  "grade": "Senior",
  "country": "USA",
  "region": "California",
  "gradDate": "2026-05-15T00:00:00.000Z"
}
```

---

### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "username": "johndoe",
  "bio": "Software developer",
  "school": "MIT",
  "grade": "Senior",
  "country": "USA",
  "region": "Massachusetts"
}
```

---

### Update Profile Photo
```http
PUT /api/users/profile-photo
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "profilePhoto": "data:image/jpeg;base64,/9j/4AAQ..."
}
```

**Requirements:**
- Base64 data URL format
- JPEG, PNG, GIF, WebP
- Max 4MB

---

## Frontend Example

```typescript
// Update profile
const updateProfile = async (data: any) => {
  const res = await fetch('/api/users/profile', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return res.json();
};

// Upload photo
const uploadPhoto = async (file: File) => {
  // Convert to base64
  const base64 = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });

  const res = await fetch('/api/users/profile-photo', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ profilePhoto: base64 })
  });
  return res.json();
};
```

---

## Validation

- **username**: 3-30 characters, unique
- **bio**: Max 500 characters
- **profilePhoto**: Base64 data URL, max 4MB

---

## Common Errors

| Status | Message | Solution |
|--------|---------|----------|
| 400 | Invalid username format | Use 3-30 characters |
| 400 | Bio too long | Max 500 characters |
| 400 | Invalid image format | Use JPEG/PNG/GIF/WebP |
| 400 | Image size exceeds 4MB | Compress image |
| 409 | Username already taken | Choose different username |
