import saveAs from 'file-saver';

enum HttpHeaders {
  // Text files
  TXT = 'text/plain',
  HTML = 'text/html',
  CSS = 'text/css',
  CSV = 'text/csv',

  // Image files
  JPEG = 'image/jpeg',
  JPG = 'image/jpg',
  PNG = 'image/png',
  GIF = 'image/gif',
  BMP = 'image/bmp',
  SVG = 'image/svg+xml',
  WEBP = 'image/webp',

  // Audio files
  MP3 = 'audio/mpeg',
  WAV = 'audio/wav',
  OGG = 'audio/ogg',

  // Video files
  MP4 = 'video/mp4',
  AVI = 'video/x-msvideo',
  MKV = 'video/x-matroska',
  MOV = 'video/quicktime',
  WEBM = 'video/webm',

  // Application files
  JSON = 'application/json',
  XML = 'application/xml',
  PDF = 'application/pdf',
  DOC = 'application/msword',
  DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  XLS = 'application/vnd.ms-excel',
  XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  PPT = 'application/vnd.ms-powerpoint',
  PPTX = 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ZIP = 'application/zip',
  GZIP = 'application/gzip',
  TAR = 'application/x-tar',
  RAR = 'application/vnd.rar',
  RTF = 'application/rtf',
}

const extensionToContentType: Record<string, HttpHeaders> = {
  TXT: HttpHeaders.TXT,
  HTML: HttpHeaders.HTML,
  CSS: HttpHeaders.CSS,
  CSV: HttpHeaders.CSV,
  JPEG: HttpHeaders.JPEG,
  JPG: HttpHeaders.JPEG,
  PNG: HttpHeaders.PNG,
  GIF: HttpHeaders.GIF,
  BMP: HttpHeaders.BMP,
  SVG: HttpHeaders.SVG,
  WEBP: HttpHeaders.WEBP,
  MP3: HttpHeaders.MP3,
  WAV: HttpHeaders.WAV,
  OGG: HttpHeaders.OGG,
  MP4: HttpHeaders.MP4,
  AVI: HttpHeaders.AVI,
  MKV: HttpHeaders.MKV,
  MOV: HttpHeaders.MOV,
  WEBM: HttpHeaders.WEBM,
  JSON: HttpHeaders.JSON,
  XML: HttpHeaders.XML,
  PDF: HttpHeaders.PDF,
  DOC: HttpHeaders.DOC,
  DOCX: HttpHeaders.DOCX,
  XLS: HttpHeaders.XLS,
  XLSX: HttpHeaders.XLSX,
  PPT: HttpHeaders.PPT,
  PPTX: HttpHeaders.PPTX,
  ZIP: HttpHeaders.ZIP,
  GZIP: HttpHeaders.GZIP,
  TAR: HttpHeaders.TAR,
  RAR: HttpHeaders.RAR,
  RTF: HttpHeaders.RTF,
};

export const getContentType = (
  filename: string,
  hasExtension = false,
): string => {
  const extension = filename.split('.').pop();
  const transformedExtension = extension ? extension.toUpperCase() : undefined;

  if (
    !transformedExtension ||
    !(transformedExtension in extensionToContentType)
  ) {
    throw new Error('Invalid or unsupported file extension');
  }

  if (hasExtension && extension) {
    return extension;
  }

  return extensionToContentType[transformedExtension];
};

export const downloadFromByteArray = (inputArray: any, fileName: string) => {
  const file = new Blob([inputArray.body], {
    type: getContentType(fileName),
  });

  saveAs(file, fileName);
};
