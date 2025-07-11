/**
 * HTTP client for file upload to Redmine
 */
import fs from "fs";
import path from "path";
import { customFetch } from "../api/custom-fetch";
import { UploadFileResponse } from "../types/attachment";

export async function uploadLocalFileToRedmine(
  filePath: string,
  filename?: string
): Promise<UploadFileResponse> {
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  // Read file as buffer
  const fileBuffer = fs.readFileSync(filePath);

  // Use provided filename or extract from file path
  const actualFilename = filename || path.basename(filePath);

  const searchParams = new URLSearchParams();
  if (actualFilename) {
    searchParams.append("filename", actualFilename);
  }
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
