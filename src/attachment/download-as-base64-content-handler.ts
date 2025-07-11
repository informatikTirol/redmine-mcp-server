/**
 * MCP handler for Base64 content download
 */
import { downloadFileAsBase64FromRedmine } from "./download-as-base64-content-client";

export interface DownloadAsBase64ContentArgs {
  pathParams: {
    attachmentId: number;
    filename: string;
  };
}

export const downloadAsBase64ContentHandler = async (args: DownloadAsBase64ContentArgs) => {
  const result = await downloadFileAsBase64FromRedmine(
    args.pathParams.attachmentId,
    args.pathParams.filename
  );

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(
          {
            success: true,
            content: result.content,
            filename: result.filename,
            message: `File downloaded successfully as Base64 content.`,
          },
          null,
          2
        ),
      },
    ],
  };
};