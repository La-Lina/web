"use client";

import { useEditor } from "../editor/EditorProvider";
import { uploadFile } from "./useUpload";
import { useState } from "react";

export default function UploadButton({
  type,
  onUploaded,
}: {
  type: string;
  onUploaded: (url: string) => void;
}) {
  const { isAdmin } = useEditor();

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  if (!isAdmin) return null;

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    console.log("[UPLOAD BUTTON] Archivo seleccionado:", file.name);

    setIsUploading(true);
    setError("");

    try {
      const result = await uploadFile(file, type);

      console.log("[UPLOAD BUTTON] Resultado:", result);

      if (!result?.url) {
        throw new Error("Vercel Blob no devolvió ninguna URL.");
      }

      console.log("[UPLOAD BUTTON] Llamando onUploaded:", result.url);

      onUploaded(result.url);
    } catch (error) {
      console.error("[UPLOAD BUTTON] Error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Error al subir el archivo."
      );
    } finally {
      console.log("[UPLOAD BUTTON] Finalizando subida");

      setIsUploading(false);

      // Permite volver a seleccionar el mismo archivo
      e.target.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label
        className={`z-50 justify-center font-bold rounded-full text-white px-4 py-2 inline-flex items-center ${
          isUploading
            ? "bg-gray-600 cursor-wait"
            : "bg-primary cursor-pointer"
        }`}
      >
        {isUploading ? "Subiendo..." : "Subir archivo"}

        <input
          type="file"
          className="hidden"
          accept="image/*,video/*"
          disabled={isUploading}
          onChange={handleChange}
        />
      </label>

      {error && (
        <p className="text-red-400 text-xs text-center break-words">
          {error}
        </p>
      )}
    </div>
  );
}