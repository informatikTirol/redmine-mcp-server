/**
 * HTTP client for file download from Redmine
 */
import fs from "fs";
import os from "os";
import path from "path";
import { getDownloadAttachmentFileUrl } from "../__generated__/http-client";
import { customFetch } from "../api/custom-fetch";
import { DownloadLocalFileResponse } from "../types/attachment";

export async function downloadFileToLocalFromRedmine(
  attachmentId: number,
  filename: string,
  outputDir?: string
): Promise<DownloadLocalFileResponse> {
  // Download the actual file using the generated URL function
  const downloadUrl = getDownloadAttachmentFileUrl(attachmentId, filename);
  const downloadResponse = await customFetch(downloadUrl);

  if (!downloadResponse.ok) {
    throw new Error(
      `Failed to download file: ${downloadResponse.status} ${downloadResponse.statusText}`
    );
  }

  // Determine output directory and file path
  const actualOutputDir = outputDir || os.tmpdir();

  // Ensure output directory exists
  if (!fs.existsSync(actualOutputDir)) {
    fs.mkdirSync(actualOutputDir, { recursive: true });
  }

  // Create unique filename to avoid conflicts
  const timestamp = Date.now();
  const ext = path.extname(filename);
  const uniqueFilename = `redmine_attachment_${attachmentId}_${timestamp}${ext}`;
  const outputPath = path.join(actualOutputDir, uniqueFilename);

  // Write file to disk
  const fileBuffer = await downloadResponse.arrayBuffer();
  fs.writeFileSync(outputPath, Buffer.from(fileBuffer));

  return {
    filePath: outputPath,
    filename: filename,
  };
}
