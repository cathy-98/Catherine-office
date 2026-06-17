"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PANEL_PLACEHOLDER_ID, SITE_NAME } from "@/lib/constants";
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

  return (
    <section className="relative isolate min-h-screen overflow-hidden px-4 py-4 sm:px-6 lg:px-8">
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 py-5 text-sm text-graphite/70 sm:px-8">
        <span className="font-medium tracking-[0.18em] uppercase">Catherine Lab</span>
        <button
          type="button"
          onClick={exploreSite}
          className="rounded-full border border-white/60 bg-white/45 px-4 py-2 text-sm font-medium text-graphite shadow-glass backdrop-blur-md transition hover:border-mauve/40 hover:text-plum"
        >
          Explorar sitio
        </button>
      </div>

      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-7xl flex-col justify-end rounded-[2rem] border border-white/60 bg-white/25 shadow-glass backdrop-blur-sm lg:min-h-[calc(100vh-3rem)]">
        <div className="relative min-h-screen overflow-hidden rounded-[2rem]">
          <OfficeCanvas
            activeObject={activeObject}
            hoveredObject={hoveredObject}
            onHoverObject={setHoveredObject}
            onSelectObject={(object) => setActiveId(object.id)}
          />

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="pointer-events-none absolute bottom-8 left-5 right-5 z-10 max-w-2xl sm:bottom-10 sm:left-10"
          >
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.24em] text-plum/80">
              Hero 3D interactivo
            </p>
            <h1 className="max-w-[14ch] text-5xl font-semibold leading-[0.95] text-graphite sm:text-7xl lg:text-8xl">
              {SITE_NAME}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-graphite/70 sm:text-lg">
              Una entrada inmersiva, editorial y suave para explorar diseño UX/UI,
              web e IA aplicada desde una oficina creativa.
            </p>
          </motion.div>
        </div>
      </div>

      <InfoPanel activeObject={activeObject} onClose={() => setActiveId(null)} />
    </section>
  );
}
