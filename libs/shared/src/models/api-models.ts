// ===== Authentication Models =====

export interface LoginViewModel {
  userName: string;
  password: string;
  deviceCode?: string | null;
}

export interface RegisterViewModel {
  userName?: string | null;
  email: string;
  password: string;
  confirmPassword?: string | null;
}

export interface ForgotPasswordViewModel {
  email: string;
}

export interface ResetPasswordViewModel {
  userId: string;
  password: string;
  confirmPassword?: string | null;
  code?: string | null;
}

export interface SetPasswordViewModel {
  newPassword: string;
  confirmPassword?: string | null;
  statusMessage?: string | null;
}

export interface ConfirmEmailViewModel {
  userId?: string | null;
  code?: string | null;
}

export interface ChangePasswordViewModel {
  oldPassword: string;
  newPassword: string;
  confirmPassword?: string | null;
  statusMessage?: string | null;
}

// ===== Token and Authentication Response Models =====

export interface TokenModel {
  hasVerifiedEmail?: boolean | null;
  tfaEnabled?: boolean | null;
  access_token?: string | null;
  token_type?: string | null;
  expires_in: number;
  issued?: string | null;
  expires?: string | null;
  refreshToken: string;
  resetToken?: string | null;
  tfaToken?: string | null;
  deviceCode?: string | null;
  last4?: string | null;
}

export interface IdentityError {
  code?: string | null;
  description?: string | null;
}

export interface IdentityResult {
  succeeded: boolean;
  errors?: IdentityError[] | null;
}

// ===== User Management Models =====

export interface UserResponseDto {
  id?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  emailConfirmed: boolean;
  lockoutEnabled: boolean;
  twoFactorEnabled: boolean;
  lastPasswordChanged?: string | null;
  roles?: string[] | null;
}

export interface CreateUserDto {
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber?: string | null;
  emailConfirmed: boolean;
}

export interface UpdateUserDto {
  email: string;
  phoneNumber?: string | null;
  emailConfirmed: boolean;
  lockoutEnabled: boolean;
  twoFactorEnabled: boolean;
}

export interface UserModel {
  email?: string | null;
  emailConfirmed: boolean;
  lockoutEnabled: boolean;
  roles?: string[] | null;
  tfaEnabled: boolean;
}

export interface UserViewModel {
  id?: string | null;
  userName?: string | null;
  password?: string | null;
  confirmPassword?: string | null;
  email?: string | null;
  userId?: string | null;
  roleId?: string | null;
  phoneNumber?: string | null;
  emailConfirmed: boolean;
}

// ===== Role Management Models =====

export interface RoleResponseDto {
  id?: string | null;
  name?: string | null;
  description?: string | null;
  userCount: number;
}

export interface CreateRoleDto {
  name: string;
  description?: string | null;
}

// ===== Claims Management Models =====

export interface ClaimViewModel {
  userName?: string | null;
  roleName?: string | null;
  claimType: string;
  claimValue: string;
}

export interface ClaimUpdateViewModel {
  userName?: string | null;
  roleName?: string | null;
  claimType: string;
  claimValue: string;
  originalClaimType: string;
  originalClaimValue: string;
}

export interface StringStringKeyValuePair {
  key?: string | null;
  value?: string | null;
}

// ===== User Role Management Models =====

export interface UserRoleDto {
  userId: string;
  roleId: string;
}

// ===== Two-Factor Authentication Models =====

export interface TwoFactorAuthenticationViewModel {
  hasAuthenticator: boolean;
  recoveryCodesLeft: number;
  is2faEnabled: boolean;
}

export interface EnableAuthenticatorViewModel {
  code: string;
  sharedKey?: string | null;
  authenticatorUri?: string | null;
}

export interface ShowRecoveryCodesViewModel {
  recoveryCodes?: string[] | null;
}

// ===== Pagination Models =====

export interface PagedResponseDto<T> {
  items?: T[] | null;
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PaginationParams {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
}

// ===== API Response Wrappers =====

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T | null;
  message?: string | null;
  errors?: string[] | null;
  statusCode: number;
  timestamp: string;
}

export interface BooleanApiResponse extends ApiResponse<boolean> {}

export interface TokenModelApiResponse extends ApiResponse<TokenModel> {}

export interface UserResponseDtoApiResponse extends ApiResponse<UserResponseDto> {}

export interface UserResponseDtoPagedResponseDtoApiResponse extends ApiResponse<PagedResponseDto<UserResponseDto>> {}

export interface RoleResponseDtoApiResponse extends ApiResponse<RoleResponseDto> {}

export interface RoleResponseDtoPagedResponseDtoApiResponse extends ApiResponse<PagedResponseDto<RoleResponseDto>> {}

export interface RoleResponseDtoIEnumerableApiResponse extends ApiResponse<RoleResponseDto[]> {}

