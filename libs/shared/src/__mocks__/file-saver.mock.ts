export const createFileSaverMock = () => {
  const saveAsMock = jest.fn();
  jest.mock('file-saver', () => ({
    saveAs: saveAsMock,
  }));
  const createObjectURLMock = jest.fn();
  window.URL.createObjectURL = createObjectURLMock;

  return saveAsMock;
};
