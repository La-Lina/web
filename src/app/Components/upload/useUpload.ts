import { upload } from "@vercel/blob/client";

export async function uploadFile(file: File, type: string) {
  const extension = file.name.split(".").pop()?.toLowerCase() || "";
  const safeType = type.replace(/[^a-zA-Z0-9_-]/g, "");
  const filename = `${safeType}_${Date.now()}_${Math.random()
    .toString(36)
    .substring(2)}.${extension}`;

  // Enviamos el archivo directamente a tu propio backend
  const response = await fetch(`/api/upload?filename=${filename}`, {
    method: "POST",
    body: file,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Error al procesar el archivo en el servidor.");
  }

  const blob = await response.json();

  return {
    url: blob.url,
  };
}