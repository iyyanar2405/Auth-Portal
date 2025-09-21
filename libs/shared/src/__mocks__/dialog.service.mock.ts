import { Subject } from 'rxjs';

export const refMock = {
  onClose: new Subject(),
};

export const createDialogServiceMock = () => ({
  open: jest.fn().mockReturnValue(refMock),
});
