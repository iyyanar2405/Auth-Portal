# AuthProvider API - Payloads & Responses Summary

## 🔐 Authentication Controller (`/api/authorize`)

| Endpoint | Method | Payload | Response |
|----------|--------|---------|----------|
| `/token` | POST | `{"userName": "user@example.com", "password": "Password123!", "deviceCode": "0"}` | `{"access_token": "jwt...", "token_type": "Bearer", "expires_in": 3600, "refreshToken": "guid"}` |
| `/refresh-token/{guid}` | POST | None | `{"access_token": "jwt...", "token_type": "Bearer", "expires_in": 3600}` |
| `/register` | POST | `{"userName": "user@example.com", "email": "user@example.com", "password": "Password123!", "confirmPassword": "Password123!"}` | `{"success": true, "data": {"userId": "guid", "email": "user@example.com"}}` |
| `/logout` | POST | `{"userName": "user@example.com"}` | `{"success": true, "message": "User logged out successfully"}` |

---

## 👥 User Management Controller (`/api/user`)

| Endpoint | Method | Payload | Response |
|----------|--------|---------|----------|
| `/` | GET | Query: `?page=1&pageSize=10&search=term` | `{"success": true, "data": {"items": [UserDto], "totalCount": 25, "pageNumber": 1}}` |
| `/{id}` | GET | None | `{"success": true, "data": {"id": "guid", "userName": "user@example.com", "roles": []}}` |
| `/` | POST | `{"userName": "user@example.com", "email": "user@example.com", "password": "Password123!", "phoneNumber": "+1234567890"}` | `{"success": true, "data": {"id": "guid", "userName": "user@example.com"}}` |
| `/{id}` | PUT | `{"userName": "updated@example.com", "email": "updated@example.com", "phoneNumber": "+1234567891"}` | `{"success": true, "data": {"id": "guid", "userName": "updated@example.com"}}` |
| `/{id}` | DELETE | None | `{"success": true, "message": "User deleted successfully"}` |
| `/{id}/lock` | POST | `{"lockoutMinutes": 60, "reason": "Security violation"}` | `{"success": true, "data": {"lockoutEnd": "2025-09-21T12:30:00Z"}}` |
| `/{id}/unlock` | POST | None | `{"success": true, "message": "User account unlocked successfully"}` |
| `/{id}/reset-password` | POST | `{"newPassword": "NewPassword123!", "confirmPassword": "NewPassword123!"}` | `{"success": true, "message": "Password reset successfully"}` |

---

## 🛡️ Role Management Controller (`/api/role`)

| Endpoint | Method | Payload | Response |
|----------|--------|---------|----------|
| `/` | GET | Query: `?page=1&pageSize=10&search=term` | `{"success": true, "data": {"items": [RoleDto], "totalCount": 5}}` |
| `/{id}` | GET | None | `{"success": true, "data": {"id": "guid", "name": "Administrator", "userCount": 5}}` |
| `/` | POST | `{"name": "Manager"}` | `{"success": true, "data": {"id": "guid", "name": "Manager", "userCount": 0}}` |
| `/{id}` | PUT | `{"name": "Senior Manager"}` | `{"success": true, "data": {"id": "guid", "name": "Senior Manager"}}` |
| `/{id}` | DELETE | None | `{"success": true, "message": "Role deleted successfully"}` |

---

## 👤🛡️ User Roles Controller (`/api/userroles`)

| Endpoint | Method | Payload | Response |
|----------|--------|---------|----------|
| `/{userId}` | GET | None | `{"success": true, "data": [{"roleId": "guid", "roleName": "User", "assignedDate": "2025-09-15T10:30:00Z"}]}` |
| `/{userId}/assign` | POST | `{"roleName": "Manager"}` | `{"success": true, "data": {"userId": "guid", "roleName": "Manager", "assignedDate": "2025-09-21T11:30:00Z"}}` |
| `/{userId}/remove` | POST | `{"roleName": "Manager"}` | `{"success": true, "message": "Role removed successfully"}` |
| `/{userId}/check/{roleName}` | GET | None | `{"success": true, "data": {"hasRole": true, "roleName": "Manager"}}` |

---

## 🎫 Claims Controller (`/api/claims`)

| Endpoint | Method | Payload | Response |
|----------|--------|---------|----------|
| `/user/{userId}` | GET | None | `{"success": true, "data": [{"type": "permission", "value": "read_users", "issuer": "AuthProvider"}]}` |
| `/role/{roleId}` | GET | None | `{"success": true, "data": [{"type": "permission", "value": "manage_users", "issuer": "AuthProvider"}]}` |
| `/` | POST | `{"userName": "user@example.com", "claimType": "permission", "claimValue": "delete_users"}` | `{"success": true, "message": "Claim added successfully"}` |
| `/` | DELETE | `{"userName": "user@example.com", "claimType": "permission", "claimValue": "delete_users"}` | `{"success": true, "message": "Claim removed successfully"}` |
| `/types` | GET | None | `{"success": true, "data": ["permission", "access_level", "department", "location", "team"]}` |

---

## 📋 Sample DTOs

### UserResponseDto
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "userName": "user@example.com",
  "email": "user@example.com",
  "emailConfirmed": true,
  "phoneNumber": "+1234567890",
  "phoneNumberConfirmed": false,
  "twoFactorEnabled": false,
  "lockoutEnabled": true,
  "lockoutEnd": null,
  "accessFailedCount": 0,
  "roles": ["User", "Manager"],
  "isActive": true,
  "lastPasswordChanged": "2025-09-15T10:30:00Z"
}
```

### RoleResponseDto
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Administrator",
  "normalizedName": "ADMINISTRATOR",
  "userCount": 5,
  "concurrencyStamp": "550e8400-e29b-41d4-a716-446655440001"
}
```

### TokenModel
```json
{
  "hasVerifiedEmail": true,
  "tfaEnabled": false,
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "issued": "2025-09-21T10:30:00Z",
  "expires": "2025-09-21T11:30:00Z",
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000",
  "resetToken": null,
  "tfaToken": null,
  "deviceCode": null,
  "last4": null
}
```

### Pagination Response
```json
{
  "items": [],
  "totalCount": 100,
  "pageNumber": 1,
  "pageSize": 10,
  "totalPages": 10,
  "hasPreviousPage": false,
  "hasNextPage": true
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400,
  "errors": [
    "Detailed error message 1",
    "Detailed error message 2"
  ]
}
```

---

## 🔑 Authentication Header
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📱 Test with Swagger UI
Access Swagger documentation at: `http://localhost:7136/swagger`