"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import UploadButton from "../upload/UploadButton";
import { useEditor } from "../editor/EditorProvider";
import { Loader, Save, SaveCheck, Settings, Undo, X } from "lucide-react";

interface EditableMediaProps {
  uploadType: string;
  initialSrc: string;
  initialPosX?: number;
  initialPosY?: number;
  initialZoom?: number;
  initialBrightness?: number;
  className?: string;
}

export default function EditableMedia({
  uploadType,
  initialSrc,
  initialPosX = 50,
  initialPosY = 50,
  initialZoom = 1,
  initialBrightness = 1,
  className = "",
}: EditableMediaProps) {
  // Estados actuales (manipulables en tiempo real)
  const [src, setSrc] = useState(initialSrc);
  const [posX, setPosX] = useState(initialPosX);
  const [posY, setPosY] = useState(initialPosY);
  const [zoom, setZoom] = useState(initialZoom);
  const [brightness, setBrightness] = useState(initialBrightness);

  // "Foto" de referencia con los datos reales guardados en la base de datos
  const [savedData, setSavedData] = useState({
    src: initialSrc,
    posX: initialPosX,
    posY: initialPosY,
    zoom: initialZoom,
    brightness: initialBrightness,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [hasSavedOnce, setHasSavedOnce] = useState(false);

  const [mediaAspect, setMediaAspect] = useState(1);
  const [containerDims, setContainerDims] = useState({ width: 0, height: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const { isAdmin } = useEditor();

  // Bandera que detecta si el admin ha cambiado CUALQUIER ajuste respecto al servidor
  const isDirty =
    src !== savedData.src ||
    posX !== savedData.posX ||
    posY !== savedData.posY ||
    zoom !== savedData.zoom ||
    brightness !== savedData.brightness;

  // NUEVA FUNCIÓN: Cancela las modificaciones locales y revierte al último estado guardado
  const handleCancel = () => {
    setSrc(savedData.src);
    setPosX(savedData.posX);
    setPosY(savedData.posY);
    setZoom(savedData.zoom);
    setBrightness(savedData.brightness);
  };

  useEffect(() => {
    const measureContainer = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerDims({ width: rect.width, height: rect.height });
      }
    };
    measureContainer();
    window.addEventListener("resize", measureContainer);
    return () => window.removeEventListener("resize", measureContainer);
  }, [src]);

  useEffect(() => {
    setSrc(initialSrc);
    setPosX(initialPosX);
    setPosY(initialPosY);
    setZoom(initialZoom);
    setBrightness(initialBrightness);
    setSavedData({
      src: initialSrc,
      posX: initialPosX,
      posY: initialPosY,
      zoom: initialZoom,
      brightness: initialBrightness,
    });
  }, [initialSrc, initialPosX, initialPosY, initialZoom, initialBrightness]);

  const isVideo = src.match(/\.(mp4|webm|ogg|mov|m4v)($|\?)/i);

  const containerWidth = containerDims.width;
  const containerHeight = containerDims.height;
  let maxShiftX = 0;
  let maxShiftY = 0;
  let translateX = 0;
  let translateY = 0;
  let renderWidth = "100%";
  let renderHeight = "100%";

  if (containerWidth > 0 && containerHeight > 0 && mediaAspect > 0) {
    const containerAspect = containerWidth / containerHeight;
    if (mediaAspect > containerAspect) {
      renderHeight = `${containerHeight}px`;
      renderWidth = `${containerHeight * mediaAspect}px`;
    } else {
      renderWidth = `${containerWidth}px`;
      renderHeight = `${containerWidth / mediaAspect}px`;
    }

    const totalWidth = parseFloat(renderWidth) * zoom;
    const totalHeight = parseFloat(renderHeight) * zoom;
    maxShiftX = Math.max(0, (totalWidth - containerWidth) / 2);
    maxShiftY = Math.max(0, (totalHeight - containerHeight) / 2);

    translateX = ((posX - 50) / 50) * maxShiftX;
    translateY = ((posY - 50) / 50) * maxShiftY;
  }

  const handleSaveAll = async () => {
    if (!isDirty) return;
    setIsSaving(true);
    try {
      await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          [`${uploadType}_src`]: src,
          [`${uploadType}_posX`]: posX,
          [`${uploadType}_posY`]: posY,
          [`${uploadType}_zoom`]: zoom,
          [`${uploadType}_brightness`]: brightness,
        }),
      });

      setSavedData({ src, posX, posY, zoom, brightness });
      setHasSavedOnce(true);
    } catch (error) {
      console.error("Error al guardar:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative group select-none ${className}`}
    >
      {/* BOTONES DE ACCIÓN */}
      {isAdmin && (
        <div
          className={`absolute bottom-2 right-2 z-50 flex gap-2 transition-opacity duration-300 
            ${showPanel || isDirty ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
        >
          {/* BOTÓN CANCELAR (A la izquierda del de guardar + Solo si isDirty es true) */}
          {isDirty && (
            <button
              onClick={handleCancel}
              className="bg-black/80 hover:bg-black text-white p-2 rounded-full shadow-md transition-all border border-white/20 text-sm flex items-center justify-center w-8 h-8 animate-in fade-in zoom-in duration-200"
              title="Cancelar cambios"
            >
              <Undo />
            </button>
          )}

          {/* BOTÓN GUARDAR */}
          <button
            onClick={handleSaveAll}
            disabled={isSaving || !isDirty}
            className={`p-2 rounded-full shadow-md transition-all border border-white/20 text-sm flex items-center justify-center w-8 h-8 
              ${
                !isDirty
                  ? "bg-black/40 text-gray-400 cursor-not-allowed"
                  : "bg-black/80 hover:bg-black text-white"
              }`}
            title="Guardar"
          >
            {isSaving ? (
              <Loader className="animate-spin w-4 h-4 text-white" />
            ) : !isDirty && hasSavedOnce ? (
              <SaveCheck />
            ) : (
              <Save />
            )}
          </button>

          {/* BOTÓN CONFIGURACIÓN */}
          <button
            onClick={() => setShowPanel(!showPanel)}
            className="bg-black/80 hover:bg-black text-white p-2 rounded-full shadow-md transition-all border border-white/20 text-sm flex items-center justify-center w-8 h-8"
            title="Ajustes"
          >
            {showPanel ? (
              <X className="w-4 h-4" />
            ) : (
              <Settings className="w-4 h-4" />
            )}
          </button>
        </div>
      )}

      {/* PANEL DE CONTROL FLOTANTE */}
      {isAdmin && showPanel && (
        <div className="absolute bottom-12 right-2 z-50 flex flex-col gap-3 bg-black/95 p-4 rounded-xl shadow-2xl backdrop-blur-md border border-white/20 w-56 text-white text-xs animate-in fade-in slide-in-from-bottom-2 duration-200">
          <UploadButton type={uploadType} onUploaded={(url) => setSrc(url)} />
          <hr className="border-white/10 my-1" />
          <div className="flex flex-col gap-1">
            <div className="flex justify-between">
              <span>Zoom</span>
              <span className="text-gray-400">{zoom.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full cursor-pointer accent-white"
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between">
              <span>Brillo</span>
              <span className="text-gray-400">{brightness.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={brightness}
              onChange={(e) => setBrightness(parseFloat(e.target.value))}
              className="w-full cursor-pointer accent-white"
            />
          </div>
        </div>
      )}

      {/* Indicador de arrastre */}
      {isAdmin && (
        <div className="absolute bottom-3 left-4 bg-black/70 text-white text-[9px] tracking-wider uppercase px-2 py-0.5 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm z-40">
          {isDragging ? "Ajustando..." : "Arrastra foto"}
        </div>
      )}

      {/* CONTENEDOR INTERNO */}
      <div className="w-full h-full overflow-hidden rounded-sm relative z-0 flex items-center justify-center">
        <motion.div
          className={`flex items-center justify-center shrink-0 ${
            isAdmin ? (isDragging ? "cursor-grabbing" : "cursor-grab") : ""
          }`}
          style={{
            width: renderWidth,
            height: renderHeight,
            scale: zoom,
            x: translateX,
            y: translateY,
            filter: `brightness(${brightness})`,
          }}
          onPanStart={() => isAdmin && setIsDragging(true)}
          onPanEnd={() => isAdmin && setIsDragging(false)}
          onPan={(event, info) => {
            if (!isAdmin || (maxShiftX === 0 && maxShiftY === 0)) return;
            if (maxShiftX > 0) {
              setPosX((prev) => {
                const deltaPosX = (info.delta.x / maxShiftX) * 50;
                return Math.max(0, Math.min(100, prev + deltaPosX));
              });
            }
            if (maxShiftY > 0) {
              setPosY((prev) => {
                const deltaPosY = (info.delta.y / maxShiftY) * 50;
                return Math.max(0, Math.min(100, prev + deltaPosY));
              });
            }
          }}
        >
          {src ? (
            isVideo ? (
              <motion.video
                src={src}
                autoPlay
                muted
                loop
                playsInline
                onLoadedMetadata={(e) =>
                  setMediaAspect(
                    e.currentTarget.videoWidth / e.currentTarget.videoHeight,
                  )
                }
                className="w-full h-full object-fill pointer-events-none"
              />
            ) : (
              <motion.img
                src={src}
                draggable={false}
                onLoad={(e) =>
                  setMediaAspect(
                    e.currentTarget.naturalWidth /
                      e.currentTarget.naturalHeight,
                  )
                }
                className="w-full h-full object-fill pointer-events-none select-none"
              />
            )
          ) : null}
        </motion.div>
      </div>
    </div>
  );
}
