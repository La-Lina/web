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
    <section className="w-full text-primary">
      {/* LEFT */}
      <div ref={left} className="h-screen flex items-center justify-start px-4 md:px-20 gap-4 relative">
        <AnimatedMediaBlock
          initialSrc={initialLeftImg} uploadType="aboutLeftImage" className="w-50 md:w-104" targetRef={left}
          initialPosX={leftX} initialPosY={leftY} initialZoom={leftZoom} initialBrightness={leftBrightness}
        />
        <TextBlock targetRef={left} className="-translate-x-12 p-2 pr-0 rounded-xl bg-white md:p-0 md:bg-none md:rounded-none md:translate-x-0">
          <p className="bonito text-xl md:text-3xl md:whitespace-nowrap">has llegado a un espacio de</p>
          <p className="gordo text-2xl md:text-4xl">escucha <br /> reflexión <br /> y diálogo</p>
        </TextBlock>
      </div>

      {/* MIDDLE */}
      <div ref={mid} className="h-screen flex items-center justify-center gap-4 relative">
        <TextBlock targetRef={mid} className="bg-white translate-x-8 rounded-xl p-2 pl-0 md:p-0 md:bg-none md:rounded-none md:translate-x-0 ">
          <p className="bonito text-xl md:text-3xl whitespace-nowrap text-right">donde distintos <br /> roces comparten</p>
          <p className="gordo text-2xl md:text-4xl text-right">experiencias <br /> miradas <br /> y preguntas</p>
        </TextBlock>
        <AnimatedMediaBlock
          initialSrc={initialMidImg} uploadType="aboutMidImage" className="w-50 md:w-112" targetRef={mid}
          initialPosX={midX} initialPosY={midY} initialZoom={midZoom} initialBrightness={midBrightness}
        />
      </div>

      {/* RIGHT */}
      <div ref={right} className="h-screen flex items-center justify-center md:justify-end md:px-20 relative">
        <div className="text-right flex flex-col items-end">
          <AnimatedMediaBlock
            initialSrc={initialRightImg} uploadType="aboutRightImage" className="w-64 md:w-96" targetRef={right}
            initialPosX={rightX} initialPosY={rightY} initialZoom={rightZoom} initialBrightness={rightBrightness}
          />
          <TextBlock targetRef={right}>
            <p className="bonito text-2xl md:text-3xl">sobre el</p>
            <p className="gordo text-3xl md:text-4xl">presente</p>
            <p className="bonito text-2xl md:text-3xl">que estamos viviendo <br /> y de dónde partimos</p>
          </TextBlock>
        </div>
      </div>
    </section>
  );
}