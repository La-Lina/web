import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as HandleUploadBody;

    const jsonResponse = await handleUpload({
      body,
      request,

      onBeforeGenerateToken: async (
        pathname,
        clientPayload,
        multipart
      ) => {
        let type = "media";

        if (clientPayload) {
          try {
            const payload = JSON.parse(clientPayload);
            type = payload.type || "media";
          } catch {
            // Si el payload no es válido, usamos "media"
          }
        }

        const extension = pathname.split(".").pop() || "";
        const safeType = type.replace(/[^a-zA-Z0-9_-]/g, "");
        const safeExtension = extension.replace(/[^a-zA-Z0-9]/g, "");

        return {
          pathname: `${safeType}_${Date.now()}_${Math.random()
            .toString(36)
            .substring(2)}.${safeExtension}`,

          allowedContentTypes: [
            "image/*",
            "video/*",
          ],

          maximumSizeInBytes: 500 * 1024 * 1024,

          multipart,

          tokenPayload: JSON.stringify({
            type: safeType,
          }),
        };
      },

      onUploadCompleted: async ({ blob }) => {
        console.log("Archivo subido correctamente:", blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Error preparando subida:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Error preparando la subida",
      },
      { status: 400 }
    );
  }
}