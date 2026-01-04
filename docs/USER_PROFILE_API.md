# User Profile API

User profile management with profile photo upload.

---

## Profile Fields

| Field | Type | Description |
|-------|------|-------------|
| `username` | string | Unique username (3-30 chars) |
| `bio` | string | Biography (max 500 chars) |
| `school` | string | School name |
| `grade` | string | Grade/Year |
| `country` | string | Country |
| `gradDate` | DateTime | Graduation date |
| `profilePhoto` | string | Profile photo URL |

All fields are **optional**.

---

## API Endpoints

### 1. Get User Profile
```
GET /api/users/profile
```

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "email": "user@example.com",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "bio": "Software developer passionate about tech",
    "phone": "+1234567890",
    "profilePhoto": "https://utfs.io/f/abc123...",
    "school": "Tech University",
    "grade": "Senior",
    "country": "USA",
    "gradDate": "2026-05-15T00:00:00.000Z",
    "role": "STUDENT",
    "isVerified": true,
    "lastLogin": "2026-01-04T10:30:00.000Z",
    "createdAt": "2025-12-01T00:00:00.000Z"
  }
}
```

---

### 2. Update User Profile
```
PUT /api/users/profile
```

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "username": "johndoe",
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Software developer passionate about tech education",
  "phone": "+1234567890",
  "school": "Tech University",
  "grade": "Senior",
  "country": "USA",
  "gradDate": "2026-05-15T00:00:00.000Z"
}
```

**All fields are optional** - send only what you want to update.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "email": "user@example.com",
    "username": "johndoe",
    // ... all user fields
  }
}
```

**Validation:**
- `username`: 3-30 characters, unique
- `bio`: Max 500 characters
- `gradDate`: ISO 8601 datetime string

---

### 3. Update Profile Photo
```
PUT /api/users/profile-photo
```

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "profilePhoto": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEA..."
}
```

**Image Requirements:**
- **Format:** Base64 data URL
- **Supported types:** JPEG, PNG, GIF, WebP
- **Max size:** 5MB
- **Prefix required:** `data:image/[type];base64,`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "profilePhoto": "https://utfs.io/f/abc123-profile.jpg",
    // ... other user fields
  }
}
```

**Notes:**
- Old profile photo is automatically deleted from UploadThing
- Image is validated before upload
- Automatic file naming: `profile-{userId}-{timestamp}.jpg`

---

## Frontend Integration Examples

### Update Profile

```typescript
const updateProfile = async (profileData: any) => {
  const response = await fetch('/api/users/profile', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: 'johndoe',
      bio: 'Tech enthusiast',
      school: 'MIT',
      grade: 'Senior',
      country: 'USA',
      gradDate: '2026-05-15T00:00:00.000Z'
    })
  });

  const data = await response.json();
  return data;
};
```

### Upload Profile Photo

```typescript
// Convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Upload profile photo
const uploadProfilePhoto = async (file: File) => {
  // Convert to base64
  const base64 = await fileToBase64(file);

  // Upload
  const response = await fetch('/api/users/profile-photo', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      profilePhoto: base64
    })
  });

  const data = await response.json();
  return data;
};

// Usage
const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    try {
      const result = await uploadProfilePhoto(file);
      console.log('New photo URL:', result.data.profilePhoto);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  }
};
```

### React Component Example

```tsx
import { useState } from 'react';

const ProfileEditor = () => {
  const [profile, setProfile] = useState({
    username: '',
    firstName: '',
    lastName: '',
    bio: '',
    school: '',
    grade: '',
    country: '',
    gradDate: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const response = await fetch('/api/users/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profile)
    });

    const data = await response.json();
    if (data.success) {
      alert('Profile updated successfully!');
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('File too large. Max 5MB');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      
      const response = await fetch('/api/users/profile-photo', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ profilePhoto: base64 })
      });

      const data = await response.json();
      if (data.success) {
        alert('Photo uploaded!');
        // Update UI with new photo URL
        setProfile(prev => ({ ...prev, profilePhoto: data.data.profilePhoto }));
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
      />
      
      <input
        type="text"
        placeholder="Username"
        value={profile.username}
        onChange={(e) => setProfile({...profile, username: e.target.value})}
      />
      
      <textarea
        placeholder="Bio"
        value={profile.bio}
        maxLength={500}
        onChange={(e) => setProfile({...profile, bio: e.target.value})}
      />
      
      {/* Other fields */}
      
      <button type="submit">Update Profile</button>
    </form>
  );
};
```

---

## Error Handling

### Common Errors

| Status | Code | Message | Solution |
|--------|------|---------|----------|
| 400 | VALIDATION_ERROR | Invalid username format | Use 3-30 characters |
| 400 | VALIDATION_ERROR | Bio too long | Max 500 characters |
| 400 | VALIDATION_ERROR | Invalid image format | Use JPEG, PNG, GIF, or WebP |
| 400 | VALIDATION_ERROR | Image size exceeds 5MB | Compress image |
| 409 | CONFLICT | Username already taken | Choose different username |
| 401 | UNAUTHORIZED | Invalid token | Re-authenticate |

---

## UploadThing Configuration

The backend uses UploadThing for file uploads:

- **Token:** Configured via `UPLOADTHING_TOKEN` env variable
- **Max file size:** 5MB
- **Supported formats:** JPEG, PNG, GIF, WebP
- **Storage:** Automatic CDN delivery
- **Old files:** Automatically deleted when updating

---

## Best Practices

1. **Image Optimization:**
   - Resize images before upload (recommended: 512x512px for profile photos)
   - Compress to reduce size
   - Use WebP format when possible

2. **Validation:**
   - Validate on client-side before upload
   - Check file size and type
   - Provide clear error messages

3. **UX:**
   - Show image preview before upload
   - Display upload progress
   - Provide cropping functionality
   - Show current photo while uploading new one

4. **Security:**
   - Always validate on server-side
   - Check file MIME types
   - Limit file sizes
   - Use unique filenames

---

## Summary

✅ **Complete profile management** - All user fields supported  
✅ **Profile photo upload** - Base64 to UploadThing conversion  
✅ **Automatic cleanup** - Old photos deleted automatically  
✅ **Validation** - Image format and size validation  
✅ **Activity tracking** - Profile updates tracked for points  

Your profile system is ready for frontend integration! 🎨📸
