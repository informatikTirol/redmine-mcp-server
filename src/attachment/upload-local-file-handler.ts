/**
 * MCP handler for file upload
 */
import { uploadLocalFileToRedmine } from "./upload-local-file-client";

export interface UploadFileArgs {
  pathParams: {
    filePath: string;
    filename?: string;
  };
}

export const uploadFileHandler = async (args: UploadFileArgs) => {
  const result = await uploadLocalFileToRedmine(
    args.pathParams.filePath,
    args.pathParams.filename
  );

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(
          {
            success: true,
            token: result.upload.token,
            id: result.upload.id,
            message: `File uploaded successfully. Token: ${result.upload.token}`,
          },
          null,
          2
        ),
      },
    ],
  };
};
