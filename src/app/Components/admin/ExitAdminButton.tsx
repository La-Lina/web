"use client";

import { useEditor } from "../editor/EditorProvider";
import { signOut } from "next-auth/react";
import { useState } from "react";

export default function ExitAdminButton() {
  const { isAdmin } = useEditor();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Si no es administrador, el botón ni siquiera se renderiza en el HTML
  if (!isAdmin) return null;

  const handleExit = async () => {
    setIsLoggingOut(true);
    try {
      // Cierra la sesión de NextAuth y recarga la página automáticamente
      await signOut({ callbackUrl: "/" }); 
    } catch (error) {
      console.error("Error al salir del modo admin:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-1/2 mr-2 z-[9999] pointer-events-auto">
      <button
        onClick={handleExit}
        disabled={isLoggingOut}
        className="bg-red-600 hover:bg-red-700 text-white font-bold font-courier-prime text-xs tracking-wider uppercase px-6 py-3.5 rounded-full shadow-2xl transition-all duration-300 border border-red-500/30 flex items-center gap-2 backdrop-blur-sm hover:scale-105 active:scale-95"
      >
        {isLoggingOut ? (
          <>
            <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Saliendo...
          </>
        ) : (
          <>
            Salir del modo admin
          </>
        )}
      </button>
    </div>
  );
}