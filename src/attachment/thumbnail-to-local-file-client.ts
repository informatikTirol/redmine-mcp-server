/**
 * HTTP client for thumbnail download from Redmine
 */
import fs from "fs";
import os from "os";
import path from "path";
import { getDownloadThumbnailUrl } from "../__generated__/http-client";
import { customFetch } from "../api/custom-fetch";
import { DownloadLocalFileResponse } from "../types/attachment";

export async function downloadThumbnailToLocalFromRedmine(
  attachmentId: number,
  outputDir?: string
): Promise<DownloadLocalFileResponse> {
  // Download the thumbnail using the generated URL function
  const downloadUrl = getDownloadThumbnailUrl(attachmentId);
  const downloadResponse = await customFetch(downloadUrl);

  if (!downloadResponse.ok) {
    throw new Error(
      `Failed to download thumbnail: ${downloadResponse.status} ${downloadResponse.statusText}`
    );
  }

  // Determine output directory and file path
  const actualOutputDir = outputDir || os.tmpdir();

  // Ensure output directory exists
  if (!fs.existsSync(actualOutputDir)) {
    fs.mkdirSync(actualOutputDir, { recursive: true });
  }

  // Create unique filename for thumbnail
  const timestamp = Date.now();
  const uniqueFilename = `redmine_thumbnail_${attachmentId}_${timestamp}.png`;
  const outputPath = path.join(actualOutputDir, uniqueFilename);

  // Write thumbnail to disk
  const fileBuffer = await downloadResponse.arrayBuffer();
  fs.writeFileSync(outputPath, Buffer.from(fileBuffer));

  return {
    filePath: outputPath,
    filename: uniqueFilename,
  };
}