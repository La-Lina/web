"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import EditableMedia from "../Components/admin/EditableMedia";
import { useEditor } from "../Components/editor/EditorProvider";

// lucide icons
import { SquarePen, X } from "lucide-react";

interface HighlightProps {
  mediaData?: any;
}

const Highlight = ({ mediaData = {} }: HighlightProps) => {
  const { isAdmin } = useEditor();

  // Estados locales para los textos (leídos de media.json o valores por defecto)
  const [day, setDay] = useState(mediaData?.highlightDay ?? 15);
  const [month, setMonth] = useState(mediaData?.highlightMonth ?? 8);
  const [title, setTitle] = useState(mediaData?.highlightTitle ?? "la costa");

  // Estados del panel de edición de textos
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const faderInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 1.2, ease: "easeOut" },
    },
  } as const;

  const handleSaveText = async () => {
    setIsSaving(true);
    try {
      await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          highlightDay: day,
          highlightMonth: month,
          highlightTitle: title,
        }),
      });
      setShowTextEditor(false);
    } catch (error) {
      console.error("Error al guardar los textos:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section
      id="highlight"
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      {/* FONDO EDITABLE (Vídeo o Imagen) */}
      {/* Le ponemos z-0 para que quede detrás, y brightness bajo por defecto para que el texto se lea bien */}
      <EditableMedia
        uploadType="highlightBg"
        initialSrc={mediaData?.highlightBg_src || "/default-video.mp4"}
        initialPosX={mediaData?.highlightBg_posX ?? 50}
        initialPosY={mediaData?.highlightBg_posY ?? 50}
        initialZoom={mediaData?.highlightBg_zoom ?? 1}
        initialBrightness={mediaData?.highlightBg_brightness ?? 0.4}
        className="absolute inset-0 w-full h-full z-0"
      />

      {/* PANEL DE EDICIÓN DE TEXTOS (Solo Admin) */}
      {isAdmin && (
        <div className="absolute top-4 left-28 z-50">
          <button
            onClick={() => setShowTextEditor(!showTextEditor)}
            className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-lg flex items-center gap-2"
          >
            {showTextEditor ? (
              <X className="w-4 h-4" />
            ) : (
              <>
                <SquarePen className="w-4 h-4" />
                Editar Textos
              </>
            )}
          </button>

          {showTextEditor && (
            <div className="mt-2 flex flex-col gap-3 bg-black/95 p-5 rounded-xl shadow-2xl backdrop-blur-md border border-white/20 w-64 text-white text-xs animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex gap-2">
                <div className="flex flex-col gap-1 w-1/2">
                  <label className="text-gray-400">Día</label>
                  <input
                    type="number"
                    value={day}
                    onChange={(e) => setDay(Number(e.target.value))}
                    className="bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white outline-none focus:border-white w-full"
                  />
                </div>
                <div className="flex flex-col gap-1 w-1/2">
                  <label className="text-gray-400">Mes</label>
                  <input
                    type="number"
                    value={month}
                    onChange={(e) => setMonth(Number(e.target.value))}
                    className="bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white outline-none focus:border-white w-full"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-gray-400">Título</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white outline-none focus:border-white w-full"
                />
              </div>

              <button
                onClick={handleSaveText}
                disabled={isSaving}
                className="w-full bg-white text-black font-bold py-2 mt-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {isSaving ? "Guardando..." : "Guardar Textos"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* CONTENEDOR DE LOS TEXTOS (z-10 y pointer-events-none para no bloquear el drag del fondo) */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end gap-4 md:justify-between px-8 md:pl-24 py-12 text-white pointer-events-none">
        {/** DATE */}
        <motion.p
          variants={faderInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="text-4xl md:text-9xl font-courier-prime"
        >
          <span className="inline md:block">
            {String(day).padStart(2, "0")}/
          </span>
          {String(month).padStart(2, "0")}
        </motion.p>

        {/** CONTENEDOR INFERIOR */}
        <motion.div
          variants={faderInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-col items-start"
        >
          {/* Asegúrate de que este SVG sea de color blanco o claro para que contraste con el fondo oscuro */}
          <img
            className="h-auto w-3/4 md:w-auto mb-6 drop-shadow-lg"
            src="/podcast.svg"
            alt="PODCAST"
          />
          <h4 className="text-5xl md:text-8xl md:w-1/2 drop-shadow-xl uppercase">
            {title}
          </h4>
        </motion.div>
      </div>
    </section>
  );
};

export default Highlight;
