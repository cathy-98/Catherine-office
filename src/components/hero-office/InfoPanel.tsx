"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { OfficeObject } from "@/types/office";

type InfoPanelProps = {
  activeObject: OfficeObject | null;
  onClose: () => void;
};

export function InfoPanel({ activeObject, onClose }: InfoPanelProps) {
  return (
    <AnimatePresence>
      {activeObject ? (
        <motion.aside
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-4 left-4 right-4 z-30 rounded-3xl border border-white/70 bg-white/70 p-5 shadow-glass backdrop-blur-2xl sm:bottom-8 sm:left-auto sm:right-8 sm:w-[24rem] sm:p-6"
        >
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-plum/75">
                {activeObject.label}
              </p>
              <h2 className="text-3xl font-semibold leading-tight text-graphite">
                {activeObject.title}
              </h2>
            </div>
            <button
              type="button"
              aria-label="Cerrar panel"
              onClick={onClose}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-graphite/10 bg-white/55 text-xl leading-none text-graphite transition hover:border-plum/25 hover:text-plum"
            >
              ×
            </button>
          </div>
          <p className="text-base leading-7 text-graphite/72">{activeObject.body}</p>
          <p className="mt-6 border-t border-graphite/10 pt-4 text-xs leading-5 text-graphite/45">
            Placeholder 3D actual: <span className="font-mono">{activeObject.modelPath}</span>. Cuando
            el modelo definitivo esté listo, este objeto puede reemplazarse desde la escena sin cambiar
            el contenido del panel.
          </p>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
