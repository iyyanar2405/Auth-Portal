# AuthProvider API Documentation

## Overview
This document provides comprehensive API documentation for the AuthProvider authentication system, including all endpoints, request payloads, and response formats.

**Base URL**: `http://localhost:7136/api`  
**Authentication**: JWT Bearer Token (for protected endpoints)

---

## 🔐 Authentication Controller (`/api/authorize`)

### 1. Login / Generate Token
**Endpoint**: `POST /api/authorize/token`  
**Description**: Authenticate user and generate access token  
**Authentication**: None required

#### Request Payload:
```json
{
  "userName": "user@example.com",
  "password": "Password123!",
  "deviceCode": "0"
}
```

#### Success Response (200):
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

#### Error Responses (400):
```json
["Invalid credentials."]
```
```json
["This account has been locked."]
```
```json
["Invalid login attempt."]
```

### 2. Refresh Token
**Endpoint**: `POST /api/authorize/refresh-token/{refreshGuid}`  
**Description**: Refresh JWT token using refresh token  
**Authentication**: None required

#### URL Parameter:
- `refreshGuid`: The refresh token GUID

#### Success Response (200):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refreshToken": "550e8400-e29b-41d4-a716-446655440001"
}
```

### 3. Register User
**Endpoint**: `POST /api/authorize/register`  
**Description**: Register a new user  
**Authentication**: None required

#### Request Payload:
```json
{
  "userName": "newuser@example.com",
  "email": "newuser@example.com",
  "password": "Password123!",
  "confirmPassword": "Password123!"
}
```

#### Success Response (200):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "newuser@example.com",
    "emailConfirmed": false
  }
}
```

### 4. Logout
**Endpoint**: `POST /api/authorize/logout`  
**Description**: Logout user and invalidate tokens  
**Authentication**: JWT Bearer Token required

#### Request Payload:
```json
{
  "userName": "user@example.com"
}
```

#### Success Response (200):
```json
{
  "success": true,
  "message": "User logged out successfully"
}
```

---

## 👥 User Management Controller (`/api/user`)

### 1. Get All Users (Paginated)
**Endpoint**: `GET /api/user`  
**Description**: Retrieve paginated list of users  
**Authentication**: JWT Bearer Token required

#### Query Parameters:
- `page` (int, optional): Page number (default: 1)
- `pageSize` (int, optional): Items per page (default: 10, max: 100)
- `search` (string, optional): Search term for username or email

#### Example Request:
```
GET /api/user?page=1&pageSize=10&search=john
```

#### Success Response (200):
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "userName": "john.doe@example.com",
        "email": "john.doe@example.com",
        "emailConfirmed": true,
        "phoneNumber": "+1234567890",
        "phoneNumberConfirmed": false,
        "twoFactorEnabled": false,
        "lockoutEnabled": true,
        "lockoutEnd": null,
        "accessFailedCount": 0,
        "roles": ["User"],
        "isActive": true,
        "lastPasswordChanged": "2025-09-15T10:30:00Z"
      }
    ],
    "totalCount": 25,
    "pageNumber": 1,
    "pageSize": 10,
    "totalPages": 3,
    "hasPreviousPage": false,
    "hasNextPage": true
  }
}
```

### 2. Get User by ID
**Endpoint**: `GET /api/user/{id}`  
**Description**: Retrieve specific user by ID  
**Authentication**: JWT Bearer Token required

#### URL Parameter:
- `id`: User ID (GUID)

#### Success Response (200):
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "userName": "john.doe@example.com",
    "email": "john.doe@example.com",
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
}
```

#### Error Response (404):
```json
{
  "success": false,
  "message": "User not found",
  "statusCode": 404
}
```

### 3. Create User
**Endpoint**: `POST /api/user`  
**Description**: Create a new user  
**Authentication**: JWT Bearer Token required

#### Request Payload:
```json
{
  "userName": "newuser@example.com",
  "email": "newuser@example.com",
  "password": "Password123!",
  "phoneNumber": "+1234567890",
  "emailConfirmed": true,
  "lockoutEnabled": true,
  "twoFactorEnabled": false
}
```

