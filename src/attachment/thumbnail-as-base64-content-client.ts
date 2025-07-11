/**
 * HTTP client for Base64 thumbnail download from Redmine
 */
import { getDownloadThumbnailUrl } from "../__generated__/http-client";
import { customFetch } from "../api/custom-fetch";
import { DownloadThumbnailBase64ContentResponse } from "../types/attachment";

export async function downloadThumbnailAsBase64FromRedmine(
  attachmentId: number
): Promise<DownloadThumbnailBase64ContentResponse> {
  // Download the thumbnail using the generated URL function
  const downloadUrl = getDownloadThumbnailUrl(attachmentId);
  const downloadResponse = await customFetch(downloadUrl);

  if (!downloadResponse.ok) {
    throw new Error(
      `Failed to download thumbnail: ${downloadResponse.status} ${downloadResponse.statusText}`
    );
  }

  // Get thumbnail content as buffer
  const fileBuffer = await downloadResponse.arrayBuffer();
  
  // Convert to Base64
  const base64Content = Buffer.from(fileBuffer).toString("base64");

  return {
    content: base64Content,
    attachmentId: attachmentId,
  };
}