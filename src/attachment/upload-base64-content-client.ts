/**
 * HTTP client for Base64 content upload to Redmine
 */
import { customFetch } from "../api/custom-fetch";
import { UploadFileResponse, UploadBase64ContentParams } from "../types/attachment";

export async function uploadBase64ContentToRedmine(
  content: string,
  filename: string
): Promise<UploadFileResponse> {
  // Validate Base64 content
  if (!content) {
    throw new Error("Base64 content is required");
  }

  if (!filename) {
    throw new Error("Filename is required");
  }

  // Convert Base64 to Buffer
  let fileBuffer: Buffer;
  try {
    fileBuffer = Buffer.from(content, "base64");
  } catch (error) {
    throw new Error(`Invalid Base64 content: ${error}`);
  }

  // Build query parameters
  const searchParams = new URLSearchParams();
  searchParams.append("filename", filename);
  const query = searchParams.toString();

  const url = "/uploads.json" + (query.length > 0 ? `?${query}` : "");

  const response = await customFetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/octet-stream",
    },
    body: fileBuffer,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Upload failed with status ${response.status}: ${errorText}`
    );
  }

  const result = (await response.json()) as UploadFileResponse;
  return result;
}