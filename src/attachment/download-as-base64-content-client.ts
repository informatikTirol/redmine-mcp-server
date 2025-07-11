/**
 * HTTP client for Base64 content download from Redmine
 */
import { getDownloadAttachmentFileUrl } from "../__generated__/http-client";
import { customFetch } from "../api/custom-fetch";
import { DownloadBase64ContentResponse } from "../types/attachment";

export async function downloadFileAsBase64FromRedmine(
  attachmentId: number,
  filename: string
): Promise<DownloadBase64ContentResponse> {
  // Download the actual file using the generated URL function
  const downloadUrl = getDownloadAttachmentFileUrl(attachmentId, filename);
  const downloadResponse = await customFetch(downloadUrl);

  if (!downloadResponse.ok) {
    throw new Error(
      `Failed to download file: ${downloadResponse.status} ${downloadResponse.statusText}`
    );
  }

  // Get file content as buffer
  const fileBuffer = await downloadResponse.arrayBuffer();
  
  // Convert to Base64
  const base64Content = Buffer.from(fileBuffer).toString("base64");

  return {
    content: base64Content,
    filename: filename,
  };
}