#### Success Response (201):
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "userName": "newuser@example.com",
    "email": "newuser@example.com",
    "emailConfirmed": true,
    "phoneNumber": "+1234567890",
    "phoneNumberConfirmed": false,
    "twoFactorEnabled": false,
    "lockoutEnabled": true,
    "roles": [],
    "isActive": true
  }
}
```

### 4. Update User
**Endpoint**: `PUT /api/user/{id}`  
**Description**: Update existing user  
**Authentication**: JWT Bearer Token required

#### Request Payload:
```json
{
  "userName": "updated.user@example.com",
  "email": "updated.user@example.com",
  "phoneNumber": "+1234567891",
  "emailConfirmed": true,
  "lockoutEnabled": false,
  "twoFactorEnabled": true
}
```

#### Success Response (200):
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "userName": "updated.user@example.com",
    "email": "updated.user@example.com",
    "emailConfirmed": true,
    "phoneNumber": "+1234567891",
    "phoneNumberConfirmed": false,
    "twoFactorEnabled": true,
    "lockoutEnabled": false,
    "roles": ["User"],
    "isActive": true
  }
}
```

### 5. Delete User
**Endpoint**: `DELETE /api/user/{id}`  
**Description**: Delete user (soft delete)  
**Authentication**: JWT Bearer Token required

#### Success Response (200):
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

### 6. Lock User Account
**Endpoint**: `POST /api/user/{id}/lock`  
**Description**: Lock user account for specified duration  
**Authentication**: JWT Bearer Token required

#### Request Payload:
```json
{
  "lockoutMinutes": 60,
  "reason": "Security violation"
}
```

#### Success Response (200):
```json
{
  "success": true,
  "message": "User account locked successfully",
  "data": {
    "lockoutEnd": "2025-09-21T12:30:00Z",
    "reason": "Security violation"
  }
}
```

### 7. Unlock User Account
**Endpoint**: `POST /api/user/{id}/unlock`  
**Description**: Unlock user account  
**Authentication**: JWT Bearer Token required

#### Success Response (200):
```json
{
  "success": true,
  "message": "User account unlocked successfully"
}
```

### 8. Reset User Password
**Endpoint**: `POST /api/user/{id}/reset-password`  
**Description**: Reset user password  
**Authentication**: JWT Bearer Token required

#### Request Payload:
```json
{
  "newPassword": "NewPassword123!",
  "confirmPassword": "NewPassword123!"
}
```

#### Success Response (200):
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

## 🛡️ Role Management Controller (`/api/role`)

### 1. Get All Roles (Paginated)
**Endpoint**: `GET /api/role`  
**Description**: Retrieve paginated list of roles  
**Authentication**: JWT Bearer Token required

#### Query Parameters:
- `page` (int, optional): Page number (default: 1)
- `pageSize` (int, optional): Items per page (default: 10, max: 100)
- `search` (string, optional): Search term for role name

#### Success Response (200):
```json
{
  "success": true,
  "message": "Roles retrieved successfully",
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Administrator",
        "normalizedName": "ADMINISTRATOR",
        "userCount": 5,
        "concurrencyStamp": "550e8400-e29b-41d4-a716-446655440001"
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "name": "User",
        "normalizedName": "USER",
        "userCount": 25,
        "concurrencyStamp": "550e8400-e29b-41d4-a716-446655440003"
      }
    ],
    "totalCount": 5,
    "pageNumber": 1,
    "pageSize": 10,
    "totalPages": 1,
    "hasPreviousPage": false,
    "hasNextPage": false
  }
}
```

### 2. Get Role by ID
**Endpoint**: `GET /api/role/{id}`  
**Description**: Retrieve specific role by ID  
**Authentication**: JWT Bearer Token required

