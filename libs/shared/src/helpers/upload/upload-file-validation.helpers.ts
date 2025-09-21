const MAX_NAME_LENGTH = 254;

export interface ErrorMessages {
  wrongFileSize: string;
  wrongFileNameLength: string;
  wrongTotalFileSize: string;
}

export function validateFileHelper(
  file: File,
  errorMessages: ErrorMessages,
  maxFileSize: number,
): string[] {
  const errors = [];

  if (file.size > maxFileSize) {
    errors.push(errorMessages.wrongFileSize);
  }

  if (file.name.length > MAX_NAME_LENGTH) {
    errors.push(errorMessages.wrongFileNameLength);
  }

  return errors;
}
