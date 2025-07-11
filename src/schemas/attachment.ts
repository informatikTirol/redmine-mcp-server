/**
 * Zod schemas for file upload and download operations
 */
import { z as zod } from "zod";

// Local file system based operations (existing)
export const uploadLocalFileParams = zod.object({
  filePath: zod.string().describe("Path to the file to upload"),
  filename: zod
    .string()
    .optional()
    .describe(
      "Optional filename to use in Redmine (defaults to basename of filePath)"
    ),
});

export const downloadToLocalFileParams = zod.object({
  attachmentId: zod.number().describe("Redmine attachment ID to download"),
  filename: zod.string().describe("Filename of the attachment to download"),
  outputDir: zod
    .string()
    .optional()
    .describe("Optional output directory (defaults to OS temp directory)"),
});

export const downloadThumbnailToLocalFileParams = zod.object({
  attachmentId: zod.number().describe("Redmine attachment ID to download thumbnail for"),
  outputDir: zod
    .string()
    .optional()
    .describe("Optional output directory (defaults to OS temp directory)"),
});

// Base64 content based operations (new)
export const uploadBase64ContentParams = zod.object({
  content: zod.string().describe("Base64 encoded file content"),
  filename: zod.string().describe("Filename to use in Redmine"),
});

export const downloadAsBase64ContentParams = zod.object({
  attachmentId: zod.number().describe("Redmine attachment ID to download"),
  filename: zod.string().describe("Filename of the attachment to download"),
});

export const downloadThumbnailAsBase64ContentParams = zod.object({
  attachmentId: zod.number().describe("Redmine attachment ID to download thumbnail for"),
});

// Type exports for local file operations
export type UploadLocalFileParams = zod.infer<typeof uploadLocalFileParams>;
export type DownloadToLocalFileParams = zod.infer<typeof downloadToLocalFileParams>;
export type DownloadThumbnailToLocalFileParams = zod.infer<typeof downloadThumbnailToLocalFileParams>;

// Type exports for Base64 content operations
export type UploadBase64ContentParams = zod.infer<typeof uploadBase64ContentParams>;
export type DownloadAsBase64ContentParams = zod.infer<typeof downloadAsBase64ContentParams>;
export type DownloadThumbnailAsBase64ContentParams = zod.infer<typeof downloadThumbnailAsBase64ContentParams>;

