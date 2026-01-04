# Defaults API

Get lists of default schools and regions for dropdowns and selections.

---

## Endpoints

### Search Defaults
```http
GET /api/defaults/search?type={school|region}&q={query}
```

**Query Parameters:**
- `type` (required): Either `school` or `region`
- `q` (required): Search query (partial match, case-insensitive)

**Examples:**
```bash
# Search schools containing "bilingual"
GET /api/defaults/search?type=school&q=bilingual

# Search regions containing "west"
GET /api/defaults/search?type=region&q=west

# Search schools in Yaoundé
GET /api/defaults/search?type=school&q=yaoundé
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "...",
      "name": "Government Bilingual High School Molyko",
      "region": "South West",
      "country": "Cameroon"
    },
    {
      "id": "...",
      "name": "Government Bilingual High School Bamenda",
      "region": "North West",
      "country": "Cameroon"
    }
  ]
}
```

**Features:**
- ✅ Case-insensitive search
- ✅ Partial match (finds "Bilingual" in "Government Bilingual High School")
- ✅ Returns max 20 results
- ✅ Sorted alphabetically

---

### Get Defaults by Type
```http
GET /api/defaults?type={school|region}
```

**Query Parameters:**
- `type` (required): Either `school` or `region`

**Examples:**
```bash
# Get schools
GET /api/defaults?type=school

# Get regions
GET /api/defaults?type=region
```

**Response (Schools):**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "name": "Government Bilingual High School Molyko",
      "region": "South West",
      "country": "Cameroon"
    },
    {
      "id": "...",
      "name": "Government Technical High School Bamenda",
      "region": "North West",
      "country": "Cameroon"
    }
  ]
}
```

**Response (Regions):**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "name": "South West",
      "country": "Cameroon"
    },
    {
      "id": "...",
      "name": "North West",
      "country": "Cameroon"
    }
  ]
}
```

---

### Get All Schools
```http
GET /api/defaults/schools
```

Returns all active schools.

---

### Get All Regions
```http
GET /api/defaults/regions
```

Returns all active regions.

---

### Create School (Admin Only)
```http
POST /api/defaults/schools
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Government Bilingual High School Molyko",
  "region": "South West",
  "country": "Cameroon"
}
```

---

### Create Region (Admin Only)
```http
POST /api/defaults/regions
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "name": "South West",
  "country": "Cameroon"
}
```

---

## Frontend Usage

```typescript
// Get schools for dropdown
const getSchools = async () => {
  const res = await fetch('/api/defaults?type=school');
  const data = await res.json();
  return data.data;
};

// Get regions for dropdown
const getRegions = async () => {
  const res = await fetch('/api/defaults?type=region');
  const data = await res.json();
  return data.data;
};

// Search schools with autocomplete
const searchSchools = async (query: string) => {
  const res = await fetch(`/api/defaults/search?type=school&q=${encodeURIComponent(query)}`);
  const data = await res.json();
  return data.data;
};

// Search regions
const searchRegions = async (query: string) => {
  const res = await fetch(`/api/defaults/search?type=region&q=${encodeURIComponent(query)}`);
  const data = await res.json();
  return data.data;
};

// Autocomplete component example
const SchoolAutocomplete = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (value: string) => {
    setQuery(value);
    if (value.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const schools = await searchSchools(value);
      setResults(schools);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search schools..."
      />
      {loading && <div>Searching...</div>}
      <ul>
        {results.map(school => (
          <li key={school.id} onClick={() => selectSchool(school)}>
            {school.name} - {school.region}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Use in a select component
const SchoolSelect = () => {
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    getSchools().then(setSchools);
  }, []);

  return (
    <select>
      <option value="">Select a school</option>
      {schools.map(school => (
        <option key={school.id} value={school.name}>
          {school.name}
        </option>
      ))}
    </select>
  );
};
```

---

## User Profile Integration

The `region` field is now available in the User model:

```json
{
  "username": "johndoe",
  "school": "Government Bilingual High School Molyko",
  "region": "South West",
  "country": "Cameroon"
}
```

Update user profile with region:
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "school": "Government Bilingual High School Molyko",
  "region": "South West",
  "country": "Cameroon"
}
```

---

## Common Errors

| Status | Message | Solution |
|--------|---------|----------|
| 400 | Invalid or missing type parameter | Use `?type=school` or `?type=region` |
| 400 | School/Region name is required | Provide `name` in request body |

---

## Notes

- All endpoints return active items only (`isActive: true`)
- Schools are sorted alphabetically by name
- Regions are sorted alphabetically by name
- POST endpoints require authentication
- Items are soft-deleted (set `isActive: false`) when deleted
