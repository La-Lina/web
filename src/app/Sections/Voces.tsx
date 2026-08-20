"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import EditableMedia from "../Components/admin/EditableMedia";
import { ChevronLeft, ChevronRight, Edit2, Check, ArrowLeft, ArrowRight, Plus, Trash2, X } from "lucide-react";
import { useEditor } from "../Components/editor/EditorProvider"; 
import UploadButton from "../Components/upload/UploadButton";

const FALLBACK_VOCES = [
  { id: "1", name: "Marta", role: "psicóloga", uploadType: "vocesMarta" },
  { id: "2", name: "Pedro", role: "biólogo marino", uploadType: "vocesPedro" },
  { id: "3", name: "Andrea", role: "periodista", uploadType: "vocesAndrea" },
  { id: "4", name: "Marcos", role: "noleo quepone", uploadType: "vocesMarcos" },
];

// 1. Variantes de animación
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Retraso secuencial entre cada tarjeta
      delayChildren: 0.2,
    },
  },
};

const cardVariants: any = {
  hidden: { opacity: 0, x: 100 }, // Empiezan desplazadas a la derecha
  visible: {
    opacity: 1,
    x: 0, // Llegan a su posición original
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1], // Curva suave y fluida
    },
  },
};

export default function Voces({ mediaData = {} }: { mediaData?: any }) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  
  const { isAdmin } = useEditor(); 
  
  const [voces, setVoces] = useState<any[]>(mediaData?.vocesList || FALLBACK_VOCES);
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newSrc, setNewSrc] = useState("");
  const [isSavingVoice, setIsSavingVoice] = useState(false);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);

  const checkArrows = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const overflow = scrollWidth > clientWidth + 2;
    setHasOverflow(overflow);
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(overflow && scrollLeft < scrollWidth - clientWidth - 2);
  };

  useEffect(() => {
    checkArrows(); 
    window.addEventListener("resize", checkArrows);
    return () => window.removeEventListener("resize", checkArrows);
  }, [voces]);

  const scrollByAmount = (amount: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current || isEditMode || !hasOverflow) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftPos(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current || !hasOverflow) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; 
    scrollRef.current.scrollLeft = scrollLeftPos - walk;
  };

  const handleMouseUpOrLeave = () => setIsDragging(false);

  const saveVocesListToDB = async (listToSave: any[]) => {
    try {
      await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vocesList: listToSave }),
      });
    } catch (error) {
      console.error("Error al guardar el orden de las voces:", error);
    }
  };

  const moveVoice = (index: number, direction: "left" | "right") => {
    if (direction === "left" && index === 0) return;
    if (direction === "right" && index === voces.length - 1) return;
    const newVoces = [...voces];
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    [newVoces[index], newVoces[targetIndex]] = [newVoces[targetIndex], newVoces[index]];
    setVoces(newVoces);
  };

  const removeVoice = (indexToRemove: number) => {
    if (!confirm("¿Seguro que quieres eliminar esta voz?")) return;
    const newVoces = voces.filter((_, idx) => idx !== indexToRemove);
    setVoces(newVoces);
  };

  const handleAddVoice = async () => {
    if (!newName.trim() || !newRole.trim()) {
      alert("Por favor, rellena el nombre y el rol.");
      return;
    }
    setIsSavingVoice(true);
    
    const newId = Date.now().toString();
    const newUploadType = `voz_${newId}`;
    
    const newVoice = { 
      id: newId, 
      name: newName, 
      role: newRole, 
      uploadType: newUploadType,
      tempSrc: newSrc
    };

    const newList = [...voces, newVoice];
    setVoces(newList);

    try {
      await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vocesList: newList,
          [`${newUploadType}_src`]: newSrc || "/gin_xmas.jfif",
          [`${newUploadType}_posX`]: 50,
          [`${newUploadType}_posY`]: 50,
          [`${newUploadType}_zoom`]: 1,
          [`${newUploadType}_brightness`]: 1,
        }),
      });
    } catch (error) {
      console.error("Error guardando la nueva voz", error);
    } finally {
      setIsSavingVoice(false);
      setShowAddModal(false);
      setNewName("");
      setNewRole("");
      setNewSrc("");
    }
  };

  const getTemplateByIndex = (index: number) => {
    const pos = index % 4; 
    if (pos === 0) return "A";
    if (pos === 1) return "B";
    if (pos === 2) return "C";
    return "D";
  };

  const getCardStyles = (template: string) => {
    switch (template) {
      case "A": return "translate-y-28 pr-8 pt-4"; 
      case "B": return "translate-y-12 pl-8 pt-32"; 
      case "C": return "self-end pr-8 pt-40"; 
      case "D": return "pl-8 pt-4"; 
      default: return "";
    }
  };

  return (
    <>
      <section
        id="voces"
        className="py-8 mb-20 gap-8 flex flex-col items-center overflow-hidden w-full relative"
      >
        {/* DIVISOR SUPERIOR */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-4/9 h-[5px] bg-gray-300"
        />
        
        {/* TÍTULO */}
        <div className="flex flex-col items-center gap-4">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="font-courier-prime font-bold text-4xl"
          >
            VOCES
          </motion.h3>

          {isAdmin && (
            <div className="flex gap-2 animate-in fade-in zoom-in duration-300">
              <button
                onClick={() => {
                  if (isEditMode) saveVocesListToDB(voces);
                  setIsEditMode(!isEditMode);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-md border ${
                  isEditMode 
                    ? "bg-green-600 hover:bg-green-700 text-white border-green-500" 
                    : "bg-white/10 hover:bg-white/20 text-black backdrop-blur-md border-black/20"
                }`}
              >
                {isEditMode ? <><Check className="w-4 h-4" /> Finalizar Edición</> : <><Edit2 className="w-4 h-4" /> Modo Edición</>}
              </button>

              {isEditMode && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all bg-black hover:bg-gray-800 text-white shadow-md border border-gray-700"
                >
                  <Plus className="w-4 h-4" /> Añadir Voz
                </button>
              )}
            </div>
          )}
        </div>

        {/* CONTENEDOR VOCES */}
        <div className="relative w-full max-w-9/10 mt-8">
          {canScrollLeft && (
            <button
              onClick={() => scrollByAmount(-400)}
              className="absolute -left-8 top-1/2 -translate-y-1/2 z-40 bg-black/50 hover:bg-black text-white p-3 rounded-full backdrop-blur-md transition-all active:scale-95"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Animamos el contenedor scroll con variants */}
          <motion.div
            ref={scrollRef}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            onScroll={checkArrows}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className={`flex gap-8 h-130 text-white font-courier-prime overflow-x-auto 
              [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
              ${
                isEditMode
                  ? "scroll-auto overflow-x-scroll"
                  : hasOverflow
                  ? isDragging
                    ? "cursor-grabbing select-none scroll-auto"
                    : "cursor-grab snap-x snap-mandatory scroll-smooth"
                  : "cursor-default justify-center overflow-x-hidden"
              }`}
          >
            {voces.map((voz, index) => {
              const currentTemplate = getTemplateByIndex(index);
              
              return (
                <motion.div
                  key={voz.id}
                  variants={cardVariants}
                  className={`relative snap-center shrink-0 w-78 h-92 bg-voces space-y-2 
                    ${getCardStyles(currentTemplate)} ${hasOverflow && isDragging ? "scale-[0.98]" : ""}`}
                >
                  {isEditMode && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex gap-1 z-50 bg-black/80 px-2 py-1 rounded-full border border-white/20 backdrop-blur-sm">
                      <button 
                        onClick={() => moveVoice(index, "left")} disabled={index === 0}
                        className="text-white hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed p-1 transition-colors" title="Izquierda"
                      ><ArrowLeft className="w-4 h-4" /></button>
                      
                      <button 
                        onClick={() => moveVoice(index, "right")} disabled={index === voces.length - 1}
                        className="text-white hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed p-1 transition-colors border-r border-white/20 pr-2 mr-1" title="Derecha"
                      ><ArrowRight className="w-4 h-4" /></button>
                      
                      <button 
                        onClick={() => removeVoice(index)}
                        className="text-red-400 hover:text-red-500 p-1 transition-colors" title="Eliminar Voz"
                      ><Trash2 className="w-4 h-4" /></button>
                    </div>
                  )}

                  <p className={currentTemplate === "A" || currentTemplate === "C" ? "text-right" : "text-left"}>
                    {voz.role}
                  </p>
                  
                  <div 
                    className="h-24 w-full relative"
                    onMouseDown={(e) => { if (isAdmin) e.stopPropagation(); }}
                  >
                    <EditableMedia
                      uploadType={voz.uploadType}
                      initialSrc={mediaData?.[`${voz.uploadType}_src`] || voz.tempSrc || "/gin_xmas.jfif"}
                      initialPosX={mediaData?.[`${voz.uploadType}_posX`] ?? 50}
                      initialPosY={mediaData?.[`${voz.uploadType}_posY`] ?? 50}
                      initialZoom={mediaData?.[`${voz.uploadType}_zoom`] ?? 1}
                      initialBrightness={mediaData?.[`${voz.uploadType}_brightness`] ?? 1}
                      className={`h-full w-full ${!isAdmin ? "pointer-events-none" : ""}`}
                    />
                  </div>

                  <p className={`text-4xl px-4 ${currentTemplate === "B" || currentTemplate === "D" ? "text-right" : "text-left"}`}>
                    {voz.name}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          {canScrollRight && (
            <button
              onClick={() => scrollByAmount(400)}
              className="absolute -right-8 top-1/2 -translate-y-1/2 z-40 bg-black/50 hover:bg-black text-white p-3 rounded-full backdrop-blur-md transition-all active:scale-95"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}
        </div>

        {/* DIVISOR INFERIOR */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="w-4/9 h-[5px] bg-gray-300 mt-8"
        />
      </section>

      {/* POPUP DE AÑADIR VOZ */}
      {showAddModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-white/20 p-6 rounded-2xl w-full max-w-sm flex flex-col gap-5 text-white animate-in zoom-in-95 duration-200 font-courier-prime shadow-2xl">
            
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h4 className="text-xl font-bold uppercase tracking-wider">Nueva Voz</h4>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400 uppercase tracking-widest">Nombre</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ej: Laura"
                  className="bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white outline-none focus:border-white transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400 uppercase tracking-widest">Profesión / Rol</label>
                <input
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="Ej: Antropóloga"
                  className="bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white outline-none focus:border-white transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1 border border-dashed border-white/20 p-4 rounded-md items-center justify-center">
                <label className="text-xs text-gray-400 uppercase tracking-widest mb-2 text-center w-full">Foto o Vídeo</label>
                {newSrc ? (
                  <div className="text-green-400 text-xs font-bold flex items-center gap-1"><Check className="w-3 h-3"/> Archivo cargado</div>
                ) : (
                  <UploadButton type="temp_voice_upload" onUploaded={(url) => setNewSrc(url)} />
                )}
              </div>
            </div>

            <button
              onClick={handleAddVoice}
              disabled={isSavingVoice}
              className="w-full bg-white text-black font-bold py-3 mt-2 rounded-lg hover:bg-gray-200 transition-all uppercase tracking-wider text-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSavingVoice ? "Guardando..." : "Guardar en Carrusel"}
            </button>

          </div>
        </div>
      )}
    </>
  );
}