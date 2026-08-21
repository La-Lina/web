"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import EditableMedia from "../Components/admin/EditableMedia";

// --- COMPONENTE PARA EL TEXTO ---
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

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.45, 0.55, 1],
    [0.3, 1, 1, 0.3]
  );

  const blurValue = useTransform(
    scrollYProgress,
    [0, 0.45, 0.55, 1],
    [10, 0, 0, 10]
  );

  const filter = useTransform(blurValue, (v) => `blur(${v}px)`);

  return (
    <motion.div
      style={{ opacity, filter }}
      className={`flex flex-col z-10 relative ${className ?? ""}`}
    >
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
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const scrollOpacity = useTransform(
    scrollYProgress,
    [0, 0.45, 0.55, 1],
    [0.2, 1, 1, 0.2]
  );

  const scrollBrightness = useTransform(
    scrollYProgress,
    [0, 0.45, 0.55, 1],
    [0.2, 1, 1, 0.2]
  );

  const scrollFilter = useTransform(
    scrollBrightness,
    (v) => `brightness(${v})`
  );

  return (
    <motion.div
      className={`shadow-xl ${className}`}
      style={{
        opacity: scrollOpacity,
        filter: scrollFilter,
      }}
    >
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
  mediaData = {},
}: {
  mediaData?: any;
}) {
  const left = useRef<HTMLDivElement | null>(null);
  const mid = useRef<HTMLDivElement | null>(null);
  const right = useRef<HTMLDivElement | null>(null);

  return (
    <section
      className="w-full md:px-12 lg:px-20 text-primary space-y-24 py-16"
      id="about"
    >
      {/* LEFT */}
      <div
        ref={left}
        className="h-auto flex flex-row items-center justify-center md:justify-start
        gap-2 md:gap-6 relative"
      >
        <AnimatedMediaBlock
          uploadType="aboutLeftImage"
          initialSrc={
            mediaData?.aboutLeftImage_src || "/gin_xmas.jfif"
          }
          className="w-40 sm:w-58 md:w-72 lg:w-80"
          targetRef={left}
          initialPosX={mediaData?.aboutLeftImage_posX ?? 50}
          initialPosY={mediaData?.aboutLeftImage_posY ?? 50}
          initialZoom={mediaData?.aboutLeftImage_zoom ?? 1}
          initialBrightness={
            mediaData?.aboutLeftImage_brightness ?? 1
          }
        />

        <TextBlock
          targetRef={left}
          className="text-left p-3 rounded-xl bg-transparent md:p-0 md:rounded-none"
        >
          <p className="bonito text-lg sm:text-xl md:text-2xl lg:text-3xl w-[10ch] sm:w-auto md:whitespace-nowrap">
            has llegado a un espacio de
          </p>

          <p className="gordo text-xl md:text-3xl lg:text-4xl">
            escucha <br />
            reflexión <br />
            y diálogo
          </p>
        </TextBlock>
      </div>

      {/* MIDDLE */}
      <div
        ref={mid}
        className="h-auto flex flex-row items-center justify-center
        gap-2 md:gap-6 relative px-6 sm:px-10 md:px-0 md:-translate-x-8"
      >
        <TextBlock
          targetRef={mid}
          className="text-right p-3 rounded-xl bg-transparent md:p-0 md:rounded-none"
        >
          <p className="bonito text-lg sm:text-xl md:text-2xl lg:text-3xl md:whitespace-nowrap">
            donde distintos <br />
            roces comparten
          </p>

          <p className="gordo text-xl md:text-3xl lg:text-4xl">
            experiencias <br />
            miradas <br />
            y preguntas
          </p>
        </TextBlock>

        <AnimatedMediaBlock
          uploadType="aboutMidImage"
          initialSrc={
            mediaData?.aboutMidImage_src || "/gin_xmas.jfif"
          }
          className="w-40 sm:w-58 md:w-72 lg:w-80"
          targetRef={mid}
          initialPosX={mediaData?.aboutMidImage_posX ?? 50}
          initialPosY={mediaData?.aboutMidImage_posY ?? 50}
          initialZoom={mediaData?.aboutMidImage_zoom ?? 1}
          initialBrightness={
            mediaData?.aboutMidImage_brightness ?? 1
          }
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
            uploadType="aboutRightImage"
            initialSrc={
              mediaData?.aboutRightImage_src || "/gin_xmas.jfif"
            }
            className="w-40 sm:w-60 md:w-72 lg:w-72"
            targetRef={right}
            initialPosX={mediaData?.aboutRightImage_posX ?? 50}
            initialPosY={mediaData?.aboutRightImage_posY ?? 50}
            initialZoom={mediaData?.aboutRightImage_zoom ?? 1}
            initialBrightness={
              mediaData?.aboutRightImage_brightness ?? 1
            }
          />

          <TextBlock targetRef={right}>
            <p className="bonito text-lg sm:text-xl md:text-2xl lg:text-3xl">
              sobre el
            </p>

            <p className="gordo text-xl sm:text-3xl md:text-3xl lg:text-4xl">
              presente
            </p>

            <p className="bonito text-lg sm:text-xl md:text-2xl lg:text-3xl">
              que estamos viviendo <br />
              y de dónde partimos
            </p>
          </TextBlock>
        </div>
      </div>
    </section>
  );
}