export interface StringIEnumerableApiResponse extends ApiResponse<string[]> {}

export interface StringStringKeyValuePairIEnumerableApiResponse extends ApiResponse<StringStringKeyValuePair[]> {}

// ===== API Endpoints Constants =====

export const API_BASE_URL = 'http://localhost:7136';

export const API_ENDPOINTS = {
  // Authentication
  CONFIRM_EMAIL: '/api/Authorize/confirm-email',
  REGISTER: '/api/Authorize/register',
  TOKEN: '/api/Authorize/token',
  LOGIN: '/api/Authorize/Login',
  REFRESH_TOKEN: '/api/Authorize/refresh-token',
  LOGOUT: '/api/Authorize/LogOut',
  FORGOT_PASSWORD: '/api/Authorize/forgotPassword',
  RESET_PASSWORD: '/api/Authorize/resetPassword',
  RESEND_VERIFICATION_EMAIL: '/api/Authorize/resendVerificationEmail',
  SET_TFA: '/api/Authorize/setTfa',
  SET_PASSWORD: '/api/Authorize/setpassword',
  SEND_TFA_SMS: '/api/Authorize/SendTfaSMS',
  ADD_TFA_PHONE: '/api/Authorize/AddTfaPhone',
  VERIFY_TFA_CODE: '/api/Authorize/VerifyTFACode',
  QR_CODE: '/api/Authorize/QRCode',
  TOTP: '/api/Authorize/totp',

  // Claims Management
  CLAIMS_ME: '/api/Claims/me',
  CLAIMS_USER: '/api/Claims/user',
  CLAIMS_ROLE: '/api/Claims/role',
  CLAIMS_TYPES: '/api/Claims/types',
  CLAIMS: '/api/Claims',
  CLAIMS_USER_UPDATE: '/api/Claims/user',
  CLAIMS_ROLE_UPDATE: '/api/Claims/role',

  // User Management
  USER_IS_AUTHENTICATED: '/api/User/is-authenticated',
  USER: '/api/User',
  USER_BY_ID: '/api/User',
  USER_LOCKOUT: '/api/User/{id}/lockout',
  USER_UNLOCK: '/api/User/{id}/unlock',
  USER_RESET_PASSWORD: '/api/User/{id}/reset-password',

  // Role Management
  ROLE: '/api/Role',
  ROLE_BY_ID: '/api/Role',
  ROLE_USERS: '/api/Role/{id}/users',

  // User Role Management
  USER_ROLES_BY_USER: '/api/UserRoles/user',
  USER_ROLES_ME: '/api/UserRoles/me',
  USER_ROLES_BY_ROLE: '/api/UserRoles/role',
  USER_ROLES_ASSIGN: '/api/UserRoles/assign',
  USER_ROLES_REMOVE: '/api/UserRoles/remove',
  USER_ROLES_CHECK: '/api/UserRoles/check',

  // Manage
  MANAGE_USER_INFO: '/api/manage/userInfo',
  MANAGE_TFA: '/api/manage/twoFactorAuthentication',
  MANAGE_ENABLE_AUTHENTICATOR: '/api/manage/enableAuthenticator',
  MANAGE_CHANGE_PASSWORD: '/api/manage/changePassword',
  MANAGE_SEND_VERIFICATION_EMAIL: '/api/manage/sendVerificationEmail',
  MANAGE_SET_PASSWORD: '/api/manage/setPassword',
  MANAGE_SET_TFA: '/api/manage/setTfa',
  MANAGE_RESET_AUTHENTICATOR: '/api/manage/resetAuthenticator',
  MANAGE_GENERATE_RECOVERY_CODES: '/api/manage/generateRecoveryCodes',
  MANAGE_SAVE_TFA_DETAILS: '/api/manage/SaveTFADetails',

  // Sync
  SYNC_CHORUS_USER: '/api/sync/Chorus/User'
} as const;

// ===== Helper Types =====

export type ApiEndpoint = keyof typeof API_ENDPOINTS;

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, any>;
}

// ===== API Categories for Dashboard Display =====

export interface ApiEndpointInfo {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  summary: string;
  category: string;
  requiresAuth?: boolean;
  parameters?: string[];
}

export const API_CATEGORIES = {
  AUTHENTICATION: 'Authentication',
  USER_MANAGEMENT: 'User Management',
  ROLE_MANAGEMENT: 'Role Management',
  CLAIMS_MANAGEMENT: 'Claims Management',
  USER_ROLE_MANAGEMENT: 'User Role Management',
  ACCOUNT_MANAGEMENT: 'Account Management',
  TWO_FACTOR_AUTH: 'Two-Factor Authentication',
  SYNC: 'Sync Operations'
} as const;

