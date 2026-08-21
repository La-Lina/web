import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename") || "archivo.jpg";

    if (!request.body) {
      return NextResponse.json(
        { error: "No se proporcionó ningún archivo" },
        { status: 400 }
      );
    }

    // La subida se realiza directamente desde tu servidor hacia Vercel Blob
    const blob = await put(filename, request.body, {
      access: "public",
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error("[API UPLOAD ERROR]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al subir" },
      { status: 500 }
    );
  }
}