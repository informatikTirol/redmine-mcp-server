/**
 * MCP handler for Base64 thumbnail download
 */
import { downloadThumbnailAsBase64FromRedmine } from "./thumbnail-as-base64-content-client";

export interface DownloadThumbnailAsBase64ContentArgs {
  pathParams: {
    attachmentId: number;
  };
}

export const downloadThumbnailAsBase64ContentHandler = async (args: DownloadThumbnailAsBase64ContentArgs) => {
  const result = await downloadThumbnailAsBase64FromRedmine(
    args.pathParams.attachmentId
  );

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(
          {
            success: true,
            content: result.content,
            attachmentId: result.attachmentId,
            message: `Thumbnail downloaded successfully as Base64 content for attachment ${result.attachmentId}`,
          },
          null,
          2
        ),
      },
    ],
  };
};