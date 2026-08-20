"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
// Asegúrate de que esta ruta apunte correctamente a tu nuevo componente
import EditableMedia from "../Components/admin/EditableMedia";

// --- COMPONENTE PARA EL TEXTO (OPACIDAD + BLUR) ---
function TextBlock({
  children,
  targetRef,
  className,
}: {
  children: React.ReactNode;
  targetRef: React.RefObject<HTMLDivElement | null>;
  className?: string;
}) {
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.45, 0.55, 1], [0.3, 1, 1, 0.3]);
  const blurValue = useTransform(scrollYProgress, [0, 0.45, 0.55, 1], [10, 0, 0, 10]);
  const filter = useTransform(blurValue, (v) => `blur(${v}px)`);

  return (
    <motion.div style={{ opacity, filter }} className={`flex flex-col z-10 relative ${className ?? ""}`}>
      {children}
    </motion.div>
  );
}

// --- ENVOLTORIO ANIMADO PARA EDITABLE MEDIA ---
function AnimatedMediaBlock({
  uploadType,
  initialSrc,
  className,
  targetRef,
  initialPosX,
  initialPosY,
  initialZoom,
  initialBrightness,
}: {
  uploadType: string;
  initialSrc: string;
  className: string;
  targetRef: React.RefObject<HTMLDivElement | null>;
  initialPosX?: number;
  initialPosY?: number;
  initialZoom?: number;
  initialBrightness?: number;
}) {
  // Animaciones de Scroll (Aparecen al hacer scroll)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.45, 0.55, 1], [0.2, 1, 1, 0.2]);
  const scrollBrightness = useTransform(scrollYProgress, [0, 0.45, 0.55, 1], [0.2, 1, 1, 0.2]);
  const scrollFilter = useTransform(scrollBrightness, (v) => `brightness(${v})`);

  return (
    // Este motion.div maneja el fade-in y el brillo por scroll
    <motion.div
      className={`shadow-xl ${className}`}
      style={{ opacity: scrollOpacity, filter: scrollFilter }}
    >
      {/* Aquí inyectamos el componente genérico con todas sus herramientas */}
      <EditableMedia
        uploadType={uploadType}
        initialSrc={initialSrc}
        initialPosX={initialPosX}
        initialPosY={initialPosY}
        initialZoom={initialZoom}
        initialBrightness={initialBrightness}
        className="w-full h-full aspect-[3/4]"
      />
    </motion.div>
  );
}

// --- COMPONENTE PRINCIPAL ---
export default function About({
  initialLeftImg = "/gin_xmas.jfif", leftX = 50, leftY = 50, leftZoom = 1, leftBrightness = 1,
  initialMidImg = "/gin_xmas.jfif", midX = 50, midY = 50, midZoom = 1, midBrightness = 1,
  initialRightImg = "/gin_xmas.jfif", rightX = 50, rightY = 50, rightZoom = 1, rightBrightness = 1,
}: {
  initialLeftImg?: string; leftX?: number; leftY?: number; leftZoom?: number; leftBrightness?: number;
  initialMidImg?: string; midX?: number; midY?: number; midZoom?: number; midBrightness?: number;
  initialRightImg?: string; rightX?: number; rightY?: number; rightZoom?: number; rightBrightness?: number;
}) {
  const left = useRef<HTMLDivElement | null>(null);
  const mid = useRef<HTMLDivElement | null>(null);
  const right = useRef<HTMLDivElement | null>(null);

  return (
    <section className="w-full md:px-12 lg:px-20 text-primary space-y-24 py-16">
      {/* LEFT */}
      <div
        ref={left}
        className="h-auto flex flex-row items-center justify-center md:justify-start
        gap-2 md:gap-6 relative"
      >
        <AnimatedMediaBlock
          initialSrc={initialLeftImg} uploadType="aboutLeftImage"
          className="w-44 sm:w-58 md:w-72 lg:w-80" targetRef={left}
          initialPosX={leftX} initialPosY={leftY} initialZoom={leftZoom} initialBrightness={leftBrightness}
        />
        <TextBlock
          targetRef={left}
          className="text-left p-3 rounded-xl bg-transparent md:p-0 md:rounded-none"
        >
          <p className="bonito text-lg sm:text-xl md:text-2xl lg:text-3xl md:whitespace-nowrap">has llegado a un espacio de</p>
          <p className="gordo text-2xl md:text-3xl lg:text-4xl">escucha <br /> reflexión <br /> y diálogo</p>
        </TextBlock>
      </div>

      {/* MIDDLE */}
      <div
        ref={mid}
        className="h-auto  flex flex-row items-center justify-center
        gap-2 md:gap-6 relative px-6 sm:px-10 md:px-0 md:-translate-x-8"
      >
        <TextBlock
          targetRef={mid}
          className="text-right p-3 rounded-xl bg-transparent md:p-0 md:rounded-none"
        >
          <p className="bonito text-lg sm:text-xl md:text-2xl lg:text-3xl md:whitespace-nowrap">donde distintos <br /> roces comparten</p>
          <p className="gordo text-2xl md:text-3xl lg:text-4xl">experiencias <br /> miradas <br /> y preguntas</p>
        </TextBlock>
        <AnimatedMediaBlock
          initialSrc={initialMidImg} uploadType="aboutMidImage"
          className="w-44 sm:w-58 md:w-72 lg:w-80" targetRef={mid}
          initialPosX={midX} initialPosY={midY} initialZoom={midZoom} initialBrightness={midBrightness}
        />
      </div>

      {/* RIGHT */}
      <div
        ref={right}
        className="h-auto flex items-center justify-center md:justify-end
        px-6 sm:px-10 md:px-10 lg:px-20 relative py-16 md:py-0"
      >
        <div className="text-left md:text-right flex flex-row md:flex-col items-end gap-2">
          <AnimatedMediaBlock
            initialSrc={initialRightImg} uploadType="aboutRightImage"
            className="w-48 sm:w-60 md:w-72 lg:w-72" targetRef={right}
            initialPosX={rightX} initialPosY={rightY} initialZoom={rightZoom} initialBrightness={rightBrightness}
          />
          <TextBlock targetRef={right}>
            <p className="bonito text-lg sm:text-xl md:text-2xl lg:text-3xl">sobre el</p>
            <p className="gordo text-2xl sm:text-3xl md:text-3xl lg:text-4xl">presente</p>
            <p className="bonito text-lg sm:text-xl md:text-2xl lg:text-3xl">que estamos viviendo <br /> y de dónde partimos</p>
          </TextBlock>
        </div>
      </div>
    </section>
  );
}