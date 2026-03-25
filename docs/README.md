TIC Portal v2 Backend

The TIC Portal is a web platform that connects students, teams, and mentors.
This server provides the backend APIs used by the TIC Portal frontend.

API documentation:
- `swagger/user-profile.yaml`
- `swagger/README.md`
TIC Portal v2 backend provides the API used by the TIC Portal frontend (JWT-authenticated REST endpoints).

API documentation:
- `swagger/user-profile.yaml`: OpenAPI specification
- https://ticportal-v3-backend.onrender.com/api/docs/ 



TIC Portal v2 Backend - API Documentation

This folder contains OpenAPI/Swagger documentation for the TIC Portal v2 backend.

Included files:
- `swagger/user-profile.yaml`: OpenAPI 3.x specification for the user profile API.
- `swagger/README.md`: Instructions for using/viewing the Swagger specification.

Notes:
- Refer to the OpenAPI specification under `docs/swagger/` for endpoint details, request/response shapes, and auth requirements.
# API Documentation Overview

Complete API documentation for TIC Portal v2 Backend.

---

## 📚 Available Documentation



##  Quick Start

### Base URL
```
Local: http://localhost:5000/api
Production: 
```

### Authentication
All protected endpoints require a JWT bearer token:

```bash
Authorization: Bearer <your_token_here>
```

Get a token by logging in:
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

---

## 📖 Documentation Format

Each API doc includes:
- ✅ Endpoint descriptions
- ✅ Request/response examples
- ✅ Validation rules
- ✅ Error codes
- ✅ Frontend integration examples

---

##  Testing APIs

### Using cURL
```bash
# Get user profile
curl -X GET "http://localhost:5000/api/users/profile" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Swagger UI
1. See `docs/swagger/README.md` for setup instructions
2. Visit `http://localhost:5000/api-docs` (after setup)
3. Test endpoints interactively

### Using Postman
1. Import the OpenAPI YAML files
2. Set up environment variables for base URL and token
3. Test all endpoints

---

## Response Format

All API responses follow this structure:

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

---

##  Development

### Environment Variables

See `.env.example` for full list.

### Running the Server
```bash
npm run dev  
npm start
```

---

## Related Resources

- **Prisma Schema**: `prisma/schema.prisma`
- **Environment Config**: `src/config/env.ts`
- **API Routes**: `src/modules/*/routes.ts`
- **Controllers**: `src/modules/*/controller.ts`
- **Services**: `src/modules/*/service.ts`

---

## Contributing

When adding new endpoints:

1. ✅ Create/update the endpoint in routes
2. ✅ Add controller method
3. ✅ Implement service logic
4. ✅ Update relevant documentation
5. ✅ Create OpenAPI spec (if needed)
6. ✅ Add frontend examples

---

## Security

- All passwords are hashed with bcrypt
- JWT tokens for authentication
- Rate limiting on sensitive endpoints
- Input validation on all endpoints
- File upload validation (size, type)

---

## Support

For questions or issues:
- Check the specific API documentation
- Review the OpenAPI specs
- Contact: support@ticsummit.org

---

**Last Updated**: January 4, 2026  
**Version**: 2.0.0  
**Status**: ✅ Active Development
