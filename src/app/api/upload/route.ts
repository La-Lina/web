import {
  handleUpload,
  type HandleUploadBody,
} from "@vercel/blob/client";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as HandleUploadBody;

    console.log("[API UPLOAD] Petición recibida");

    const response = await handleUpload({
      body,
      request,

      onBeforeGenerateToken: async (
        pathname,
        clientPayload
      ) => {
        console.log(
          "[API UPLOAD] Generando token para:",
          pathname
        );

        let type = "media";

        if (clientPayload) {
          try {
            const payload = JSON.parse(clientPayload);

            if (payload.type) {
              type = payload.type;
            }
          } catch (error) {
            console.error(
              "[API UPLOAD] Error leyendo clientPayload:",
              error
            );
          }
        }

        const extension =
          pathname.split(".").pop()?.toLowerCase() || "";

        const safeType = type.replace(
          /[^a-zA-Z0-9_-]/g,
          ""
        );

        const safeExtension = extension.replace(
          /[^a-zA-Z0-9]/g,
          ""
        );

        const filename = `${safeType}_${Date.now()}_${Math.random()
          .toString(36)
          .substring(2)}.${safeExtension}`;

        console.log(
          "[API UPLOAD] Nombre final:",
          filename
        );

        return {
          allowedContentTypes: [
            "image/*",
            "video/*",
          ],

          maximumSizeInBytes:
            500 * 1024 * 1024,

          pathname: filename,
        };
      },

      onUploadCompleted: async ({ blob }) => {
        console.log(
          "[API UPLOAD] Archivo completado:",
          blob.url
        );
      },
    });

    console.log(
      "[API UPLOAD] Respuesta generada correctamente"
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error(
      "[API UPLOAD] ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Error preparando la subida",
      },
      {
        status: 400,
      }
    );
  }
}