export const API_ENDPOINTS_INFO: ApiEndpointInfo[] = [
  // Authentication
  { endpoint: '/api/Authorize/token', method: 'POST', summary: 'Authenticate user and generate access token', category: API_CATEGORIES.AUTHENTICATION },
  { endpoint: '/api/Authorize/register', method: 'POST', summary: 'Register a new user account', category: API_CATEGORIES.AUTHENTICATION },
  { endpoint: '/api/Authorize/LogOut', method: 'POST', summary: 'Log out user', category: API_CATEGORIES.AUTHENTICATION, requiresAuth: true },
  { endpoint: '/api/Authorize/forgotPassword', method: 'POST', summary: 'Send forgot password email', category: API_CATEGORIES.AUTHENTICATION },
  { endpoint: '/api/Authorize/resetPassword', method: 'POST', summary: 'Reset account password with reset token', category: API_CATEGORIES.AUTHENTICATION },
  { endpoint: '/api/Authorize/confirm-email', method: 'POST', summary: 'Confirm user email address with verification token', category: API_CATEGORIES.AUTHENTICATION },
  
  // User Management
  { endpoint: '/api/User', method: 'GET', summary: 'Get all users with pagination', category: API_CATEGORIES.USER_MANAGEMENT, requiresAuth: true, parameters: ['pageNumber', 'pageSize', 'searchTerm'] },
  { endpoint: '/api/User', method: 'POST', summary: 'Create a new user', category: API_CATEGORIES.USER_MANAGEMENT, requiresAuth: true },
  { endpoint: '/api/User/{id}', method: 'GET', summary: 'Get a specific user by ID', category: API_CATEGORIES.USER_MANAGEMENT, requiresAuth: true, parameters: ['id'] },
  { endpoint: '/api/User/{id}', method: 'PUT', summary: 'Update an existing user', category: API_CATEGORIES.USER_MANAGEMENT, requiresAuth: true, parameters: ['id'] },
  { endpoint: '/api/User/{id}', method: 'DELETE', summary: 'Delete a user', category: API_CATEGORIES.USER_MANAGEMENT, requiresAuth: true, parameters: ['id'] },
  { endpoint: '/api/User/{id}/lockout', method: 'POST', summary: 'Lock out a user account', category: API_CATEGORIES.USER_MANAGEMENT, requiresAuth: true, parameters: ['id', 'lockoutEnd?'] },
  { endpoint: '/api/User/{id}/unlock', method: 'POST', summary: 'Unlock a user account', category: API_CATEGORIES.USER_MANAGEMENT, requiresAuth: true, parameters: ['id'] },
  { endpoint: '/api/User/{id}/reset-password', method: 'POST', summary: 'Reset user password (Admin only)', category: API_CATEGORIES.USER_MANAGEMENT, requiresAuth: true, parameters: ['id'] },
  
  // Role Management
  { endpoint: '/api/Role', method: 'GET', summary: 'Get all roles with pagination', category: API_CATEGORIES.ROLE_MANAGEMENT, requiresAuth: true, parameters: ['pageNumber', 'pageSize', 'searchTerm'] },
  { endpoint: '/api/Role', method: 'POST', summary: 'Create a new role', category: API_CATEGORIES.ROLE_MANAGEMENT, requiresAuth: true },
  { endpoint: '/api/Role/{id}', method: 'GET', summary: 'Get a specific role by ID', category: API_CATEGORIES.ROLE_MANAGEMENT, requiresAuth: true, parameters: ['id'] },
  { endpoint: '/api/Role/{id}', method: 'PUT', summary: 'Update an existing role', category: API_CATEGORIES.ROLE_MANAGEMENT, requiresAuth: true, parameters: ['id'] },
  { endpoint: '/api/Role/{id}', method: 'DELETE', summary: 'Delete a role', category: API_CATEGORIES.ROLE_MANAGEMENT, requiresAuth: true, parameters: ['id'] },
  { endpoint: '/api/Role/{id}/users', method: 'GET', summary: 'Get all users assigned to a specific role', category: API_CATEGORIES.ROLE_MANAGEMENT, requiresAuth: true, parameters: ['id', 'pageNumber', 'pageSize'] },
  
  // Claims Management
  { endpoint: '/api/Claims/me', method: 'GET', summary: 'Get all claims for the current user', category: API_CATEGORIES.CLAIMS_MANAGEMENT, requiresAuth: true },
  { endpoint: '/api/Claims/user/{userId}', method: 'GET', summary: 'Get all claims for a specific user', category: API_CATEGORIES.CLAIMS_MANAGEMENT, requiresAuth: true, parameters: ['userId'] },
  { endpoint: '/api/Claims/role/{roleId}', method: 'GET', summary: 'Get all claims for a specific role', category: API_CATEGORIES.CLAIMS_MANAGEMENT, requiresAuth: true, parameters: ['roleId'] },
  { endpoint: '/api/Claims/types', method: 'GET', summary: 'Get all available claim types', category: API_CATEGORIES.CLAIMS_MANAGEMENT, requiresAuth: true },
  { endpoint: '/api/Claims', method: 'POST', summary: 'Add a claim to a user or role', category: API_CATEGORIES.CLAIMS_MANAGEMENT, requiresAuth: true },
  { endpoint: '/api/Claims/user', method: 'PUT', summary: 'Update a user claim', category: API_CATEGORIES.CLAIMS_MANAGEMENT, requiresAuth: true },
  { endpoint: '/api/Claims/user', method: 'DELETE', summary: 'Remove a claim from a user', category: API_CATEGORIES.CLAIMS_MANAGEMENT, requiresAuth: true },
  { endpoint: '/api/Claims/role', method: 'PUT', summary: 'Update a role claim', category: API_CATEGORIES.CLAIMS_MANAGEMENT, requiresAuth: true },
  { endpoint: '/api/Claims/role', method: 'DELETE', summary: 'Remove a claim from a role', category: API_CATEGORIES.CLAIMS_MANAGEMENT, requiresAuth: true },
  
  // User Role Management
  { endpoint: '/api/UserRoles/user/{userId}', method: 'GET', summary: 'Get all roles assigned to a user', category: API_CATEGORIES.USER_ROLE_MANAGEMENT, requiresAuth: true, parameters: ['userId'] },
  { endpoint: '/api/UserRoles/me', method: 'GET', summary: 'Get current user\'s roles', category: API_CATEGORIES.USER_ROLE_MANAGEMENT, requiresAuth: true },
  { endpoint: '/api/UserRoles/role/{roleId}', method: 'GET', summary: 'Get all users assigned to a role', category: API_CATEGORIES.USER_ROLE_MANAGEMENT, requiresAuth: true, parameters: ['roleId', 'pageNumber', 'pageSize'] },
  { endpoint: '/api/UserRoles/assign', method: 'POST', summary: 'Assign a role to a user', category: API_CATEGORIES.USER_ROLE_MANAGEMENT, requiresAuth: true },
  { endpoint: '/api/UserRoles/remove', method: 'DELETE', summary: 'Remove a role from a user', category: API_CATEGORIES.USER_ROLE_MANAGEMENT, requiresAuth: true },
  { endpoint: '/api/UserRoles/check/{userId}/{roleId}', method: 'GET', summary: 'Check if a user has a specific role', category: API_CATEGORIES.USER_ROLE_MANAGEMENT, requiresAuth: true, parameters: ['userId', 'roleId'] },
  
  // Account Management
  { endpoint: '/api/manage/userInfo', method: 'GET', summary: 'Get user information', category: API_CATEGORIES.ACCOUNT_MANAGEMENT, requiresAuth: true },
  { endpoint: '/api/manage/changePassword', method: 'POST', summary: 'Change password for authenticated user', category: API_CATEGORIES.ACCOUNT_MANAGEMENT, requiresAuth: true },
  { endpoint: '/api/manage/sendVerificationEmail', method: 'POST', summary: 'Send email verification email', category: API_CATEGORIES.ACCOUNT_MANAGEMENT, requiresAuth: true },
  { endpoint: '/api/manage/setPassword', method: 'POST', summary: 'Set a password if the user doesn\'t have one already', category: API_CATEGORIES.ACCOUNT_MANAGEMENT, requiresAuth: true },
  
  // Two-Factor Authentication
  { endpoint: '/api/manage/twoFactorAuthentication', method: 'GET', summary: 'Get TFA stats', category: API_CATEGORIES.TWO_FACTOR_AUTH, requiresAuth: true },
  { endpoint: '/api/manage/enableAuthenticator', method: 'GET', summary: 'Get authenticator setup info', category: API_CATEGORIES.TWO_FACTOR_AUTH, requiresAuth: true },
  { endpoint: '/api/manage/enableAuthenticator', method: 'POST', summary: 'Enable TFA (requires QR code)', category: API_CATEGORIES.TWO_FACTOR_AUTH, requiresAuth: true },
  { endpoint: '/api/manage/setTfa/{isEnabled}', method: 'POST', summary: 'Enable/Disable TFA', category: API_CATEGORIES.TWO_FACTOR_AUTH, requiresAuth: true, parameters: ['isEnabled'] },
  { endpoint: '/api/manage/resetAuthenticator', method: 'POST', summary: 'Reset TFA (This will reset and disable TFA)', category: API_CATEGORIES.TWO_FACTOR_AUTH, requiresAuth: true },
  { endpoint: '/api/manage/generateRecoveryCodes', method: 'POST', summary: 'Generate new recovery codes', category: API_CATEGORIES.TWO_FACTOR_AUTH, requiresAuth: true }
];