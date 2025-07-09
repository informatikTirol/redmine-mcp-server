/**
 * Zod schemas for file upload and download operations
 */
import { z as zod } from "zod";

export const uploadFileParams = zod.object({
  filePath: zod.string().describe("Path to the file to upload"),
  filename: zod
    .string()
    .optional()
    .describe(
      "Optional filename to use in Redmine (defaults to basename of filePath)"
    ),
});

export const downloadFileParams = zod.object({
  attachmentId: zod.number().describe("Redmine attachment ID to download"),
  filename: zod.string().describe("Filename of the attachment to download"),
  outputDir: zod
    .string()
    .optional()
    .describe("Optional output directory (defaults to OS temp directory)"),
});

export const downloadThumbnailParams = zod.object({
  attachmentId: zod.number().describe("Redmine attachment ID to download thumbnail for"),
  outputDir: zod
    .string()
    .optional()
    .describe("Optional output directory (defaults to OS temp directory)"),
});

export type UploadFileParams = zod.infer<typeof uploadFileParams>;
export type DownloadFileParams = zod.infer<typeof downloadFileParams>;
export type DownloadThumbnailParams = zod.infer<typeof downloadThumbnailParams>;
