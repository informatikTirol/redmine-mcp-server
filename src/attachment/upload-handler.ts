/**
 * MCP handler for file upload
 */
import { uploadFileToRedmine } from "./upload-client";

export interface UploadFileArgs {
  pathParams: {
    filePath: string;
    filename?: string;
  };
}

export const uploadFileHandler = async (args: UploadFileArgs) => {
  const result = await uploadFileToRedmine(
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
