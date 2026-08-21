import Hero from "./Sections/Hero";
import About from "./Sections/About";
import Voces from "./Sections/Voces";
import Highlight from "./Sections/Highlight";
import Contact from "./Sections/Contact";
import Header from "./Components/Header";
import { getMedia } from "@/lib/media";
import ExitAdminButton from "./Components/admin/ExitAdminButton";
import MaintenanceToggle from "./Components/admin/MaintenanceToggle";

export default async function Home() {
  const media = await getMedia();

  const maintenance = Boolean(
    media && typeof media === "object" && "maintenance" in media && media.maintenance === true,
  );

  if (maintenance) {
    return (
      <div>
        <Hero mediaData={media} />

        <MaintenanceToggle initialMaintenance={maintenance} />
        <ExitAdminButton />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <Hero mediaData={media} />
      <About />
      <Voces mediaData={media} />
      <Highlight mediaData={media} />
      <Contact />

      <MaintenanceToggle initialMaintenance={maintenance} />
      <ExitAdminButton />
    </div>
  );
}