#### Success Response (200):
```json
{
  "success": true,
  "message": "Role retrieved successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Administrator",
    "normalizedName": "ADMINISTRATOR",
    "userCount": 5,
    "concurrencyStamp": "550e8400-e29b-41d4-a716-446655440001"
  }
}
```

### 3. Create Role
**Endpoint**: `POST /api/role`  
**Description**: Create a new role  
**Authentication**: JWT Bearer Token required

#### Request Payload:
```json
{
  "name": "Manager"
}
```

#### Success Response (201):
```json
{
  "success": true,
  "message": "Role created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440004",
    "name": "Manager",
    "normalizedName": "MANAGER",
    "userCount": 0,
    "concurrencyStamp": "550e8400-e29b-41d4-a716-446655440005"
  }
}
```

### 4. Update Role
**Endpoint**: `PUT /api/role/{id}`  
**Description**: Update existing role  
**Authentication**: JWT Bearer Token required

#### Request Payload:
```json
{
  "name": "Senior Manager"
}
```

#### Success Response (200):
```json
{
  "success": true,
  "message": "Role updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440004",
    "name": "Senior Manager",
    "normalizedName": "SENIOR MANAGER",
    "userCount": 3,
    "concurrencyStamp": "550e8400-e29b-41d4-a716-446655440006"
  }
}
```

### 5. Delete Role
**Endpoint**: `DELETE /api/role/{id}`  
**Description**: Delete role (if no users assigned)  
**Authentication**: JWT Bearer Token required

#### Success Response (200):
```json
{
  "success": true,
  "message": "Role deleted successfully"
}
```

#### Error Response (400):
```json
{
  "success": false,
  "message": "Cannot delete role with assigned users",
  "statusCode": 400,
  "errors": ["Role has 5 users assigned"]
}
```

---

## 👤🛡️ User Roles Controller (`/api/userroles`)

### 1. Get User Roles
**Endpoint**: `GET /api/userroles/{userId}`  
**Description**: Get all roles assigned to a user  
**Authentication**: JWT Bearer Token required

#### Success Response (200):
```json
{
  "success": true,
  "message": "User roles retrieved successfully",
  "data": [
    {
      "roleId": "550e8400-e29b-41d4-a716-446655440000",
      "roleName": "User",
      "assignedDate": "2025-09-15T10:30:00Z"
    },
    {
      "roleId": "550e8400-e29b-41d4-a716-446655440002",
      "roleName": "Manager",
      "assignedDate": "2025-09-20T14:15:00Z"
    }
  ]
}
```

### 2. Assign Role to User
**Endpoint**: `POST /api/userroles/{userId}/assign`  
**Description**: Assign a role to a user  
**Authentication**: JWT Bearer Token required

#### Request Payload:
```json
{
  "roleName": "Manager"
}
```

#### Success Response (200):
```json
{
  "success": true,
  "message": "Role assigned successfully",
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "roleId": "550e8400-e29b-41d4-a716-446655440002",
    "roleName": "Manager",
    "assignedDate": "2025-09-21T11:30:00Z"
  }
}
```

### 3. Remove Role from User
**Endpoint**: `POST /api/userroles/{userId}/remove`  
**Description**: Remove a role from a user  
**Authentication**: JWT Bearer Token required

#### Request Payload:
```json
{
  "roleName": "Manager"
}
```

#### Success Response (200):
```json
{
  "success": true,
  "message": "Role removed successfully"
}
```

### 4. Check User Role
**Endpoint**: `GET /api/userroles/{userId}/check/{roleName}`  
**Description**: Check if user has specific role  
**Authentication**: JWT Bearer Token required

#### Success Response (200):
```json
{
  "success": true,
  "message": "Role check completed",
  "data": {
    "hasRole": true,
    "roleName": "Manager",
    "assignedDate": "2025-09-20T14:15:00Z"
  }
}
```

---

## 🎫 Claims Controller (`/api/claims`)

### 1. Get User Claims
**Endpoint**: `GET /api/claims/user/{userId}`  
**Description**: Get all claims for a specific user  
**Authentication**: JWT Bearer Token required

