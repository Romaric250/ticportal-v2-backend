# Swagger/OpenAPI Documentation

This folder contains OpenAPI 3.0 specification files for the TIC Portal API.

## Files

- `user-profile.yaml` - User profile management endpoints

## Viewing the Documentation

### Option 1: Swagger Editor (Online)
1. Go to https://editor.swagger.io/
2. Click "File" → "Import file"
3. Upload the YAML file
4. View interactive documentation

### Option 2: Swagger UI (Local)
```bash
# Install swagger-ui-express
npm install swagger-ui-express yaml

# Add to your Express app
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';
import fs from 'fs';

const swaggerDocument = YAML.parse(
  fs.readFileSync('./docs/swagger/user-profile.yaml', 'utf8')
);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

# Visit http://localhost:5000/api-docs
```

### Option 3: VS Code Extension
1. Install "OpenAPI (Swagger) Editor" extension
2. Open YAML file
3. Press `Ctrl+Shift+P` and select "OpenAPI: Preview"

## Using the API

All authenticated endpoints require a JWT bearer token:

```bash
curl -X GET "http://localhost:5000/api/users/profile" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Testing with Swagger UI

Once you have Swagger UI running:

1. Click "Authorize" button
2. Enter your JWT token (without "Bearer" prefix)
3. Try out the endpoints directly from the UI

## Structure

Each endpoint includes:
- **Summary** - Brief description
- **Parameters** - Request parameters and body
- **Responses** - All possible responses with examples
- **Security** - Authentication requirements
- **Examples** - Sample requests and responses
