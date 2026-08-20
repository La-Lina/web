import EditableMedia from "../Components/admin/EditableMedia";

// 1. Añadimos = {} para que, si no recibe nada, sea un objeto vacío y no 'undefined'
const Hero = ({ mediaData = {} }: { mediaData?: any }) => {
  return (
    <section className="w-full h-[90dvh] bg-primary/90 md:h-screen relative overflow-visible">
      <EditableMedia
        uploadType="hero"
        // 2. Añadimos la interrogación (?) para evitar errores
        initialSrc={mediaData?.hero_src || "/default-video.mp4"}
        initialPosX={mediaData?.hero_posX}
        initialPosY={mediaData?.hero_posY}
        initialZoom={mediaData?.hero_zoom}
        initialBrightness={mediaData?.hero_brightness}
        className="w-full h-full md:h-screen"
      />

      <div
        className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-2/5 pointer-events-none z-10 text-secondary 
        flex flex-col items-end gap-3 sm:gap-4 lg:gap-8
        "
      >
        <h1 className="font-cassey relative 
        text-[14rem] leading-38
        sm:text-[20rem] sm:leading-48
        md:text-[24rem] md:leading-56 
        lg:text-[28rem] lg:leading-64">
          <span
            className="absolute 
            text-[8rem] leading-16 top-6 -left-14
            sm:text-[12rem] sm:leading-24 sm:top-5.5 sm:-left-21
            md:text-[14rem] md:leading-32 md:top-4 md:-left-24 
            lg:text-[16rem] lg:leading-38 lg:top-3 lg:-left-28"
          >
            la
          </span>
          liña
        </h1>

        <img
          className=" relative bottom-0 -translate-x-1 h-auto w-auto sm:w-4/5"
          src="/voz_nomada.svg"
          alt="La voz nómada de canarias"
        />
      </div>
    </section>
  );
};

export default Hero;
