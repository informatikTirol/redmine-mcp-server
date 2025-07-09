/**
 * File upload and download types
 */

export interface UploadFileParams {
  filePath: string;
  filename?: string;
}

export interface UploadFileResponse {
  upload: {
    id: number;
    token: string;
  };
}

export interface DownloadFileParams {
  attachmentId: number;
  filename: string;
  outputDir?: string;
}

export interface DownloadFileResponse {
  filePath: string;
  filename: string;
}
