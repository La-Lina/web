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
      const res = await uploadFile(file, type);
      onUploaded(res.url);
    } catch (error) {
      console.error("Error subiendo archivo:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Error subiendo el archivo."
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label
        className={`z-50 bg-primary justify-center font-bold rounded-full button text-white px-4 py-2 cursor-pointer inline-flex items-center ${
          isUploading ? "opacity-50 cursor-wait" : ""
        }`}
      >
        {isUploading ? "Subiendo..." : "Subir archivo"}

        <input
          type="file"
          className="hidden"
          accept="image/*,video/*"
          disabled={isUploading}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            await handleUpload(file);

            // Permite volver a seleccionar el mismo archivo
            e.target.value = "";
          }}
        />
      </label>

      {error && (
        <p className="text-red-400 text-[10px] text-center">
          {error}
        </p>
      )}
    </div>
  );
}