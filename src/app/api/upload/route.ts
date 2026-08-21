import { handleUpload } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();

    const response = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        return {
          allowedContentTypes: [
            "image/*",
            "video/*",
          ],
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({
            pathname,
          }),
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log("Archivo subido correctamente:", blob.url);
      },
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error preparando subida a Vercel Blob:", error);

    return NextResponse.json(
      {
        error: "Error preparando la subida del archivo",
      },
      {
        status: 500,
      },
    );
  }
}