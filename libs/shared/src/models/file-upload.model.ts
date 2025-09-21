export interface FileUpload {
  data: {
    documentId: number;
    fileName: string;
  };
  error?: {
    errorCode: string;
    fileName: string;
  };
  isSuccess: boolean;
  message: string;
}
