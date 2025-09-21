import saveAs from 'file-saver';

export const downloadFileFromByteArray = (
  inputArray: number[],
  fileName: string,
  mimeType: string,
) => {
  const uint8Array = new Uint8Array(inputArray);
  const blob = new Blob([uint8Array], {
    type: mimeType,
  });
  saveAs(blob, fileName);
};

export const downloadFileFromBase64 = (
  base64String: string,
  fileName: string,
  mimeType: string,
) => {
  const byteCharacters = atob(base64String);
  const byteArrays = new Uint8Array(byteCharacters.length);

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < byteCharacters.length; i++) {
    byteArrays[i] = byteCharacters.charCodeAt(i);
  }

  const blob = new Blob([byteArrays], { type: mimeType });

  saveAs(blob, fileName);
};
