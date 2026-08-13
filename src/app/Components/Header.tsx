"use client";

import { useEffect, useState } from "react";

const ScrollTo = (id?: string): void => {
  if (id == null) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  var offsetVar = 0;

  switch (id) {
    case "about":
      offsetVar = 10;
      break;
    case "voces":
      offsetVar = 4;
      break;
    case "highlight":
      offsetVar = 0;
      break;
    default:
      break;
  }

  const el = document.getElementById(id);
  if (el) {
    
    const offset =
      parseFloat(getComputedStyle(document.documentElement).fontSize) * offsetVar;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const Header = () => {
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY < 32);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [isAtHighlight, setIsAtHightlight] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const highlightEl = document.getElementById("highlight");
      if (highlightEl) {
        const top = highlightEl.getBoundingClientRect().top + window.scrollY - 100;
        setIsAtHightlight(window.scrollY >= top);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`hidden md:block w-screen left-0 px-8 z-100 ${isAtTop ? "absolute top-16" : "fixed top-8"}`}
    >
      <div
        className={`flex w-full ml-auto px-8 py-4 justify-between transition-all duration-1000 ${
          isAtTop ? "" : "bg-primary/60 backdrop-blur-md shadow-md rounded-full"
        } ${isAtHighlight ? "!w-7/12" : ""}
        }`}
      >
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <img
            className="lg:w-64 w-48"
            src="/voz_nomada.svg"
            alt="La voz nómada de Canarias"
          />
        </button>

        <div className="inline-flex gap-4 lg:gap-12">
          <button type="button" onClick={() => ScrollTo("about")}>
            <p className="header-button">la liña</p>
          </button>
          <button type="button" onClick={() => ScrollTo("voces")}>
            <p className="header-button">voces</p>
          </button>
          <button type="button" onClick={() => ScrollTo("highlight")}>
            <p className="header-button">conecta</p>
          </button>
          <button type="button" onClick={() => ScrollTo("contact")}>
            <p className="header-button-bg">escucha</p>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
