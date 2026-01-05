# User Search API

Quick reference for the user search endpoint.

**Base URL:** `http://localhost:5000/api/users`

---

## Search Users

```http
GET /api/users/search?q={query}&type={type}&page={page}&limit={limit}
Authorization: Bearer {token}
```

Search for users by name, email, username, or school with optional type filtering.

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `q` | string | Yes | - | Search query (searches in firstName, lastName, email, username, school) |
| `type` | enum | No | - | Filter by user type: `user` (STUDENT) or `mentor` (MENTOR) |
| `page` | number | No | 1 | Page number |
| `limit` | number | No | 20 | Results per page (max: 100) |

### Examples

#### 1. Search all users by name
```http
GET /api/users/search?q=John
Authorization: Bearer {token}
```

#### 2. Search for mentors only
```http
GET /api/users/search?q=John&type=mentor
Authorization: Bearer {token}
```

#### 3. Search students from a specific school
```http
GET /api/users/search?q=romaric&type=user
Authorization: Bearer {token}
```

#### 4. Paginated search
```http
GET /api/users/search?q=John&page=2&limit=10
Authorization: Bearer {token}
```

---

## Response Format

### Success Response (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "username": "johndoe",
      "profilePhoto": "https://utfs.io/f/abc123.jpg",
      "bio": "Software developer and mentor",
      "school": "University of Buea",
      "grade": "Graduate",
      "country": "Cameroon",
      "region": "Southwest",
      "role": "MENTOR"
    },
    {
      "id": "507f1f77bcf86cd799439012",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane.smith@example.com",
      "username": "janesmith",
      "profilePhoto": "https://utfs.io/f/xyz789.jpg",
      "bio": "Computer science student",
      "school": "University of Buea",
      "grade": "Year 3",
      "country": "Cameroon",
      "region": "Southwest",
      "role": "STUDENT"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

### Error Response (400 Bad Request)

```json
{
  "success": false,
  "message": "Search query is required"
}
```

### Error Response (401 Unauthorized)

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

## React Examples

### Basic Search Hook

```tsx
import { useState, useEffect } from 'react';

export const useUserSearch = (query: string, type?: 'user' | 'mentor') => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    if (!query) return;

    const searchUsers = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ q: query });
        if (type) params.append('type', type);

        const response = await fetch(
          `/api/users/search?${params.toString()}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        const data = await response.json();
        setUsers(data.data);
        setPagination(data.pagination);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounce);
  }, [query, type]);

  return { users, loading, pagination };
};
```

### Search Component

```tsx
import { useState } from 'react';

export const UserSearch = () => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'user' | 'mentor' | undefined>();
  const { users, loading, pagination } = useUserSearch(query, type);

  return (
    <div>
      <input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      
      <select onChange={(e) => setType(e.target.value as any)}>
        <option value="">All Users</option>
        <option value="user">Students Only</option>
        <option value="mentor">Mentors Only</option>
      </select>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {users.map((user) => (
            <div key={user.id}>
              <img src={user.profilePhoto} alt={user.firstName} />
              <h3>{user.firstName} {user.lastName}</h3>
              <p>{user.bio}</p>
              <span>{user.school}</span>
              <span>{user.role}</span>
            </div>
          ))}
          
          {pagination && (
            <div>
              Page {pagination.page} of {pagination.totalPages}
              ({pagination.total} results)
            </div>
          )}
        </div>
      )}
    </div>
  );
};
```

### Fetch with Axios

```tsx
import axios from 'axios';

const searchUsers = async (query: string, type?: 'user' | 'mentor') => {
  try {
    const { data } = await axios.get('/api/users/search', {
      params: { q: query, type },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return data;
  } catch (error) {
    console.error('Search failed:', error);
    throw error;
  }
};

// Usage
const results = await searchUsers('John', 'mentor');
console.log(results.data); // Array of users
console.log(results.pagination); // Pagination info
```

---

## Search Behavior

The search is **case-insensitive** and searches across:
- First Name
- Last Name
- Email
- Username
- School

The search uses **partial matching** (contains), so searching for "John" will match:
- **John** Doe
- **John**ny Smith
- **john**@example.com
- St. **John**'s University

---

## Use Cases

### 1. Find Team Members
Search for students to add to your team:
```
GET /api/users/search?q=software&type=user
```

### 2. Find Mentors
Search for mentors with specific expertise:
```
GET /api/users/search?q=AI&type=mentor
```

### 3. School-based Search
Find all users from a specific school:
```
GET /api/users/search?q=University%20of%20Buea
```

### 4. Browse All Mentors
List all available mentors:
```
GET /api/users/search?q=&type=mentor&limit=50
```

---

## Performance Tips

1. **Debounce user input** - Wait 300ms after the user stops typing before searching
2. **Use pagination** - Don't load all results at once
3. **Cache results** - Store recent searches in state/memory
4. **Filter client-side** - For type changes, filter cached results instead of re-fetching

---

## Notes

- Authentication required (Bearer token)
- Maximum 100 results per page
- Results are ordered by first name, then last name
- Empty query with type filter will return all users of that type
