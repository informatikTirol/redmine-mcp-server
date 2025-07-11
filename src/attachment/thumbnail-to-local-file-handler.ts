/**
 * MCP handler for thumbnail download
 */
import { downloadThumbnailToLocalFromRedmine } from "./thumbnail-to-local-file-client";

export interface DownloadThumbnailArgs {
  pathParams: {
    attachmentId: number;
    outputDir?: string;
  };
}

export const downloadThumbnailHandler = async (args: DownloadThumbnailArgs) => {
  const result = await downloadThumbnailToLocalFromRedmine(
    args.pathParams.attachmentId,
    args.pathParams.outputDir
  );

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(
          {
            success: true,
            filePath: result.filePath,
            filename: result.filename,
            message: `Thumbnail downloaded successfully to: ${result.filePath}`,
          },
          null,
          2
        ),
      },
    ],
  };
};