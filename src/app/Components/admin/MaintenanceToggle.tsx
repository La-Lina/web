"use client";

import { useEditor } from "../editor/EditorProvider";
import { useState } from "react";

interface MaintenanceToggleProps {
  initialMaintenance?: boolean;
}

export default function MaintenanceToggle({
  initialMaintenance = false,
}: MaintenanceToggleProps) {
  const { isAdmin } = useEditor();

  const [maintenance, setMaintenance] = useState(initialMaintenance);
  const [isSaving, setIsSaving] = useState(false);

  if (!isAdmin) return null;

  const toggleMaintenance = async () => {
    if (isSaving) return;

    const newValue = !maintenance;

    setIsSaving(true);

    try {
      const res = await fetch("/api/media", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          maintenance: newValue,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error guardando mantenimiento");
      }

      console.log("Mantenimiento guardado:", data.data.maintenance);

      setMaintenance(newValue);

      // Refresca los Server Components para que page.tsx
      // vuelva a leer Redis sin abandonar la sesión de admin.
      window.location.reload();
    } catch (error) {
      console.error("Error cambiando mantenimiento:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed bottom-4 ml-2 left-1/2 z-[9999]">
      <button
        type="button"
        onClick={toggleMaintenance}
        disabled={isSaving}
        className="flex items-center gap-3 bg-black/80 text-white px-4 py-3 rounded-full border border-white/20"
      >
        <span className="text-xs font-courier-prime">Mantenimiento</span>

        <span
          className={`relative w-10 h-5 rounded-full transition-colors ${
            maintenance ? "bg-red-500" : "bg-gray-600"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
              maintenance ? "translate-x-5" : ""
            }`}
          >
            {isSaving && (
              <span className="absolute inset-0 rounded-full border-3 border-red-500 border-t-transparent animate-spin" />
            )}
          </span>
        </span>
      </button>
    </div>
  );
}