#### Success Response (200):
```json
{
  "success": true,
  "message": "User claims retrieved successfully",
  "data": [
    {
      "type": "permission",
      "value": "read_users",
      "issuer": "AuthProvider"
    },
    {
      "type": "permission",
      "value": "write_users",
      "issuer": "AuthProvider"
    },
    {
      "type": "department",
      "value": "IT",
      "issuer": "AuthProvider"
    }
  ]
}
```

### 2. Get Role Claims
**Endpoint**: `GET /api/claims/role/{roleId}`  
**Description**: Get all claims for a specific role  
**Authentication**: JWT Bearer Token required

#### Success Response (200):
```json
{
  "success": true,
  "message": "Role claims retrieved successfully",
  "data": [
    {
      "type": "permission",
      "value": "manage_users",
      "issuer": "AuthProvider"
    },
    {
      "type": "access_level",
      "value": "admin",
      "issuer": "AuthProvider"
    }
  ]
}
```

### 3. Add Claim
**Endpoint**: `POST /api/claims`  
**Description**: Add claim to user or role  
**Authentication**: JWT Bearer Token required

#### Request Payload (User Claim):
```json
{
  "userName": "user@example.com",
  "claimType": "permission",
  "claimValue": "delete_users"
}
```

#### Request Payload (Role Claim):
```json
{
  "roleName": "Manager",
  "claimType": "access_level",
  "claimValue": "supervisor"
}
```

#### Success Response (200):
```json
{
  "success": true,
  "message": "Claim added successfully"
}
```

### 4. Remove Claim
**Endpoint**: `DELETE /api/claims`  
**Description**: Remove claim from user or role  
**Authentication**: JWT Bearer Token required

#### Request Payload:
```json
{
  "userName": "user@example.com",
  "claimType": "permission",
  "claimValue": "delete_users"
}
```

#### Success Response (200):
```json
{
  "success": true,
  "message": "Claim removed successfully"
}
```

### 5. Get Available Claim Types
**Endpoint**: `GET /api/claims/types`  
**Description**: Get list of available claim types  
**Authentication**: JWT Bearer Token required

#### Success Response (200):
```json
{
  "success": true,
  "message": "Claim types retrieved successfully",
  "data": [
    "permission",
    "access_level",
    "department",
    "location",
    "team"
  ]
}
```

---

## 📄 Common Response Patterns

### Success Response Structure:
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}, // Response data (varies by endpoint)
  "statusCode": 200
}
```

### Error Response Structure:
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

### Validation Error Response:
```json
{
  "success": false,
  "message": "Validation failed",
  "statusCode": 400,
  "errors": [
    "The UserName field is required.",
    "The Password field must be at least 6 characters long."
  ]
}
```

### Pagination Response Structure:
```json
{
  "items": [], // Array of items
  "totalCount": 100,
  "pageNumber": 1,
  "pageSize": 10,
  "totalPages": 10,
  "hasPreviousPage": false,
  "hasNextPage": true
}
```

---

## 🔒 Authentication & Authorization

### JWT Bearer Token
Include the JWT token in the Authorization header for protected endpoints:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### HTTP Status Codes
- `200 OK`: Success
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request/validation errors
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Access denied
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource already exists
- `500 Internal Server Error`: Server error

---

## 📝 Notes

1. **Password Requirements**: Passwords must meet complexity requirements (uppercase, lowercase, numbers, special characters)
2. **Email Validation**: Email addresses must be valid format
3. **Rate Limiting**: Login attempts may be rate limited
4. **Account Lockout**: Accounts may be locked after failed login attempts
5. **Token Expiration**: JWT tokens expire after 60 minutes by default
6. **Refresh Tokens**: Use refresh tokens to obtain new access tokens
7. **Two-Factor Authentication**: Some endpoints support 2FA when enabled

This documentation covers all the main controllers and endpoints in your AuthProvider API. Each endpoint includes the request format, response format, and common error scenarios.