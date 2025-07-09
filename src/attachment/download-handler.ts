/**
 * MCP handler for file download
 */
import { downloadFileFromRedmine } from "./download-client";

export interface DownloadFileArgs {
  pathParams: {
    attachmentId: number;
    filename: string;
    outputDir?: string;
  };
}

export const downloadFileHandler = async (args: DownloadFileArgs) => {
  const result = await downloadFileFromRedmine(
    args.pathParams.attachmentId,
    args.pathParams.filename,
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
            message: `File downloaded successfully to: ${result.filePath}`,
          },
          null,
          2
        ),
      },
    ],
  };
};
