import EditableMedia from "../Components/admin/EditableMedia";

// 1. Añadimos = {} para que, si no recibe nada, sea un objeto vacío y no 'undefined'
const Hero = ({ mediaData = {} }: { mediaData?: any }) => {
  return (
    <section className="w-full h-[90dvh] md:h-screen relative">
      <EditableMedia
        uploadType="hero"
        // 2. Añadimos la interrogación (?) para evitar errores
        initialSrc={mediaData?.hero_src || "/default-video.mp4"}
        initialPosX={mediaData?.hero_posX}
        initialPosY={mediaData?.hero_posY}
        initialZoom={mediaData?.hero_zoom}
        initialBrightness={mediaData?.hero_brightness}
        className="w-full h-screen"
      />

      <div className="absolute top-1/2 left-1/2 -translate-y-2/3 lg:-translate-x-1/2 pointer-events-none z-10 text-secondary flex flex-col items-end gap-6
      -translate-x-2/5">
        <h1 className="font-cassey relative text-[12rem] md:text-[32rem] md:h-[34rem] ">
          <span className="text-8xl md:text-[16rem] absolute top-19 -left-9 md:top-34 md:-left-26">la</span>
          liña
        </h1>

        <img
          className="h-10 md:h-20 w-auto relative bottom-24 md:bottom-0 -translate-x-1"
          src="/voz_nomada.svg"
          alt="La voz nómada de canarias"
        />
      </div>
    </section>
  );
};

export default Hero;