/**
 * File upload and download types
 */

// Local file system based types (existing)
export interface UploadLocalFileParams {
  filePath: string;
  filename?: string;
}

export interface DownloadToLocalFileParams {
  attachmentId: number;
  filename: string;
  outputDir?: string;
}

export interface DownloadLocalFileResponse {
  filePath: string;
  filename: string;
}

// Base64 content based types (new)
export interface UploadBase64ContentParams {
  content: string;
  filename: string;
}

export interface DownloadAsBase64ContentParams {
  attachmentId: number;
  filename: string;
}

export interface DownloadThumbnailAsBase64ContentParams {
  attachmentId: number;
}

export interface DownloadBase64ContentResponse {
  content: string;
  filename: string;
}

export interface DownloadThumbnailBase64ContentResponse {
  content: string;
  attachmentId: number;
}

// Common upload response (same for both local file and Base64)
export interface UploadFileResponse {
  upload: {
    id: number;
    token: string;
  };
}

