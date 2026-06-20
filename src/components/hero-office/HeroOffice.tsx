"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { DIGITAL_WORLD_ID, PANEL_PLACEHOLDER_ID, SITE_NAME } from "@/lib/constants";
import type { OfficeObject, OfficeObjectId } from "@/types/office";
import { officeObjects } from "./officeData";
import { OfficeCanvas } from "./OfficeCanvas";
import { InfoPanel } from "./InfoPanel";

export function HeroOffice() {
  const [activeId, setActiveId] = useState<OfficeObjectId | null>(null);
  const [hoveredObject, setHoveredObject] = useState<OfficeObject | null>(null);

  const activeObject = useMemo(
    () => officeObjects.find((object) => object.id === activeId) ?? null,
    [activeId],
  );

  const exploreSite = () => {
    document.getElementById(PANEL_PLACEHOLDER_ID)?.scrollIntoView({ behavior: "smooth" });
  };

  const enterDigitalWorld = () => {
    document.getElementById(DIGITAL_WORLD_ID)?.scrollIntoView({ behavior: "smooth" });
  };

  const openProjects = () => {
    setActiveId("projects");
  };

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-[#eee7dd] px-3 py-3 sm:px-6 sm:py-4 lg:px-8">
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 py-5 text-sm text-graphite/70 sm:px-8">
        <span className="font-medium tracking-[0.18em] uppercase">Catherine Lab</span>
        <button
          type="button"
          onClick={exploreSite}
          className="rounded-full border border-white/60 bg-white/55 px-4 py-2 text-sm font-medium text-graphite shadow-glass backdrop-blur-md transition hover:border-mauve/40 hover:text-plum"
        >
          Explorar sitio
        </button>
      </div>

      <div className="mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-7xl flex-col justify-end rounded-[1.6rem] border border-white/60 bg-[#f8f5f0]/70 shadow-glass backdrop-blur-sm sm:rounded-[2rem] lg:min-h-[calc(100vh-3rem)]">
        <div className="relative min-h-screen overflow-hidden rounded-[1.6rem] sm:rounded-[2rem]">
          <OfficeCanvas
            activeObject={activeObject}
            hoveredObject={hoveredObject}
            onHoverObject={setHoveredObject}
            onSelectObject={(object) => setActiveId(object.id)}
          />

          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="absolute left-4 right-4 top-20 z-10 max-w-[22rem] sm:left-8 sm:right-auto sm:top-auto sm:bottom-8 lg:left-10"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-plum/80 sm:text-sm">
              Hero 3D interactivo
            </p>
            <h1 className="max-w-[12ch] text-3xl font-semibold leading-[1.02] text-graphite sm:text-4xl lg:text-5xl">
              {SITE_NAME}
            </h1>
            <p className="mt-3 max-w-sm text-sm leading-6 text-graphite/72 sm:text-base sm:leading-7">
              Una entrada inmersiva para explorar diseño UX/UI, web e IA aplicada
              desde mi espacio creativo.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={enterDigitalWorld}
                className="pointer-events-auto rounded-full bg-graphite px-5 py-3 text-sm font-semibold text-white shadow-glass transition hover:bg-plum"
              >
                Entrar a mi mundo
              </button>
              <button
                type="button"
                onClick={openProjects}
                className="pointer-events-auto rounded-full border border-graphite/15 bg-white/65 px-5 py-3 text-sm font-semibold text-graphite shadow-glass backdrop-blur-xl transition hover:border-mauve/40 hover:text-plum"
              >
                Ver proyectos
              </button>
            </div>
          </motion.div>

          <div className="pointer-events-none absolute bottom-6 right-5 z-10 hidden rounded-full border border-white/70 bg-white/60 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-graphite/55 shadow-glass backdrop-blur-xl sm:block">
            Arrastra para girar 360
          </div>

          <div className="absolute bottom-5 left-4 right-4 z-10 grid grid-cols-3 gap-2 sm:hidden">
            {officeObjects.map((object) => (
              <button
                key={object.id}
                type="button"
                onClick={() => setActiveId(object.id)}
                className="rounded-2xl border border-white/70 bg-white/68 px-3 py-2 text-xs font-semibold text-graphite/75 shadow-glass backdrop-blur-xl"
              >
                {object.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <InfoPanel activeObject={activeObject} onClose={() => setActiveId(null)} />
    </section>
  );
}
