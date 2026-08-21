import Hero from "./Sections/Hero";
import About from "./Sections/About";
import Voces from "./Sections/Voces";
import Highlight from "./Sections/Highlight";
import Contact from "./Sections/Contact";
import Header from "./Components/Header";
import { getMedia } from "@/lib/media";
import ExitAdminButton from "./Components/admin/ExitAdminButton";
import MaintenanceToggle from "./Components/admin/MaintenanceToggle";
import { getServerSession } from "next-auth/next";
import { authConfig } from "@/auth";

export default async function Home() {
  const media = await getMedia();

  const session = await getServerSession(authConfig);
  const isAdmin = session?.user?.role === "admin";

  const mediaWithMaintenance = media as { maintenance?: boolean } | null | undefined;
  const maintenance = mediaWithMaintenance?.maintenance === true;

  return (
    <div>
      {(!maintenance || isAdmin) && (
        <>
          <Header />
          <Hero mediaData={media} />
          <About />
          <Voces mediaData={media} />
          <Highlight mediaData={media} />
          <Contact />
        </>
      )}

      {maintenance && !isAdmin && (
        <Hero mediaData={media} />
      )}

      <MaintenanceToggle initialMaintenance={maintenance} />
      <ExitAdminButton />
    </div>
  );
}