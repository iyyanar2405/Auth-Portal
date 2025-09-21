export const createAuthServiceMock = () => ({
  login: jest.fn(),
  logout: jest.fn(),
  getToken: jest.fn(),
  getClientCredentialToken: jest.fn(),
  isUserAuthenticated: jest.fn(),
  isUserValidated: jest.fn(),
});
