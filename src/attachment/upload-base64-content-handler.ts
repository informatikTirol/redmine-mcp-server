/**
 * MCP handler for Base64 content upload
 */
import { uploadBase64ContentToRedmine } from "./upload-base64-content-client";

export interface UploadBase64ContentArgs {
  pathParams: {
    content: string;
    filename: string;
  };
}

export const uploadBase64ContentHandler = async (args: UploadBase64ContentArgs) => {
  const result = await uploadBase64ContentToRedmine(
    args.pathParams.content,
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
            message: `File uploaded successfully from Base64 content. Token: ${result.upload.token}`,
          },
          null,
          2
        ),
      },
    ],
  };
};