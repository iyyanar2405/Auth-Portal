import { of } from 'rxjs';

export const createConfirmationServiceMock = () => ({
  confirm: jest.fn().mockReturnValue(of(true)),
});
