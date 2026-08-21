import { upload } from "@vercel/blob/client";

export async function uploadFile(file: File, type: string) {
  try {
    const blob = await upload(
      `${type}_${Date.now()}_${file.name}`,
      file,
      {
        access: "public",
        handleUploadUrl: "/api/upload",
        clientPayload: JSON.stringify({
          type,
        }),
      },
    );

    return {
      url: blob.url,
    };
  } catch (error) {
    console.error("Error subiendo archivo:", error);
    throw error;
  }
}