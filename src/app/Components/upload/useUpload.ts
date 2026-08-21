import { upload } from "@vercel/blob/client";

export async function uploadFile(file: File, type: string) {
  const blob = await upload(file.name, file, {
    access: "public",
    handleUploadUrl: "/api/upload",
    clientPayload: JSON.stringify({
      type,
    }),
    multipart: true,
  });

  return {
    url: blob.url,
  };
}