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

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setError("");

    try {
      const result = await uploadFile(file, type);

      if (!result?.url) {
        throw new Error("No se recibió la URL del archivo.");
      }

      onUploaded(result.url);
    } catch (error) {
      console.error("Error subiendo archivo:", error);
      setError("Error al subir el archivo.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label
        className={`z-50 justify-center font-bold rounded-full button text-white px-4 py-2 inline-flex items-center ${
          isUploading
            ? "bg-gray-600 cursor-wait"
            : "bg-primary cursor-pointer"
        }`}
      >
        {isUploading ? "Subiendo..." : "Subir archivo"}

        {!isUploading && (
          <input
            type="file"
            className="hidden"
            accept="image/*,video/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];

              if (!file) return;

              await handleUpload(file);

              // Permite volver a seleccionar el mismo archivo
              e.target.value = "";
            }}
          />
        )}
      </label>

      {error && (
        <p className="text-red-400 text-xs text-center">
          {error}
        </p>
      )}
    </div>
  );
}