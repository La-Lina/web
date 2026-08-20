"use client";

import { useEffect, useState } from "react";

export default function PageTransition() {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => {
        setIsVisible(false);
        // Desmontamos el DOM tras los 700ms de transición para que no quede residuo negro
        setTimeout(() => setShouldRender(false), 700);
      }, 100);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => window.removeEventListener("load", handleLoad);
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 bg-black z-[99999] transition-opacity duration-700 ease-out pointer-events-none ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}