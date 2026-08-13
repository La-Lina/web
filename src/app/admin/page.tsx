"use client";

import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";

export default function AdminLogin() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Nuevos estados para controlar errores y carga
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Condición para deshabilitar el botón: campos vacíos o si está cargando
  const isButtonDisabled = !email.trim() || !password.trim() || isLoading;

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(""); // Limpiamos errores anteriores

    try {
      // 1. CLAVE: Pasamos redirect: false para evitar que NextAuth nos redirija a su página por defecto
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/",
      });

      // 2. Comprobamos si la respuesta contiene un error de NextAuth
      if (res?.error) {
        setError("Usuario o contraseña incorrectos.");
        setIsLoading(false);
      } else if (res?.ok) {
        window.location.href = res.url || "/";
      }
    } catch (err) {
      console.error("Error durante el login:", err);
      setError("Ocurrió un error inesperado.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-black/90 font-courier-prime">
      <div
        className="bg-black border border-gray-500 text-white items-center flex flex-col gap-6 w-84 p-8 rounded-2xl 
      absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        // Corregido: Tailwind v3 usa translate-x y translate-y por separado, -translate-1/2 no existía de esa forma
      >
        <h2 className="text-2xl font-bold">Modo edición</h2>

        <div className="flex flex-col gap-4 w-9/10">
          <input
            className="bg-gray-700 text-sm w-full rounded-full pl-3 py-2 text-white placeholder-gray-400 outline-none focus:ring-1 focus:ring-gray-400"
            placeholder="Usuario"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="bg-gray-700 text-sm w-full rounded-full pl-3 py-2 text-white placeholder-gray-400 outline-none focus:ring-1 focus:ring-gray-400"
            placeholder="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* MENSAJE DE ERROR (Solo se muestra si el estado tiene texto) */}
        {error && (
          <p className="text-red-500 text-xs font-semibold text-center w-full">
            {error}
          </p>
        )}

        <button
          className={`font-courier-prime font-bold py-2 w-6/10 mt-4 rounded-full transition-all duration-300
            ${
              isButtonDisabled
                ? "bg-gray-600 text-gray-400 cursor-not-allowed opacity-50"
                : "bg-primary text-white hover:brightness-110 active:scale-95"
            }`}
          onClick={handleSubmit}
          disabled={!mounted || isButtonDisabled}
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </button>
      </div>
    </div>
  );
}
