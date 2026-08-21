import { upload } from "@vercel/blob/client";

export async function uploadFile(file: File, type: string) {
  console.log("[UPLOAD] Iniciando:", file.name, file.size, file.type);

  const blob = await upload(file.name, file, {
    access: "public",
    handleUploadUrl: "/api/upload",
    clientPayload: JSON.stringify({ type }),
  });

  console.log("[UPLOAD] Blob recibido:", blob);

  return {
    url: blob.url,
  };
}