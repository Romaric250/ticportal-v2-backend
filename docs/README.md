# API Documentation Overview

Complete API documentation for TIC Portal v2 Backend.

---

## 📚 Available Documentation

### Authentication & Authorization
- **[AUTH_API.md](./AUTH_API.md)** - Authentication endpoints (register, login, verify, etc.)
- **[ACTIVITY_TRACKING.md](./ACTIVITY_TRACKING.md)** - Activity tracking and gamification system

### User Management
- **[USER_PROFILE_API.md](./USER_PROFILE_API.md)** - User profile management and photo upload

### System Defaults
- **[DEFAULTS_API.md](./DEFAULTS_API.md)** - Default schools and regions for dropdowns

### OpenAPI/Swagger Specs
- **[swagger/user-profile.yaml](./swagger/user-profile.yaml)** - OpenAPI 3.0 specification for user profile endpoints
- **[swagger/README.md](./swagger/README.md)** - How to use Swagger documentation

---

## 🚀 Quick Start

### Base URL
```
Local: http://localhost:5000/api
Production: https://api.ticportal.org/api
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

## 🔧 Testing APIs

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

## 🎯 Common Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | Login user | ❌ |
| POST | `/auth/verify-email` | Verify email with OTP | ❌ |
| GET | `/users/profile` | Get user profile | ✅ |
| PUT | `/users/profile` | Update profile | ✅ |
| PUT | `/users/profile-photo` | Upload profile photo | ✅ |
| GET | `/defaults/search?type=school&q=query` | Search schools | ❌ |
| GET | `/defaults/search?type=region&q=query` | Search regions | ❌ |
| GET | `/defaults?type=school` | Get schools list | ❌ |
| GET | `/defaults?type=region` | Get regions list | ❌ |

---

## 📦 Response Format

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

## 🛠️ Development

### Environment Variables
```env
DATABASE_URL=mongodb://...
JWT_ACCESS_SECRET=your_secret
JWT_REFRESH_SECRET=your_secret
UPLOADTHING_TOKEN=your_token
RESEND_API_KEY=your_key
```

See `.env.example` for full list.

### Running the Server
```bash
npm run dev  # Development with hot reload
npm start    # Production
```

---

## 🔗 Related Resources

- **Prisma Schema**: `prisma/schema.prisma`
- **Environment Config**: `src/config/env.ts`
- **API Routes**: `src/modules/*/routes.ts`
- **Controllers**: `src/modules/*/controller.ts`
- **Services**: `src/modules/*/service.ts`

---

## 📝 Contributing

When adding new endpoints:

1. ✅ Create/update the endpoint in routes
2. ✅ Add controller method
3. ✅ Implement service logic
4. ✅ Update relevant documentation
5. ✅ Create OpenAPI spec (if needed)
6. ✅ Add frontend examples

---

## 🔒 Security

- All passwords are hashed with bcrypt
- JWT tokens for authentication
- Rate limiting on sensitive endpoints
- Input validation on all endpoints
- File upload validation (size, type)

---

## 📞 Support

For questions or issues:
- Check the specific API documentation
- Review the OpenAPI specs
- Contact: support@ticsummit.org

---

**Last Updated**: January 4, 2026  
**Version**: 2.0.0  
**Status**: ✅ Active Development
