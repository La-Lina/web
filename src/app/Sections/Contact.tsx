"use client";

import { motion, type Variants } from "framer-motion";

const Contact = () => {
  // Animación del contenedor principal
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 50 }, // Empieza 50px abajo e invisible
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        // Esto hace que los hijos que tengan variantes se animen uno tras otro
        staggerChildren: 0.2, 
      },
    },
  };

  // Animación para los elementos de dentro (hijos)
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 }, // Los hijos suben un poquito menos para un efecto más sutil
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.section
      id="contact"
      className="flex flex-col md:flex-row items-center md:items-end justify-center my-32 gap-12"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }} // Se activa cuando asoma un 20% en pantalla
    >
      {/* Logotipo */}
      <motion.img
        variants={itemVariants}
        src="/logotipo_escuchalo.svg"
        alt="logotipo la liña escuchalo como quieras"
      />

      <div className="text-primary flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          {/* Email */}
          <motion.div variants={itemVariants} className="inline-flex gap-2 items-center">
            <img
              className="h-2/3 translate-y-0.5"
              src="/email.svg"
              alt="email"
            />
            <p className="bonito text-xl">info@laliña.es</p>
          </motion.div>

          {/* Redes / Msg */}
          <motion.div variants={itemVariants} className="inline-flex gap-2 items-center">
            <img className="h-2/3 translate-y-0.5" src="/msg.svg" alt="msg" />
            <p className="bonito text-xl">@lavoznomada</p>
          </motion.div>
        </div>

        {/* Bloque de Podcasts */}
        <motion.div variants={itemVariants} className="inline-flex justify-between w-full">
          <a>
            <img src="/apple-podcast.svg" alt="Apple Podcast" />
          </a>
          <a>
            <img src="/spotify.svg" alt="Spotify" />
          </a>
          <a>
            <img src="/youtube.svg" alt="YouTube" />
          </a>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Contact;