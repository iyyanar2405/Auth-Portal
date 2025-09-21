import { of } from 'rxjs';

export const createActionsMock = () => ({
  pipe: jest.fn().mockReturnValue(of({})),
});
